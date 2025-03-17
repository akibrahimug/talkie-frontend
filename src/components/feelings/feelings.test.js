import Feelings from '@components/feelings/feelings';
import ModalBoxContent from '@components/posts/post-modal/modal-box-content/modal-box-content';
import { render, screen, within } from '@root/test.utils';
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
    const selectedFeelings = screen.getByTestId('box-feeling');
    const feelingImage = within(selectedFeelings).getByAltText('');
    expect(selectedFeelings).toBeInTheDocument();
    expect(feelingImage).toBeInTheDocument();
    expect(feelingImage).toHaveAttribute('src', 'happy.jpg');
  });
});
