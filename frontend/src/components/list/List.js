import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Task from '../tasks/Task';
import ListForm from './ListForm';
import './List.css';

const List = ({ list, tasks, index, onDelete, onEdit, onAddTask, onTaskClick }) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const handleEdit = (updatedList) => {
    onEdit(list.id, updatedList);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={`list-${list.id}`} index={index}>
      {(provided) => (
        <div
          className="list-container"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          {isEditing ? (
            <ListForm 
              initialData={list} 
              onSubmit={handleEdit} 
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="list-header" {...provided.dragHandleProps}>
              <h3>{list.name}</h3>
              <div className="list-actions">
                <button 
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="fas fa-pencil-alt"></i>
                </button>
                <button 
                  className="delete-button"
                  onClick={() => onDelete(list.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          )}

          <Droppable droppableId={`list-${list.id}`} type="TASK">
            {(provided, snapshot) => (
              <div
                className={`list-tasks ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks
                  .filter((task) => task.listId === list.id)
                  .sort((a, b) => a.order - b.order)
                  .map((task, taskIndex) => (
                    <Task 
                      key={task.id} 
                      task={task} 
                      index={taskIndex} 
                      onClick={() => onTaskClick(task)}
                    />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="list-footer">
            <ListForm 
              onSubmit={(data) => onAddTask({ ...data, listId: list.id })}
              isTask
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default List;