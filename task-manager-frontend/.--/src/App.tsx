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
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h2>📌 Marin's Task Manager (React TS + MySQL)</h2>

      {/* Input Box and Button */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ padding: '10px', width: '250px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc', color: '#000' }}
        />
        <button
          onClick={handleAddTask}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add Task
        </button>
      </div>

      {/* Task List Display */}
      <h3>All Tasks:</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              padding: '12px',
              marginBottom: '10px',
              backgroundColor: '#333',
              borderRadius: '6px',
              width: '380px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#fff'
            }}
          >
            <span>{task.title}</span>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleToggleStatus(task.id, task.status)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: task.status === 'Completed' ? '#28a745' : '#ffc107',
                  color: task.status === 'Completed' ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {task.status}
              </button>

              <button
                onClick={() => handleDeleteTask(task.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
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