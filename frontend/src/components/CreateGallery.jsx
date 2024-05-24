import React, { useState } from 'react';
import axios from 'axios';

const CreateGallery = ({ token, onClose, fetchGalleries }) => {
  const [name, setName] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    try {
      await axios.post('https://localhost:8080/gallery', { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onClose();  // Close modal
      fetchGalleries();  // Refresh galleries
    } catch (error) {
      console.error('Failed to create gallery:', error);
      alert("Failed to create gallery");
    }
  };

  return (
    <div className="create-gallery-modal">
      <h2 className="create-gallery-title">Create Gallery</h2>
      <div className="create-gallery-form">
        <label className="create-gallery-label">
          Name:
          <input
            type="text"
            className="create-gallery-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div className="button-container">
        <button onClick={onClose} className="create-gallery-cancel">Cancel</button>
        <button onClick={handleCreate} className="create-gallery-button">Create</button>
        
      </div>
    </div>
  );
};

export default CreateGallery;
