import PropTypes from 'prop-types';
import { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePostItem } from '@redux/reducers/post/post.reducer';
import '@components/select-dropdown/selectDropdown.scss';

const SelectDropdown = ({ isActive, setSelectedItem, items = [], parentRef }) => {
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [hasPositioned, setHasPositioned] = useState(false);

  const selectItem = (item) => {
    setSelectedItem(item);
    dispatch(updatePostItem({ privacy: item.topText }));
  };

  // Calculate position based on parent element, once and keep it consistent
  useEffect(() => {
    const calculatePosition = () => {
      if (parentRef && parentRef.current) {
        const rect = parentRef.current.getBoundingClientRect();

        // Always position directly below the button
        const newPosition = {
          top: rect.bottom + window.scrollY + 10, // 10px below button
          left: rect.left + window.scrollX // Directly aligned with button left edge
        };

        // Only update if position has changed significantly to avoid unnecessary rerenders
        if (
          !hasPositioned ||
          Math.abs(newPosition.top - position.top) > 5 ||
          Math.abs(newPosition.left - position.left) > 5
        ) {
          setPosition(newPosition);
          setHasPositioned(true);
        }
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
  }, [isActive, parentRef]); // Remove hasPositioned dependency to avoid recalculation cycles

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
  parentRef: PropTypes.object
};

export default SelectDropdown;
