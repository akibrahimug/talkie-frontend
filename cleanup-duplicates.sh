#!/bin/bash

# Define colors for better visibility
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo "${BLUE}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${NC}"
echo "${BLUE}┃    ${YELLOW}Cleaning up duplicate files in Talkie App         ${BLUE}┃${NC}"
echo "${BLUE}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${NC}"

# Find all duplicate files with '2' in the name
echo "${YELLOW}🔍 Finding duplicate files...${NC}"
DUPLICATES=$(find src -name "* 2.ts" -o -name "* 2.tsx" && find src -name "* 2.scss" -o -name "* 2.scss" && find . -name "* 2.json" -o -name "* 2.json" && find . -name "* 2.md" -o -name "* 2.md" && find . -name "* 2.txt" -o -name "* 2.txt" && find . -name "* 2.yml" -o -name "* 2.yml" && find . -name "* 2.js" -o -name "* 2.js" && find src -name "* 2" -o -name "* 2" && find src -name "* 2.ts" -o -name "* 2.tsx" && find src -name "* 2.scss" -o -name "* 2.scss" && find . -name "* 2.json" -o -name "* 2.json" && find . -name "* 2.md" -o -name "* 2.md" && find . -name "* 2.txt" -o -name "* 2.txt" && find . -name "* 2.yml" -o -name "* 2.yml" && find . -name "* 2.js" -o -name "* 2.js" && find src -name "* 2" -o -name "* 2" && find . -name "* 2" -o -name "* 2" && find . -name "* 2.png" -o -name "* 2.png" && find . -name "* 2.jpg" -o -name "* 2.jpg" && find . -name "* 2.jpeg" -o -name "* 2.jpeg" && find . -name "* 2.gif" -o -name "* 2.gif" && find . -name "* 2.svg" -o -name "* 2.svg" && find . -name "* 2.webp" -o -name "* 2.webp" )

if [ -z "$DUPLICATES" ]; then
  echo "${GREEN}✅ No duplicate files found!${NC}"
else
  echo "${YELLOW}Found these duplicate files:${NC}"
  echo "$DUPLICATES"

  # Confirm before deleting
  read -p "${YELLOW}Delete these duplicates? (y/n) ${NC}" -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "${YELLOW}🗑️ Removing duplicate files...${NC}"

    # Remove each duplicate file
    while IFS= read -r file; do
      if [ -f "$file" ]; then
        rm "$file"
        echo "${GREEN}✓ Removed: $file${NC}"
      fi
    done <<< "$DUPLICATES"

    echo "${GREEN}✅ All duplicate files removed successfully!${NC}"
  else
    echo "${RED}❌ Operation cancelled. No files deleted.${NC}"
  fi
fi

# Add a hook to prevent this from happening in the future
echo "${YELLOW}📝 Setting up protection against future duplications...${NC}"

# Create a pre-commit hook to check for and warn about duplicates
if [ ! -d .git/hooks ]; then
  echo "${RED}❌ .git/hooks directory not found. Are you in the root of the repository?${NC}"
else
  # Add to existing pre-commit hook if it exists, otherwise create a new one
  PRE_COMMIT=".husky/pre-commit"

  # Add detection code to the pre-commit hook
  if [ -f "$PRE_COMMIT" ]; then
    echo "${YELLOW}⚠️ Pre-commit hook already exists.${NC}"
    echo "${YELLOW}Adding duplicate detection to existing hook...${NC}"

    # Check if our code is already in the pre-commit hook
    if grep -q "DUPLICATE_FILES_CHECK" "$PRE_COMMIT"; then
      echo "${GREEN}✅ Duplicate file detection already set up in pre-commit hook.${NC}"
    else
      # Add our code before the lint-staged call
      awk '/Running lint-staged/{print "# DUPLICATE_FILES_CHECK - Detect duplicate files before commit";
      print "echo \"${YELLOW}⏳ Checking for duplicate files...${NC}\"";
      print "DUPLICATE_FILES=\$(find src -name \"* 2.js\" -o -name \"* 2.jsx\")";
      print "if [ -n \"\$DUPLICATE_FILES\" ]; then";
      print "  echo \"${RED}${BOLD}❌ WARNING: Duplicate files detected!${NC}\"";
      print "  echo \"\$DUPLICATE_FILES\"";
      print "  echo \"${YELLOW}💡 Run ./cleanup-duplicates.sh to clean these up.${NC}\"";
      print "  echo \"${YELLOW}Continuing with commit, but please clean up these files soon.${NC}\"";
      print "fi";
      print "";
      print $0} !/Running lint-staged/{print}' "$PRE_COMMIT" > "$PRE_COMMIT.tmp"

      mv "$PRE_COMMIT.tmp" "$PRE_COMMIT"
      chmod +x "$PRE_COMMIT"

      echo "${GREEN}✅ Added duplicate file detection to pre-commit hook.${NC}"
    fi
  fi
fi

# Add protection in VSCode settings
VSCODE_SETTINGS=".vscode/settings.json"
mkdir -p .vscode

if [ ! -f "$VSCODE_SETTINGS" ]; then
  echo "{}" > "$VSCODE_SETTINGS"
fi

# Update VSCode settings to prevent duplicate files
echo "${YELLOW}📝 Updating VSCode settings to prevent duplications...${NC}"
TEMP_SETTINGS=$(mktemp)

# Check if file exists and is valid JSON
if [ -f "$VSCODE_SETTINGS" ] && jq empty "$VSCODE_SETTINGS" 2>/dev/null; then
  # Extract current settings
  cat "$VSCODE_SETTINGS" > "$TEMP_SETTINGS"

  # Add our settings using jq
  jq '. + {
    "files.saveConflictResolution": "uniqueFile",
    "files.insertFinalNewline": true,
    "files.trimTrailingWhitespace": true,
    "files.trimFinalNewlines": true
  }' "$TEMP_SETTINGS" > "$VSCODE_SETTINGS"

  echo "${GREEN}✅ VSCode settings updated to prevent duplicate files.${NC}"
else
  # Create a new settings file
  cat > "$VSCODE_SETTINGS" << EOF
{
  "files.saveConflictResolution": "uniqueFile",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "files.trimFinalNewlines": true
}
EOF
  echo "${GREEN}✅ Created new VSCode settings file with duplicate prevention.${NC}"
fi

rm -f "$TEMP_SETTINGS"

echo ""
echo "${GREEN}${BOLD}✨ SETUP COMPLETE ✨${NC}"
echo "${YELLOW}To use:${NC}"
echo "  1. Run ${BOLD}./cleanup-duplicates.sh${NC} anytime you notice duplicate files"
echo "  2. The pre-commit hook will now warn you about duplicate files"
echo "  3. VSCode settings updated to help prevent duplicates"
echo ""
echo "${BLUE}Happy coding! 💻${NC}"

# Make the script executable
chmod +x cleanup-duplicates.sh
