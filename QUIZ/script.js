const subjects = [
    {
        name: "Data Science",
        questions: [
            {
        question: "What does “overfitting” mean in machine learning?",
        answers: [
            {text: "Model performs well on training data but poorly on new data",correct: true},
            {text: "Model performs poorly on training data",correct: false},
            {text: "Model ignores input features",correct: false},
            {text: "Model is too simple",correct: false}
        ]
    },
    {
        question: "Which library is commonly used for data manipulation in Python?",
        answers: [
            {text: "NumPy",correct: false},
            {text: "Pandas",correct: true},
            {text: "Matplotlib",correct: false},
            {text: "TensorFlow",correct: false}
        ]
        
    },
    {
        question: "What type of plot is best for showing the distribution of a single variable?",
        answers: [
            {text: "Line plot",correct: false},
            {text: "Histogram",correct: true},
            {text: "Scatter plot",correct: false},
            {text: ". Pie chart",correct: false}
        ]
        
    },
    {
        question: "What is the purpose of a confusion matrix?",
        answers: [
            {text: "To visualize clustering",correct: false},
            {text: "To evaluate classification performance",correct: true},
            {text: "To reduce dimensionality",correct: false},
            {text: "To normalize data",correct: false}
        ]
        
    },
    {
        question: "Which algorithm is used for dimensionality reduction?",
        answers: [
            {text: "Linear Regression",correct: false},
            {text: "K-Means",correct: false},
            {text: "PCA",correct: true},
            {text: "Naive Bayes",correct: false}
        ]
        
    },
    {
        question: "What does “precision” measure?",
        answers: [
            {text: "Correct predictions out of all predictions",correct: false},
            {text: "Correct positive predictions out of total predicted positives",correct: true},
            {text: "Correct negatives out of total negatives",correct: false},
            {text: "Total predictions",correct: false}
        ]
        
    },
    {

        question: "Which technique helps prevent overfitting?",
        answers: [
            {text: "Increasing model complexity",correct: false},
            {text: "Using more features",correct: false},
            {text: "Regularization",correct: true},
            {text: "Ignoring validation data",correct: false}
        ]
        
    },
    {
        question: "In gradient descent, what does the learning rate control?",
        answers: [
            {text: "Number of features",correct: false},
            {text: "Step size during optimization",correct: true},
            {text: "Model accuracy",correct: false},
            {text: "Dataset size",correct: false}
        ]
        
    },
    {
        question: "What is the main assumption of Naive Bayes?",
        answers: [
            {text: "Features are dependent",correct: false},
            {text: "Features are independent",correct: true},
            {text: "Data is linearly separable",correct: false},
            {text: "Data has no noise",correct: false}
        ]
        
    },
    {
        question: "What is the bias-variance tradeoff?",
        answers: [
            {text: "Tradeoff between data size and features",correct: false},
            {text: "Tradeoff between training and testing time",correct: false},
            {text: "Tradeoff between underfitting and overfitting",correct: true},
            {text: "Tradeoff between accuracy and precision",correct: false}
        ]
        
    }
    ]
    },
    {
        name: "Cyber Security",
        questions: [
            {
    question: "What is phishing?",
    answers: [
        {text: "A hacking technique using fake emails", correct: true},
        {text: "A firewall method", correct: false},
        {text: "Encrypting data", correct: false},
        {text: "Securing networks", correct: false}
    ]
    },
    {
    question: "What does HTTPS stand for?",
    answers: [
        {text: "High Transfer Text Protocol", correct: false},
        {text: "Hyper Tool Transfer Protocol", correct: false},
        {text: "None of these", correct: false},
        {text: "HyperText Transfer Protocol Secure", correct: true}
    ]
    },
    {
    question: "What is malware?",
    answers: [
        {text: "Malicious software", correct: true},
        {text: "Hardware issue", correct: false},
        {text: "Network protocol", correct: false},
        {text: "Operating system", correct: false}
    ]
    },
    {
    question: "What is a firewall?",
    answers: [
        {text: "Antivirus software", correct: false},
        {text: "Security system to block unauthorized access", correct: true},
        {text: "Internet cable", correct: false},
        {text: "Password manager", correct: false}
    ]
    },
    {
    question: "Which is a strong password?",
    answers: [
        {text: "123456", correct: false},
        {text: "password", correct: false},
        {text: "P@ssw0rd123!", correct: true},
        {text: "abc123", correct: false}
    ]
    },
    {
    question: "What is two-factor authentication?",
    answers: [
        {text: "Two passwords", correct: false},
        {text: "Using two methods to verify identity", correct: true},
        {text: "Two usernames", correct: false},
        {text: "None", correct: false}
    ]
    },
    {
    question: "What is ransomware?",
    answers: [
        {text: "Free software", correct: false},
        {text: "Backup tool", correct: false},
        {text: "Malware that demands payment", correct: true},
        {text: "Firewall", correct: false}
    ]
    },
    {
    question: "What is encryption?",
    answers: [
        {text: "Converting data into secure format", correct: true},
        {text: "Deleting data", correct: false},
        {text: "Copying files", correct: false},
        {text: "Compressing data", correct: false}
    ]
    },
    {
    question: "What is a VPN?",
    answers: [
        {text: "Virus protection network", correct: false},
        {text: "Public internet", correct: false},
        {text: "None", correct: false},
        {text: "Secure network connection", correct: true}
    ]
    },
    {
    question: "What is a brute force attack?",
    answers: [
        {text: "Trying many passwords to gain access", correct: true},
        {text: "Blocking websites", correct: false},
        {text: "Encrypting files", correct: false},
        {text: "Monitoring traffic", correct: false}
    ]
    }
        ]
    },
    {
        name: "Visualization",
        questions: [
            {
    question: "What does AI stand for?",
    answers: [
        {text: "Artificial Intelligence", correct: true},
        {text: "Automated Interface", correct: false},
        {text: "Advanced Internet", correct: false},
        {text: "None", correct: false}
    ]
},
{
    question: "Which is an example of AI?",
    answers: [
        {text: "Chatbots", correct: true},
        {text: "Keyboard", correct: false},
        {text: "Mouse", correct: false},
        {text: "Printer", correct: false}
    ]
},
{
    question: "What is machine learning?",
    answers: [
        {text: "Manual coding", correct: false},
        {text: "Learning from data", correct: true},
        {text: "Hardware design", correct: false},
        {text: "Typing data", correct: false}
    ]
},
{
    question: "Which language is popular for AI?",
    answers: [
        {text: "HTML", correct: false},
        {text: "Python", correct: true},
        {text: "CSS", correct: false},
        {text: "C", correct: false}
    ]
},
{
    question: "What is a neural network?",
    answers: [
        {text: "Computer network", correct: false},
        {text: "Internet system", correct: false},
         {text: "Model inspired by human brain", correct: true},
        {text: "Database", correct: false}
    ]
},
{
    question: "What is deep learning?",
    answers: [
        {text: "Basic coding", correct: false},
        {text: "Simple math", correct: false},
        {text: "Advanced neural networks", correct: true},
        {text: "None", correct: false}
    ]
},
{
    question: "What is training data?",
    answers: [
        {text: "Testing data", correct: false},
        {text: "Random data", correct: false},
        {text: "Deleted data", correct: false},
        {text: "Data used to train model", correct: true}
    ]
},
{
    question: "What is an algorithm?",
    answers: [
        {text: "Hardware", correct: false},
        {text: "Software bug", correct: false},
        {text: "Network", correct: false},
        {text: "Step-by-step procedure", correct: true}
    ]
},
{
    question: "What is automation?",
    answers: [
        {text: "Performing tasks automatically", correct: true},
        {text: "Manual work", correct: false},
        {text: "Stopping machines", correct: false},
        {text: "None", correct: false}
    ]
},
{
    question: "What is NLP?",
    answers: [
        {text: "New Learning Process", correct: false},
        {text: "Network Language Protocol", correct: false},
        {text: "Natural Language Processing", correct: true},
        {text: "None", correct: false}
    ]
    }
        ]
    }
];

