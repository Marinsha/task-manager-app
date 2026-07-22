import { useState, useEffect } from 'react';
import './App.css';

// 1. TypeScript Interface
interface Task {
  id: number;
  title: string;
  status: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState<string>('');

  // Fetch Data
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add Task
  const handleAddTask = async () => {
    if (!newTitle.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        setNewTitle('');
        fetchTasks();
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Toggle Status
  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Delete Task
  const handleDeleteTask = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="app-container">
      <h2 className="app-title">📌 Marin's Task Manager</h2>

      {/* Input Box and Button */}
      <div className="input-group">
        <input
          type="text"
          className="task-input"
          placeholder="Enter a new task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button className="add-btn" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      {/* Task List Display */}
      <h3 className="section-title">All Tasks</h3>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span className={`task-title ${task.status === 'Completed' ? 'completed-text' : ''}`}>
              {task.title}
            </span>

            <div className="action-buttons">
              <button
                onClick={() => handleToggleStatus(task.id, task.status)}
                className={`status-btn ${task.status === 'Completed' ? 'completed' : 'pending'}`}
              >
                {task.status}
              </button>

              <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;