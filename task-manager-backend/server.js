const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Frontend-ல இருந்து வர Request-ஐ Allow பண்ண
app.use(express.json()); // JSON Data-வை புரிஞ்சுக்க

// MySQL Connection (Unga Port 3307-க்கு ஏத்த மாதிரி Set பண்ணிருக்கேன்)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',      // XAMPP-ல Password இல்ல
    database: 'marin_tasks_db',
    port: 3307         // 👈 Unga XAMPP MySQL Port Number
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed!", err);
    } else {
        console.log("MySQL Database Connected Successfully!");
    }
});

// Get tasks for a specific user
app.get('/api/tasks/:userId', (req, res) => {
    const { userId } = req.params;
    const query = 'SELECT * FROM tasks WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// API 2: Add New Task (புது Task டேட்டாபேஸ்ல சேர்க்க)
// Add a new task with user_id
app.post('/api/tasks', (req, res) => {
    const { title, userId } = req.body;
    const query = 'INSERT INTO tasks (title, status, user_id) VALUES (?, ?, ?)';
    db.query(query, [title, 'Pending', userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, title, status: 'Pending', userId });
    });
});

//update tasks
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const query = 'UPDATE tasks SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
        if (err) {
            console.error("Error updating task:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Task updated successfully!" });
    });
});

//Delete tasks
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

// Secret Key for JWT (இத வச்சுதான் Token Encrypt ஆகும்)
const JWT_SECRET = 'your_secret_key_123';

// 1. REGISTER USER (Sign Up)
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Password-ஐ Encrypt (Hash) பண்றோம்
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

// 2. LOGIN USER
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

        // Password சரியா இருக்கான்னு Compare பண்றோம்
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Login ஆனதும் User ID வச்சு JWT Token உருவாக்குறோம்
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: "Login successful!", token, userId: user.id });
    });
});
// Server Run பண்ணுறோம்
app.listen(5000, () => {
    console.log("Backend Server running on http://localhost:5000");
});