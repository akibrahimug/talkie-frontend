import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectDropdown from '@components/select-dropdown/selectDropdown';
import { FaGlobe } from 'react-icons/fa';

// Mock the useDispatch hook
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn()
}));

const privacyList = [
  { topText: 'Public', subText: 'Anyone on SocialApp', icon: <FaGlobe className="globe-icon globe" /> },
  { topText: 'Friends', subText: 'Your friends on SocialApp', icon: <FaGlobe className="globe-icon globe" /> },
  { topText: 'Private', subText: 'Only me', icon: <FaGlobe className="globe-icon globe" /> }
];

describe('SelectDropdown', () => {
  it('should have list items', () => {
    render(<SelectDropdown isActive={true} setSelectedItem={jest.fn()} items={privacyList} />);
    const listItems = screen.getAllByTestId('select-dropdown');
    const topText = screen.getByText(/public/i);
    const subText = screen.getByText(/anyone/i);
    const firstItem = listItems[0];
    const menuIconContainer = within(firstItem).getByText('', { selector: '.menu-icon' });
    expect(topText).toBeInTheDocument();
    expect(subText).toBeInTheDocument();
    expect(menuIconContainer).toBeInTheDocument();
    expect(listItems.length).toEqual(privacyList.length);
  });

  it('should handle click', () => {
    const onClick = jest.fn();
    render(<SelectDropdown isActive={true} setSelectedItem={onClick} items={privacyList} />);
    const listItem = screen.getAllByTestId('select-dropdown')[0];
    userEvent.click(listItem);
    expect(onClick).toHaveBeenCalledWith(privacyList[0]);
  });

  it('should display selected item', () => {
    render(
      <div data-testid="box-text-display">
        <div className="selected-privacy" data-testid="box-item-text">
          {`${privacyList[0].topText}`}
        </div>
      </div>
    );
    expect(screen.getByText(/public/i)).toBeInTheDocument();
  });
});
