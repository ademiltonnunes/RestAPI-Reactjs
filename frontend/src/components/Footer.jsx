import React from 'react';
import facebookIcon from '../photos/facebook.png';

const Footer = () => {
    const currentYear = new Date().getFullYear(); // Gets the current year
    return (
        <footer className="footer">
        <div className="social-media">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={facebookIcon} alt="Facebook" />
            </a>
            {/* Add other social media links here */}
        </div>
        <div className="footer-text">
            ©{currentYear} by 3S Construction. Created by Ademilton Marcelo
        </div>
        </footer>
    );
};

export default Footer;
