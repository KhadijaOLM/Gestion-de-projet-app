
//from src/components/workspace/WorkspaceForm.js
import React, { useState } from 'react';
import './WorkspaceForm.css';
import { useNavigate } from 'react-router-dom';
import { useHttpClient } from '../../hooks/useHttpClient';
import { useAuth } from '../../hooks/useAuth';

const WorkspaceForm = ({ onCancel }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const navigate = useNavigate();
  const { sendRequest } = useHttpClient();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        alert('Veuillez vous reconnecter');
        navigate('/login');
        return;
      }
      
      await sendRequest(
        '/api/workspaces',
        'POST',
        formData,
        {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      );
      navigate('/dashboard');
      onCancel();
    } catch (err) {
      console.error('Erreur:', err);
      alert(err.message || 'Une erreur est survenue');
    }
  };

  if (!token) {
    return <div>Redirection vers la page de connexion...</div>;
  }

  return (
    <form className="workspace-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nom de l'espace de travail</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Mon espace de travail"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description de l'espace de travail..."
          rows="4"
        />
      </div>
      
      <div className="form-actions">
          <button type="button" onClick={onCancel}>Annuler</button>
          <button type="submit">Créer</button>
        </div>
    </form>
  );
};
export default WorkspaceForm;
