import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser, logout } = useAuth(); // Added logout and currentUser
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setError('');
      setLoading(true);
      await logout();
      // No need to navigate here as the component will re-render
      // and show the login form automatically
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="alert error">{error}</div>}

        {currentUser ? (
          <div className="logged-in-state">
            <p>You are logged in as: <strong>{currentUser.email}</strong></p>
            <button
              onClick={handleLogout}
              className="btn secondary"
              disabled={loading}
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
            <div className="auth-footer">
              <Link to="/dashboard">Go to Dashboard</Link>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn primary"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="auth-footer">
              Need an account? <Link to="/register">Sign up</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}