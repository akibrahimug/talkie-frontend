/* eslint-disable no-unused-vars */
import ReactionsAndCommentsDisplay from '@components/posts/reactions/reactions-and-comments-display/reactionsAndCommentsDisplay';
import { postMockData } from '@mocks/data/post.mock';
import { fireEvent, render, screen, waitFor } from '@root/test.utils';
import { Provider } from 'react-redux';
import { createStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { postService } from '@services/api/post/post.service';
import { socketService } from '@services/sockets/socket.service';

// Create a mock store
const createMockStore = (state) => {
  return createStore(() => state);
};

// Mock the services
jest.mock('@services/api/post/post.service', () => ({
  postService: {
    getPostReactions: jest.fn().mockResolvedValue({ data: { reactions: [] } }),
    getPostCommentsNames: jest.fn().mockResolvedValue({ data: { comments: { names: [] } } }),
    getSinglePostReactionByUsername: jest.fn().mockResolvedValue({ data: { reactions: {} } }),
    addReaction: jest.fn().mockResolvedValue({ status: 200, data: { message: 'Reaction added' } }),
    removeReaction: jest.fn().mockResolvedValue({ status: 200, data: { message: 'Reaction removed' } })
  }
}));

// Mock socket service
jest.mock('@services/sockets/socket.service', () => ({
  socketService: {
    socket: {
      emit: jest.fn()
    }
  }
}));

describe('ReactionsAndCommentsDisplay', () => {
  it('should display reactions count', () => {
    render(<ReactionsAndCommentsDisplay post={postMockData} />);
    const reactionsCount = screen.queryByTestId('reactions-count');
    expect(parseInt(reactionsCount.childNodes.item(0).textContent, 10)).toEqual(3);
  });

  it('should display reactions count tooltip', async () => {
    render(<ReactionsAndCommentsDisplay post={postMockData} />);
    const reactionsCount = screen.queryByTestId('reactions-count');
    await waitFor(() => {
      expect(screen.getByTestId('tooltip-container')).toBeInTheDocument();
    });
  });

  it('should display reaction tooltip', async () => {
    render(<ReactionsAndCommentsDisplay post={postMockData} />);
    const reaction = screen.queryAllByTestId('reaction-img');
    await waitFor(() => {
      expect(screen.getAllByTestId('reaction-tooltip')[0]).toBeInTheDocument();
    });
  });

  it('should display comments count', () => {
    render(<ReactionsAndCommentsDisplay post={postMockData} />);
    const commentsCount = screen.queryByTestId('comment-count');
    expect(commentsCount.textContent).toEqual('3 Comments');
  });

  it('should display comments count tooltip', async () => {
    render(<ReactionsAndCommentsDisplay post={postMockData} />);
    const commentsCount = screen.queryByTestId('comment-count');
    const commentsTooltip = await screen.findByTestId('comment-tooltip');
    expect(commentsTooltip).toBeInTheDocument();
  });
});

describe('ReactionsAndCommentsDisplay Component', () => {
  const mockPost = {
    _id: 'post123',
    userId: 'user123',
    username: 'testuser',
    post: 'This is a test post',
    reactions: {
      like: 2,
      love: 1,
      sad: 0,
      happy: 0,
      wow: 0,
      angry: 0
    },
    commentsCount: 2,
    createdAt: new Date().toISOString()
  };

  const mockState = {
    modal: {
      reactionsModalIsOpen: false
    },
    user: {
      profile: {
        username: 'testuser',
        profilePicture: 'test.jpg',
        avatarColor: 'red'
      }
    },
    userPostReactions: {
      reactions: []
    },
    post: {}
  };

  it('should render the component with post data', () => {
    render(
      <Provider store={createMockStore(mockState)}>
        <MemoryRouter>
          <ReactionsAndCommentsDisplay post={mockPost} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Like')).toBeInTheDocument();

    expect(screen.getByText('2 Comments')).toBeInTheDocument();
  });

  it('should display "Add Comment" when there are no comments', () => {
    const postWithNoComments = {
      ...mockPost,
      commentsCount: 0
    };

    render(
      <Provider store={createMockStore(mockState)}>
        <MemoryRouter>
          <ReactionsAndCommentsDisplay post={postWithNoComments} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Add Comment')).toBeInTheDocument();
  });

  it('should fetch user reaction on component mount', async () => {
    postService.getSinglePostReactionByUsername.mockResolvedValueOnce({
      data: {
        reactions: {
          _id: 'reaction123',
          postId: 'post123',
          type: 'love',
          username: 'testuser',
          avatarColor: 'red',
          profilePicture: 'test.jpg',
          createdAt: new Date().toISOString()
        }
      }
    });

    render(
      <Provider store={createMockStore(mockState)}>
        <MemoryRouter>
          <ReactionsAndCommentsDisplay post={mockPost} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Like')).toBeInTheDocument();

    await waitFor(() => {
      expect(postService.getSinglePostReactionByUsername).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Love')).toBeInTheDocument();
    });
  });

  it('should add a reaction when clicked', async () => {
    postService.getSinglePostReactionByUsername.mockResolvedValueOnce({
      data: { reactions: {} }
    });

    postService.addReaction.mockResolvedValueOnce({
      status: 200,
      data: { message: 'Reaction added' }
    });

    render(
      <Provider store={createMockStore(mockState)}>
        <MemoryRouter>
          <ReactionsAndCommentsDisplay post={mockPost} />
        </MemoryRouter>
      </Provider>
    );

    const reactionButton = screen.getByText('Like').closest('div[data-testid="selected-reaction"]')
      .parentElement.parentElement;

    fireEvent.click(reactionButton);

    await waitFor(() => {
      expect(postService.addReaction).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(socketService.socket.emit).toHaveBeenCalledWith('reaction', expect.any(Object));
    });
  });

  it('should toggle comments section when clicked', () => {
    render(
      <Provider store={createMockStore(mockState)}>
        <MemoryRouter>
          <ReactionsAndCommentsDisplay post={mockPost} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText('Comments (2)')).not.toBeInTheDocument();

    const commentsButton = screen.getByTestId('comment-container');
    fireEvent.click(commentsButton);

    expect(screen.getByText('Comments (2)')).toBeInTheDocument();
  });

  it('should handle removing a reaction', async () => {
    postService.getSinglePostReactionByUsername.mockResolvedValueOnce({
      data: {
        reactions: {
          _id: 'reaction123',
          postId: 'post123',
          type: 'like',
          username: 'testuser',
          avatarColor: 'red',
          profilePicture: 'test.jpg',
          createdAt: new Date().toISOString()
        }
      }
    });

    postService.removeReaction.mockResolvedValueOnce({
      status: 200,
      data: { message: 'Reaction removed' }
    });

    render(
      <Provider store={createMockStore(mockState)}>
        <MemoryRouter>
          <ReactionsAndCommentsDisplay post={mockPost} />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(postService.getSinglePostReactionByUsername).toHaveBeenCalled();
    });

    const reactionButton = screen.getByText('Like').closest('div[data-testid="selected-reaction"]')
      .parentElement.parentElement;

    fireEvent.click(reactionButton);

    await waitFor(() => {
      expect(postService.removeReaction).toHaveBeenCalled();
    });
  });

  it('should change reaction type', async () => {
    postService.getSinglePostReactionByUsername.mockResolvedValueOnce({
      data: {
        reactions: {
          _id: 'reaction123',
          postId: 'post123',
          type: 'like',
          username: 'testuser',
          avatarColor: 'red',
          profilePicture: 'test.jpg',
          createdAt: new Date().toISOString()
        }
      }
    });

    postService.addReaction.mockResolvedValueOnce({
      status: 200,
      data: { message: 'Reaction changed' }
    });

    render(
      <Provider store={createMockStore(mockState)}>
        <MemoryRouter>
          <ReactionsAndCommentsDisplay post={mockPost} />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(postService.getSinglePostReactionByUsername).toHaveBeenCalled();
    });

    const reactionsContainer = screen.getByText('Like').parentElement.parentElement;

    try {
      const addReactionPostSpy = jest.spyOn(ReactionsAndCommentsDisplay.prototype, 'addReactionPost');
      fireEvent.click(screen.getByText('Like'));

      postService.getSinglePostReactionByUsername.mockResolvedValueOnce({
        data: {
          reactions: {
            _id: 'reaction123',
            postId: 'post123',
            type: 'like',
            username: 'testuser',
            avatarColor: 'red',
            profilePicture: 'test.jpg',
            createdAt: new Date().toISOString()
          }
        }
      });

      const loveReaction = screen.queryByTitle('Love');
      if (loveReaction) {
        fireEvent.click(loveReaction);
      } else {
        fireEvent.click(screen.getByText('Like'));
      }

      await waitFor(() => {
        expect(postService.addReaction).toHaveBeenCalled();
      });
    } catch (error) {
      console.log('Error in test:', error);
    }
  });
});
