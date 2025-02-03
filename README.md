# Portfolio Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.6.4-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0.24-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Storybook](https://img.shields.io/badge/Storybook-8.0.10-FF4785?style=for-the-badge&logo=storybook)](https://storybook.js.org/)
[![ESLint](https://img.shields.io/badge/ESLint-8.14.0-4B32C3?style=for-the-badge&logo=eslint)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-2.6.2-F7B93E?style=for-the-badge&logo=prettier)](https://prettier.io/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-6.5.1-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

## 📝 Description

This is a modern, responsive portfolio frontend application built with Next.js and React. It showcases professional work, skills, and experiences in an elegant and interactive way.

## ✨ Features

- 🎨 Modern and responsive design
- ⚡ Server-side rendering with Next.js
- 🎭 Smooth animations with Framer Motion
- 📱 Mobile-first approach
- 🎯 TypeScript for type safety
- 📚 Component documentation with Storybook
- 🔒 Authentication support with NextAuth.js
- 🎨 Styling with TailwindCSS
- 📅 Date handling with date-fns and dayjs
- 🔄 Data fetching with SWR
- 🎨 Material UI components integration

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- Yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/akibrahimug/portfolio-frontend.git
```

2. Install dependencies:

```bash
yarn install
```

3. Run the development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Available Scripts

- `yarn dev` - Run development server
- `yarn build` - Build production bundle
- `yarn start` - Start production server
- `yarn test` - Run tests
- `yarn format` - Format code with Prettier
- `yarn storybook` - Run Storybook development server
- `yarn build-storybook` - Build Storybook for production
- `yarn commit` - Commit changes using Commitizen

## 🏗️ Project Structure

```
portfolio-frontend/
├── .github/          # GitHub workflows and configurations
├── .husky/           # Git hooks
├── .storybook/       # Storybook configuration
├── components/       # React components
├── pages/           # Next.js pages
├── public/          # Static assets
├── styles/          # Global styles
├── stories/         # Storybook stories
└── types/           # TypeScript type definitions
```

## 🔧 Technologies

- **Framework:** Next.js, React
- **Language:** TypeScript
- **Styling:** TailwindCSS, Emotion, Material-UI
- **State Management:** SWR
- **Animation:** Framer Motion
- **Documentation:** Storybook
- **Code Quality:** ESLint, Prettier
- **Git Hooks:** Husky
- **Commit Standard:** Commitizen, Commitlint
- **CI/CD:** GitHub Actions
- **Authentication:** NextAuth.js

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXTAUTH_URL=your_auth_url
NEXTAUTH_SECRET=your_secret
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using `yarn commit`
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License.

## 👤 Author

Kasoma Ibrahim

- GitHub: [@akibrahimug](https://github.com/akibrahimug)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- All contributors and maintainers

---

⭐️ If you found this project helpful, please give it a star!
