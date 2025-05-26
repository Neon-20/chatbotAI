# Database Schema

DomusAI uses PostgreSQL with Supabase for data persistence, authentication, and real-time features.

## 🗄️ Schema Overview

The database is organized into several key areas:
- **User Management**: Profiles, authentication, roles
- **Workspace Organization**: Workspaces, folders, permissions
- **Chat System**: Chats, messages, file attachments
- **AI Resources**: Assistants, prompts, tools, models
- **File Management**: Files, collections, processing

## 👤 User Management

### profiles

Stores user profile information and preferences.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  image_path TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  profile_context TEXT DEFAULT '',
  roles roles DEFAULT 'user',
  has_onboarded BOOLEAN DEFAULT FALSE,
  
  -- API Keys (encrypted)
  openai_api_key TEXT,
  anthropic_api_key TEXT,
  google_gemini_api_key TEXT,
  azure_openai_api_key TEXT,
  azure_openai_endpoint TEXT,
  mistral_api_key TEXT,
  groq_api_key TEXT,
  perplexity_api_key TEXT,
  openrouter_api_key TEXT,
  
  -- Azure OpenAI specific
  use_azure_openai BOOLEAN DEFAULT FALSE,
  azure_openai_35_turbo_id TEXT,
  azure_openai_45_turbo_id TEXT,
  azure_openai_45_vision_id TEXT,
  azure_openai_embeddings_id TEXT,
  openai_organization_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

**Indexes:**
```sql
CREATE INDEX idx_profiles_roles ON profiles(roles);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);
```

**RLS Policies:**
```sql
-- Users can only view and edit their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### roles (Enum)

```sql
CREATE TYPE roles AS ENUM ('user', 'admin', 'superadmin');
```

## 🏢 Workspace Management

### workspaces

Organizes chats and resources into logical groups.

```sql
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_path TEXT DEFAULT '',
  is_home BOOLEAN DEFAULT FALSE,
  
  -- Default chat settings
  default_context_length INTEGER DEFAULT 4096,
  default_model TEXT DEFAULT 'gpt-3.5-turbo',
  default_prompt TEXT DEFAULT 'You are a helpful AI assistant.',
  default_temperature REAL DEFAULT 0.5,
  
  -- Workspace behavior
  embeddings_provider TEXT DEFAULT 'openai',
  include_profile_context BOOLEAN DEFAULT TRUE,
  include_workspace_instructions BOOLEAN DEFAULT TRUE,
  instructions TEXT DEFAULT '',
  
  -- Privacy settings
  is_public BOOLEAN DEFAULT FALSE,
  sharing_enabled BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

**Indexes:**
```sql
CREATE INDEX idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX idx_workspaces_is_home ON workspaces(user_id, is_home);
CREATE INDEX idx_workspaces_public ON workspaces(is_public) WHERE is_public = TRUE;
```

**RLS Policies:**
```sql
-- Users can access their own workspaces and public ones
CREATE POLICY "Users can view own workspaces" ON workspaces
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (is_public = TRUE AND sharing_enabled = TRUE)
  );

CREATE POLICY "Users can manage own workspaces" ON workspaces
  FOR ALL USING (auth.uid() = user_id);
```

### folders

Organize resources within workspaces.

```sql
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  type folder_type NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TYPE folder_type AS ENUM (
  'chats', 'files', 'collections', 'prompts', 
  'presets', 'assistants', 'tools', 'models'
);
```

## 💬 Chat System

### chats

Individual conversation threads.

```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  
  -- Chat settings
  context_length INTEGER DEFAULT 4096,
  model TEXT DEFAULT 'gpt-3.5-turbo',
  prompt TEXT DEFAULT '',
  temperature REAL DEFAULT 0.5,
  
  -- Metadata
  sharing sharing DEFAULT 'private',
  embeddings_provider TEXT DEFAULT 'openai',
  include_profile_context BOOLEAN DEFAULT TRUE,
  include_workspace_instructions BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TYPE sharing AS ENUM ('private', 'public');
```

### messages

Individual messages within chats.

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  role message_role NOT NULL,
  model TEXT,
  sequence_number INTEGER NOT NULL,
  
  -- AI response metadata
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TYPE message_role AS ENUM ('system', 'user', 'assistant', 'function');
```

**Indexes:**
```sql
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_sequence ON messages(chat_id, sequence_number);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

### message_file_items

Links files to specific messages.

```sql
CREATE TABLE message_file_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_item_id UUID NOT NULL REFERENCES file_items(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 📁 File Management

### files

Uploaded files and documents.

```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  file_path TEXT NOT NULL,
  size INTEGER NOT NULL,
  type TEXT NOT NULL,
  
  -- Processing status
  sharing sharing DEFAULT 'private',
  tokens INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

### file_items

Processed chunks of files for retrieval.

```sql
CREATE TABLE file_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  tokens INTEGER NOT NULL,
  
  -- Vector embedding (for semantic search)
  openai_embedding vector(1536),
  local_embedding vector(384),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

**Indexes:**
```sql
CREATE INDEX idx_file_items_file_id ON file_items(file_id);
-- Vector similarity search indexes
CREATE INDEX idx_file_items_openai_embedding ON file_items 
  USING ivfflat (openai_embedding vector_cosine_ops);
CREATE INDEX idx_file_items_local_embedding ON file_items 
  USING ivfflat (local_embedding vector_cosine_ops);
