import React from 'react';
import './Icon.scss';
import * as PhosphorIcons from '@phosphor-icons/react';

/**
 * Central icon component that provides access to all phosphor icons with consistent styling
 *
 * @param {string} name - The name of the icon from Phosphor Icons library
 * @param {string} size - Size of the icon (sm, md, lg) or numeric value
 * @param {string} color - Color override for the icon
 * @param {string} weight - Icon weight (thin, light, regular, bold, fill, duotone)
 * @param {string} className - Additional CSS classes to apply
 * @param {object} rest - Any additional props to pass to the icon component
 * @returns {JSX.Element} The rendered icon
 */
const Icon = ({ name, size = 'md', color = null, weight = 'regular', className = '', ...rest }) => {
  // Handle size values
  const sizeMap = {
    sm: '16',
    md: '20',
    lg: '24',
    xl: '32'
  };

  const finalSize = sizeMap[size] || size;

  // Get the icon component dynamically from Phosphor
  const IconComponent = PhosphorIcons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Phosphor Icons library`);
    return null;
  }

  // Style object for the icon
  const style = color ? { color } : {};

  return (
    <IconComponent size={finalSize} weight={weight} className={`phosphor-icon ${className}`} style={style} {...rest} />
  );
};

export default Icon;
