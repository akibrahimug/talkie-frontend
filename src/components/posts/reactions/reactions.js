import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import '@components/posts/reactions/reactions.scss';
import { reactionsMap, reactionsColor } from '@services/utils/static.data';

/**
 * Facebook-style reactions component
 * @param {Object} props - Component props
 * @param {Function} props.handleClick - Function to handle reaction click
 * @param {boolean} props.showLabel - Whether to show labels
 * @param {string} props.currentReaction - Current selected reaction
 * @returns {JSX.Element} - The reactions component
 */
const Reactions = ({ handleClick, showLabel = true, currentReaction = '' }) => {
  const reactionList = ['like', 'love', 'wow', 'happy', 'sad', 'angry'];
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredReaction, setHoveredReaction] = useState(null);

  // For animation timing
  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  /**
   * Handle mouse enter on reaction
   * @param {string} reaction - The reaction type
   */
  const handleMouseEnter = (reaction) => {
    setHoveredReaction(reaction);
  };

  /**
   * Handle mouse leave from reaction
   */
  const handleMouseLeave = () => {
    setHoveredReaction(null);
  };

  /**
   * Handle reaction click
   * @param {string} reaction - The reaction type
   * @param {Event} e - Click event
   */
  const onReactionClick = (reaction, e) => {
    e.stopPropagation();
    setIsVisible(false);
    handleClick(reaction);
  };

  return (
    <div className="fb-reactions" data-testid="reactions">
      <div className={`reactions-wrapper ${isVisible ? 'visible' : ''}`}>
        {reactionList.map((reaction, index) => (
          <div
            key={index}
            className={`reaction-item ${hoveredReaction === reaction ? 'hovered' : ''} ${
              currentReaction === reaction ? 'selected' : ''
            }`}
            onClick={(e) => onReactionClick(reaction, e)}
            onMouseEnter={() => handleMouseEnter(reaction)}
            onMouseLeave={handleMouseLeave}
            data-testid="reaction">
            <div className="reaction-icon-wrapper">
              <div className="reaction-icon-container">{reactionsMap[reaction]}</div>
            </div>
            {showLabel && <span className="reaction-label">{reaction}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

Reactions.propTypes = {
  handleClick: PropTypes.func.isRequired,
  showLabel: PropTypes.bool,
  currentReaction: PropTypes.string
};

export default Reactions;
