/* eslint-disable testing-library/no-node-access */
/* eslint-disable no-unused-vars */
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostForm from '@components/posts/post-form/postForm';
import { ImageUtils } from '@services/utils/image.utils.service';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import { openModal, toggleImageModal } from '@redux/reducers/modal/modal.reducer';

// Mock the redux dispatch
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn().mockImplementation((action) => action)
}));

// Mock the ImageUtils.checkFile method
jest.mock('@services/utils/image.utils.service', () => ({
  ImageUtils: {
    checkFile: jest.fn(),
    addFileToRedux: jest.fn()
  }
}));

describe('PostForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the post form component correctly', () => {
    render(
      <Provider store={store}>
        <PostForm />
      </Provider>
    );

    expect(screen.getByTestId('post-form')).toBeInTheDocument();
    expect(screen.getByText('Create Post')).toBeInTheDocument();
  });

  test('clicking on photo button opens the file input', () => {
    const dispatchMock = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(dispatchMock);

    render(
      <Provider store={store}>
        <PostForm />
      </Provider>
    );

    // Find and click the photo button
    const photoItems = screen.getAllByText('Photo');
    fireEvent.click(photoItems[0]);

    // Verify dispatch was called with the correct actions
    expect(dispatchMock).toHaveBeenCalledWith(openModal({ type: 'add' }));
    // The second call will be toggleImageModal but not a function directly
    expect(dispatchMock).toHaveBeenCalledTimes(2);
  });

  test('handleFileChange processes selected image correctly', () => {
    const dispatchMock = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(dispatchMock);

    render(
      <Provider store={store}>
        <PostForm />
      </Provider>
    );

    // Create a mock file
    const file = new File(['(⌐□_□)'], 'test-image.png', { type: 'image/png' });

    // Use old-school DOM APIs for getting the file input
    // This is a pragmatic approach since Testing Library doesn't handle file inputs well
    const fileInput = document.querySelector('input[type="file"][name="image"]');

    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Verify ImageUtils.checkFile was called with the file and correct type
    expect(ImageUtils.checkFile).toHaveBeenCalledWith(file, 'image');

    // Verify dispatch was called to open modal
    expect(dispatchMock).toHaveBeenCalledWith(openModal({ type: 'add' }));
  });

  test('handles case when no file is selected', () => {
    const dispatchMock = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(dispatchMock);

    render(
      <Provider store={store}>
        <PostForm />
      </Provider>
    );

    // Use old-school DOM APIs for getting the file input
    const fileInput = document.querySelector('input[type="file"][name="image"]');

    // Simulate empty file selection
    fireEvent.change(fileInput, { target: { files: [] } });

    // Check that neither the ImageUtils.checkFile nor the dispatch was called
    expect(ImageUtils.checkFile).not.toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  test('clicking on video button opens the video file input', () => {
    const dispatchMock = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(dispatchMock);

    render(
      <Provider store={store}>
        <PostForm />
      </Provider>
    );

    // Find list items and get the last one (which should be the video button)
    const videoElement = screen.getByTestId('list-item').querySelectorAll('li')[3];
    fireEvent.click(videoElement);

    // Verify dispatch was called with correct actions
    expect(dispatchMock).toHaveBeenCalledWith(openModal({ type: 'add' }));
  });

  test('handleVideoFileChange processes selected video correctly', () => {
    const dispatchMock = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(dispatchMock);

    render(
      <Provider store={store}>
        <PostForm />
      </Provider>
    );

    // Create a mock video file
    const videoFile = new File(['(⌐□_□)'], 'test-video.mp4', { type: 'video/mp4' });

    // Use old-school DOM APIs for getting the video input
    const videoInput = document.querySelector('input[type="file"][name="video"]');

    // Simulate video file selection
    fireEvent.change(videoInput, { target: { files: [videoFile] } });

    // Verify ImageUtils.checkFile was called with the file and correct type
    expect(ImageUtils.checkFile).toHaveBeenCalledWith(videoFile, 'video');

    // Verify dispatch was called to open modal
    expect(dispatchMock).toHaveBeenCalledWith(openModal({ type: 'add' }));
  });
});
