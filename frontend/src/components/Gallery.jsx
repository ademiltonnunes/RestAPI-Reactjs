import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GalleryDetail from './GalleryDetails';
import CreateGallery from './CreateGallery';

const Gallery = ({ token }) => {
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchGalleries();
  }, [token]);

  const fetchGalleries = async () => {
    try {
      const response = await axios.get('https://localhost:8080/gallery', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGalleries(response.data);
    } catch (error) {
      console.error('Error fetching galleries:', error);
    }
  };

  const toggleCreateModal = () => {
    setIsCreating(!isCreating);
  };
  
  const handleDelete = async (galleryId) => {
    if (window.confirm("Are you sure you want to delete this gallery?")) {
      try {
        await axios.delete(`https://localhost:8080/gallery/${galleryId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchGalleries(); // Refresh the gallery list after deletion
      } catch (error) {
        console.error('Error deleting gallery:', error);
      }
    }
  };

  if (selectedGallery) {
    return <GalleryDetail gallery={selectedGallery} onBack={() => setSelectedGallery(null) } token={token} />;
  }

  return (
    <div>
      <div className="gallery-header">
        <button className="create-button" onClick={toggleCreateModal}>Create New Gallery</button>
        {isCreating && <CreateGallery token={token} onClose={toggleCreateModal} fetchGalleries={fetchGalleries} />}
      </div>
      <div className="gallery-grid">
        {galleries.map(gallery => (
          <div key={gallery._id} className="gallery-item" onClick={() => setSelectedGallery(gallery)}>
            <button className="delete-button" onClick={(e) => {
              e.stopPropagation(); // Prevent gallery selection when clicking delete
              handleDelete(gallery._id);
            }}>X</button>
            <h3>{gallery.name}</h3>
            <p>Creation Date: {new Date(gallery.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
