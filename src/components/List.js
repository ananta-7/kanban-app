import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Card from './Card';

export default function List({ list, boardId }) {
  const [cards, setCards] = useState([]);
  const [newCardTitle, setNewCardTitle] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'cards'), where('listId', '==', list.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cardsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCards(cardsData);
    });
    return () => unsubscribe();
  }, [list.id]);

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return;
    try {
      await addDoc(collection(db, 'cards'), {
        title: newCardTitle,
        listId: list.id,
        boardId,
        createdAt: new Date().toISOString()
      });
      setNewCardTitle('');
    } catch (err) {
      console.error("Error adding card: ", err);
    }
  };

  return (
    <div className="list">
      <h3>{list.title}</h3>
      <div className="cards-container">
        {cards.map(card => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      <div className="add-card">
        <input
          type="text"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          placeholder="New card title"
        />
        <button onClick={handleAddCard}>Add Card</button>
      </div>
    </div>
  );
}