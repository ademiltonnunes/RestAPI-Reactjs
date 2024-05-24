import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Photos = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
      const fetchPhotos = async () => {
          try {
              const response = await axios.get('https://localhost:8080/portal/photos');
              setPhotos(response.data.photos);
          } catch (error) {
              console.error('Failed to fetch photos:', error);
          }
      };
  
      fetchPhotos();
    }, []);
  

    const goToPrevious = () => {
        setCurrentSlide(prev => (prev === 0 ? photos.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentSlide(prev => (prev === photos.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="slideshow-container">
            {photos.map((photo, index) => (
                <div
                    className={`slide ${index === currentSlide ? 'active' : ''}`}
                    key={index}
                >
                    <img src={photo.imageUrl} alt={`Slide ${index + 1}`} />
                </div>
            ))}
            <button className="prev" onClick={goToPrevious}>&#10094;</button>
            <button className="next" onClick={goToNext}>&#10095;</button>
        </div>
    );
};

export default Photos;
