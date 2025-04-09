import React, { useState } from 'react';
import { FaReply, FaEdit, FaTrash } from 'react-icons/fa';
import './TaskComment.css';

const TaskComment = ({ comment, user, onDelete, onUpdate, onReply }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const isAuthor = user._id === comment.author._id;
  const formattedDate = new Date(comment.createdAt).toLocaleString();

  const handleUpdate = () => {
    onUpdate(comment._id, editedText);
    setIsEditing(false);
  };

  const handleReply = () => {
    onReply(comment._id, replyText);
    setIsReplying(false);
    setReplyText('');
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <div className="comment-author">
          <div className="author-avatar">
            {comment.author.name.charAt(0).toUpperCase()}
          </div>
          <div className="author-info">
            <span className="author-name">{comment.author.name}</span>
            <span className="comment-date">{formattedDate}</span>
          </div>
        </div>
        {isAuthor && (
          <div className="comment-actions">
            <button onClick={() => setIsEditing(!isEditing)} className="action-btn edit-btn">
              <FaEdit />
            </button>
            <button onClick={() => onDelete(comment._id)} className="action-btn delete-btn">
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      <div className="comment-body">
        {isEditing ? (
          <div className="comment-edit">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="comment-edit-input"
            />
            <div className="edit-actions">
              <button onClick={() => setIsEditing(false)} className="edit-btn-cancel">
                Cancel
              </button>
              <button onClick={handleUpdate} className="edit-btn-save">
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.text}</p>
        )}
      </div>

      <div className="comment-footer">
        <button onClick={() => setIsReplying(!isReplying)} className="reply-btn">
          <FaReply /> Reply
        </button>
      </div>

      {isReplying && (
        <div className="reply-form">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="reply-input"
          />
          <div className="reply-actions">
            <button onClick={() => setIsReplying(false)} className="reply-btn-cancel">
              Cancel
            </button>
            <button onClick={handleReply} className="reply-btn-submit">
              Reply
            </button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <TaskComment
              key={reply._id}
              comment={reply}
              user={user}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskComment;