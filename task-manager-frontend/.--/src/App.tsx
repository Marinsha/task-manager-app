import { useState, useEffect } from 'react';
import './App.css';
import { Auth } from './Auth';
import { WelcomePage } from './WelcomePage';
import { Profile } from './Profile';

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
  
  // Edit State variables
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  
  // Show Auth Screen State
  const [showAuth, setShowAuth] = useState<boolean>(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<'dashboard' | 'profile'>('dashboard'); 
  const [userEmail, setUserEmail] = useState<string>(''); // User email store பண்ண

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
    const isCompleted = currentStatus.toLowerCase() === 'completed';
    const newStatus = isCompleted ? 'Pending' : 'Completed';

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

  // Start Editing Task
  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  // Save Edited Task Title
  const handleSaveEdit = async (id: number) => {
    if (!editingTitle.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTitle }),
      });

      if (response.ok) {
        setEditingTaskId(null);
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task title:", error);
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

  // பயனர் Login பண்ணவில்லை என்றால் WelcomePage அல்லது Auth Component தெரியும்
  if (!token) {
    if (showAuth) {
      return <Auth onLoginSuccess={handleLoginSuccess} onBackToHome={() => setShowAuth(false)} />;
    }
    return <WelcomePage onGetStarted={() => setShowAuth(true)} />;
  }

  // Profile Page காட்ட
if (currentPage === 'profile') {
  return (
    <Profile
      email={localStorage.getItem('userEmail') || 'user@taskpulse.com'}
      totalTasks={tasks.length}
      completedTasks={tasks.filter(t => t.status.toLowerCase() === 'completed').length}
      onBackToDashboard={() => setCurrentPage('dashboard')}
    />
  );
}

  // 📊 Progress Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status.toLowerCase() === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Login பண்ணியிருந்தால் Task Manager Screen தெரியும்
  return (
    <div className="app-container">
      {/* Header Section */}
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
  <h2 className="app-title" style={{ margin: 0 }}>📌 Task Manager</h2>
  <div style={{ display: 'flex', gap: '10px' }}>
    <button onClick={() => setCurrentPage('profile')} className="status-btn" style={{ backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold' }}>
      👤 Profile
    </button>
    <button onClick={handleLogout} className="delete-btn">Logout</button>
  </div>
</div>

      {/* Input Box and Add Button */}
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

      {/* Search Bar */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          className="task-input"
          placeholder="🔍 Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {/* 📊 Analytics & Progress Bar Section */}
      <div className="analytics-card">
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-label">Total</span>
            <span className="stat-value">{totalTasks}</span>
          </div>
          <div className="stat-box pending">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{pendingTasks}</span>
          </div>
          <div className="stat-box completed">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completedTasks}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-header">
            <span>Task Completion</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Task List Display */}
      <h3 className="section-title">Your Tasks</h3>
      <ul className="task-list">
        {tasks
          .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((task) => (
            <li key={task.id} className="task-item">
              {/* Editing Mode Check */}
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  className="task-input"
                  style={{ flex: 1, minWidth: 0, padding: '8px 12px' }}
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
              ) : (
                <span className={`task-title ${task.status.toLowerCase() === 'completed' ? 'completed-text' : ''}`}>
                  {task.title}
                </span>
              )}

              <div className="action-buttons">
                {/* Edit / Save Button */}
                {editingTaskId === task.id ? (
                  <button onClick={() => handleSaveEdit(task.id)} className="add-btn" style={{ padding: '6px 12px' }}>
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleStartEdit(task)} className="status-btn" style={{ backgroundColor: '#f59e0b', color: '#fff' }}>
                    Edit
                  </button>
                )}

                <button
                  onClick={() => handleToggleStatus(task.id, task.status)}
                  className={`status-btn ${task.status.toLowerCase() === 'completed' ? 'completed' : 'pending'}`}
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