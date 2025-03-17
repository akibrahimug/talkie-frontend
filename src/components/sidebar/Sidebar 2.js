import React, { useEffect, useState } from 'react';
import '@components/sidebar/Sidebar.scss';
import { sideBarItems, fontAwesomeIcons } from '@services/utils/static.data';
import { useLocation, createSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Sidebar = () => {
  const [sidebar, setSidebar] = useState([]);
  const location = useLocation();
  const { profile } = useSelector((state) => state.user);
  const navigate = useNavigate();
  // hide sidebar text on mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const checkUrl = (name) => {
    return location.pathname.includes(name.toLowerCase());
  };

  const navigateToPage = (name, url) => {
    if (name === 'Profile') {
      url = `${url}/${profile?.username}?${createSearchParams({ id: profile?._id, uId: profile?.uId })}`;
    }
    navigate(url);
  };

  useEffect(() => {
    setSidebar(sideBarItems);
  }, []);
  return (
    <div className="app-side-menu">
      <div className="side-menu">
        <ul className="list-unstyled">
          {sidebar.map((data) => (
            <li key={data.index} onClick={() => navigateToPage(data.name, data.url)}>
              <div data-testid="sidebar-list" className={`sidebar-link ${checkUrl(data.name) ? 'active' : ''}`}>
                <div className={`menu-icon ${isMobile ? 'menu-icon-mobile' : ''}`}>
                  {fontAwesomeIcons[data.iconName]}
                </div>
                <div className="menu-link">
                  <span className={isMobile ? 'hide-text' : ''}>{`${data.name}`}</span>
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
