import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, updateDoc } from 'firebase/firestore';
import './BoardDetail.css';
import { db } from '../firebase';
import List from '../components/List';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

export default function BoardDetail() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');

  useEffect(() => {
    const fetchBoard = async () => {
      const boardDoc = await getDoc(doc(db, 'boards', boardId));
      if (boardDoc.exists()) {
        setBoard({ id: boardDoc.id, ...boardDoc.data() });
      }
    };

    const q = query(collection(db, 'lists'), where('boardId', '==', boardId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLists(listsData.sort((a, b) => a.order - b.order));
    });

    fetchBoard();
    return () => unsubscribe();
  }, [boardId]);

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;
    try {
      await addDoc(collection(db, 'lists'), {
        title: newListTitle,
        boardId,
        order: lists.length,
        createdAt: new Date().toISOString()
      });
      setNewListTitle('');
    } catch (err) {
      console.error("Error adding list: ", err);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) return;

    // Same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Update in Firestore
    await updateDoc(doc(db, 'cards', draggableId), {
      listId: destination.droppableId
    });
  };

  if (!board) return <div>Loading...</div>;
  

  return (
    <div className="board-detail">
      <h1>{board.title}</h1>
      <div className="add-list">
        <input
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="New list title"
        />
        <button onClick={handleAddList}>Add List</button>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-lists" direction="horizontal" type="list">
          {(provided) => (
            <div
              className="lists-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {lists.map((list, index) => (
                <List 
                  key={list.id} 
                  list={list} 
                  boardId={boardId} 
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}