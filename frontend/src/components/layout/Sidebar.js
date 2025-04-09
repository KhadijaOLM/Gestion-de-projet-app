import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useHttpClient } from '../../hooks/useHttpClient';
import  Modal  from '../ui/Modal'; 
import WorkspaceForm from '../workspace/WorkspaceForm';
import BoardForm from '../board/BoardForm';
import './Layout.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [workspaces, setWorkspaces] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await sendRequest('/api/workspaces');
        setWorkspaces(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchWorkspaces();
  }, [user, sendRequest]);

  // Gestion de la création d'espace
  const handleCreateWorkspace = async (formData) => {
    try {
      const response = await sendRequest('/api/workspaces', 'POST', formData);
      setWorkspaces([...workspaces, response.workspace]);
      setShowWorkspaceModal(false);
      navigate(`/workspace/${response.workspace.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Gestion de la création de tableau
  const handleCreateBoard = async (formData) => {
    try {
      const response = await sendRequest(
        `/api/workspaces/${currentWorkspace}/boards`,
        'POST', 
        formData
      );
      setShowBoardModal(false);
      navigate(`/board/${response.board.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Modals */}
      <Modal show={showWorkspaceModal} onClose={() => setShowWorkspaceModal(false)}>
        <WorkspaceForm 
          onSubmit={handleCreateWorkspace} 
          onCancel={() => setShowWorkspaceModal(false)}
        />
      </Modal>

      <Modal show={showBoardModal} onClose={() => setShowBoardModal(false)}>
        <BoardForm 
          workspaceId={currentWorkspace}
          onSubmit={handleCreateBoard}
          onCancel={() => setShowBoardModal(false)}
        />
      </Modal>

      {/* Contenu de la sidebar */}
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`sidebar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <i className="fa-solid fa-home"></i>
          {!isCollapsed && <span>Tableau de bord</span>}
        </Link>

        {/* Section Workspaces */}
        <div className="workspace-section">
          {!isCollapsed && <div className="sidebar-divider">Espaces de travail</div>}

          {workspaces.map(workspace => (
            <div key={workspace.id} className="workspace-item">
              <Link 
                to={`/workspace/${workspace.id}`}
                className={`sidebar-item ${location.pathname.includes(`/workspace/${workspace.id}`) ? 'active' : ''}`}
              >
                <div className="workspace-icon" style={{ backgroundColor: workspace.color || '#3498db' }}>
                  {workspace.name.charAt(0).toUpperCase()}
                </div>
                {!isCollapsed && <span>{workspace.name}</span>}
              </Link>

              {/* Bouton Nouveau tableau */}
              {!isCollapsed && location.pathname.includes(`/workspace/${workspace.id}`) && (
                <button 
                  className="sidebar-item board-item new-item"
                  onClick={() => {
                    setCurrentWorkspace(workspace.id);
                    setShowBoardModal(true);
                  }}
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Nouveau tableau</span>
                </button>
              )}
            </div>
          ))}

          {/* Bouton Nouvel espace */}
          <button 
            className="sidebar-item new-item"
            onClick={() => setShowWorkspaceModal(true)}
          >
            <i className="fa-solid fa-plus"></i>
            {!isCollapsed && <span>Nouvel espace</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
};
export default Sidebar;