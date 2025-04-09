import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertContext } from '../context/AlertContext';
import { useHttpClient } from '../hooks/useHttpClient';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const { loading: httpLoading, sendRequest } = useHttpClient();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const data = await sendRequest('/api/workspaces');
        console.log(data);
        // Supposons que votre API renvoie les espaces de travail sous responseData.workspaces
        // Si responseData est directement le tableau d'espaces de travail, utilisez juste responseData
        setWorkspaces(data.workspaces || data);
        setLoading(false);
      } catch (error) {
        setAlert('Erreur lors du chargement des espaces de travail', 'danger');
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [sendRequest, setAlert]);

  const onChange = e => {
    setNewWorkspace({ ...newWorkspace, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const responseData = await sendRequest(
        '/workspaces', 
        'POST', 
        JSON.stringify({
          name: newWorkspace.name,
          description: newWorkspace.description
        })
      );
    
      // Ajouter le nouveau workspace à notre état local
      setWorkspaces([...workspaces, responseData]);
      setNewWorkspace({ name: '', description: '' });
      setShowCreateForm(false);
      setAlert('Espace de travail créé avec succès', 'success');
    } catch (error) {
      // Error est déjà géré dans useHttpClient
    }
  };

  if (loading || httpLoading) {
    return <div className="dashboard-loading">Chargement...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Bienvenue, {user?.name || 'Utilisateur'}</p>
      </header>

      <section className="dashboard-summary">
        <div className="summary-card">
          <h3>Espaces de travail</h3>
          <p className="summary-number">{workspaces.length}</p>
        </div>
        <div className="summary-card">
          <h3>Tâches actives</h3>
          <p className="summary-number">12</p>
        </div>
        <div className="summary-card">
          <h3>Tâches terminées</h3>
          <p className="summary-number">45</p>
        </div>
      </section>

      <section className="workspaces-section">
        <div className="section-header">
          <h2>Mes espaces de travail</h2>
          <button 
            className="btn-create" 
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Annuler' : 'Nouveau'}
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
                value={newWorkspace.name}
                onChange={onChange}
                required
                placeholder="Nom de l'espace de travail"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newWorkspace.description}
                onChange={onChange}
                placeholder="Description de l'espace de travail"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">Créer</button>
            </div>
          </form>
        )}

        <div className="workspaces-grid">
          {workspaces.length > 0 ? (
            workspaces.map(workspace => (
              <Link to={`/workspace/${workspace.id}`} key={workspace.id} className="workspace-card">
                <h3>{workspace.name}</h3>
                <p>{workspace.description}</p>
                <div className="workspace-footer">
                  <span className="members-count">{workspace.members} membres</span>
                </div>
              </Link>
            ))
          ) : (
            <p className="no-workspaces">Aucun espace de travail disponible. Créez-en un nouveau !</p>
          )}
        </div>
      </section>

      <section className="recent-activity">
        <h2>Activité récente</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-time">Il y a 2 heures</span>
            <p>Une nouvelle tâche a été créée dans "Projet Marketing"</p>
          </div>
          <div className="activity-item">
            <span className="activity-time">Il y a 1 jour</span>
            <p>Vous avez terminé la tâche "Préparer la présentation"</p>
          </div>
          <div className="activity-item">
            <span className="activity-time">Il y a 2 jours</span>
            <p>Nouveau membre ajouté à "Développement Produit"</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;