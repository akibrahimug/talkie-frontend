# Talkie - A Social Media Web Application

![Talkie Logo](https://via.placeholder.com/1200x300/5F7FFF/FFFFFF?text=Talkie+Social+Media)

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Code Quality](#code-quality)
  - [Linting and Formatting](#linting-and-formatting)
  - [Testing](#testing)
  - [Git Hooks](#git-hooks)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Talkie is a modern social media web application that enables users to connect, share, and communicate with friends and followers. With features like real-time messaging, post sharing, and profile management, Talkie provides a comprehensive social networking experience.

## ✨ Features

- **User Authentication**

  - Sign up, login, and password recovery
  - Secure authentication flow

- **Social Feed**

  - View, create, and interact with posts
  - Like, comment, and share content
  - Rich text and media support
  - Emoji and GIF integration

- **Real-time Chat**

  - Private messaging between users
  - Message notifications
  - Emoji support in chats

- **Profile Management**

  - Customizable user profiles
  - Profile pictures and cover photos
  - Bio and personal information

- **Social Connections**

  - Follow/unfollow users
  - View followers and following lists
  - Discover new people to connect with

- **Notifications**

  - Real-time notification system
  - Activity updates from connections

- **Photo Galleries**

  - Upload and share photos
  - Organize and browse image collections

- **Responsive Design**
  - Optimized for desktop and mobile devices
  - Consistent experience across screen sizes

## 📸 Screenshots

### Home Page / News Feed

![Home Page](https://via.placeholder.com/800x500/DDDDDD/888888?text=Home+Page+Screenshot)

<!-- Replace with actual screenshot of your app's homepage -->

### User Profile

![Profile Page](https://via.placeholder.com/800x500/DDDDDD/888888?text=Profile+Page+Screenshot)

<!-- Replace with actual screenshot of the profile page -->

### Chat Interface

![Chat Interface](https://via.placeholder.com/800x500/DDDDDD/888888?text=Chat+Interface+Screenshot)

<!-- Replace with actual screenshot of the messaging feature -->

### Photo Gallery

![Photo Gallery](https://via.placeholder.com/800x500/DDDDDD/888888?text=Photo+Gallery+Screenshot)

<!-- Replace with actual screenshot of the photo gallery -->

### Notifications

![Notifications](https://via.placeholder.com/800x500/DDDDDD/888888?text=Notifications+Screenshot)

<!-- Replace with actual screenshot of the notifications panel -->

## 💻 Technology Stack

### Frontend

- **React.js** - JavaScript library for building user interfaces
- **Redux Toolkit** - State management with Redux Toolkit
- **React Router** - Navigation and routing
- **Sass** - CSS preprocessor for styling
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API requests
- **React Loading Skeleton** - Loading state UI
- **Emoji Picker React** - Emoji selection component
- **React Icons** - Icon library
- **Date-fns** - JavaScript date utility library
- **Millify** - Formatting large numbers
- **Lodash** - Utility library

### Development Tools

- **Jest** - Testing framework
- **React Testing Library** - Testing React components
- **MSW** - Mock Service Worker for API mocking
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit message linting
- **Lint-staged** - Run linters on git staged files

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/talkie-frontend.git
cd talkie-frontend
```

2. Install dependencies:

```bash
yarn install
# or
npm install
```

3. Start the development server:

```bash
yarn dev
# or
npm run dev
```

The application will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

Adjust the URLs according to your backend setup.

### Available Scripts

- `yarn dev` - Start the development server
- `yarn build` - Build the application for production
- `yarn test` - Run tests
- `yarn lint:check` - Check for linting issues
- `yarn lint:fix` - Fix linting issues
- `yarn prettier:check` - Check code formatting
- `yarn prettier:fix` - Fix code formatting

## 📁 Project Structure

```
talkie-frontend/
├── public/             # Public assets and HTML template
├── src/                # Source code
│   ├── assets/         # Static assets (images, fonts)
│   ├── colors/         # Color definitions
│   ├── components/     # Reusable UI components
│   │   ├── avatar/
│   │   ├── button/
│   │   ├── dialog/
│   │   ├── dropdown/
│   │   ├── feelings/
│   │   ├── giphy/
│   │   ├── header/
│   │   ├── input/
│   │   ├── message-sidebar/
│   │   ├── posts/
│   │   ├── select-dropdown/
│   │   ├── sidebar/
│   │   ├── spinner/
│   │   ├── suggestions/
│   │   └── toast/
│   ├── hooks/          # Custom React hooks
│   ├── mocks/          # API mocks for testing
│   ├── pages/          # Application pages
│   │   ├── auth/       # Authentication pages
│   │   ├── error/      # Error pages
│   │   └── social/     # Social features pages
│   │       ├── chat/
│   │       ├── followers/
│   │       ├── following/
│   │       ├── notifications/
│   │       ├── people/
│   │       ├── photos/
│   │       ├── profile/
│   │       └── streams/
│   ├── redux-toolkit/  # Redux state management
│   │   ├── api/        # API endpoints
│   │   └── reducers/   # Redux reducers
│   ├── services/       # API services
│   ├── App.js          # Main app component
│   ├── App.scss        # Main app styles
│   ├── index.js        # Entry point
│   ├── index.scss      # Global styles
│   ├── routes.js       # Application routes
│   └── setupTests.js   # Test configuration
├── .eslintignore       # ESLint ignore patterns
├── .eslintrc           # ESLint configuration
├── .gitignore          # Git ignore patterns
├── .prettierignore     # Prettier ignore patterns
├── .prettierrc.json    # Prettier configuration
├── config-overrides.js # React app config overrides
├── jsconfig.json       # JavaScript configuration
├── package.json        # Package dependencies
└── README.md           # Project documentation
```

## 🔧 Code Quality

### Linting and Formatting

This project uses ESLint and Prettier for code quality and formatting:

- ESLint enforces code quality rules
- Prettier ensures consistent code formatting
- Configuration files are in the project root

Run linting checks:

```bash
yarn lint:check
```

Fix linting issues:

```bash
yarn lint:fix
```

Check code formatting:

```bash
yarn prettier:check
```

Fix code formatting:

```bash
yarn prettier:fix
```

### Testing

The project uses Jest and React Testing Library for testing:

- Unit tests for components and functionality
- Integration tests for user flows
- Test mocks for API calls using MSW

Run tests:

```bash
yarn test
```

Run tests for changed files only:

```bash
yarn test:changed
```

### Git Hooks

Husky is used to enforce code quality on git operations:

- **Pre-commit Hook**: Runs linting, formatting, and tests on staged files
- **Commit Message Hook**: Ensures commit messages follow conventional commit format

## 📦 Deployment

To build the application for production:

```bash
yarn build
```

This will create a `build` directory with optimized production-ready files.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes all tests and linting checks before submitting a PR.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by [KASOMA IBRAHIM](https://github.com/akibrahimug)
