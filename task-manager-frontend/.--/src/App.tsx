import { useState, useEffect } from 'react';
import './App.css';
import { Auth } from './Auth';

interface Task {
  id: number;
  title: string;
  status: string;
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState<string>('');

  // Login ஆன பயனரின் Tasks-ஐ மட்டும் Fetch செய்யும் Function
  const fetchTasks = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${userId}`);
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchTasks();
    }
  }, [token, userId]);

  // Login Success Handler
  const handleLoginSuccess = (newToken: string, newUserId: number) => {
    setToken(newToken);
    setUserId(newUserId.toString());
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
    setTasks([]);
  };

  // Add Task
  const handleAddTask = async () => {
    if (!newTitle.trim() || !userId) return;

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, userId: Number(userId) }),
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

  // பயனர் Login பண்ணவில்லை என்றால் Auth Component மட்டுமே தெரியும்
  if (!token) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  // Login பண்ணியிருந்தால் Task Manager Screen தெரியும்
  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="app-title" style={{ margin: 0 }}>📌 Task Manager</h2>
        <button onClick={handleLogout} className="delete-btn">Logout</button>
      </div>

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
      <h3 className="section-title">Your Tasks</h3>
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