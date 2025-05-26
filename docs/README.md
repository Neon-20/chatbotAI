# DomusAI Documentation

This directory contains the comprehensive documentation website for DomusAI, built with [Nextra](https://nextra.site/) and Next.js.

## 📚 Documentation Structure

```
docs/
├── pages/                  # Documentation pages
│   ├── index.mdx          # Homepage
│   ├── user-guides/       # User documentation
│   ├── developer/         # Developer documentation
│   ├── admin/             # Administrator guides
│   ├── integrations/      # Integration guides
│   ├── support/           # Support and FAQ
│   └── changelog.mdx      # Version history
├── public/                # Static assets
├── theme.config.tsx       # Nextra theme configuration
├── next.config.js         # Next.js configuration
└── package.json           # Dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Navigate to docs directory:**
   ```bash
   cd docs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Visit `http://localhost:3001`

## 📝 Writing Documentation

### Creating New Pages

1. **Create MDX file:**
   ```bash
   # For user guides
   touch pages/user-guides/new-feature.mdx

   # For developer docs
   touch pages/developer/new-api.mdx
   ```

2. **Add to navigation:**
   Update `_meta.json` in the appropriate directory:
   ```json
   {
     "new-feature": "New Feature Guide"
   }
   ```

3. **Write content:**
   ```mdx
   import { Callout, Cards, Card } from 'nextra/components'

   # New Feature Guide

   This guide explains how to use the new feature.

   <Callout type="info">
     This is an informational callout.
   </Callout>
   ```

### Markdown Features

**Basic Formatting:**
```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
`Inline code`

- Bullet list
- Another item

1. Numbered list
2. Another item

[Link text](https://example.com)
```

**Code Blocks:**
````markdown
```typescript
// TypeScript code with syntax highlighting
interface User {
  id: string
  name: string
}
```
````

**Callouts:**
```mdx
import { Callout } from 'nextra/components'

<Callout type="info">
  Informational message
</Callout>

<Callout type="warning">
  Warning message
</Callout>

<Callout type="error">
  Error message
</Callout>
```

**Cards:**
```mdx
import { Cards, Card } from 'nextra/components'

<Cards>
  <Card icon="🚀" title="Quick Start" href="/getting-started">
    Get started with DomusAI in minutes.
  </Card>
  <Card icon="📖" title="User Guide" href="/user-guides">
    Learn how to use all features.
  </Card>
</Cards>
```

## 🚀 Deployment

### Static Export

Build static files for deployment:

```bash
npm run build
npm run export
```

This creates an `out/` directory with static files.

### Vercel Deployment

1. **Connect repository** to Vercel
2. **Set build settings:**
   - Build Command: `npm run build`
   - Output Directory: `out`
   - Install Command: `npm install`

3. **Environment variables:**
   ```
   NODE_ENV=production
   ```

## 📄 License

This documentation is licensed under the MIT License.
