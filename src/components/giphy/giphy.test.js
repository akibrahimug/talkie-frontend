import Giphy from '@components/giphy/giphy';
import { fireEvent, render, screen } from '@root/test.utils';
import { GiphyUtils } from '@services/utils/giphy.utils.service';

// Create a mock URL for testing
// const url =
//   'https://media1.giphy.com/media/qg5pk8s2h5kJy/giphy.gif?cid=b6f691b6xs6w6z065eld5ihx7moh2xlo0fyofdhij5zp9xn4&rid=giphy.gif&ct=g';

// Mock the GiphyUtils service
jest.mock('@services/utils/giphy.utils.service', () => ({
  GiphyUtils: {
    getTrendingGifs: jest.fn(),
    searchGifs: jest.fn()
  }
}));

describe('Giphy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getTrendingGifs when mounted', () => {
    render(<Giphy />);
    expect(GiphyUtils.getTrendingGifs).toHaveBeenCalled();
  });

  it('should call searchGifs when input changes', () => {
    render(<Giphy />);

    // Get the search input
    const inputElement = screen.getByPlaceholderText('Search Gif');

    // Simulate search input change
    fireEvent.change(inputElement, { target: { value: 'dog' } });

    // Check if the service was called with correct parameters
    expect(GiphyUtils.searchGifs).toHaveBeenCalledWith('dog', expect.any(Function), expect.any(Function));
  });

  it('should handle empty search results', () => {
    render(<Giphy />);

    // Get the search input
    const inputElement = screen.getByPlaceholderText('Search Gif');

    // Simulate search with a value
    fireEvent.change(inputElement, { target: { value: '.....' } });

    // Check if the service was called with correct parameters
    expect(GiphyUtils.searchGifs).toHaveBeenCalledWith('.....', expect.any(Function), expect.any(Function));
  });
});
