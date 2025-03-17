#!/bin/bash

# This script helps test if the pre-commit hook and commit message validation are working properly

echo "Making a small change to test pre-commit hooks..."

# Create a temporary file with a deliberate formatting error
TEMP_FILE="src/temp-test-file.js"
echo "function testPreCommitHook() {
    const someVariable = 'test'  // Missing semicolon
    return someVariable
}" > $TEMP_FILE

# Add the file to git
git add $TEMP_FILE

# Try to commit with an incorrectly formatted message
echo "Attempting to commit with an incorrectly formatted message..."
git commit -m "testing hooks" || echo "Commit message validation worked correctly"

# Try to commit with a correctly formatted message
echo "Attempting to commit with a correctly formatted message..."
git commit -m "test: Add temporary file to test pre-commit hooks" || echo "Pre-commit hook worked correctly by preventing the commit due to linting errors"

# Clean up by removing the temp file
rm $TEMP_FILE
git reset HEAD $TEMP_FILE

echo "Test complete. If the hooks are working correctly, both commit attempts should have failed."
echo "The first due to invalid commit message format, the second due to linting errors."
