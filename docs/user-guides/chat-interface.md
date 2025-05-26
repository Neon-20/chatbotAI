# Chat Interface Guide

The DomusAI chat interface is designed to provide an intuitive and powerful way to interact with AI models. This guide covers all features and functionality.

## 🎯 Interface Overview

### Main Components

The chat interface consists of several key areas:

1. **Chat Header** - Shows current chat name and selected model
2. **Message Area** - Displays conversation history
3. **Input Area** - Where you type messages and upload files
4. **Sidebar** - Navigation and resource management
5. **Suggestion Tiles** - Quick access to common prompts

### Navigation

- **Sidebar Toggle**: Press `S` or click the hamburger menu
- **New Chat**: Press `O` or click the "+" button
- **Focus Input**: Press `/` to focus the chat input
- **Command Palette**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows)

## 💬 Starting Conversations

### Creating a New Chat

1. Click the "+" button in the sidebar
2. Or use the keyboard shortcut `O`
3. The chat will start with your workspace's default settings

### Selecting AI Models

Choose from various AI models based on your needs:

**General Purpose:**
- **GPT-4** - Most capable, best for complex tasks
- **GPT-3.5 Turbo** - Fast and efficient for most tasks
- **Claude 3** - Excellent for analysis and writing

**Specialized:**
- **GPT-4 Vision** - Can analyze images
- **Code Llama** - Optimized for programming
- **Gemini Pro** - Google's latest model

To change models:
1. Click the model selector in the chat settings
2. Choose your preferred model
3. The change applies to new messages

### Using Suggestion Tiles

The homepage features 6 suggestion tiles for common tasks:

1. **Rewrite Text** - Improve and paraphrase content
2. **Summarize** - Create concise summaries
3. **Translate** - Convert between languages
4. **Code Review** - Analyze and improve code
5. **Email Draft** - Create professional emails
6. **Meeting Notes** - Organize meeting information

**How to use:**
- Click any tile to auto-fill the prompt
- Tiles with variables will open a dialog for input
- Simple tiles auto-submit immediately

## ✍️ Composing Messages

### Text Input

The chat input supports:
- **Auto-resize** - Expands as you type
- **Markdown** - Use `**bold**`, `*italic*`, `code`
- **Line breaks** - Shift+Enter for new lines
- **Send** - Enter to send (or click send button)

### Formatting Options

DomusAI supports rich text formatting:

```markdown
**Bold text**
*Italic text*
`Inline code`
```

```
Code blocks with syntax highlighting
```

> Blockquotes for emphasis

- Bullet lists
- With multiple items

1. Numbered lists
2. For ordered content

