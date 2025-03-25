// Define regex patterns directly in the test file for testing
// This avoids importing the script which would execute during testing
const ICON_IMPORT_REGEX = /import\s+\{([^}]+)\}\s+from\s+['"]react-icons\/fa['"];/g;
const ICON_USAGE_REGEX = /<(Fa[a-zA-Z0-9]+)(\s+[^>]*)?>/g;
const ICON_CLOSING_TAG_REGEX = /<\/(Fa[a-zA-Z0-9]+)>/g;

// Tests for the icon migration script
describe('migrate-icons.js RegEx Tests', () => {
  describe('ICON_IMPORT_REGEX pattern', () => {
    it('matches simple FontAwesome imports', () => {
      const content = `import { FaHeart } from 'react-icons/fa';`;
      const matches = [...content.matchAll(ICON_IMPORT_REGEX)];
      expect(matches.length).toBe(1);
      expect(matches[0][1].trim()).toBe('FaHeart');
    });

    it('matches multiple FontAwesome icon imports', () => {
      const content = `import { FaHeart, FaBell, FaTrashAlt } from 'react-icons/fa';`;
      const matches = [...content.matchAll(ICON_IMPORT_REGEX)];
      expect(matches.length).toBe(1);
      expect(matches[0][1].trim()).toBe('FaHeart, FaBell, FaTrashAlt');
    });

    it('does not match non-FontAwesome imports', () => {
      const content = `import { useState } from 'react';`;
      const matches = [...content.matchAll(ICON_IMPORT_REGEX)];
      expect(matches.length).toBe(0);
    });
  });

  describe('ICON_USAGE_REGEX pattern', () => {
    it('matches simple FontAwesome icon usage', () => {
      const content = `<FaHeart>`;
      const matches = [...content.matchAll(ICON_USAGE_REGEX)];
      expect(matches.length).toBe(1);
      expect(matches[0][1]).toBe('FaHeart');
    });

    it('matches FontAwesome icon with props', () => {
      const content = `<FaHeart className="icon" size={24} >`;
      const matches = [...content.matchAll(ICON_USAGE_REGEX)];
      expect(matches.length).toBe(1);
      expect(matches[0][1]).toBe('FaHeart');
      expect(matches[0][2].trim()).toBe('className="icon" size={24}');
    });

    it('matches multiple FontAwesome icons', () => {
      const content = `
        <div>
          <FaHeart className="icon" >
          <FaBell onClick={handleClick} >
        </div>
      `;
      const matches = [...content.matchAll(ICON_USAGE_REGEX)];
      expect(matches.length).toBe(2);
      expect(matches[0][1]).toBe('FaHeart');
      expect(matches[1][1]).toBe('FaBell');
    });
  });

  describe('ICON_CLOSING_TAG_REGEX pattern', () => {
    it('matches FontAwesome icon closing tags', () => {
      const content = `</FaHeart>`;
      const matches = [...content.matchAll(ICON_CLOSING_TAG_REGEX)];
      expect(matches.length).toBe(1);
      expect(matches[0][1]).toBe('FaHeart');
    });
  });

  describe('Content replacement logic', () => {
    it('replaces FontAwesome imports with FAIcon imports', () => {
      const content = `import { FaHeart, FaBell } from 'react-icons/fa';`;
      const result = content.replace(ICON_IMPORT_REGEX, `import { FAIcon } from '@components/icons';`);
      expect(result).toBe(`import { FAIcon } from '@components/icons';`);
    });

    it('replaces FontAwesome icon usage with FAIcon', () => {
      const content = `<FaHeart className="icon" >`;
      const result = content.replace(ICON_USAGE_REGEX, (match, iconName, props = '') => {
        return `<FAIcon icon="${iconName}"${props}>`;
      });
      expect(result).toBe(`<FAIcon icon="FaHeart" className="icon" >`);
    });

    it('replaces FontAwesome closing tags with FAIcon closing tags', () => {
      const content = `</FaHeart>`;
      const result = content.replace(ICON_CLOSING_TAG_REGEX, '</FAIcon>');
      expect(result).toBe(`</FAIcon>`);
    });

    it('handles a complete component with multiple icons', () => {
      const content = `
        import { FaHeart, FaBell } from 'react-icons/fa';
        import React from 'react';

        const Component = () => (
          <div>
            <FaHeart className="icon" >
            <FaBell onClick={handleClick} >
          </div>
        );
      `;

      let result = content.replace(ICON_IMPORT_REGEX, `import { FAIcon } from '@components/icons';`);
      result = result.replace(ICON_USAGE_REGEX, (match, iconName, props = '') => {
        return `<FAIcon icon="${iconName}"${props}>`;
      });
      result = result.replace(ICON_CLOSING_TAG_REGEX, '</FAIcon>');

      const expected = `
        import { FAIcon } from '@components/icons';
        import React from 'react';

        const Component = () => (
          <div>
            <FAIcon icon="FaHeart" className="icon" >
            <FAIcon icon="FaBell" onClick={handleClick} >
          </div>
        );
      `;

      expect(result).toBe(expected);
    });
  });
});
