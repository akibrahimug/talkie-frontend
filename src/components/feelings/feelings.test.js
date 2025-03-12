import Feelings from '@components/feelings/feelings';
import ModalBoxContent from '@components/posts/post-modal/modal-box-content/ModalBoxContent';
import { render, screen } from '@root/test.utils';
import userEvent from '@testing-library/user-event';

describe('Feelings', () => {
  it('should have non-empty list', () => {
    render(<Feelings />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBeGreaterThan(0);
  });

  it('should handle click', () => {
    render(<Feelings />);
    render(<ModalBoxContent />);
    const listElement = screen.queryAllByTestId('feelings-item');
    userEvent.click(listElement[0]);
    const selectedFeelings = screen.getByRole('generic', { name: /inline display/i });
    const feelingImage = screen.getByRole('img', { name: /feeling icon/i });
    expect(selectedFeelings).toBeInTheDocument();
    expect(feelingImage).toBeInTheDocument();
    expect(feelingImage).toHaveAttribute('src', 'happy.jpg');
  });
});
