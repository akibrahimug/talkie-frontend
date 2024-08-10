import reducer, { addUser, clearUser, updateUserProfile } from '@redux/reducers/user/user.reducer';

const initialState = {
  profile: null,
  token: ''
};

describe('user reducer', () => {
  beforeEach(() => {
    initialState.token = '';
    initialState.profile = null;
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({ profile: null, token: '' });
  });

  it('should add user with token and profile', () => {
    expect(reducer(initialState, addUser({ token: '12343', profile: { username: 'test' } }))).toEqual({
      profile: { username: 'test' },
      token: '12343'
    });
  });

  it('should update user profile', () => {
    initialState.token = '12345';
    initialState.profile = { username: 'Test' };
    expect(reducer(initialState, updateUserProfile({ username: 'Test2' }))).toEqual({
      token: '12345',
      profile: { username: 'Test2' }
    });
  });

  it('should reset profile and token', () => {
    initialState.token = '12345';
    initialState.profile = { username: 'Test' };
    expect(reducer(initialState, clearUser())).toEqual({
      profile: null,
      token: ''
    });
  });
});
