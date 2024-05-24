import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ViewImage from './ViewImage';

const Service = () => {
  const [services, setServices] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    axios.get('https://localhost:8080/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => console.error('Error fetching services:', error));
  }, []);

  const openModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); 
  };

  return (
    <div className="services">
      <h2>Photo of Services</h2>
      <p>Please, check out our photos of our services:</p>
      {services.map((gallery) => (
        <div className="service-gallery-container" key={gallery.name}>  {/* Apply new container class */}
          <h3>{gallery.name} - {formatDate(gallery.date)}</h3>
          <div className="photo-grid-service">
            {gallery.photos.map((photo) => (
              <img
                key={photo.photo_id}
                src={photo.imageUrl}
                alt={photo.content}
                onClick={() => openModal(photo)}
                className="service-photo"
              />
            ))}
          </div>
        </div>
      ))}
      {selectedPhoto && <ViewImage photo={selectedPhoto} onClose={closeModal} />}
    </div>
  );
};

export default Service;
