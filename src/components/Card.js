import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function Card({ card }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, 'cards', card.id), {
        title,
        description
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating card:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'cards', card.id));
    } catch (err) {
      console.error("Error deleting card:", err);
    }
  };

  return (
    <div className="card">
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <div className="card-actions">
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h4>{card.title}</h4>
          {card.description && <p>{card.description}</p>}
          <div className="card-actions">
            <button onClick={() => setIsEditing(true)}>
              <FiEdit2 />
            </button>
            <button onClick={handleDelete}>
              <FiTrash2 />
            </button>
          </div>
        </>
      )}
    </div>
  );
}