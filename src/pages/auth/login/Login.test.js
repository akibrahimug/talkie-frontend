import Login from '@pages/auth/login/Login';
import { render, screen, waitFor } from '@root/test.utils';
import { authService } from '@services/api/auth/auth.service';
import userEvent from '@testing-library/user-event';
import { existingUser, userJwt } from '@mocks/data/user.mock';
import { Utils } from '@services/utils/utils.service';
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate
}));

describe('Login', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('login form should have its labels', () => {
    render(<Login />);
    const usernameLabel = screen.getByLabelText('Username');
    const passwordLabel = screen.getByLabelText('Password');

    expect(usernameLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
  });

  describe('Button', () => {
    it('should be disabled', () => {
      render(<Login />);
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();
    });

    it('should be enabled when input values are present', () => {
      render(<Login />);
      const buttonElement = screen.getByRole('button');
      const usernameLabel = screen.getByLabelText('Username');
      const passwordLabel = screen.getByLabelText('Password');

      userEvent.type(usernameLabel, 'Manny');
      userEvent.type(passwordLabel, 'test');

      expect(buttonElement).toBeEnabled();
    });

    it('should change label text when clicked', async () => {
      jest.spyOn(authService, 'signin').mockResolvedValue({});
      render(<Login />);
      const buttonElement = screen.getByRole('button');
      const usernameLabel = screen.getByLabelText('Username');
      const passwordLabel = screen.getByLabelText('Password');

      userEvent.type(usernameLabel, 'Manny');
      userEvent.type(passwordLabel, 'test');

      userEvent.click(buttonElement);

      const newButtonElement = await screen.findByRole('button', { name: /SIGNIN IN PROGRESS.../ });
      expect(newButtonElement).toBeInTheDocument();
    });
  });

  it('checkbox should be unchecked', async () => {
    render(<Login />);
    const checkbox = screen.getByLabelText(/Keep me signed in/);
    expect(checkbox).not.toBeChecked();
  });

  it('checkbox should be checked', async () => {
    render(<Login />);
    const checkbox = screen.getByLabelText(/Keep me signed in/);
    expect(checkbox).not.toBeChecked();
    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});

describe('Success', () => {
  it('should navigate to the streams page', async () => {
    jest.spyOn(authService, 'signin').mockReturnValue({
      response: {
        data: { message: 'User login successfully', user: existingUser, token: userJwt }
      }
    });
    jest.spyOn(Utils, 'dispatchUser').mockImplementation((result, pageReload, dispatch, setUser) => {
      setUser(result);
    });
    render(<Login />);

    const buttonElement = screen.getByRole('button');
    const usernameLabel = screen.getByLabelText('Username');
    const passwordLabel = screen.getByLabelText('Password');

    userEvent.type(usernameLabel, 'Manny');
    userEvent.type(passwordLabel, 'test');

    userEvent.click(buttonElement);

    await waitFor(() => expect(mockedUseNavigate).toHaveBeenCalledWith('/app/social/streams'));
  });
});

describe('Error', () => {
  it('should display error alert and border', async () => {
    jest.spyOn(authService, 'signin').mockRejectedValue({
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    });

    render(<Login />);
    const buttonElement = screen.getByRole('button');
    const usernameElement = screen.getByLabelText('Username');
    const passwordElement = screen.getByLabelText('Password');

    userEvent.type(usernameElement, 'manny');
    userEvent.type(passwordElement, 'qwerty');
    userEvent.click(buttonElement);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert.textContent).toEqual('Invalid credentials');

    await waitFor(() => expect(usernameElement).toHaveStyle({ border: '1px solid #fa9b8a' }));
    await waitFor(() => expect(passwordElement).toHaveStyle({ border: '1px solid #fa9b8a' }));
  });
});
