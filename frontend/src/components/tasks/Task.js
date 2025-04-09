import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { FaEdit, FaTrash, FaComments } from 'react-icons/fa';
import './Task.css';

const Task = ({ task, index, onDelete, onEdit, onOpenDetail }) => {
  const priorityColors = {
    high: '#ff6b6b',
    medium: '#feca57',
    low: '#1dd1a1'
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onOpenDetail(task)}
        >
          <div 
            className="task-priority" 
            style={{ backgroundColor: priorityColors[task.priority] }}
          />
          <div className="task-content">
            <h3 className="task-title">{task.title}</h3>
            <p className="task-description">{task.description.substring(0, 80)}
              {task.description.length > 80 ? '...' : ''}
            </p>
            <div className="task-meta">
              <span className="task-assignee">
                {task.assignee ? (
                  <div className="assignee-avatar">
                    {task.assignee.name.charAt(0).toUpperCase()}
                  </div>
                ) : null}
              </span>
              <div className="task-dates">
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="task-comment-count">
              <FaComments /> <span>{task.comments?.length || 0}</span>
            </div>
          </div>
          <div className="task-actions">
            <button 
              className="task-edit-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              <FaEdit />
            </button>
            <button 
              className="task-delete-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;