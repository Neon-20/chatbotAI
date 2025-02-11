# Domus AI 

## 1. Project Overview
AID Copilot is an advanced chat interface that enables seamless interaction with various AI models. Built with modern web technologies, it provides a robust platform for AI-powered conversations with features like workspace management,role-based access management, file handling, and customizable settings.

### Key Features
- Multi-model AI chat 
- Real-time response
- AI-Based Suggestions
- Workspace organization
- Default Prompts
- Multi-File attachment capabilities
- Light/Dark Mode
- Manage Profile
- Choose between AI models
- Customizable chat settings
- Markdown message support

## Demo below:
## 2. Purpose and Scope
The project aims to provide a flexible and powerful chat interface that can:
- Support multiple AI language models (OpenAI, Azure, Anthropic, etc.)
- Enable organized conversations through workspace management
- Handle file attachments and context-aware discussions
- Provide customizable settings for different use cases
- Facilitate seamless user experience across devices
- Support multiple languages and locales in chat interface

## 3. Local Quick Setup

### Prerequisites
- Node.js (v18 or higher)
- Docker
- Supabase CLI

### Installation Steps
```bash

# Install dependencies
npm install

# Install Supabase CLI (MacOS/Linux)
brew install supabase/tap/supabase

# Start Supabase
supabase start

# Configure environment
cp .env.local.example .env.local

# Start application
npm run dev
```

## 4. System Architecture
### Frontend Layer
- Next.js application with React components
- Client-side state management
- UI components
- Real-time updates handling
  
### Backend Layer
- Supabase for data persistence
- Authentication system
- File storage management
- Vectorization of files
  
### Integration Layer
- AI model API integrations
- WebSocket connections
- RESTful endpoints
  
## 5. System Components
### Chat Interface
- Real-time chat functionality
- Markdown rendering
- Code syntax highlighting
- Message history management
- Workspace Management
- Multiple workspace support
- Context organization
- Workspace switching
- File Handler
- File upload functionality
- Attachment management
- Storage integration
- User preferences
- AI-Based Suggestions
- Model configurations
- Interface customization
- Role Based Access Management (RBAC)
  
## 6. Tech Stack Used
### Frontend Technologies
- Next.js 14
- React
- Tailwind CSS
- Radix UI
- Shadcn UI
  
### Backend Services
- Supabase
- PostgreSQL
- Authentication system
  
## AI Integrations
- OpenAI API
- Azure OpenAI
- Anthropic Claude
- Google AI
- Mistral AI
- Local Ollama support

