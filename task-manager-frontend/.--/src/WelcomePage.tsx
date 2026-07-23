import React from 'react';
import './WelcomePage.css';

interface WelcomePageProps {
    onGetStarted: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
    return (
        <div className="welcome-container">
            {/* Header / Navbar */}
            <nav className="welcome-nav">
                <h1 className="logo">TaskPulse⚡</h1>
                <button className="nav-btn" onClick={onGetStarted}>Login</button>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <h1 className="hero-title">
                    Pulse of Your <span className="highlight">Productivity</span>
                </h1>
                <p className="hero-subtitle">
                    Organize your tasks, stay focused, and achieve your goals effortlessly with TaskPulse.
                </p>
                <button className="cta-btn" onClick={onGetStarted}>
                    Get Started for Free 🚀
                </button>
            </section>

            {/* Features Grid */}
            <section className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Fast & Responsive</h3>
                    <p>Add, edit, and manage your tasks instantly without any hassle.</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">🔒</div>
                    <h3>Secure & Private</h3>
                    <p>Your tasks are isolated and stored securely with JWT authentication.</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">🔍</div>
                    <h3>Smart Search</h3>
                    <p>Quickly find and organize what matters to you most in seconds.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="welcome-footer">
                <p>© 2026 TaskPulse. Built with React & Node.js</p>
            </footer>
        </div>
    );
};