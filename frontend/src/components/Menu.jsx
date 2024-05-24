import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Menu = ({ isAuthenticated }) => {
  const location = useLocation();

  const menuOptions = [
    { name: 'Home', path: '/', alignRight: false },
    { name: 'Contact', path: '/clients', alignRight: false },
    { name: 'Photos', path: '/services', alignRight: false },
    { name: 'Admin', path: isAuthenticated ? '/admin' : '/login', alignRight: true }
  ];

  return (
    <nav>
      <ul className="menu">
        {menuOptions.map((option, index) => (
          <li 
            key={index} 
            className={`menu-item ${option.alignRight ? 'menu-right' : ''} ${location.pathname === option.path ? 'active' : ''}`}>
            <Link to={option.path} className="menu-link">
                {option.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
