import React, { useEffect, useState } from 'react';
import '@components/sidebar/Sidebar.scss';
import { sideBarItems, fontAwesomeIcons } from '@services/utils/static.data';
import { useLocation } from 'react-router-dom';
const Sidebar = () => {
  const [sidebar, setSidebar] = useState([]);
  const location = useLocation();

  const checkUrl = (name) => {
    return location.pathname.includes(name.toLowerCase());
  };

  useEffect(() => {
    setSidebar(sideBarItems);
  }, []);
  return (
    <div className="app-side-menu">
      <div className="side-menu">
        <ul className="list-unstyled">
          {sidebar.map((data) => (
            <li key={data.index}>
              <div data-testid="sidebar-list" className={`sidebar-link ${checkUrl(data.name) ? 'active' : ''}`}>
                <div className="menu-icon">{fontAwesomeIcons[data.iconName]}</div>
                <div className="menu-link">
                  <span>{`${data.name}`}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
