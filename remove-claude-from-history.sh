#!/bin/bash

# Script to remove CLAUDE.md from the entire Git history
# WARNING: This will rewrite Git history. Make sure you understand the implications.

# Make sure we're in the project root
cd "$(dirname "$0")"

# Create a new branch to work with
git checkout -b remove-claude-file

# Use filter-branch to rewrite history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch CLAUDE.md" \
  --prune-empty --tag-name-filter cat -- --all

# Push the changes to origin with force (CAUTION)
echo "History has been rewritten to remove CLAUDE.md from git history."
echo ""
echo "IMPORTANT: Next steps (do NOT run these blindly):"
echo "1. Examine the new history with 'git log'"
echo "2. If everything looks good, run:"
echo "   git push origin remove-claude-file --force"
echo "3. Create a PR from 'remove-claude-file' branch to 'main'" 
echo "4. After merging, all collaborators must reclone or reset their repos"
echo ""
echo "ALTERNATIVE: If you are the only contributor and are ok with force-pushing to main:"
echo "   git checkout main"
echo "   git reset --hard remove-claude-file"
echo "   git push origin main --force"
echo ""
echo "Warning: Force pushing rewrites history for everyone. Use with caution!"