import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Gallery from './Gallery';
import ClientsContact from './ClientsContact';

const Admin = ({token, onLogout }) => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-panel">
      <aside className="sidebar">
        <h1>3S Construction</h1>
        <nav>
          <ul>
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => handleTabChange('dashboard')}>Dashboard</li>
            <li className={activeTab === 'gallery' ? 'active' : ''} onClick={() => handleTabChange('gallery')}>Galleries</li>
            {/* <li className={activeTab === 'user' ? 'active' : ''} onClick={() => handleTabChange('user')}>Users</li> */}
            <li className={activeTab === 'contact' ? 'active' : ''} onClick={() => handleTabChange('contact')}>Contact</li>
          </ul>
        </nav>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </aside>
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'gallery' && <Gallery token={token}/>}
        {/* {activeTab === 'user' && <ClientsContact />} */}
        {activeTab === 'contact' && <ClientsContact />}
      </main>
    </div>
  );
};

export default Admin;
