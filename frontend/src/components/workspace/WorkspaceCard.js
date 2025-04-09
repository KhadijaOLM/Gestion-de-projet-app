
//frontend/src/components/workspace/WorkspaceCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './WorkspaceCard.css';

const WorkspaceCard = ({ workspace, onDelete }) => {
  return (
    <div className="workspace-card">
      <div className="workspace-card-header">
        <h3>{workspace.name}</h3>
        <div className="workspace-card-actions">
          <button 
            className="delete-button"
            onClick={(e) => {
              e.preventDefault();
              onDelete(workspace.id);
            }}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <p className="workspace-description">{workspace.description}</p>
      <Link to={`/workspace/${workspace.id}`} className="workspace-link">
        Ouvrir l'espace de travail
      </Link>
    </div>
  );
};
export default WorkspaceCard;
