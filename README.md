# Ravikishan Platform - Monorepo

A comprehensive NEB +2 educational platform with tiered access control, AI-powered chat, interactive 3D labs, and syllabus management.

## Structure

```
ravikishan/
├── frontend/                 # Next.js 15 (App Router)
│   ├── app/                  # Pages and API routes
│   │   ├── (marketing)/      # Public landing pages
│   │   ├── (app)/            # Authenticated app shell
│   │   ├── admin/            # Owner-only admin panel
│   │   ├── login/            # Authentication
│   │   └── signup/           # User registration
│   ├── components/           # React components
│   │   ├── ui/               # Design system primitives
│   │   ├── layout/           # Layout components
│   │   ├── lab/              # Lab simulations
│   │   ├── content/          # Content display
│   │   ├── chat/             # Chat interface
│   │   ├── navigation/       # Navigation components
│   │   └── theme/            # Theme utilities
│   ├── features/             # Feature modules
│   │   ├── auth/             # Authentication logic
│   │   ├── knowledge/        # Knowledge base
│   │   ├── mindmap/          # Mind mapping
│   │   └── syllabus/         # Syllabus management
│   ├── lib/                  # Core utilities
│   │   ├── api/              # API clients
│   │   ├── auth/             # Auth utilities
│   │   ├── content/          # Content services
│   │   ├── schemas/          # Zod validation
│   │   └── types/            # TypeScript types
│   ├── providers/            # React context providers
│   ├── hooks/                # Custom React hooks
│   ├── tests/                # Test suites
│   └── content-tools/        # Migration scripts
├── backend/                  # Express API (future)
├── content/                  # Shared curriculum data
├── docs/                     # Documentation
└── scripts/                  # Build/deploy scripts
```

## Getting Started

### Prerequisites
- Node.js 20+
- npm 9+
- Supabase account (or local setup)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Features

- **NEB Syllabus**: Complete Class 11 & 12 curriculum with 314+ topics
- **Interactive Labs**: 17+ 3D simulations for Physics, Chemistry, Biology, Math
- **AI Chat**: Powered by Agnes AI for instant help
- **Tiered Access**: 4-level access control (Public, Co-member, Member, Owner)
- **Content Ingest**: Admin tool for adding new educational content
- **Syllabus Analytics**: Interactive charts showing curriculum coverage
- **Past 5 Years Comparison**: Track syllabus changes over time

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber
- **Charts**: Plotly.js
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Testing**: Vitest, Playwright
- **Deployment**: Vercel, Render, Netlify

## Development

### Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Lint
npm run lint
```

### Building

```bash
npm run build
npm start
```

## License

MIT
