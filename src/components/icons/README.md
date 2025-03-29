# Icon System

This directory contains components and utilities for managing icons in the Talkie application. We use [Phosphor Icons](https://phosphoricons.com/) as our icon library for consistent, high-quality icons.

## Components

### `Icon` Component

The main component for rendering icons.

```jsx
import Icon from '@components/icons';

// Basic usage
<Icon name="Heart" />

// With custom size, weight, and color
<Icon
  name="Heart"
  size="lg"
  weight="fill"
  color="#ff0000"
  className="custom-icon-class"
/>
```

#### Props

- `name` (string, required): The name of the Phosphor icon
- `size` (string/number, default: 'md'): Size of the icon
  - Can be a predefined size ('sm', 'md', 'lg', 'xl')
  - Or a numeric pixel value
- `weight` (string, default: 'regular'): Icon weight/style
  - Options: 'thin', 'light', 'regular', 'bold', 'fill', 'duotone'
- `color` (string): Explicit color for the icon
- `className` (string): Additional CSS classes
- All other props are passed to the icon component

### `FAIcon` Component

A utility component for easy migration from FontAwesome to Phosphor icons.

```jsx
import { FAIcon } from '@components/icons';

// Replace FontAwesome import
// BEFORE: import { FaSearch } from 'react-icons/fa';
// AFTER: import { FAIcon } from '@components/icons';

// Replace FontAwesome usage
// BEFORE: <FaSearch className="search-icon" />
// AFTER: <FAIcon icon="FaSearch" className="search-icon" />
```

#### Props

- `icon` (string, required): The original FontAwesome icon name (e.g., 'FaSearch')
- `className` (string): Additional CSS classes
- All other props are passed to the underlying Icon component

## Utilities

### Icon Mappings

Utilities to help map FontAwesome icon names to Phosphor equivalents:

```jsx
import { getPhosphorName, getPhosphorWeight } from '@components/icons';

// Convert FontAwesome name to Phosphor name
const phosphorName = getPhosphorName('FaSearch'); // Returns 'MagnifyingGlass'

// Get appropriate weight based on FontAwesome naming
const weight = getPhosphorWeight('FaRegBell'); // Returns 'regular'
```

## Migration Strategy

To migrate from FontAwesome to Phosphor Icons:

1. For simple replacements, use the `FAIcon` component:

   ```jsx
   // BEFORE
   import { FaHeart } from 'react-icons/fa';
   // AFTER
   import { FAIcon } from '@components/icons';

   // BEFORE
   <FaHeart className="icon" />
   // AFTER
   <FAIcon icon="FaHeart" className="icon" />
   ```

2. For new components, use the `Icon` component directly:

   ```jsx
   import Icon from '@components/icons';

   <Icon name="Heart" weight="fill" size="lg" />;
   ```

3. For complex components with many icons, consider using the mapping utilities:

   ```jsx
   import Icon from '@components/icons';
   import { getPhosphorName } from '@components/icons';

   const iconName = getPhosphorName('FaHeart'); // Returns 'Heart'
   <Icon name={iconName} weight="fill" />;
   ```

## Icon Styles

Common icon styles are defined in `Icon.scss` and include:

- `.icon`: Base icon style
- `.globe-icon`: Style for privacy icons
- `.banner-nav-item-name-icon`: Style for banner navigation icons

## Adding New Icons

When adding new icons:

1. Check if the icon exists in [Phosphor Icons](https://phosphoricons.com/)
2. If migrating from FontAwesome, add the mapping in `iconMappings.js`
3. Use the appropriate component based on your needs