[Links](https://example.com)
```

### Message Length

- **Recommended**: Keep messages under 2000 characters
- **Maximum**: 8000 characters per message
- **Context**: Longer conversations may hit model limits

## 📎 File Attachments

### Supported File Types

**Documents:**
- PDF (.pdf)
- Word Documents (.docx)
- Text Files (.txt, .md)
- Rich Text (.rtf)

**Spreadsheets:**
- Excel (.xlsx)
- CSV (.csv)
- Google Sheets (via export)

**Images:**
- PNG, JPG, JPEG, GIF
- WebP, SVG
- Maximum 10MB per image

**Code Files:**
- Most programming languages
- Configuration files
- Scripts and notebooks

### Uploading Files

**Drag and Drop:**
1. Drag files from your computer
2. Drop them onto the chat interface
3. Files are automatically processed

**Click to Upload:**
1. Click the attachment button (📎)
2. Select files from the file picker
3. Multiple files can be selected

**File Processing:**
- Documents are extracted and vectorized
- Images are analyzed for content
- Code files are syntax highlighted
- Processing time varies by file size

### Working with Files

Once uploaded, you can:
- **Ask questions** about file content
- **Request summaries** of documents
- **Analyze data** in spreadsheets
- **Review code** for improvements
- **Extract information** from images

**Example prompts:**
```
"Summarize the key points from this document"
"What are the main findings in this spreadsheet?"
"Review this code for potential bugs"
"What does this image show?"
```

## 🎨 Message Display

### Message Types

**User Messages:**
- Appear on the right side
- Blue background
- Show timestamp on hover

**AI Messages:**
- Appear on the left side
- Gray background
- Include model name and token count

**System Messages:**
- Centered, italic text
- Used for notifications and status

### Message Actions

Each message has action buttons:

**Copy** (📋)
- Copy message content to clipboard
- Preserves formatting

**Edit** (✏️)
- Edit your own messages
- Regenerates AI response after edit

**Delete** (🗑️)
- Remove message from chat
- Cannot be undone

**Regenerate** (🔄)
- Get a new AI response
- Only available for AI messages

**Speak** (🔊)
- Text-to-speech for AI responses
- Uses browser's speech synthesis

### Code Blocks

Code in messages is automatically highlighted:

```python
def hello_world():
    print("Hello, DomusAI!")
```

**Features:**
- Syntax highlighting for 100+ languages
- Copy button for easy copying
- Line numbers for reference
- Proper indentation preservation

## ⚙️ Chat Settings

Access chat settings via the gear icon (⚙️):

### Model Configuration

**Temperature** (0.0 - 1.0)
- Controls AI creativity and randomness
- 0.0 = Deterministic, focused
- 1.0 = Creative, varied
- Default: 0.7

**Context Length**
- How much conversation history to include
- Options: 1K, 2K, 4K, 8K, 16K, 32K tokens
- Longer context = better memory, slower responses

**System Prompt**
- Custom instructions for the AI
- Defines AI personality and behavior
- Examples: "You are a helpful coding assistant"

### Advanced Settings

**Include Profile Context**
- Uses your profile information for personalization
- Helps AI understand your background

**Include Workspace Instructions**
- Applies workspace-specific guidelines
- Useful for team consistency

**Retrieval Settings**
- Enable file-based retrieval
- Set number of relevant chunks to include
- Adjust similarity threshold

## 🔍 Search and Navigation

### Message Search

Find specific messages in your chat:
1. Press `Cmd+F` (Mac) or `Ctrl+F` (Windows)
2. Type your search term
3. Navigate through results

### Chat History

Access previous conversations:
- **Recent Chats** - Listed in sidebar
- **Search Chats** - Use the search bar
- **Filter by Date** - Sort by creation or update time
- **Archive Old Chats** - Messages older than 30 days are archived

### Bookmarking

Save important messages:
1. Click the bookmark icon on any message
2. Access bookmarks in the sidebar
3. Organize with custom tags

## 🎯 Productivity Features

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift+Enter` | New line |
| `/` | Focus input |
| `O` | New chat |
| `S` | Toggle sidebar |
| `Cmd+K` | Command palette |
| `Cmd+Z` | Undo last action |

### Quick Actions

**Message Templates:**
- Save frequently used prompts
- Access via `/` command
- Customize with variables

**Batch Operations:**
- Select multiple messages
- Delete or export in bulk
- Apply actions to selection

### Export Options

Export your conversations:
- **Markdown** - For documentation
- **PDF** - For sharing
- **JSON** - For data analysis
- **HTML** - For web viewing

## 🔊 Accessibility Features

### Screen Reader Support

- Full ARIA label support
- Semantic HTML structure
- Keyboard navigation
- Focus management

### Visual Accessibility

- High contrast mode
- Adjustable font sizes
- Color blind friendly palette
- Reduced motion options

### Audio Features

- Text-to-speech for AI responses
- Audio notifications for new messages
- Voice input (browser dependent)
- Keyboard sound feedback

## 📱 Mobile Experience

### Touch Gestures

- **Swipe left** - Open sidebar
- **Swipe right** - Close sidebar
- **Long press** - Message actions menu
- **Pull to refresh** - Reload chat

### Mobile Optimizations

- Responsive design for all screen sizes
- Touch-friendly button sizes
- Optimized keyboard handling
- Reduced data usage options

## 🔧 Troubleshooting

### Common Issues

**Messages not sending:**
- Check internet connection
- Verify API key configuration
- Try refreshing the page

**Files not uploading:**
- Check file size (max 10MB)
- Verify file type is supported
- Clear browser cache

**Slow responses:**
- Large context length increases response time
- Complex files take longer to process
- Try using a faster model

### Performance Tips

- Keep conversations focused
- Archive old chats regularly
- Limit file attachments per message
- Use appropriate context length

### Getting Help

- Click the help button (?) in the interface
- Check the status page for service issues
- Contact support for technical problems
- Join the community forum for tips

## 🎉 Advanced Tips

### Power User Features

**Custom Prompts:**
- Create reusable prompt templates
- Use variables for dynamic content
- Share prompts with team members

**Workflow Automation:**
- Chain multiple AI requests
- Use output from one as input to another
- Create complex analysis pipelines

**Integration Tips:**
- Connect with external tools
- Use webhooks for notifications
- Export data for further analysis

### Best Practices

1. **Be specific** in your requests
2. **Provide context** for better responses
3. **Break down complex tasks** into steps
4. **Use appropriate models** for different tasks
5. **Organize conversations** by topic or project

Ready to explore more? Check out our [Workspace Management Guide](./workspace-management.md) to learn about organizing your work!
