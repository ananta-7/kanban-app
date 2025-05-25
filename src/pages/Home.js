import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';
export default function Home() {
  const { currentUser } = useAuth();
  
  return (
    <div className="home">
      <h1>Kanban Task Manager</h1>
      {currentUser ? (
        <Link to="/dashboard" className="btn">Go to Dashboard</Link>
      ) : (
        <div className="auth-links">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn">Register</Link>
        </div>
      )}
    </div>
  );
}