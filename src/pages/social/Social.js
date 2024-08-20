import React from 'react';
import '@pages/social/Social.scss';
import { Outlet } from 'react-router-dom';
import Header from '@components/header/header';
import Sidebar from '@components/sidebar/Sidebar';

const Social = () => {
  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="dashboard-sidebar">
          <Sidebar />
        </div>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Social;
