
//frontend/src/pages/Workspace.js
import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertContext } from '../context/AlertContext';
import { useHttpClient } from '../hooks/useHttpClient';
import '../styles/Workspace.css';

const Workspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [workspace, setWorkspace] = useState(null);
  const [boards, setBoards] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoard, setNewBoard] = useState({
    name: '',
    description: '' 
  });

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const responseData = await sendRequest(`/api/workspaces/${id}`);
         setWorkspace(responseData);
         setBoards(responseData.boards || []);
         setMembers(responseData.members);
        // Simulation d'une requête API
        setTimeout(() => {
          // Mock data
          const mockWorkspace = {
            id: parseInt(id),
            name: id === '1' ? 'Projet Marketing' : id === '2' ? 'Développement Produit' : 'Espace ' + id,
            description: 'Description de l\'espace de travail',
            createdAt: '2025-02-15'
          };
          
          const mockBoards = [
            { id: 1, name: 'À faire', tasksCount: 5 },
            { id: 2, name: 'En cours', tasksCount: 3 },
            { id: 3, name: 'Terminé', tasksCount: 8 }
          ];
          
          const mockMembers = [
            { id: 1, name: 'Jean Dupont', email: 'jean@example.com', role: 'Admin' },
            { id: 2, name: 'Marie Martin', email: 'marie@example.com', role: 'Membre' },
            { id: 3, name: 'Pierre Durand', email: 'pierre@example.com', role: 'Membre' }
          ];
          
          setWorkspace(mockWorkspace);
          setBoards(mockBoards);
          setMembers(mockMembers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        setAlert('Erreur lors du chargement de l\'espace de travail', 'danger');
        navigate('/dashboard');
      }
    };

    fetchWorkspaceData();
  }, [id, navigate, setAlert, sendRequest]);

  const onChange = e => {
    setNewBoard({ ...newBoard, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    
    // Simulation de création
    const newId = boards.length + 1;
    const createdBoard = {
      id: newId,
      name: newBoard.name,
      tasksCount: 0
    };
    
    setBoards([...boards, createdBoard]);
    setNewBoard({ name: '', description: '' });
    setShowCreateForm(false);
    setAlert('Tableau créé avec succès', 'success');
  };

  const handleDeleteWorkspace = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet espace de travail ?')) {
      // Simulation de suppression
      setAlert('Espace de travail supprimé avec succès', 'success');
      navigate('/dashboard');
    }
  };

  if (loading) {
    return <div className="workspace-loading">Chargement de l'espace de travail...</div>;
  }

  return (
    <div className="workspace-container">
      <header className="workspace-header">
        <div className="header-content">
          <h1>{workspace.name}</h1>
          <p className="workspace-description">{workspace.description}</p>
          <p className="workspace-meta">Créé le {new Date(workspace.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="workspace-actions">
          <button className="btn-edit">Modifier</button>
          <button className="btn-delete" onClick={handleDeleteWorkspace}>Supprimer</button>
        </div>
      </header>

      <div className="workspace-content">
        <main className="workspace-main">
          <section className="boards-section">
            <div className="section-header">
              <h2>Tableaux</h2>
              <button 
                className="btn-create" 
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? 'Annuler' : 'Nouveau tableau'}
              </button>
            </div>

            {showCreateForm && (
              <form onSubmit={onSubmit} className="create-form">
                <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newBoard.name}
                    onChange={onChange}
                    required
                    placeholder="Nom du tableau"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description (optionnelle)</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newBoard.description}
                    onChange={onChange}
                    placeholder="Description du tableau"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit">Créer</button>
                </div>
              </form>
            )}

            <div className="boards-grid">
              {boards.map(board => (
                <Link to={`/board/${board.id}`} key={board.id} className="board-card">
                  <h3>{board.name}</h3>
                  <span className="tasks-count">{board.tasksCount} tâches</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="workspace-activity">
            <h2>Activité récente</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-time">Il y a 1 heure</span>
                <p><strong>Marie Martin</strong> a ajouté une nouvelle tâche</p>
              </div>
              <div className="activity-item">
                <span className="activity-time">Il y a 5 heures</span>
                <p><strong>Jean Dupont</strong> a commenté une tâche</p>
              </div>
              <div className="activity-item">
                <span className="activity-time">Il y a 1 jour</span>
                <p><strong>Pierre Durand</strong> a terminé une tâche</p>
              </div>
            </div>
          </section>
        </main>

        <aside className="workspace-sidebar">
          <section className="members-section">
            <h2>Membres ({members.length})</h2>
            <ul className="members-list">
              {members.map(member => (
                <li key={member.id} className="member-item">
                  <div className="member-avatar">
                    {member.name.charAt(0)}
                  </div>
                  <div className="member-info">
                    <h4>{member.name}</h4>
                    <p>{member.email}</p>
                    <span className={`member-role ${member.role.toLowerCase()}`}>{member.role}</span>
                  </div>
                </li>
              ))}
            </ul>
            <button className="btn-invite">Inviter un membre</button>
          </section>

          <section className="workspace-stats">
            <h2>Statistiques</h2>
            <div className="stats-item">
              <h4>Tableaux</h4>
              <p>{boards.length}</p>
            </div>
            <div className="stats-item">
              <h4>Tâches</h4>
              <p>{boards.reduce((acc, board) => acc + board.tasksCount, 0)}</p>
            </div>
            <div className="stats-item">
              <h4>Membres</h4>
              <p>{members.length}</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
export default Workspace;