```

### collections

Grouped sets of files for organization.

```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  
  sharing sharing DEFAULT 'private',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

### collection_files

Many-to-many relationship between collections and files.

```sql
CREATE TABLE collection_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(collection_id, file_id)
);
```

## 🤖 AI Resources

### assistants

Custom AI assistants with specific instructions.

```sql
CREATE TABLE assistants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  instructions TEXT NOT NULL,
  
  -- Assistant configuration
  model TEXT NOT NULL,
  image_path TEXT DEFAULT '',
  include_profile_context BOOLEAN DEFAULT TRUE,
  include_workspace_instructions BOOLEAN DEFAULT TRUE,
  
  -- OpenAI Assistant integration
  openai_assistant_id TEXT,
  
  sharing sharing DEFAULT 'private',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

### prompts

Reusable prompt templates.

```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  
  sharing sharing DEFAULT 'private',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

### tools

Custom tools and functions for AI assistants.

```sql
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  url TEXT NOT NULL,
  schema JSONB NOT NULL,
  
  -- Tool configuration
  headers JSONB DEFAULT '{}',
  custom_headers TEXT DEFAULT '',
  
  sharing sharing DEFAULT 'private',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

### models

Custom model configurations.

```sql
CREATE TABLE models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  api_key TEXT NOT NULL,
  base_url TEXT NOT NULL,
  model_id TEXT NOT NULL,
  
  -- Model capabilities
  context_length INTEGER DEFAULT 4096,
  
  sharing sharing DEFAULT 'private',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

## 🔗 Relationship Tables

### assistant_files
```sql
CREATE TABLE assistant_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assistant_id UUID NOT NULL REFERENCES assistants(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  UNIQUE(assistant_id, file_id)
);
```

### assistant_tools
```sql
CREATE TABLE assistant_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assistant_id UUID NOT NULL REFERENCES assistants(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  UNIQUE(assistant_id, tool_id)
);
```

### chat_files
```sql
CREATE TABLE chat_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  UNIQUE(chat_id, file_id)
);
```

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:

### User Data Isolation
```sql
-- Example policy for chats table
CREATE POLICY "Users can only access own chats" ON chats
  FOR ALL USING (auth.uid() = user_id);
```

### Workspace Access Control
```sql
-- Users can access resources in workspaces they own or public ones
CREATE POLICY "Workspace resource access" ON files
  FOR SELECT USING (
    auth.uid() = user_id OR 
    workspace_id IN (
      SELECT id FROM workspaces 
      WHERE is_public = TRUE AND sharing_enabled = TRUE
    )
  );
```

### Role-Based Access
```sql
-- Admin users can access all data
CREATE POLICY "Admin access" ON profiles
  FOR ALL USING (
    auth.uid() = id OR 
    (SELECT roles FROM profiles WHERE id = auth.uid()) IN ('admin', 'superadmin')
  );
```

## 🔍 Indexes and Performance

### Key Indexes
```sql
-- User-based queries
CREATE INDEX idx_user_workspaces ON workspaces(user_id);
CREATE INDEX idx_user_chats ON chats(user_id);
CREATE INDEX idx_user_files ON files(user_id);

-- Workspace-based queries
CREATE INDEX idx_workspace_chats ON chats(workspace_id);
CREATE INDEX idx_workspace_files ON files(workspace_id);

-- Time-based queries
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_chats_updated_at ON chats(updated_at);

-- Vector similarity search
CREATE INDEX idx_openai_embeddings ON file_items 
  USING ivfflat (openai_embedding vector_cosine_ops);
```

## 🔄 Triggers and Functions

### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Auto-create home workspace
```sql
CREATE OR REPLACE FUNCTION create_profile_and_workspace()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles(id, display_name, bio, image_path, image_url)
  VALUES(NEW.id, '', '', '', '');

  -- Create home workspace
  INSERT INTO public.workspaces(user_id, is_home, name, default_model, description)
  VALUES(NEW.id, TRUE, 'Home', 'gpt-4-1106-preview', 'My home workspace.');

  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_profile_and_workspace_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_and_workspace();
```

## 📊 Analytics Views

### User activity summary
```sql
CREATE VIEW user_activity_summary AS
SELECT 
  p.id,
  p.display_name,
  COUNT(DISTINCT c.id) as total_chats,
  COUNT(DISTINCT m.id) as total_messages,
  COUNT(DISTINCT f.id) as total_files,
  MAX(m.created_at) as last_activity
FROM profiles p
LEFT JOIN chats c ON p.id = c.user_id
LEFT JOIN messages m ON c.id = m.chat_id
LEFT JOIN files f ON p.id = f.user_id
GROUP BY p.id, p.display_name;
```

### Workspace usage stats
```sql
CREATE VIEW workspace_usage_stats AS
SELECT 
  w.id,
  w.name,
  w.user_id,
  COUNT(DISTINCT c.id) as chat_count,
  COUNT(DISTINCT f.id) as file_count,
  COUNT(DISTINCT a.id) as assistant_count,
  SUM(m.prompt_tokens + m.completion_tokens) as total_tokens
FROM workspaces w
LEFT JOIN chats c ON w.id = c.workspace_id
LEFT JOIN files f ON w.id = f.workspace_id
LEFT JOIN assistants a ON w.id = a.workspace_id
LEFT JOIN messages m ON c.id = m.chat_id
GROUP BY w.id, w.name, w.user_id;
```
