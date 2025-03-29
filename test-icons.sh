#!/bin/bash

# Set terminal colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧪 Running Icon System Tests...${NC}"

# Create a temporary jest config file
TMP_CONFIG="jest.icons.config.js"

# Write the basic config to the temporary file
cat > $TMP_CONFIG << EOL
module.exports = {
  // Use react-scripts preset
  preset: 'react-scripts',

  // Target only the icon tests
  testMatch: ['**/components/icons/__tests__/**/*.test.js'],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Module mappings
  moduleNameMapper: {
    '\\.scss$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
    '@components/(.*)': '<rootDir>/src/components/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
    '@hooks/(.*)': '<rootDir>/src/hooks/$1',
    '@mocks/(.*)': '<rootDir>/src/mocks/$1',
    '@pages/(.*)': '<rootDir>/src/pages/$1',
    '@redux/(.*)': '<rootDir>/src/redux-toolkit/$1',
    '@assets/(.*)': '<rootDir>/src/assets/$1',
    '@colors/(.*)': '<rootDir>/src/colors/$1',
    '@root/(.*)': '<rootDir>/src/$1'
  },

  // Transform files with babel-jest
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },

  // Clear mocks automatically
  clearMocks: true,

  // Verbose output
  verbose: true
};
EOL

# Run the tests with the temporary config
echo -e "${GREEN}Running tests with custom configuration...${NC}"
npx jest --config=$TMP_CONFIG

# Store the exit code
EXIT_CODE=$?

# Clean up the temporary config file
rm $TMP_CONFIG

# Exit with the Jest exit code
exit $EXIT_CODE
