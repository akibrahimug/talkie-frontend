import React from 'react';
import Icon from './Icon';
import { getPhosphorName, getPhosphorWeight } from './iconMappings';

/**
 * A drop-in replacement component for FontAwesome icons
 *
 * This component allows for easy migration from FontAwesome to Phosphor icons
 * by accepting the original FontAwesome icon name and converting it to the
 * equivalent Phosphor icon.
 *
 * @param {string} icon - The original FontAwesome icon name (e.g., 'FaSearch')
 * @param {string} className - CSS classes to apply
 * @param {object} rest - Any other props to pass to the icon
 * @returns {JSX.Element} The Phosphor icon equivalent
 */
const FAIcon = ({ icon, className = '', ...rest }) => {
  // Convert the FontAwesome icon name to Phosphor equivalent
  const phosphorName = getPhosphorName(icon);

  // Determine the appropriate weight based on the FontAwesome icon name
  const weight = getPhosphorWeight(icon);

  return <Icon name={phosphorName} className={className} weight={weight} {...rest} />;
};

export default FAIcon;
