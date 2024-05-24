import React from 'react';

const ViewImage = ({ photo, onClose }) => {
  return (
    <div className="image-modal">
      <div className="image-content">
        <img src={photo.imageUrl} alt={photo.content} className="modal-image" />
        <button onClick={onClose} className="close-modal-button">Close Photo</button>
      </div>
    </div>
  );
};

export default ViewImage;
