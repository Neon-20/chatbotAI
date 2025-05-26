# API Reference

DomusAI provides a comprehensive REST API for managing chats, workspaces, files, and AI interactions.

## 🔐 Authentication

All API requests require authentication using Supabase JWT tokens.

### Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Getting a Token
```javascript
import { supabase } from '@/lib/supabase/browser-client'

const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token
```

## 📡 Base URL

```
Production: https://api.domusai.com
Development: http://localhost:3000/api
```

## 🗨️ Chat API

### Send Message

Send a message to an AI model and receive a streaming response.

```http
POST /api/chat
```

**Request Body:**
```json
{
  "chatSettings": {
    "model": "gpt-4",
    "temperature": 0.7,
    "contextLength": 4096,
    "systemPrompt": "You are a helpful assistant."
  },
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "selectedAssistant": null,
  "customModelId": null,
  "workspaceInstructions": "",
  "messageFileItems": [],
  "isRegeneration": false
}
```

**Response:**
```
Content-Type: text/plain; charset=utf-8
Transfer-Encoding: chunked

data: {"type":"token","content":"Hello"}
data: {"type":"token","content":"!"}
data: {"type":"token","content":" I'm"}
data: {"type":"done"}
```

**Error Response:**
```json
{
  "error": "Invalid model specified",
  "code": "INVALID_MODEL",
  "details": {
    "availableModels": ["gpt-4", "gpt-3.5-turbo", "claude-3"]
  }
}
```

### Get Chat History

Retrieve messages for a specific chat.

```http
GET /api/chat/{chatId}/messages
```

**Parameters:**
- `chatId` (string): The chat identifier
- `limit` (number, optional): Number of messages to return (default: 50)
- `offset` (number, optional): Pagination offset (default: 0)

**Response:**
```json
{
  "messages": [
    {
      "id": "msg_123",
      "role": "user",
      "content": "Hello",
      "created_at": "2024-01-15T10:30:00Z",
      "file_items": []
    },
    {
      "id": "msg_124",
      "role": "assistant",
      "content": "Hello! How can I help you today?",
      "created_at": "2024-01-15T10:30:05Z",
      "model": "gpt-4"
    }
  ],
  "total": 2,
  "hasMore": false
}
```

## 🏢 Workspace API

### List Workspaces

Get all workspaces for the authenticated user.

```http
GET /api/workspaces
```

**Response:**
```json
{
  "workspaces": [
    {
      "id": "ws_123",
      "name": "Home",
      "description": "My personal workspace",
      "is_home": true,
      "default_model": "gpt-4",
      "default_temperature": 0.7,
      "created_at": "2024-01-01T00:00:00Z",
      "user_id": "user_123"
    }
  ]
}
```

### Create Workspace

Create a new workspace.

```http
POST /api/workspaces
```

**Request Body:**
```json
{
  "name": "Project Alpha",
  "description": "Workspace for Project Alpha development",
  "default_model": "gpt-4",
  "default_temperature": 0.7,
  "default_context_length": 4096,
  "instructions": "Focus on software development tasks",
  "include_profile_context": true,
  "include_workspace_instructions": true
}
```

**Response:**
```json
{
  "workspace": {
    "id": "ws_456",
    "name": "Project Alpha",
    "description": "Workspace for Project Alpha development",
    "is_home": false,
    "default_model": "gpt-4",
    "created_at": "2024-01-15T10:30:00Z",
    "user_id": "user_123"
  }
}
```

### Update Workspace

Update an existing workspace.

```http
PUT /api/workspaces/{workspaceId}
```

**Request Body:**
```json
{
  "name": "Updated Project Alpha",
  "description": "Updated description",
  "default_model": "claude-3"
}
```

### Delete Workspace

Delete a workspace and all its contents.

```http
DELETE /api/workspaces/{workspaceId}
```

**Response:**
```json
{
  "success": true,
  "message": "Workspace deleted successfully"
}
```

## 📁 File API

### Upload File

Upload a file for use in chats.

```http
POST /api/files/upload
```

**Request:**
```http
Content-Type: multipart/form-data

file: <binary_data>
workspaceId: ws_123
name: document.pdf
description: Important document
```

**Response:**
```json
{
  "file": {
    "id": "file_123",
    "name": "document.pdf",
    "description": "Important document",
    "type": "pdf",
    "size": 1024000,
    "file_path": "files/user_123/document.pdf",
    "created_at": "2024-01-15T10:30:00Z",
    "workspace_id": "ws_123"
  }
}
```

