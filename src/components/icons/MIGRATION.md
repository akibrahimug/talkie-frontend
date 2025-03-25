# Icon Migration Guide

## Project: Talkie Social Media App

## Task: Replace FontAwesome icons with Phosphor Icons

This document provides a step-by-step guide for migrating all icons in the application from FontAwesome (via react-icons) to Phosphor Icons.

## Background

We've created a centralized icon system using [Phosphor Icons](https://phosphoricons.com/) that improves consistency and makes it easier to maintain our icon usage across the application.

## Components Created

1. `Icon.js` - The main component for rendering Phosphor Icons
2. `FAIcon.js` - A drop-in replacement for FontAwesome icons
3. `iconMappings.js` - Maps FontAwesome icon names to Phosphor equivalents
4. `migrate-icons.js` - A utility script to help identify files that need to be updated

## Migration Process

### 1. Install Dependencies

We've already added the Phosphor Icons package to the project:

```bash
yarn add @phosphor-icons/react
```

### 2. Update Files

For each file using FontAwesome icons, make the following changes:

#### Step 1: Replace Imports

Replace:

```jsx
import { FaHeart, FaUser } from 'react-icons/fa';
```

With:

```jsx
import { FAIcon } from '@components/icons';
```

#### Step 2: Replace Icons

Replace:

```jsx
<FaHeart className="icon" />
```

With:

```jsx
<FAIcon icon="FaHeart" className="icon" />
```

### 3. Using the Migration Helper Script

You can use the included script to identify files that need to be updated:

```bash
yarn node ./src/components/icons/migrate-icons.js
```

The script will scan the codebase and list files that need to be updated.

### 4. Testing

After updating each file, make sure to:

1. Check that the icons render correctly
2. Verify icon colors match the design requirements
3. Test any interactive functionality like click handlers

### 5. New Icons

For new icons, use the `Icon` component directly:

```jsx
import Icon from '@components/icons';

// Then in your component
<Icon name="Heart" weight="fill" size="lg" color="#ff0000" />;
```

## Icon Style Reference

Common icon styles in our app:

- `.icon` - Standard sidebar icon
- `.header-list-icon` - Header icons
- `.globe-icon` - Privacy setting icons
- `pencil` and `trash` - Post editing icons

## Completion Checklist

Use this checklist to track progress:

- [x] Create icon components
- [x] Update static.data.js
- [x] Update header.js
- [x] Update post.js
- [ ] Update sidebar components
- [ ] Update notification components
- [ ] Update post form components
- [ ] Update modal components
- [ ] Update comment components
- [ ] Update all remaining components
- [ ] Final testing

## Benefits

This migration improves the application by:

1. Using a more modern, consistent icon library
2. Centralizing icon management
3. Making future icon updates easier
4. Improving performance through better icon delivery
5. Adding support for different icon weights and styles

## Questions?

Refer to the `README.md` file in the `/components/icons` directory for more details on using the icon system.
