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

// API 1: Get All Tasks (Database-ல இருந்து Data எடுக்க)
app.get('/api/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) return res.status(500).json(err);
        return res.json(results);
    });
});

// API 2: Add New Task (புது Task டேட்டாபேஸ்ல சேர்க்க)
app.post('/api/tasks', (req, res) => {
    const { title } = req.body;
    db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ id: result.insertId, title, status: 'Pending' });
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

// Server Run பண்ணுறோம்
app.listen(5000, () => {
    console.log("Backend Server running on http://localhost:5000");
});