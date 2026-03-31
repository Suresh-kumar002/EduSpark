import { Router, type IRouter } from "express";
import { db, conversations, messages } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { SendOpenaiMessageBody, SendOpenaiMessageParams } from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

// List all conversations
router.get("/conversations", async (req, res) => {
  try {
    const all = await db
      .select()
      .from(conversations)
      .orderBy(asc(conversations.createdAt));
    res.json(
      all.map((c) => ({
        id: c.id,
        title: c.title,
        createdAt: c.createdAt,
        updatedAt: c.createdAt,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list conversations");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new conversation
router.post("/conversations", async (req, res) => {
  try {
    const [conv] = await db
      .insert(conversations)
      .values({ title: "DarshiBot Chat" })
      .returning();
    res.status(201).json({
      id: conv.id,
      title: conv.title,
      createdAt: conv.createdAt,
      updatedAt: conv.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a conversation with all its messages
router.get("/conversations/:id", async (req, res) => {
  try {
    const params = SendOpenaiMessageParams.safeParse({ id: Number(req.params.id) });
    if (!params.success) {
      res.status(400).json({ error: "Invalid conversation ID" });
      return;
    }
    const id = params.data.id;

    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));

    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));

    res.json({
      id: conv.id,
      title: conv.title,
      createdAt: conv.createdAt,
      updatedAt: conv.createdAt,
      messages: msgs.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send a message and stream the AI response
router.post("/conversations/:id/messages", async (req, res) => {
  try {
    const params = SendOpenaiMessageParams.safeParse({ id: Number(req.params.id) });
    const body = SendOpenaiMessageBody.safeParse(req.body);

    if (!params.success || !body.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const id = params.data.id;
    const userContent = body.data.content;

    // Verify conversation exists
    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));

    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    // Save user message
    await db.insert(messages).values({
      conversationId: id,
      role: "user",
      content: userContent,
    });

    // Fetch full history for context
    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));

    // Build chat messages for OpenAI
    const chatMessages = [
      {
        role: "system" as const,
        content:
          "You are DarshiBot, a helpful, friendly, and intelligent AI assistant. You are conversational, warm, and use emojis occasionally to be engaging. You give clear, concise answers.",
      },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-5.2",
        max_completion_tokens: 8192,
        messages: chatMessages,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
    } catch (aiError) {
      req.log.error({ err: aiError }, "OpenAI streaming error, using fallback");
      // Smart rule-based fallback
      const lower = userContent.toLowerCase().trim();
      let fallback: string;
      if (lower.match(/^(hi|hello|hey|howdy)/)) {
        fallback = "Hello! 👋 I'm DarshiBot, your AI assistant. How can I help you today?";
      } else if (lower.includes("who are you") || lower.includes("what are you")) {
        fallback = "I'm DarshiBot, an AI chatbot built to assist you! Ask me anything. 🤖";
      } else if (lower.includes("how are you")) {
        fallback = "I'm doing great, thank you for asking! How can I assist you today? 😊";
      } else if (lower.match(/^(bye|goodbye|see you|cya)/)) {
        fallback = "Goodbye! 👋 Feel free to come back anytime!";
      } else if (lower.includes("help")) {
        fallback = "I'm here to help! You can ask me anything — questions, advice, explanations, or just have a chat. 💬";
      } else {
        fallback = "I'm having trouble connecting to my AI brain right now. Please try again in a moment. 🔧";
      }
      fullResponse = fallback;
      res.write(`data: ${JSON.stringify({ content: fallback })}\n\n`);
    }

    // Save assistant message to DB
    if (fullResponse) {
      await db.insert(messages).values({
        conversationId: id,
        role: "assistant",
        content: fullResponse,
      });
    }

    // Signal done
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "Failed to process message");
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
      res.end();
    }
  }
});

export default router;
