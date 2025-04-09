import React, { useState, useEffect } from 'react';
import './ListForm.css';

const ListForm = ({ onSubmit, initialData = null, onCancel, isTask = false }) => {
  const [isFormOpen, setIsFormOpen] = useState(!!initialData);
  const [formData, setFormData] = useState({
    name: '',
    description: isTask ? '' : undefined,
  });
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: isTask ? undefined : (initialData.description || ''),
      });
    }
  }, [initialData, isTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    
    if (!initialData) {
      // Reset form if it's a new item
      setFormData({
        name: '',
        description: isTask ? '' : undefined,
      });
      setIsFormOpen(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setIsFormOpen(false);
    }
  };

  if (!isFormOpen) {
    return (
      <button 
        className="add-item-button"
        onClick={() => setIsFormOpen(true)}
      >
        <i className="fas fa-plus"></i>
        {isTask ? ' Ajouter une tâche' : ' Ajouter une liste'}
      </button>
    );
  }

  return (
    <form className={`list-form ${isTask ? 'task-form' : ''}`} onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={isTask ? "Titre de la tâche" : "Titre de la liste"}
          autoFocus
          required
        />
      </div>
      
      {!isTask && (
        <div className="form-group">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description (optionnelle)"
            rows="2"
          />
        </div>
      )}
      
      <div className="form-actions">
        <button type="submit" className="submit-button">
          {initialData ? 'Enregistrer' : (isTask ? 'Ajouter' : 'Créer')}
        </button>
        <button 
          type="button" 
          className="cancel-button"
          onClick={handleCancel}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </form>
  );
};

export default ListForm;