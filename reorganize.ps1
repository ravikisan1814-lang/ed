# PowerShell script to reorganize project into monorepo structure

$ErrorActionPreference = "Continue"

Write-Host "Creating monorepo structure..."

# Create frontend app structure
$frontendDirs = @(
    "frontend\app\(marketing)",
    "frontend\app\(app)",
    "frontend\app\admin",
    "frontend\app\login",
    "frontend\app\signup",
    "frontend\app\(app)\class-11",
    "frontend\app\(app)\class-11\notes",
    "frontend\app\(app)\class-11\notes\[subject]",
    "frontend\app\(app)\class-12",
    "frontend\app\(app)\class-12\notes",
    "frontend\app\(app)\class-12\notes\[subject]",
    "frontend\app\(app)\notes",
    "frontend\app\(app)\lab",
    "frontend\app\(app)\knowledge",
    "frontend\app\(app)\knowledge\grammar",
    "frontend\app\(app)\knowledge\numerical-physics",
    "frontend\app\(app)\knowledge\numerical-chemistry",
    "frontend\app\(app)\world-knowledge",
    "frontend\app\(app)\loksewa",
    "frontend\app\(app)\levels",
    "frontend\app\(app)\syllabus",
    "frontend\app\(app)\subjects",
    "frontend\app\(app)\resources",
    "frontend\app\(app)\progress",
    "frontend\app\(app)\bookmarks",
    "frontend\app\(app)\chat",
    "frontend\app\(app)\credits",
    "frontend\components\ui",
    "frontend\components\layout",
    "frontend\components\content",
    "frontend\components\chat",
    "frontend\components\navigation",
    "frontend\components\theme",
    "frontend\features\auth",
    "frontend\features\knowledge",
    "frontend\features\mindmap",
    "frontend\features\syllabus",
    "frontend\lib\api",
    "frontend\lib\auth",
    "frontend\lib\content",
    "frontend\lib\schemas",
    "frontend\lib\types",
    "frontend\providers",
    "frontend\hooks",
    "frontend\public",
    "frontend\tests\unit",
    "frontend\tests\integration",
    "frontend\tests\e2e",
    "frontend\content",
    "frontend\content-tools",
    "frontend\docker",
    "frontend\docs",
    "backend\src\config",
    "backend\src\db\schema",
    "backend\src\db\migrations",
    "backend\src\db\seed",
    "backend\src\db\repositories",
    "backend\src\cache",
    "backend\src\api",
    "backend\src\auth",
    "backend\src\services",
    "backend\src\ai",
    "backend\src\middleware",
    "backend\src\validators",
    "backend\src\utils",
    "backend\src\docs",
    "content",
    "content-tools",
    ".github\workflows",
    "docs"
)

foreach ($dir in $frontendDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
}

Write-Host "Directory structure created!"

# Move files using Robocopy for better reliability
Write-Host "Moving files..."

# Move app directory
if (Test-Path "app") {
    robocopy app frontend/app /E /MOVE /NFL /NDL /NJH /NJS
    if (Test-Path "app") { Remove-Item -Path "app" -Recurse -Force -ErrorAction SilentlyContinue }
}

# Move components directory
if (Test-Path "components") {
    robocopy components frontend/components /E /MOVE /NFL /NDL /NJH /NJS
    if (Test-Path "components") { Remove-Item -Path "components" -Recurse -Force -ErrorAction SilentlyContinue }
}

# Move hooks directory
if (Test-Path "hooks") {
    robocopy hooks frontend/hooks /E /MOVE /NFL /NDL /NJH /NJS
    if (Test-Path "hooks") { Remove-Item -Path "hooks" -Recurse -Force -ErrorAction SilentlyContinue }
}

# Move lib directory
if (Test-Path "lib") {
    robocopy lib frontend/lib /E /MOVE /NFL /NDL /NJH /NJS
    if (Test-Path "lib") { Remove-Item -Path "lib" -Recurse -Force -ErrorAction SilentlyContinue }
}

# Move tests directory
if (Test-Path "tests") {
    robocopy tests frontend/tests /E /MOVE /NFL /NDL /NJH /NJS
    if (Test-Path "tests") { Remove-Item -Path "tests" -Recurse -Force -ErrorAction SilentlyContinue }
}

# Move scripts to content-tools
if (Test-Path "scripts") {
    robocopy scripts frontend/content-tools /E /MOVE /NFL /NDL /NJH /NJS
    if (Test-Path "scripts") { Remove-Item -Path "scripts" -Recurse -Force -ErrorAction SilentlyContinue }
}

# Move supabase to content
if (Test-Path "supabase") {
    robocopy supabase content /E /MOVE /NFL /NDL /NJH /NJS
    if (Test-Path "supabase") { Remove-Item -Path "supabase" -Recurse -Force -ErrorAction SilentlyContinue }
}

# Move root files to frontend
$rootFiles = @(
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "middleware.ts",
    "vitest.config.mts",
    "playwright.config.ts",
    "vercel.json",
    "render.yaml",
    "netlify.toml",
    "AGENTS.md",
    "AGENT_STATUS.md",
    "ARCHITECTURE.md",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "DECISIONS.md",
    "DEPLOYMENT.md",
    "PROJECT_SPEC.md",
    "README.md",
    "SECURITY.md",
    "TASKS.md",
    "TESTING.md",
    ".gitignore",
    "app/layout.tsx",
    "app/globals.css"
)

foreach ($file in $rootFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "frontend/$file" -Force
    }
}

Write-Host "Monorepo reorganization complete!"
Write-Host ""
Write-Host "Structure:"
Write-Host "  frontend/   - Next.js application"
Write-Host "  backend/    - Express API (to be created)"
Write-Host "  content/    - Shared curriculum data"
Write-Host "  docs/       - Documentation"
Write-Host "  .github/    - CI/CD workflows"
