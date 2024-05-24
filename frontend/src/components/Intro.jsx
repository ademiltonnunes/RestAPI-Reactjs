import React from 'react';
import photo1 from '../photos/intro.jpeg';

const Intro = () => {
  return (
    <div className="intro" style={{ backgroundImage: `url(${photo1})` }}>
      <div className="intro-overlay">
        <div className="intro-text">
          <h1>3S CONSTRUCTION</h1>
          <p>Place where your dream comes true</p>
        </div>
      </div>
    </div>
  );
};

export default Intro;
