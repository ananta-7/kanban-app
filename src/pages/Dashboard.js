import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, 'boards'), where('userId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const boardsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBoards(boardsData);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleAddBoard = async () => {
    if (!newBoardTitle.trim()) return;
    try {
      await addDoc(collection(db, 'boards'), {
        title: newBoardTitle,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      });
      setNewBoardTitle('');
    } catch (err) {
      console.error("Error adding board: ", err);
    }
  };

  return (
    <div className="dashboard">
      <h1>Your Boards</h1>
      <div className="add-board">
        <input
          type="text"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          placeholder="New board title"
        />
        <button onClick={handleAddBoard}>Add Board</button>
      </div>
      <div className="boards-grid">
        {boards.map(board => (
          <Link to={`/board/${board.id}`} key={board.id} className="board-card">
            <h3>{board.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}