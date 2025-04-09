//frontend/src/components/board/BoardCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './BoardCard.css';

const BoardCard = ({ board, onDelete }) => {
  return (
    <div className="board-card" style={{ backgroundColor: board.color || '#0079bf' }}>
      <div className="board-card-header">
        <h3>{board.name}</h3>
        <div className="board-card-actions">
          <button 
            className="delete-button"
            onClick={(e) => {
              e.preventDefault();
              onDelete(board.id);
            }}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <p className="board-description">{board.description}</p>
      <Link to={`/board/${board.id}`} className="board-link">
        Ouvrir le tableau
      </Link>
    </div>
  );
};
export default BoardCard;
