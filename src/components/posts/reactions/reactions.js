import PropTypes from 'prop-types';

import '@components/posts/reactions/reactions.scss';
import { reactionsMap } from '@services/utils/static.data';

const Reactions = ({ handleClick, showLabel = true }) => {
  const reactionList = ['like', 'love', 'wow', 'happy', 'sad', 'angry'];

  return (
    <div className="reactions" data-testid="reactions">
      <ul>
        {reactionList.map((reaction, index) => (
          <li key={index} onClick={() => handleClick(reaction)} data-testid="reaction">
            {showLabel && <label>{reaction}</label>}
            <div className="reaction-icon-container">{reactionsMap[reaction]}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

Reactions.propTypes = {
  handleClick: PropTypes.func.isRequired,
  showLabel: PropTypes.bool
};

export default Reactions;
