import reducer, {
  addPostFeeling,
  closeModal,
  openModal,
  toggleCommentsModal,
  toggleDeleteDialog,
  toggleFeelingModal,
  toggleGifModal,
  toggleImageModal,
  toggleReactionsModal,
  toggleVideoModal
} from '@redux/reducers/modal/modal.reducer';

describe('modal reducer', () => {
  let initialState;
  let modalData;

  beforeEach(() => {
    initialState = {
      type: '',
      isOpen: false,
      feeling: '',
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: false,
      openVideoDialog: false,
      gifModalIsOpen: false,
      reactionsModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false
    };

    modalData = {
      type: 'add',
      isOpen: true,
      feeling: '',
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: false,
      openVideoDialog: false,
      gifModalIsOpen: false,
      reactionsModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false
    };
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should open modal', () => {
    expect(reducer(initialState, openModal({ type: 'add', data: 'test data' }))).toEqual({
      type: 'add',
      isOpen: true,
      feeling: '',
      image: '',
      data: 'test data',
      feelingsIsOpen: false,
      openFileDialog: false,
      openVideoDialog: false,
      gifModalIsOpen: false,
      reactionsModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false
    });
  });

  it('should close modal', () => {
    expect(reducer(modalData, closeModal())).toEqual({
      type: '',
      isOpen: false,
      feeling: '',
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: false,
      openVideoDialog: false,
      gifModalIsOpen: false,
      reactionsModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false
    });
  });

  it('should add post feeling', () => {
    expect(reducer(modalData, addPostFeeling({ feeling: 'happy' }))).toEqual({
      type: 'add',
      isOpen: true,
      feeling: 'happy',
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: false,
      openVideoDialog: false,
      gifModalIsOpen: false,
      reactionsModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false
    });
  });

  it('should toggle gif modal', () => {
    expect(reducer(modalData, toggleGifModal(true))).toEqual({
      type: 'add',
      isOpen: true,
      feeling: '',
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: false,
      openVideoDialog: false,
      gifModalIsOpen: true,
      reactionsModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false
    });
  });

  it('should toggle reactions modal', () => {
    expect(reducer(modalData, toggleReactionsModal(true))).toEqual({
      type: 'add',
      isOpen: true,
      feeling: '',
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: false,
      openVideoDialog: false,
      gifModalIsOpen: false,
      reactionsModalIsOpen: true,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false
    });
  });

  it('should toggle comments modal', () => {
    expect(reducer(modalData, toggleCommentsModal(true))).toEqual({
      type: 'add',
      isOpen: true,
      feeling: '',
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: false,
      openVideoDialog: false,
      gifModalIsOpen: false,
      reactionsModalIsOpen: false,
      commentsModalIsOpen: true,
      deleteDialogIsOpen: false
    });
  });

  it('should toggle feelings modal', () => {
    expect(reducer(modalData, toggleFeelingModal(true))).toEqual({
      type: 'add',
      isOpen: true,
      feeling: '',
      image: '',
      data: null,
      feelingsIsOpen: true,
      openFileDialog: false,
      openVideoDialog: false,
      gifModalIsOpen: false,
      reactionsModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false
    });
  });

  it('should toggle image modal', () => {
    expect(reducer(modalData, toggleImageModal(true))).toEqual({
      type: 'add',
      isOpen: true,
      feeling: '',
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: true,
      openVideoDialog: false,
      gifModalIsOpen: false,
      reactionsModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false
    });
  });

  it('should toggle video modal', () => {
    expect(reducer(modalData, toggleVideoModal(true))).toEqual({
      type: 'add',
      isOpen: true,
      feeling: '',
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: false,
      openVideoDialog: true,
      gifModalIsOpen: false,
      reactionsModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false
    });
  });

  it('should toggle delete dialog', () => {
    expect(reducer(modalData, toggleDeleteDialog({ toggle: true, data: 'deleted data' }))).toEqual({
      type: 'add',
      isOpen: true,
      feeling: '',
      image: '',
      data: 'deleted data',
      feelingsIsOpen: false,
      openFileDialog: false,
      openVideoDialog: false,
      gifModalIsOpen: false,
      reactionsModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: true
    });
  });
});
