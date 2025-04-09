
//frontend/src/pages/Board.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { AlertContext } from '../context/AlertContext';
import '../styles/Board.css';

const Board = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setAlert } = useContext(AlertContext);
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    column: 'todo'
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        // Simulation d'une requête API
        setTimeout(() => {
          // Mock data
          const mockBoard = {
            id: parseInt(id),
            name: id === '1' ? 'À faire' : id === '2' ? 'En cours' : 'Tableau ' + id,
            workspaceId: 1
          };
          
          const mockColumns = {
            'todo': {
              id: 'todo',
              title: 'À faire',
              taskIds: ['task-1', 'task-2', 'task-3']
            },
            'inProgress': {
              id: 'inProgress',
              title: 'En cours',
              taskIds: ['task-4', 'task-5']
            },
            'review': {
              id: 'review',
              title: 'En révision',
              taskIds: ['task-6']
            },
            'done': {
              id: 'done',
              title: 'Terminé',
              taskIds: ['task-7', 'task-8']
            }
          };
          
          const mockTasks = {
            'task-1': { id: 'task-1', title: 'Créer des maquettes', description: 'Concevoir les maquettes pour le nouveau site', priority: 'high', assignee: 'Marie Martin' },
            'task-2': { id: 'task-2', title: 'Analyser la concurrence', description: 'Faire une analyse des sites concurrents', priority: 'medium', assignee: 'Jean Dupont' },
            'task-3': { id: 'task-3', title: 'Définir la palette de couleurs', description: 'Choisir les couleurs pour la charte graphique', priority: 'low', assignee: null },
            'task-4': { id: 'task-4', title: 'Développer la page d\'accueil', description: 'Coder la page d\'accueil en HTML/CSS', priority: 'high', assignee: 'Pierre Durand' },
            'task-5': { id: 'task-5', title: 'Intégrer l\'API de paiement', description: 'Connecter l\'application avec l\'API Stripe', priority: 'high', assignee: 'Jean Dupont' },
            'task-6': { id: 'task-6', title: 'Tester le formulaire de contact', description: 'Vérifier que le formulaire fonctionne correctement', priority: 'medium', assignee: 'Marie Martin' },
            'task-7': { id: 'task-7', title: 'Optimiser les images', description: 'Compresser les images pour améliorer les performances', priority: 'low', assignee: 'Pierre Durand' },
            'task-8': { id: 'task-8', title: 'Configurer le serveur', description: 'Mettre en place le serveur de production', priority: 'medium', assignee: 'Jean Dupont' }
          };
          
          setBoard(mockBoard);
          setColumns(mockColumns);
          // Store tasks in state
          setTasks(mockTasks);
          setColumnOrder(['todo', 'inProgress', 'review', 'done']);
          setLoading(false);
        }, 1000);
      } catch (error) {
        setAlert('Erreur lors du chargement du tableau', 'danger');
        navigate('/dashboard');
      }
    };

    fetchBoardData();
  }, [id, navigate, setAlert]);

  const [tasks, setTasks] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);

  const onChange = e => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    
    // Simulation de création
    const taskId = `task-${Date.now()}`;
    const createdTask = {
      id: taskId,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      assignee: null
    };
    
    // Update tasks
    const updatedTasks = {
      ...tasks,
      [taskId]: createdTask
    };
    
    // Update column
    const column = columns[newTask.column];
    const updatedColumn = {
      ...column,
      taskIds: [...column.taskIds, taskId]
    };
    
    setTasks(updatedTasks);
    setColumns({
      ...columns,
      [newTask.column]: updatedColumn
    });
    
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      column: 'todo'
    });
    setShowTaskForm(false);
    setAlert('Tâche créée avec succès', 'success');
  };

  const onDragEnd = result => {
    const { destination, source, draggableId } = result;
    
    // If there is no destination
    if (!destination) return;
    
    // If the item is dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    
    // Moving within the same column
    if (sourceColumn === destinationColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      
      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds
      };
      
      setColumns({
        ...columns,
        [newColumn.id]: newColumn
      });
      return;
    }
    
    // Moving to another column
    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    sourceTaskIds.splice(source.index, 1);
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds
    };
    
    const destinationTaskIds = Array.from(destinationColumn.taskIds);
    destinationTaskIds.splice(destination.index, 0, draggableId);
    const newDestinationColumn = {
      ...destinationColumn,
      taskIds: destinationTaskIds
    };
    
    setColumns({
      ...columns,
      [newSourceColumn.id]: newSourceColumn,
      [newDestinationColumn.id]: newDestinationColumn
    });
  };

  const openTaskDetail = task => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  const closeTaskDetail = () => {
    setSelectedTask(null);
    setShowTaskDetail(false);
  };

  if (loading) {
    return <div className="board-loading">Chargement du tableau...</div>;
  }

  return (
    <div className="board-container">
      <header className="board-header">
        <div className="header-content">
          <h1>{board.name}</h1>
          <nav className="board-breadcrumb">
            <button onClick={() => navigate(`/workspace/${board.workspaceId}`)}>Retour à l'espace de travail</button>
          </nav>
        </div>
        <div className="board-actions">
          <button className="btn-create-task" onClick={() => setShowTaskForm(!showTaskForm)}>
            {showTaskForm ? 'Annuler' : 'Nouvelle tâche'}
          </button>
          <button className="btn-board-settings">Paramètres</button>
        </div>
      </header>

      {showTaskForm && (
        <form onSubmit={onSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Titre</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTask.title}
              onChange={onChange}
              required
              placeholder="Titre de la tâche"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={newTask.description}
              onChange={onChange}
              placeholder="Description de la tâche"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">Priorité</label>
            <select id="priority" name="priority" value={newTask.priority} onChange={onChange}>
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="column">Colonne</label>
            <select id="column" name="column" value={newTask.column} onChange={onChange}>
              {columnOrder.map(columnId => (
                <option key={columnId} value={columnId}>{columns[columnId].title}</option>
              ))}
            </select>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-submit">Créer</button>
            <button type="button" onClick={() => setShowTaskForm(false)} className="btn-cancel">Annuler</button>
          </div>
        </form>
      )}

      <div className="board-content">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="columns-container">
            {columnOrder.map(columnId => {
              const column = columns[columnId];
              const columnTasks = column.taskIds.map(taskId => tasks[taskId]);
              
              return (
                <div key={column.id} className="column">
                  <h2 className="column-title">{column.title}</h2>
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                className={`task-card ${snapshot.isDragging ? 'dragging' : ''} priority-${task.priority}`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => openTaskDetail(task)}
                              >
                                <div className="task-header">
                                  <h3 className="task-title">{task.title}</h3>
                                  <span className={`priority-badge ${task.priority}`}>
                                    {task.priority === 'high' ? 'Haute' : 
                                     task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                                  </span>
                                </div>
                                <p className="task-description">{task.description}</p>
                                {task.assignee && (
                                  <div className="task-assignee">
                                    <span className="assignee-avatar">{task.assignee.charAt(0)}</span>
                                    <span className="assignee-name">{task.assignee}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <button className="btn-add-task" onClick={() => {
                    setNewTask({ ...newTask, column: column.id });
                    setShowTaskForm(true);
                  }}>
                    + Ajouter une tâche
                  </button>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {showTaskDetail && selectedTask && (
        <div className="task-detail-overlay">
          <div className="task-detail-container">
            <div className="task-detail-header">
              <h2>{selectedTask.title}</h2>
              <button className="btn-close" onClick={closeTaskDetail}>×</button>
            </div>
            <div className="task-detail-content">
              <div className="task-detail-section">
                <h3>Description</h3>
                <p>{selectedTask.description || 'Aucune description'}</p>
              </div>
              <div className="task-detail-section">
                <h3>Priorité</h3>
                <span className={`priority-badge ${selectedTask.priority}`}>
                  {selectedTask.priority === 'high' ? 'Haute' : 
                   selectedTask.priority === 'medium' ? 'Moyenne' : 'Basse'}
                </span>
              </div>
              <div className="task-detail-section">
                <h3>Assigné à</h3>
                {selectedTask.assignee ? (
                  <div className="assignee-info">
                    <span className="assignee-avatar">{selectedTask.assignee.charAt(0)}</span>
                    <span className="assignee-name">{selectedTask.assignee}</span>
                  </div>
                ) : (
                  <p>Non assigné</p>
                )}
              </div>
            </div>
            <div className="task-detail-actions">
              <button className="btn-edit">Modifier</button>
              <button className="btn-delete">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Board;