### List Files

Get all files in a workspace.

```http
GET /api/files?workspaceId={workspaceId}
```

**Response:**
```json
{
  "files": [
    {
      "id": "file_123",
      "name": "document.pdf",
      "type": "pdf",
      "size": 1024000,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Delete File

Delete a file and its associated data.

```http
DELETE /api/files/{fileId}
```

## 🤖 Assistant API

### List Assistants

Get all assistants in a workspace.

```http
GET /api/assistants?workspaceId={workspaceId}
```

**Response:**
```json
{
  "assistants": [
    {
      "id": "asst_123",
      "name": "Code Reviewer",
      "description": "Specialized in code review and optimization",
      "instructions": "You are an expert code reviewer...",
      "model": "gpt-4",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Create Assistant

Create a new AI assistant.

```http
POST /api/assistants
```

**Request Body:**
```json
{
  "name": "Data Analyst",
  "description": "Specialized in data analysis and visualization",
  "instructions": "You are an expert data analyst...",
  "model": "gpt-4",
  "workspaceId": "ws_123",
  "tools": ["code_interpreter", "retrieval"]
}
```

## 🔍 Retrieval API

### Search Files

Search through uploaded files using semantic search.

```http
POST /api/retrieval/search
```

**Request Body:**
```json
{
  "query": "machine learning algorithms",
  "workspaceId": "ws_123",
  "fileIds": ["file_123", "file_456"],
  "limit": 10
}
```

**Response:**
```json
{
  "results": [
    {
      "fileId": "file_123",
      "fileName": "ml_guide.pdf",
      "content": "Machine learning algorithms are...",
      "similarity": 0.95,
      "page": 5
    }
  ]
}
```

## 👤 User API

### Get Profile

Get the current user's profile.

```http
GET /api/user/profile
```

**Response:**
```json
{
  "profile": {
    "id": "user_123",
    "display_name": "John Doe",
    "bio": "Software developer",
    "image_url": "https://...",
    "roles": "user",
    "has_onboarded": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Update Profile

Update user profile information.

```http
PUT /api/user/profile
```

**Request Body:**
```json
{
  "display_name": "Jane Doe",
  "bio": "Senior Software Developer",
  "profile_context": "I work primarily with React and Node.js"
}
```

## 📊 Analytics API

### Get Usage Stats

Get usage statistics for the current user.

```http
GET /api/analytics/usage
```

**Parameters:**
- `period` (string): "day", "week", "month", "year"
- `workspaceId` (string, optional): Filter by workspace

**Response:**
```json
{
  "stats": {
    "totalMessages": 1250,
    "totalChats": 45,
    "totalFiles": 12,
    "tokensUsed": 125000,
    "period": "month"
  },
  "breakdown": {
    "byModel": {
      "gpt-4": 800,
      "gpt-3.5-turbo": 300,
      "claude-3": 150
    },
    "byDay": [
      {"date": "2024-01-01", "messages": 25},
      {"date": "2024-01-02", "messages": 30}
    ]
  }
}
```

## ⚙️ Admin API

### List Users (Admin Only)

Get all users in the system.

```http
GET /api/admin/users
```

**Headers:**
```http
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
{
  "users": [
    {
      "id": "user_123",
      "display_name": "John Doe",
      "email": "john@example.com",
      "roles": "user",
      "created_at": "2024-01-01T00:00:00Z",
      "last_active": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 50
}
```

### Update User Role

Change a user's role.

```http
PUT /api/admin/users/{userId}/role
```

**Request Body:**
```json
{
  "role": "admin"
}
```

## 🚨 Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Invalid or missing authentication |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid request data |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

## 📝 Rate Limiting

API requests are rate limited:
- **Free tier**: 100 requests/hour
- **Pro tier**: 1000 requests/hour
- **Enterprise**: Custom limits

Rate limit headers:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642262400
```

## 🔧 SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @domusai/sdk
```

```javascript
import { DomusAI } from '@domusai/sdk'

const client = new DomusAI({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.domusai.com'
})

const response = await client.chat.send({
  messages: [{ role: 'user', content: 'Hello!' }],
  model: 'gpt-4'
})
```

### Python

```bash
pip install domusai
```

```python
from domusai import DomusAI

client = DomusAI(api_key="your_api_key")

response = client.chat.send(
    messages=[{"role": "user", "content": "Hello!"}],
    model="gpt-4"
)
```
