#!/bin/bash

# Define colors for better visibility
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo "${BLUE}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${NC}"
echo "${BLUE}┃       ${YELLOW}Testing Git Hooks for Talkie App              ${BLUE}┃${NC}"
echo "${BLUE}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${NC}"

# Part 1: Test commit message validation hook
echo "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${PURPLE}      Testing commit-msg hook (message format)      ${NC}"
echo "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Create a dummy commit to test the message format
echo "${YELLOW}📝 Creating a temporary file for testing commit message format...${NC}"
echo "test file for commit message" > commit-msg-test.txt
git add commit-msg-test.txt

# Try to commit with an incorrectly formatted message
echo "${YELLOW}🔍 Attempting to commit with an incorrectly formatted message:${NC} 'testing hooks'"
echo "${YELLOW}⚠️ Expected behavior:${NC} Commit should fail due to invalid message format"
echo ""
git commit -m "testing hooks" || echo "${GREEN}✅ Commit message validation worked correctly!${NC}"
echo ""

# Clean up
git reset HEAD commit-msg-test.txt
rm commit-msg-test.txt

# Part 2: Test pre-commit hook with linting errors
echo "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${PURPLE}      Testing pre-commit hook (linting errors)      ${NC}"
echo "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Create a temporary file with deliberate linting/formatting errors
echo "${YELLOW}📝 Creating a temporary JavaScript file with linting errors...${NC}"
TEMP_FILE="src/temp-test-file.js"
echo "function testPreCommitHook() {
    const someVariable = 'test'  // Missing semicolon
    if(true){
        console.log('This has formatting issues')
    }
    return someVariable
}" > $TEMP_FILE

echo "${GREEN}✅ Created file:${NC} $TEMP_FILE"
echo "${YELLOW}📄 File content:${NC}"
cat $TEMP_FILE
echo ""

# Add the file to git
echo "${YELLOW}🔍 Adding file to git staging area...${NC}"
git add $TEMP_FILE
echo "${GREEN}✅ Added file to git${NC}"
echo ""

# Try to commit with a correctly formatted message
echo "${YELLOW}🔍 Attempting to commit with a valid message:${NC} 'test: Add temporary file to test pre-commit hooks'"
echo "${YELLOW}⚠️ Expected behavior:${NC} Commit should fail due to linting errors in the JS file"
echo ""
git commit -m "test: Add temporary file to test pre-commit hooks" || echo "${GREEN}✅ Pre-commit hook worked correctly by preventing the commit due to linting errors!${NC}"
echo ""

# Clean up by removing the temp file
echo "${YELLOW}🧹 Cleaning up temporary files...${NC}"
rm $TEMP_FILE
git reset HEAD $TEMP_FILE
echo "${GREEN}✅ Cleanup complete${NC}"
echo ""

# Summary
echo "${BLUE}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${NC}"
echo "${BLUE}┃                 ${GREEN}Test Results                       ${BLUE}┃${NC}"
echo "${BLUE}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${NC}"
echo "${GREEN}✅ If both commit attempts failed, your hooks are working correctly!${NC}"
echo "${YELLOW}📝 Test Results:${NC}"
echo "  - Test 1: Checks if commit-msg hook rejects invalid message format"
echo "  - Test 2: Checks if pre-commit hook catches linting errors"
echo ""
echo "${BLUE}To make a valid commit:${NC}"
echo "  1. Ensure code passes linting (${GREEN}yarn lint:fix${NC})"
echo "  2. Use a properly formatted message:"
echo "     ${GREEN}git commit -m \"feat: Add new feature\" ✅${NC}"
echo "     ${RED}git commit -m \"adding stuff\" ❌${NC}"
