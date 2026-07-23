import { useState } from 'react';
import { toast } from 'react-toastify';

interface AuthProps {
  onLoginSuccess: (token: string, userId: number) => void;
  onBackToHome: () => void;
}

export function Auth({ onLoginSuccess, onBackToHome }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 🛡️ Register பண்ணும்போது மட்டும் 6 digit check பண்றோம்
    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 digits/characters long!');
      return;
    }

    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (isLogin) {
        // ✅ Login வெற்றியடைந்தால் localStorage-ல் சேமிக்கிறோம்
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId.toString());
        localStorage.setItem('userEmail', email);

        // 📸 Profile Pic Check: படம் இருந்தால் Save பண்ணும், இல்லையென்றால் பழைய படத்தை நீக்கும்!
        if (data.profilePic) {
          localStorage.setItem('profilePic', data.profilePic);
        } else {
          localStorage.removeItem('profilePic');
        }

        onLoginSuccess(data.token, data.userId);
      } else {
        toast.success('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container" style={{ textAlign: 'center', position: 'relative' }}>
      {/* ⬅ Back to Home Button */}
      <button
        onClick={onBackToHome}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          fontSize: '0.9rem',
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        ⬅ Back to Home
      </button>

      <h2 className="app-title">{isLogin ? '🔑 Login' : '📝 Register'}</h2>

      {error && <p style={{ color: '#ef4444', marginBottom: '15px' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          className="task-input"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="task-input"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="add-btn" style={{ width: '100%' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#94a3b8' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span
          style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
        >
          {isLogin ? 'Register here' : 'Login here'}
        </span>
      </p>
    </div>
  );
}