const subjectTitle = document.getElementById("subject-title");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentSubject = localStorage.getItem("selectedSubject");
let currentSubjectIndex = subjects.findIndex(s => s.name === currentSubject);
let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    subjectTitle.innerText = currentSubject;
    nextButton.innerText = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    let question = subjects[currentSubjectIndex].questions[currentQuestionIndex];
    questionElement.innerText = `Q${currentQuestionIndex+1}: ${question.question}`;

    question.answers.forEach(ans => {
        const button = document.createElement("button");
        button.innerText = ans.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if(ans.correct) button.dataset.correct = true;
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    answerButtons.innerHTML = "";
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const correct = selectedBtn.dataset.correct === "true";
    if(correct) score++;
    selectedBtn.classList.add(correct ? "correct" : "incorrect");

    Array.from(answerButtons.children).forEach(btn => {
        if(btn.dataset.correct === "true") btn.classList.add("correct");
        btn.disabled = true;
    });

    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerText = `Score in ${currentSubject}: ${score}/${subjects[currentSubjectIndex].questions.length}`;
    nextButton.innerText = "Back to Subjects";
    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if(currentQuestionIndex < subjects[currentSubjectIndex].questions.length) {
        showQuestion();
    } else {
        showScore();
        nextButton.onclick = () => window.location.href = "subjects.html";
    }
});

startQuiz();