const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 1. Static folder setup for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'marin_tasks_db',
    port: 3307
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed!", err);
    } else {
        console.log("MySQL Database Connected Successfully!");
    }
});

const JWT_SECRET = 'your_secret_key_123';

// 📸 3. Profile Pic Upload API (MySQL Syntax Fix)
app.post('/api/upload-profile/:userId', upload.single('profilePic'), (req, res) => {
  const { userId } = req.params;
  if (!req.file) {
    return res.status(400).json({ error: 'Please select an image file!' });
  }

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  const query = 'UPDATE users SET profile_pic = ? WHERE id = ?';
  db.query(query, [imageUrl, userId], (err, result) => {
    if (err) {
      console.error("Error updating profile picture:", err);
      return res.status(500).json({ error: "Failed to upload profile picture" });
    }
    res.json({ imageUrl });
  });
});

// Get tasks
app.get('/api/tasks/:userId', (req, res) => {
    const { userId } = req.params;
    const query = 'SELECT * FROM tasks WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add new task
app.post('/api/tasks', (req, res) => {
    const { title, userId } = req.body;
    const query = 'INSERT INTO tasks (title, status, user_id) VALUES (?, ?, ?)';
    db.query(query, [title, 'Pending', userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, title, status: 'Pending', userId });
    });
});

// Update task status / title
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { status, title } = req.body;

    let query = '';
    let queryParams = [];

    if (title) {
        query = 'UPDATE tasks SET title = ? WHERE id = ?';
        queryParams = [title, id];
    } else {
        query = 'UPDATE tasks SET status = ? WHERE id = ?';
        queryParams = [status, id];
    }

    db.query(query, queryParams, (err, result) => {
        if (err) {
            console.error("Error updating task:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Task updated successfully!" });
    });
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error deleting task:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Task deleted successfully!" });
    });
});

// Register User
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(query, [email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: "Email already registered" });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: "User registered successfully!" });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error during registration" });
    }
});

// Login User
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ 
            message: "Login successful!", 
            token, 
            userId: user.id,
            profilePic: user.profile_pic || null
        });
    });
});

// Server Start
app.listen(5000, () => {
    console.log("Backend Server running on http://localhost:5000");
});