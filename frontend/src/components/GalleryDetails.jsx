import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ViewImage from './ViewImage';

const GalleryDetail = ({ gallery, onBack, token }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleFileChange = (event) => {
    setUploadError('');  
    setFile(event.target.files[0]);
  };

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`https://localhost:8080/gallery/photo/${gallery._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPhotos(response.data.photos);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await axios.post(`https://localhost:8080/gallery/photo/${gallery._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
 
      fetchPhotos();
      alert('Upload successful!');
    } catch (error) {
      setUploadError(error.response ? error.response.data.message : error.message);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [gallery._id, token]);

  const handleDelete = async (photoId) => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
      try {
        await axios.delete(`https://localhost:8080/gallery/photo/${gallery._id}/${photoId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchPhotos();
      } catch (error) {
        console.error('Failed to delete photo:', error);
      }
    }
  };

  const handleImageClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeImageModal = () => {
    setSelectedPhoto(null);
  };

  const handleToggleShowPortal = async (photoId, newShowPortal) => {
    const updatedPhotos = photos.map(photo => 
      photo.photo_id === photoId ? { ...photo, showPortal: newShowPortal } : photo
    );
    setPhotos(updatedPhotos);
    
    try {
      await axios.patch(`https://localhost:8080/gallery/photo/${gallery._id}/${photoId}`, {
        showPortal: newShowPortal
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to update photo:', error);
    }
  };
  
  return (
    <div>
      <div className='gallery-detail-header'>
          <button className='close-gallery-details-button' onClick={onBack}>Back to Galleries</button>
          <h1>Gallery Name: {gallery.name}</h1>
          <h2>Date of Creation: {new Date(gallery.date).toLocaleDateString()}</h2>
      </div>
      <div className='gallery-detail-upload'>
          <h3>Upload a new photo:</h3>
          <input type="file" accept="image/*" onChange={handleFileChange} />           
          <button className='upload-photo-button' onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {uploadError && <p>Error: {uploadError}</p>}
      </div>
      <div className='gallery-detail-photos'>
        <h3>Photos:</h3>
        <div className='photo-grid'>
          {photos.map(photo => (
            <div key={photo.photo_id} className='photo-item'>
              <button className="delete-button" onClick={(e) => {
                e.stopPropagation();
                handleDelete(photo.photo_id);
              }}>X</button>
              <img src={photo.imageUrl} alt={photo.content} onClick={() => handleImageClick(photo)}/>
              <p>{photo.content}</p>
              <label>
                  <input
                    type="checkbox"
                    checked={photo.showPortal}
                    onChange={() => handleToggleShowPortal(photo.photo_id, !photo.showPortal)}
                  />
                  Show in the homepage portal
                </label>
            </div>
          ))}
        </div>
      </div>
      {selectedPhoto && <ViewImage photo={selectedPhoto} onClose={closeImageModal} />}
    </div>
  );
};

export default GalleryDetail;
