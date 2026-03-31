import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'eduspark',
  port: Number(process.env.DB_PORT || 3306),
  connectionLimit: 8,
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  try {
    const [exists] = await pool.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if ((exists || []).length > 0) {
      return res.status(409).json({ success: false, message: 'Username or email already registered' });
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPwd]);
    return res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  try {
    const [rows] = await pool.query('SELECT id, username, email, password FROM users WHERE username = ? OR email = ?', [username, username]);
    const user = (rows || [])[0];
    if (!user) {
      return res.status(401).json({ success: false, message: 'No user found with this username/email' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Password mismatch' });
    }

    return res.json({ success: true, message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email and new password are required' });
  }

  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    const user = (rows || [])[0];
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found for this email' });
    }

    const hashedPwd = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPwd, user.id]);
    return res.json({ success: true, message: 'Password has been updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

async function ensureUserTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

ensureUserTable().then(() => {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`EduSpark auth backend running on port ${process.env.PORT || 4000}`);
  });
}).catch((error) => {
  console.error('Could not ensure users table exists:', error);
  process.exit(1);
});

console.log('DB', process.env.DB_USER, process.env.DB_PASSWORD ? '***' : '(empty)');
