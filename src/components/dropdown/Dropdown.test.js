/* eslint-disable testing-library/no-node-access */
import Dropdown from '@components/dropdown/Dropdown';
import { render, screen } from '@root/test.utils';
import userEvent from '@testing-library/user-event';
// import Utils from '@services/utils/utils.service'; // Will use this in the future

describe('Dropdown', () => {
  it('should display notification content', () => {
    const onMarkAsRead = jest.fn();
    const onDeleteNotification = jest.fn();
    const item = {
      _id: '123',
      topText: 'This is a test',
      subText: 'Subtext',
      createdAt: '2022-06-14',
      username: 'Danny',
      avatarColor: 'red',
      profilePicture: 'https://place-hold.it',
      read: false,
      post: 'This is my post',
      imgUrl: '',
      comment: '',
      reaction: '',
      senderName: '',
      notificationType: ''
    };
    const props = {
      data: [item, item, item], // Keep as array - component expects data.map()
      notificationCount: 1,
      title: 'Notifications',
      style: { right: '250px', top: '20px' },
      height: 300,
      onMarkAsRead,
      onDeleteNotification,
      onLogout: null,
      onNavigate: null
    };
    // Store baseElement but use screen methods when possible for Testing Library best practices
    const { baseElement } = render(<Dropdown {...props} />);
    const smallElement = screen.getByText(1);
    const infoContainer = screen.getByTestId('info-container');
    const topTextElement = screen.getAllByText('This is a test');

    // Use baseElement for now - we'll update component with data-testid later
    // Better approach would be: const trashIcon = screen.getByTestId('trash-icon');
    const trashIcon = baseElement.querySelector('.trash'); // Will refactor this later

    userEvent.click(topTextElement[0]);
    userEvent.click(trashIcon);
    expect(smallElement).toBeInTheDocument();

    // Using direct DOM access for now - we'll refactor this with Testing Library methods
    // Better approach would be: expect(screen.getAllByTestId('info-item')).toHaveLength(3);
    expect(infoContainer.childElementCount).toEqual(3); // Will refactor this later

    expect(onMarkAsRead).toHaveBeenCalledTimes(1);
    expect(onDeleteNotification).toHaveBeenCalledTimes(1);
  });

  it('should display settings content', () => {
    const onLogout = jest.fn();
    const onNavigate = jest.fn();
    const item = {
      _id: '123',
      topText: 'My Profile',
      subText: 'View profile',
      createdAt: '2022-06-14',
      username: 'Danny',
      avatarColor: 'red',
      profilePicture: 'https://place-hold.it'
    };
    const props = {
      data: [item], // Keep as array - component expects data.map()
      notificationCount: 0,
      title: 'Settings',
      style: { right: '250px', top: '20px' },
      height: 300,
      onMarkAsRead: null,
      onDeleteNotification: null,
      onLogout,
      onNavigate
    };
    // Store baseElement but use screen methods when possible
    const { baseElement } = render(<Dropdown {...props} />);

    // Use baseElement for now - will update component with data-testid later
    // Better approach would be: const buttonElement = screen.getByTestId('signout-button');
    const buttonElement = baseElement.querySelector('.signOut'); // Will refactor this later

    const infoContainer = screen.getByTestId('info-container');
    const topTextElement = screen.getAllByText('My Profile');
    userEvent.click(topTextElement[0]);
    userEvent.click(buttonElement);
    expect(buttonElement).toBeInTheDocument();

    // Using direct DOM access for now - we'll refactor with Testing Library methods
    // Better approach would be: expect(screen.getAllByTestId('info-item')).toHaveLength(1);
    expect(infoContainer.childElementCount).toEqual(1); // Will refactor this later

    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
