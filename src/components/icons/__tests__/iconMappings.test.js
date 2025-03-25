import { faToPhosphor, getPhosphorName, getPhosphorWeight } from '../iconMappings';

describe('Icon Mapping Utilities', () => {
  describe('faToPhosphor mapping object', () => {
    it('contains mappings for common FontAwesome icons', () => {
      // Check a sample of important mappings
      expect(faToPhosphor.FaHeart).toBe('Heart');
      expect(faToPhosphor.FaRegBell).toBe('Bell');
      expect(faToPhosphor.FaSearch).toBe('MagnifyingGlass');
      expect(faToPhosphor.FaTimes).toBe('X');
    });

    it('has consistent mappings for regular and solid variants', () => {
      // Check that regular and solid variants map to the same Phosphor icon
      expect(faToPhosphor.FaRegBell).toBe(faToPhosphor.FaBell);
      expect(faToPhosphor.FaRegUser).toBe(faToPhosphor.FaUser);
      expect(faToPhosphor.FaRegCircle).toBe(faToPhosphor.FaCircle);
      expect(faToPhosphor.FaRegTrashAlt).toBe(faToPhosphor.FaTrashAlt);
    });
  });

  describe('getPhosphorName function', () => {
    it('returns the correct Phosphor icon name for known FontAwesome icons', () => {
      expect(getPhosphorName('FaHeart')).toBe('Heart');
      expect(getPhosphorName('FaRegBell')).toBe('Bell');
      expect(getPhosphorName('FaSearch')).toBe('MagnifyingGlass');
      expect(getPhosphorName('FaTimes')).toBe('X');
    });

    it('returns the input name for unknown FontAwesome icons', () => {
      expect(getPhosphorName('FaUnknownIcon')).toBe('FaUnknownIcon');
      expect(getPhosphorName('SomeRandomName')).toBe('SomeRandomName');
    });

    it('handles sidebar specific icon mappings', () => {
      expect(getPhosphorName('FaNewspaper')).toBe('Newspaper');
      expect(getPhosphorName('FaComments')).toBe('ChatCircle');
      expect(getPhosphorName('FaUsers')).toBe('UsersThree');
    });
  });

  describe('getPhosphorWeight function', () => {
    it('returns "regular" weight for icons with "Reg" prefix', () => {
      expect(getPhosphorWeight('FaRegBell')).toBe('regular');
      expect(getPhosphorWeight('FaRegUser')).toBe('regular');
      expect(getPhosphorWeight('FaRegCircle')).toBe('regular');
    });

    it('returns "fill" weight for standard FontAwesome solid icons', () => {
      expect(getPhosphorWeight('FaHeart')).toBe('fill');
      expect(getPhosphorWeight('FaBell')).toBe('fill');
      expect(getPhosphorWeight('FaUser')).toBe('fill');
    });

    it('returns "fill" for strings without Reg or Light', () => {
      expect(getPhosphorWeight('FaLightIcon')).toBe('regular');
      expect(getPhosphorWeight('RandomString')).toBe('fill');
    });
  });
});
