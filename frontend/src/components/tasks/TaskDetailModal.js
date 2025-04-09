import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaUserAlt, FaFlag, FaHistory } from 'react-icons/fa';
import TaskComment from './TaskComment';
import './TaskDetailModal.css';

const TaskDetailModal = ({ task, onClose, onUpdate, onDelete, currentUser, boardMembers }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [taskData, setTaskData] = useState({});
  
  useEffect(() => {
    if (task) {
      setTaskData(task);
      setComments(task.comments || []);
    }
  }, [task]);

  const priorityColors = {
    high: '#ff6b6b',
    medium: '#feca57',
    low: '#1dd1a1'
  };

  const statusLabels = {
    todo: 'To Do',
    inProgress: 'In Progress',
    review: 'Review',
    done: 'Done'
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    // API call would happen here
    const newComment = {
      _id: Date.now().toString(),
      text: commentText,
      author: currentUser,
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    setComments([...comments, newComment]);
    setCommentText('');
    
    // Update task with new comment
    const updatedTask = {
      ...taskData,
      comments: [...comments, newComment]
    };
    onUpdate(updatedTask);
  };

  const handleDeleteComment = (commentId) => {
    const filteredComments = comments.filter(c => c._id !== commentId);
    setComments(filteredComments);
    
    // Update task with filtered comments
    const updatedTask = {
      ...taskData,
      comments: filteredComments
    };
    onUpdate(updatedTask);
  };

  const handleUpdateComment = (commentId, text) => {
    const updatedComments = comments.map(c => 
      c._id === commentId ? { ...c, text } : c
    );
    setComments(updatedComments);
    
    // Update task with updated comments
    const updatedTask = {
      ...taskData,
      comments: updatedComments
    };
    onUpdate(updatedTask);
  };

  const handleReplyComment = (parentCommentId, text) => {
    const newReply = {
      _id: Date.now().toString(),
      text,
      author: currentUser,
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    const updatedComments = comments.map(c => {
      if (c._id === parentCommentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply]
        };
      }
      return c;
    });
    
    setComments(updatedComments);
    
    // Update task with updated comments including reply
    const updatedTask = {
      ...taskData,
      comments: updatedComments
    };
    onUpdate(updatedTask);
  };

  const handleTaskUpdate = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value
    });
  };

  const saveTaskChanges = () => {
    onUpdate(taskData);
    setIsEditing(false);
  };

  if (!task) return null;

  return (
    <div className="modal-overlay">
      <div className="task-detail-modal">
        <div className="modal-header">
          <div className="modal-title-container">
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleTaskUpdate}
                className="edit-title-input"
              />
            ) : (
              <h2 className="modal-title">{task.title}</h2>
            )}
            <div 
              className="task-status-badge"
              style={{ backgroundColor: priorityColors[task.priority] }}
            >
              {statusLabels[task.status]}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="task-detail-section">
            <div className="task-meta-info">
              <div className="task-meta-item">
                <FaCalendarAlt className="meta-icon" />
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              
              <div className="task-meta-item">
                <FaUserAlt className="meta-icon" />
                <span>
                  {isEditing ? (
                    <select
                      name="assigneeId"
                      value={taskData.assignee?._id || ''}
                      onChange={handleTaskUpdate}
                      className="edit-assignee-select"
                    >
                      <option value="">Unassigned</option>
                      {boardMembers?.map(member => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    task.assignee?.name || 'Unassigned'
                  )}
                </span>
              </div>
              
              <div className="task-meta-item">
                <FaFlag className="meta-icon" />
                <span>
                  {isEditing ? (
                    <select
                      name="priority"
                      value={taskData.priority}
                      onChange={handleTaskUpdate}
                      className="edit-priority-select"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  ) : (
                    task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
                  )}
                </span>
              </div>
              
              <div className="task-meta-item">
                <FaHistory className="meta-icon" />
                <span>
                  {isEditing ? (
                    <select
                      name="status"
                      value={taskData.status}
                      onChange={handleTaskUpdate}
                      className="edit-status-select"
                    >
                      <option value="todo">To Do</option>
                      <option value="inProgress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  ) : (
                    statusLabels[task.status]
                  )}
                </span>
              </div>
            </div>
            
            <div className="description-section">
              <h3>Description</h3>
              {isEditing ? (
                <textarea
                  name="description"
                  value={taskData.description}
                  onChange={handleTaskUpdate}
                  className="edit-description-textarea"
                  rows="4"
                ></textarea>
              ) : (
                <p className="task-description">{task.description}</p>
              )}
            </div>
            
            <div className="task-actions">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="btn-cancel">
                    Cancel
                  </button>
                  <button onClick={saveTaskChanges} className="btn-save">
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsEditing(true)} className="btn-edit">
                    Edit Task
                  </button>
                  <button onClick={() => onDelete(task._id)} className="btn-delete">
                    Delete Task
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="task-comments-section">
            <h3>Comments ({comments.length})</h3>
            
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input"
              ></textarea>
              <button type="submit" className="comment-submit">
                Comment
              </button>
            </form>
            
            <div className="comments-list">
              {comments.map(comment => (
                <TaskComment
                  key={comment._id}
                  comment={comment}
                  user={currentUser}
                  onDelete={handleDeleteComment}
                  onUpdate={handleUpdateComment}
                  onReply={handleReplyComment}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;