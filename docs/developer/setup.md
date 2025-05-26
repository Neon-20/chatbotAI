# Development Setup

This guide will help you set up a local development environment for DomusAI.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Docker** - [Download](https://www.docker.com/get-started)
- **Git** - Version control
- **Supabase CLI** - Database management

### Development Tools (Recommended)
- **VS Code** - Code editor with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint
  - GitLens

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/chatbotAI.git
cd chatbotAI
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Install Supabase CLI

**macOS/Linux:**
```bash
brew install supabase/tap/supabase
```

**Windows:**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Alternative (npm):**
```bash
npm install -g supabase
```

### 4. Start Supabase

```bash
supabase start
```

This will start local Supabase services:
- PostgreSQL Database
- Authentication
- Storage
- Edge Functions
- Dashboard

### 5. Environment Configuration

Copy the environment template:
```bash
cp .env.local.example .env.local
```

Update `.env.local` with your configuration:

```env
# Supabase (automatically filled by supabase start)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Provider API Keys (optional for development)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_GEMINI_API_KEY=your_gemini_key

# Analytics (optional)
NEXT_PUBLIC_FARO_URL=your_faro_url
APPLICATIONINSIGHTS_CONNECTION_STRING=your_app_insights_string
```

### 6. Database Setup

Generate TypeScript types and run migrations:
```bash
npm run db-types
npm run db-migrate
```

### 7. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🗄️ Database Management

### Local Database

Supabase provides a local PostgreSQL instance with:
- **Database**: `postgresql://postgres:postgres@localhost:54322/postgres`
- **Dashboard**: `http://localhost:54323`
- **API**: `http://localhost:54321`

### Common Commands

```bash
# Reset database (careful - deletes all data)
npm run db-reset

# Apply migrations
npm run db-migrate

# Generate TypeScript types
npm run db-types

# Pull remote changes
npm run db-pull

# Push local changes
npm run db-push
```

### Creating Migrations

```bash
supabase migration new your_migration_name
```

Edit the generated SQL file in `supabase/migrations/`, then apply:
```bash
npm run db-migrate
```

## 🔧 Development Workflow

### Project Structure

```
chatbotAI/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalization
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── chat/             # Chat-specific components
│   ├── ui/               # Reusable UI components
│   └── utility/          # Utility components
├── context/              # React Context providers
├── db/                   # Database operations
├── lib/                  # Utility functions
├── supabase/            # Database schema and migrations
├── types/               # TypeScript definitions
└── docs/                # Documentation
```

### Code Style

The project uses:
- **TypeScript** for type safety
- **Prettier** for code formatting
- **ESLint** for linting
- **Tailwind CSS** for styling

Run code quality checks:
```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Fix auto-fixable issues
npm run type-check    # TypeScript type checking
npm run format:check  # Check formatting
npm run format:write  # Format code
```

### Testing

```bash
npm test              # Run Jest tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🔌 AI Provider Setup

### OpenAI

1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env.local`:
```env
OPENAI_API_KEY=sk-...
```

### Anthropic Claude

1. Get API key from [Anthropic Console](https://console.anthropic.com/)
2. Add to `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-...
```

### Google Gemini

1. Get API key from [Google AI Studio](https://makersuite.google.com/)
2. Add to `.env.local`:
```env
GOOGLE_GEMINI_API_KEY=...
```

### Azure OpenAI

1. Set up Azure OpenAI resource
2. Add to `.env.local`:
```env
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
```

## 📊 Analytics Setup

### Grafana Faro

1. Set up Faro instance
2. Add to `.env.local`:
```env
NEXT_PUBLIC_FARO_URL=https://faro-collector-prod-us-central-0.grafana.net/collect/...
```

### Application Insights

1. Create Application Insights resource in Azure
2. Add to `.env.local`:
```env
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=...
```

## 🐳 Docker Development

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Custom Docker Setup

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

## 🔍 Debugging

### VS Code Debug Configuration

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Common Issues

**Port conflicts:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Supabase connection issues:**
```bash
# Restart Supabase
supabase stop
supabase start
```

**Type errors after schema changes:**
```bash
npm run db-types
```

## 🚀 Production Build

### Build for Production

```bash
npm run build
npm run start
```

### Environment Variables

Ensure all required environment variables are set for production:
- Database connection strings
- API keys
- Analytics configuration
- Security settings

### Performance Optimization

```bash
# Analyze bundle size
npm run analyze

# Check build output
npm run build
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🆘 Getting Help

If you encounter issues:
1. Check the [Troubleshooting Guide](../support/troubleshooting.md)
2. Search existing [GitHub Issues](https://github.com/your-org/chatbotAI/issues)
3. Join our [Developer Discord](https://discord.gg/domusai-dev)
4. Contact the development team
