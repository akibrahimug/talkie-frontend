// import { forgotPasswordMockError } from '@mocks/handlers/auth';
// import { server } from '@mocks/server';
import ForgotPassword from '@pages/forgot-password/ForgotPassword';
import { render, screen, waitFor } from '@root/test.utils';
import userEvent from '@testing-library/user-event';
import { authService } from '@services/api/auth/auth.service';

describe('ForgotPassword', () => {
  it('form should have email label', () => {
    render(<ForgotPassword />);
    const emailLabel = screen.getByLabelText('Email');
    expect(emailLabel).toBeInTheDocument();
  });

  it('should have "Back to Login" text', () => {
    render(<ForgotPassword />);
    const spanElement = screen.getByText('Back to Login');
    expect(spanElement).toBeInTheDocument();
  });

  describe('Button', () => {
    it('button should be disabled', () => {
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();
    });

    it('should be enabled with input', () => {
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();

      const emailElement = screen.getByLabelText('Email');
      userEvent.type(emailElement, 'manny@test.com');
      expect(buttonElement).toBeEnabled();
    });

    it('should change label when clicked', async () => {
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      const emailElement = screen.getByLabelText('Email');
      userEvent.type(emailElement, 'manny@test.com');

      userEvent.click(buttonElement);

      const newButtonElement = screen.getByRole('button');
      expect(newButtonElement.textContent).toEqual('Please wait...');
      await waitFor(() => {
        const newButtonElement1 = screen.getByRole('button');
        expect(newButtonElement1.textContent).toEqual('FORGOT PASSWORD');
      });
    });
  });

  describe('Success', () => {
    it('should display success alert', async () => {
      jest.spyOn(authService, 'forgotPassword').mockResolvedValue({
        response: { data: { message: 'Password reset email sent.' } }
      });
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      const emailElement = screen.getByLabelText('Email');
      userEvent.type(emailElement, 'test@test.com');
      userEvent.click(buttonElement);
      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert-success');
      expect(alert.textContent).toEqual('Password reset email sent.');
    });
  });
  describe('Error', () => {
    it('should display error alert and border', async () => {
      jest.spyOn(authService, 'forgotPassword').mockRejectedValue({
        response: { data: { message: 'Invalid credentials' } }
      });
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      const emailElement = screen.getByLabelText('Email');
      userEvent.type(emailElement, 'manny');
      userEvent.click(buttonElement);

      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      await waitFor(() => expect(emailElement).toHaveStyle({ border: '1px solid #fa9b8a' }));
      expect(alert).toHaveClass('alert-error');
      expect(alert.textContent).toEqual('Invalid credentials');
    });
  });
});
