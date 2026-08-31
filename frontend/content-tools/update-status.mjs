#!/usr/bin/env node
/**
 * Auto-update PROJECT_STATUS.md on git commit
 * Run: git commit && node scripts/update-status.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const STATUS_FILE = join(__dirname, '..', 'PROJECT_STATUS.md');

try {
  // Get last commit info
  const lastCommit = execSync('git log -1 --format="%h %s (%cd)"', { encoding: 'utf8' }).trim();
  const lastCommitDate = execSync('git log -1 --format="%cd"', { encoding: 'utf8', cwd: join(__dirname, '..') }).trim();
  
  // Get branch info
  const branch = execSync('git branch --show-current', { encoding: 'utf8', cwd: join(__dirname, '..') }).trim();
  
  // Get file count
  const fileCount = execSync('git ls-files | find /c /v ""', { encoding: 'utf8', cwd: join(__dirname, '..') }).trim();
  
  // Get last 5 commits
  const recentCommits = execSync('git log -5 --format="  - %h %s"', { encoding: 'utf8', cwd: join(__dirname, '..') }).trim();
  
  // Update status file
  const content = `# Project Status

Last updated: ${new Date().toISOString().split('T')[0]}

## Overview
- **Project**: Ravikishan's Educational Platform
- **Type**: Monorepo (Next.js + Express)
- **Branch**: \`${branch}\`
- **Status**: Active Development
- **Last Commit**: ${lastCommit}
- **Total Files**: ${fileCount}

## Structure
\`\`\`
ravikishan/
├── frontend/     # Next.js 15 application
├── backend/      # Express API (placeholder)
├── content/      # Database migrations
└── docs/         # Documentation
\`\`\`

## Recent Changes
${recentCommits}

## Next Steps
- [ ] Create Express backend API
- [ ] Add CI/CD workflows
- [ ] Configure Docker support
- [ ] Expand content library
`;
  
  writeFileSync(STATUS_FILE, content);
  console.log('✅ PROJECT_STATUS.md updated');
} catch (error) {
  console.error('❌ Failed to update status:', error.message);
  process.exit(1);
}
