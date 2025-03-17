/* eslint-disable no-unused-vars */
import Post from '@components/posts/post/post';
import { postMockData } from '@mocks/data/post.mock';
import { render, screen } from '@root/test.utils';
import { Utils } from '@services/utils/utils.service';

jest.mock('@services/utils/utils.service');

describe('Post Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render post component', () => {
    const props = {
      post: postMockData,
      showIcons: true
    };
    render(<Post {...props} />);
    const postElement = screen.getByTestId('post');
    expect(postElement).toBeInTheDocument();
  });
});
