import { useState } from 'react';

interface ProfileProps {
  userId: string; // 👈 userId சேர்க்கப்பட்டது
  email: string;
  totalTasks: number;
  completedTasks: number;
  onBackToDashboard: () => void;
}

export function Profile({ userId, email, totalTasks, completedTasks, onBackToDashboard }: ProfileProps) {
  const [profilePic, setProfilePic] = useState<string | null>(localStorage.getItem('profilePic'));
  const [uploading, setUploading] = useState(false);

  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 📷 File Upload Handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);

    setUploading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/upload-profile/${userId}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setProfilePic(data.imageUrl);
        localStorage.setItem('profilePic', data.imageUrl);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="app-container" style={{ textAlign: 'center' }}>
      <button
        onClick={onBackToDashboard}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          fontSize: '0.9rem',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        ⬅ Back to Dashboard
      </button>

      <div style={{ margin: '20px 0' }}>
        {/* Profile Avatar Container */}
        <div style={{ position: 'relative', width: '100px', margin: '0 auto 15px auto' }}>
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #38bdf8'
              }}
            />
          ) : (
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              color: '#0f172a',
              fontSize: '3rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
            }}>
              {email ? email.charAt(0).toUpperCase() : 'U'}
            </div>
          )}

          {/* 📷 Camera Icon Button */}
          <label
            htmlFor="profile-upload"
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              backgroundColor: '#10b981',
              color: '#fff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1rem',
              border: '2px solid #0f172a'
            }}
            title="Upload Photo"
          >
            📷
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {uploading && <p style={{ color: '#38bdf8', fontSize: '0.85rem' }}>Uploading...</p>}

        <h2 style={{ color: '#f8fafc', margin: '5px 0' }}>User Profile</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{email}</p>
      </div>

      <hr style={{ borderColor: '#334155', margin: '20px 0' }} />

      <h3 style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '15px' }}>Your Task Statistics</h3>
      
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-box">
          <span className="stat-label">Total Created</span>
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

      <div className="stat-box" style={{ padding: '15px' }}>
        <span className="stat-label">Completion Efficiency</span>
        <span className="stat-value" style={{ fontSize: '1.5rem', color: '#10b981' }}>{completionRate}%</span>
      </div>
    </div>
  );
}