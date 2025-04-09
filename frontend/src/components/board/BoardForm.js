//frontend/src/components/board/BoardForm.js
import React, { useState, useEffect } from 'react';
import './BoardForm.css';

const BOARD_COLORS = [
  '#0079bf', // Blue
  '#d29034', // Orange
  '#519839', // Green
  '#b04632', // Red
  '#89609e', // Purple
  '#cd5a91', // Pink
  '#4bbf6b', // Light green
  '#00aecc'  // Turquoise
];

const BoardForm = ({ onSubmit, initialData = null, workspaceId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: BOARD_COLORS[0],
    workspaceId
  });
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        color: initialData.color || BOARD_COLORS[0],
        workspaceId: initialData.workspaceId || workspaceId
      });
    } else {
      setFormData(prev => ({
        ...prev,
        workspaceId
      }));
    }
  }, [initialData, workspaceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorSelect = (color) => {
    setFormData((prev) => ({
      ...prev,
      color,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    
    if (!initialData) {
      // Reset form if it's a new board
      setFormData((prev) => ({
        name: '',
        description: '',
        color: BOARD_COLORS[0],
        workspaceId: prev.workspaceId
      }));
    }
  };

  return (
    <form className="board-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nom du tableau</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Mon tableau"
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
          placeholder="Description du tableau..."
          rows="3"
        />
      </div>
      
      <div className="form-group">
        <label>Couleur du tableau</label>
        <div className="color-picker">
          {BOARD_COLORS.map((color) => (
            <div
              key={color}
              className={`color-option ${formData.color === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>
      </div>
      
      <button type="submit" className="submit-button">
        {initialData ? 'Mettre à jour' : 'Créer le tableau'}
      </button>
    </form>
  );
};
export default BoardForm;
