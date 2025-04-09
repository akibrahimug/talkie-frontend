import PropTypes from 'prop-types';
import { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePostItem } from '@redux/reducers/post/post.reducer';
import '@components/select-dropdown/selectDropdown.scss';

const SelectDropdown = ({ isActive, setSelectedItem, items = [], parentRef, updateRedux = false }) => {
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [hasPositioned, setHasPositioned] = useState(false);

  const selectItem = (item) => {
    setSelectedItem(item);
    // Only update Redux if updateRedux prop is true
    if (updateRedux) {
      dispatch(updatePostItem({ privacy: item.topText }));
    }
  };

  // Calculate position based on parent element, once and keep it consistent
  useEffect(() => {
    const calculatePosition = () => {
      if (parentRef?.current && dropdownRef?.current) {
        const parentRect = parentRef.current.getBoundingClientRect();
        const left = parentRect.left;
        const top = parentRect.bottom + window.scrollY + 8; // Add 8px offset
        setPosition({ left, top });
        setHasPositioned(true);
      }
    };

    // Calculate position on initial render, when becoming active,
    // and recalculate on window resize to maintain correct position
    calculatePosition();

    // Add event listeners for scenarios that might affect positioning
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition);

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [isActive, parentRef, dropdownRef, setPosition, hasPositioned, position.left, position.top]);

  return (
    <div className="menu-container" data-testid="menu-container" ref={menuRef}>
      <nav
        ref={dropdownRef}
        className={`menu ${isActive ? 'active' : 'inactive'}`}
        style={{
          // Always apply the same position regardless of open/closed state
          top: `${position.top}px`,
          left: `${position.left}px`,
          position: 'fixed',
          minWidth: '300px'
        }}>
        <ul>
          {items.map((item, index) => (
            <li data-testid="select-dropdown" key={index} onClick={() => selectItem(item)}>
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-text">
                <div className="menu-text-header">{item.topText}</div>
                <div className="sub-header">{item.subText}</div>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

SelectDropdown.propTypes = {
  isActive: PropTypes.bool,
  setSelectedItem: PropTypes.func,
  items: PropTypes.array,
  parentRef: PropTypes.object,
  updateRedux: PropTypes.bool
};

export default SelectDropdown;
