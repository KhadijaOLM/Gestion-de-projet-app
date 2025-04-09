import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/TaskDetail.css';

const TaskDetail = () => {
  const { boardId, taskId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Simuler les données d'une tâche
  const [task, setTask] = useState({
    id: taskId,
    title: 'Exemple de tâche',
    description: 'Description détaillée de la tâche avec toutes les informations nécessaires pour sa réalisation.',
    priority: 'medium',
    status: 'inProgress',
    assignee: 'Jean Dupont',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-16T14:45:00Z',
    comments: [
      { id: 1, author: 'Marie Martin', content: 'Pouvons-nous discuter de cette tâche lors de la prochaine réunion?', createdAt: '2023-05-15T11:30:00Z' },
      { id: 2, author: 'Jean Dupont', content: 'J\'ai commencé à travailler dessus, je devrais terminer d\'ici demain.', createdAt: '2023-05-16T09:15:00Z' }
    ],
    attachments: [
      { id: 1, name: 'document.pdf', url: '#', size: '1.2 MB' },
      { id: 2, name: 'image.jpg', url: '#', size: '850 KB' }
    ]
  });

  const [editedTask, setEditedTask] = useState({ ...task });
  const [newComment, setNewComment] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setTask(editedTask);
    setIsEditing(false);
    // Simuler une sauvegarde API
    console.log('Sauvegarde de la tâche:', editedTask);
  };

  const handleCancel = () => {
    setEditedTask({ ...task });
    setIsEditing(false);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const newCommentObj = {
      id: task.comments.length + 1,
      author: 'Utilisateur Actuel', // Normalement, on récupérerait l'utilisateur connecté
      content: newComment,
      createdAt: new Date().toISOString()
    };
    
    setTask({
      ...task,
      comments: [...task.comments, newCommentObj]
    });
    
    setNewComment('');
  };

  const statusLabels = {
    'todo': 'À faire',
    'inProgress': 'En cours',
    'review': 'En révision',
    'done': 'Terminé'
  };

  const priorityLabels = {
    'low': 'Basse',
    'medium': 'Moyenne',
    'high': 'Haute'
  };

  return (
    <div className="task-detail-page">
      <div className="task-detail-header">
        <button 
          onClick={() => navigate(`/board/${boardId}`)} 
          className="back-button"
        >
          &larr; Retour au tableau
        </button>
        <div className="task-actions">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="btn-save">Enregistrer</button>
              <button onClick={handleCancel} className="btn-cancel">Annuler</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="btn-edit">Modifier</button>
              <button className="btn-delete">Supprimer</button>
            </>
          )}
        </div>
      </div>

      <div className="task-detail-content">
        <div className="task-main">
          {isEditing ? (
            <>
              <div className="form-group">
                <label htmlFor="title">Titre</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editedTask.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={editedTask.description}
                  onChange={handleInputChange}
                  rows="5"
                />
              </div>
            </>
          ) : (
            <>
              <h1 className="task-title">{task.title}</h1>
              <div className="task-description">
                <h2>Description</h2>
                <p>{task.description || 'Aucune description'}</p>
              </div>
            </>
          )}

          <div className="task-comments">
            <h2>Commentaires ({task.comments.length})</h2>
            
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                placeholder="Ajouter un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="3"
              />
              <button type="submit" className="btn-comment">Commenter</button>
            </form>
            
            <div className="comments-list">
              {task.comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="task-sidebar">
          <div className="task-info-section">
            <h3>Statut</h3>
            {isEditing ? (
              <select 
                name="status" 
                value={editedTask.status}
                onChange={handleInputChange}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            ) : (
              <span className={`status-badge ${task.status}`}>{statusLabels[task.status]}</span>
            )}
          </div>

          <div className="task-info-section">
            <h3>Priorité</h3>
            {isEditing ? (
              <select 
                name="priority" 
                value={editedTask.priority}
                onChange={handleInputChange}
              >
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            ) : (
              <span className={`priority-badge ${task.priority}`}>{priorityLabels[task.priority]}</span>
            )}
          </div>

          <div className="task-info-section">
            <h3>Assigné à</h3>
            {isEditing ? (
              <input
                type="text"
                name="assignee"
                value={editedTask.assignee || ''}
                onChange={handleInputChange}
                placeholder="Non assigné"
              />
            ) : (
              <div className="assignee-info">
                {task.assignee ? (
                  <>
                    <span className="assignee-avatar">{task.assignee.charAt(0)}</span>
                    <span className="assignee-name">{task.assignee}</span>
                  </>
                ) : (
                  <span>Non assigné</span>
                )}
              </div>
            )}
          </div>

          <div className="task-info-section">
            <h3>Dates</h3>
            <div className="date-info">
              <div><strong>Créé:</strong> {formatDate(task.createdAt)}</div>
              <div><strong>Modifié:</strong> {formatDate(task.updatedAt)}</div>
            </div>
          </div>

          <div className="task-info-section">
            <h3>Pièces jointes</h3>
            {task.attachments.length > 0 ? (
              <ul className="attachments-list">
                {task.attachments.map(attachment => (
                  <li key={attachment.id} className="attachment-item">
                    <a href={attachment.url} className="attachment-link">
                      {attachment.name}
                    </a>
                    <span className="attachment-size">{attachment.size}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune pièce jointe</p>
            )}
            {isEditing && (
              <button className="btn-upload">Ajouter une pièce jointe</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;