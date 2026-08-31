#!/bin/bash
# Auto-update project status after git operations
# Add to .git/hooks/post-commit or run manually

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
node "$SCRIPT_DIR/frontend/content-tools/update-status.mjs"
