import { createSearchParams } from 'react-router-dom';

/**
 * ProfileUtils class for handling profile operations.
 */
export class ProfileUtils {
  /**
   * Navigate to profile.
   * @param {object} data - The profile data
   * @param {function} navigate - The navigate function
   */
  static navigateToProfile(data, navigate) {
    const url = `/app/social/profile/${data?.username}?${createSearchParams({ id: data?._id, uId: data?.uId })}`;
    navigate(url);
  }
}
