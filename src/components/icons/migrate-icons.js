#!/usr/bin/env node
/**
 * This script helps migrate FontAwesome icons to Phosphor Icons.
 * It searches your codebase for import statements and usages of FontAwesome icons,
 * and suggests replacements using the new Icon system.
 *
 * Usage:
 * 1. Make sure you have Node.js installed
 * 2. Run with yarn: yarn node ./src/components/icons/migrate-icons.js
 * 3. Follow the instructions and review the suggested changes
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Constants
const SRC_DIR = path.resolve(__dirname, '../../');
const EXTENSIONS = ['.js', '.jsx'];
const ICON_IMPORT_REGEX = /import\s+\{([^}]+)\}\s+from\s+['"]react-icons\/fa['"];/g;
const ICON_USAGE_REGEX = /<(Fa[a-zA-Z0-9]+)(\s+[^>]*)?>/g;
const ICON_CLOSING_TAG_REGEX = /<\/(Fa[a-zA-Z0-9]+)>/g;

// Helper function to find all JavaScript/JSX files
async function findJsFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? findJsFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files).filter((file) => EXTENSIONS.includes(path.extname(file)));
}

// Process a file to find and replace icon imports and usages
async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    let hasIconImports = false;

    // Check if file has FontAwesome imports
    if (ICON_IMPORT_REGEX.test(content)) {
      hasIconImports = true;

      // Reset the regex lastIndex
      ICON_IMPORT_REGEX.lastIndex = 0;

      // 1. Replace imports
      let newContent = content.replace(ICON_IMPORT_REGEX, `import { FAIcon } from '@components/icons';`);

      // 2. Replace icon usages
      newContent = newContent.replace(ICON_USAGE_REGEX, (match, iconName, props = '') => {
        return `<FAIcon icon="${iconName}"${props}>`;
      });

      // 3. Replace closing tags
      newContent = newContent.replace(ICON_CLOSING_TAG_REGEX, '</FAIcon>');

      // 4. Log the file that would be changed
      console.log(`\nFile: ${path.relative(SRC_DIR, filePath)}`);
      console.log('Changes to be made:');

      // Add a note for this file
      const relativePath = path.relative(SRC_DIR, filePath);
      return {
        path: filePath,
        hasChanges: content !== newContent,
        newContent,
        relativePath
      };
    }

    return { path: filePath, hasChanges: false };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return { path: filePath, hasChanges: false, error };
  }
}

// Main function
async function main() {
  try {
    console.log('🔍 Scanning for FontAwesome icons in your codebase...');

    // Find all JS/JSX files
    const jsFiles = await findJsFiles(SRC_DIR);
    console.log(`Found ${jsFiles.length} JavaScript/JSX files.`);

    // Process each file
    const results = await Promise.all(jsFiles.map(processFile));

    // Filter files with changes
    const filesToChange = results.filter((result) => result.hasChanges);

    if (filesToChange.length === 0) {
      console.log('✅ No FontAwesome icons found or all have been migrated already!');
      return;
    }

    console.log(`\n🔄 Found ${filesToChange.length} files with FontAwesome icons to migrate:`);
    filesToChange.forEach((file, index) => {
      console.log(`${index + 1}. ${file.relativePath}`);
    });

    // This script is meant to be informational only
    // Actual changes should be made methodically with proper testing
    console.log('\n⚠️ This script provides information only and does not make changes.');
    console.log('To migrate icons, use the following approach:');
    console.log("1. Replace FontAwesome imports with: import { FAIcon } from '@components/icons';");
    console.log('2. Replace icon components like <FaHeart /> with <FAIcon icon="FaHeart" />');
    console.log('3. Test each component thoroughly after the change');
    console.log('\nRefer to the src/components/icons/README.md for more details');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main();
