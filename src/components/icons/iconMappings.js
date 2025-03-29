/**
 * Maps FontAwesome icon names to their Phosphor Icon equivalents
 * This helps in migrating existing code that uses FontAwesome naming
 */
export const faToPhosphor = {
  // FaRegBell -> Bell (regular)
  FaRegBell: 'Bell',
  FaBell: 'Bell',

  // FaRegEnvelope -> Envelope (regular)
  FaRegEnvelope: 'Envelope',
  FaEnvelope: 'Envelope',

  // FaCaretDown -> CaretDown
  FaCaretDown: 'CaretDown',

  // FaCaretUp -> CaretUp
  FaCaretUp: 'CaretUp',

  // FaCircle -> Circle
  FaCircle: 'Circle',
  FaRegCircle: 'Circle',

  // FaTrashAlt -> Trash
  FaTrashAlt: 'Trash',
  FaRegTrashAlt: 'Trash',

  // FaUserAlt -> User
  FaUserAlt: 'User',
  FaUser: 'User',
  FaRegUser: 'User',

  // FaCheck -> Check
  FaCheck: 'Check',

  // FaSearch -> MagnifyingGlass
  FaSearch: 'MagnifyingGlass',

  // FaTimes -> X
  FaTimes: 'X',

  // FaGlobe -> Globe
  FaGlobe: 'Globe',

  // FaRegCommentAlt -> ChatTeardrop
  FaRegCommentAlt: 'ChatTeardrop',

  // FaPencilAlt -> PencilSimple
  FaPencilAlt: 'PencilSimple',

  // FaArrowLeft -> ArrowLeft
  FaArrowLeft: 'ArrowLeft',

  // FaArrowRight -> ArrowRight
  FaArrowRight: 'ArrowRight',

  // FaArrowUp -> ArrowUp
  FaArrowUp: 'ArrowUp',

  // FaSpinner -> Spinner
  FaSpinner: 'SpinnerGap',

  // FaRegPaperPlane -> PaperPlaneRight
  FaRegPaperPlane: 'PaperPlaneRight',

  // Sidebar specific mappings
  FaNewspaper: 'Newspaper',
  FaComments: 'ChatCircle',
  FaUsers: 'UsersThree',
  FaUserPlus: 'UserPlus',
  FaHeart: 'Heart',
  FaImages: 'Image',
  FaBirthdayCake: 'Cake',
  FaKey: 'Key',
  FaLock: 'LockSimple',
  FaUserCheck: 'UserCheck'
};

/**
 * Get the equivalent Phosphor icon name from a FontAwesome icon name
 * @param {string} faName - The FontAwesome icon name
 * @returns {string} - The equivalent Phosphor icon name or the original if no mapping exists
 */
export const getPhosphorName = (faName) => {
  return faToPhosphor[faName] || faName;
};

/**
 * Determine the appropriate weight for Phosphor icon based on FontAwesome icon name
 * @param {string} faName - The FontAwesome icon name
 * @returns {string} - The appropriate weight for the Phosphor icon
 */
export const getPhosphorWeight = (faName) => {
  // If the FontAwesome icon name starts with 'FaReg', use 'regular' weight
  if (faName.startsWith('FaReg')) {
    return 'regular';
  }

  // If it's a solid icon, use 'fill' weight
  if (!faName.includes('Reg') && !faName.includes('Light')) {
    return 'fill';
  }

  return 'regular';
};
