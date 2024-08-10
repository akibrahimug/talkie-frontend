// import { signupMockError } from '@mocks/handlers/auth';
// import { server } from '@mocks/server';
import Register from '@pages/register/Register';
import { render, screen, waitFor } from '@root/test.utils';
import { authService } from '@services/api/auth/auth.service';
import { Utils } from '@services/utils/utils.service';
import userEvent from '@testing-library/user-event';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate
}));

describe('Register', () => {
  it('signup form should have its labels', () => {
    render(<Register />);
    const usernameLabel = screen.getByLabelText('Username');

    const emailLabel = screen.getByLabelText('Email');
    const passwordLabel = screen.getByLabelText('Password');

    expect(usernameLabel).toBeInTheDocument();
    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
  });

  describe('Button', () => {
    it('should be disabled', () => {
      render(<Register />);
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();
    });
    it('should be enabled when input values are present', () => {
      render(<Register />);
      const buttonElement = screen.getByRole('button');
      const usernameLabel = screen.getByLabelText('Username');
      const emailLabel = screen.getByLabelText('Email');
      const passwordLabel = screen.getByLabelText('Password');

      userEvent.type(usernameLabel, 'test');
      userEvent.type(emailLabel, 'test@test.com');
      userEvent.type(passwordLabel, 'test');

      expect(buttonElement).toBeEnabled();
    });
    it('should change label text when clicked', async () => {
      jest.spyOn(Utils, 'generateAvatar').mockReturnValue('avatar image');
      jest.spyOn(authService, 'signup').mockReturnValue({});

      render(<Register />);
      const buttonElement = screen.getByRole('button');
      const usernameLabel = screen.getByLabelText('Username');
      const emailLabel = screen.getByLabelText('Email');
      const passwordLabel = screen.getByLabelText('Password');

      userEvent.type(usernameLabel, 'test');
      userEvent.type(emailLabel, 'test@test.com');
      userEvent.type(passwordLabel, 'test');

      userEvent.click(buttonElement);

      await waitFor(() => {
        const newButtonElement = screen.getByRole('button');
        expect(newButtonElement.textContent).toEqual('Please wait...');
      });
    });
  });
  describe('Success', () => {
    it('should navigate to the streams page', async () => {
      jest.spyOn(Utils, 'generateAvatar').mockReturnValue('avatar image');
      jest.spyOn(authService, 'signup').mockResolvedValue({});
      jest.spyOn(Utils, 'dispatchUser').mockImplementation((result, pageReload, dispatch, setUser) => {
        setUser(result);
      });
      render(<Register />);

      const buttonElement = screen.getByRole('button');
      const usernameLabel = screen.getByLabelText('Username');
      const emailLabel = screen.getByLabelText('Email');
      const passwordLabel = screen.getByLabelText('Password');

      userEvent.type(usernameLabel, 'Manny');
      userEvent.type(emailLabel, 'sanny@me.com');
      userEvent.type(passwordLabel, 'test');

      userEvent.click(buttonElement);

      await waitFor(() => expect(mockedUseNavigate).toHaveBeenCalledWith('/app/social/streams'));
    });
  });
  describe('Error', () => {
    it('should display error alert and border', async () => {
      // server.use(signupMockError);
      jest.spyOn(Utils, 'generateAvatar').mockReturnValue('avatar image');
      jest.spyOn(authService, 'signup').mockRejectedValue({
        response: {
          data: {
            message: 'Invalid credentials'
          }
        }
      });
      jest.spyOn(Utils, 'dispatchUser').mockImplementation((result, pageReload, dispatch, setUser) => {
        setUser(result);
      });
      render(<Register />);
      const buttonElement = screen.getByRole('button');
      const usernameElement = screen.getByLabelText('Username');
      const emailElement = screen.getByLabelText('Email');
      const passwordElement = screen.getByLabelText('Password');

      userEvent.type(usernameElement, 'manny');
      userEvent.type(emailElement, 'manny@test.com');
      userEvent.type(passwordElement, 'qwerty');
      userEvent.click(buttonElement);

      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert.textContent).toEqual('Invalid credentials');

      await waitFor(() => expect(usernameElement).toHaveStyle({ border: '1px solid #fa9b8a' }));
      await waitFor(() => expect(emailElement).toHaveStyle({ border: '1px solid #fa9b8a' }));
      await waitFor(() => expect(passwordElement).toHaveStyle({ border: '1px solid #fa9b8a' }));
    });
  });
});
