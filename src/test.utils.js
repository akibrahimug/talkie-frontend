import { store } from '@redux/store';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import {
  BrowserRouter as Router,
  createRoutesFromElements,
  Route,
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Providers component for wrapping the app with redux and router.
 * @param {object} props - The component props
 * @param {React.ReactNode} props.children - The child components
 * @returns {React.ReactNode} - The wrapped components
 */
const Providers = ({ children }) => {
  // For tests, use the simple Router to avoid configuration complexities
  return (
    <Provider store={store}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</Router>
    </Provider>
  );
};
Providers.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Custom render function for rendering components with redux and router.
 * @param {React.ReactNode} ui - The component to render
 * @param {object} options - The render options
 * @returns {object} - The rendered component
 */
const customRender = (ui, options) => render(ui, { wrapper: Providers, ...options });

/**
 * Render with router function for rendering components with router.
 * @param {React.ReactNode} ui - The component to render
 * @returns {object} - The rendered component
 */
const renderWithRouter = (ui) => {
  const history = createBrowserHistory();
  return {
    history,
    ...render(ui, { wrapper: Providers })
  };
};

export * from '@testing-library/react';
export { customRender as render };
export { renderWithRouter };
