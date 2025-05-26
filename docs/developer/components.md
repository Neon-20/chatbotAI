# Component Library

DomusAI uses a comprehensive component library built with React, TypeScript, and Tailwind CSS, following Apple design principles and AlterDomus branding.

## 🎨 Design System

### Color Palette

```css
/* AlterDomus Brand Colors */
:root {
  --primary: #e84315;        /* AlterDomus Orange-Red */
  --primary-dark: #d32f2f;   /* Darker variant */
  --primary-light: #ff6b47;  /* Lighter variant */
  
  /* Semantic Colors */
  --background: #ffffff;
  --foreground: #0a0a0a;
  --muted: #f5f5f5;
  --muted-foreground: #737373;
  --border: #e5e5e5;
  --input: #ffffff;
  --ring: #e84315;
}

/* Dark Mode */
[data-theme="dark"] {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --muted: #262626;
  --muted-foreground: #a3a3a3;
  --border: #404040;
  --input: #262626;
}
```

### Typography

```css
/* Font Stack */
.font-sans {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Text Sizes */
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
```

## 🧩 Core Components

### Button

Versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui/button"

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔥</Button>
```

**Props:**
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}
```

### Input

Styled input component with validation states.

```tsx
import { Input } from "@/components/ui/input"

// Basic usage
<Input placeholder="Enter text..." />

// With label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="john@example.com" />
</div>

// Error state
<Input className="border-red-500" placeholder="Invalid input" />
```

### Card

Container component for grouping related content.

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog

Modal dialog component for overlays and forms.

```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <div className="py-4">
      Dialog content goes here
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## 💬 Chat Components

### ChatUI

Main chat interface component.

```tsx
import { ChatUI } from "@/components/chat/chat-ui"

<ChatUI />
```

**Features:**
- Message display with markdown rendering
- Streaming response handling
- File attachment display
- Scroll management
- Print functionality

### ChatInput

Message input component with file upload and suggestions.

```tsx
import { ChatInput } from "@/components/chat/chat-input"

<ChatInput />
```

**Features:**
- Auto-resizing textarea
- File drag-and-drop
- Keyboard shortcuts
- Command suggestions
- Send button with loading state

### ChatMessages

Displays conversation history with proper formatting.

```tsx
import { ChatMessages } from "@/components/chat/chat-messages"

<ChatMessages />
```

**Features:**
- Message bubbles with role-based styling
- Markdown rendering with syntax highlighting
- Code block copy functionality
- Image display
- Timestamp formatting

### SuggestionTiles

Interactive suggestion tiles for quick prompts.

```tsx
import SuggestionTiles from "@/components/chat/suggestion-tiles"

<SuggestionTiles />
```

**Features:**
- Static predefined suggestions
- AlterDomus brand styling
- Hover animations
- Variable handling for dynamic prompts
- Auto-submission for simple prompts

```tsx
// Customizing suggestion content
const customSuggestions = [
  {
    name: "Custom Prompt",
    content: "Your custom prompt here with {{VARIABLE}}",
    iconName: "FileText",
    tooltip: "Custom tooltip"
  }
]
```

### MessageActions

Action buttons for individual messages.

```tsx
import { MessageActions } from "@/components/messages/message-actions"

<MessageActions 
  message={message}
  onCopy={() => {}}
  onEdit={() => {}}
  onDelete={() => {}}
  onRegenerate={() => {}}
/>
```

**Features:**
- Copy message content
- Edit user messages
- Delete messages
- Regenerate AI responses
- Text-to-speech functionality

## 🗂️ Sidebar Components

### Sidebar

Main navigation sidebar with tabbed content.

```tsx
import { Sidebar } from "@/components/sidebar/sidebar"

<Sidebar contentType="chats" showSidebar={true} />
```

**Content Types:**
- `chats` - Chat history
- `files` - File management
- `prompts` - Saved prompts
- `assistants` - AI assistants
- `tools` - Custom tools
- `models` - Model configurations

### SidebarSwitcher

Tab switcher for sidebar content.

```tsx
import { SidebarSwitcher } from "@/components/sidebar/sidebar-switcher"

<SidebarSwitcher onContentTypeChange={setContentType} />
```

### WorkspaceSwitcher

Dropdown for switching between workspaces.

```tsx
import { WorkspaceSwitcher } from "@/components/utility/workspace-switcher"

<WorkspaceSwitcher />
```

## 🎛️ Form Components

### TextareaAutosize

Auto-resizing textarea component.

```tsx
import { TextareaAutosize } from "@/components/ui/textarea-autosize"

<TextareaAutosize
  placeholder="Enter your message..."
  minRows={1}
  maxRows={10}
  onValueChange={(value) => console.log(value)}
/>
```

### Select

Dropdown select component.

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select onValueChange={(value) => console.log(value)}>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Switch

Toggle switch component.

```tsx
import { Switch } from "@/components/ui/switch"

<Switch 
  checked={enabled}
  onCheckedChange={setEnabled}
/>
```

## 📊 Analytics Components

### Chart Components

Various chart components for analytics dashboard.

```tsx
import { ChartArea } from "@/components/analytics/chart-area"
import { ChartBar } from "@/components/analytics/chart-bar"
import { ChartLine } from "@/components/analytics/chart-line"
import { ChartPie } from "@/components/analytics/chart-pie"

// Area chart for cumulative data
<ChartArea 
  data={chartData}
  title="Messages Over Time"
  description="Daily message count"
/>

// Bar chart for comparisons
<ChartBar 
  data={modelUsage}
  title="Model Usage"
  description="Messages by AI model"
/>

// Line chart for trends
<ChartLine 
  data={growthData}
  title="User Growth"
  description="New users per month"
/>

// Pie chart for distributions
<ChartPie 
  data={fileTypes}
  title="File Types"
  description="Distribution of uploaded files"
/>
```

### KeyMetrics

Dashboard metrics display component.

```tsx
import { KeyMetrics } from "@/components/analytics/key-metrics"

<KeyMetrics 
  totalUsers={1250}
  totalMessages={45000}
  totalFiles={890}
  activeUsers={320}
/>
```

## 🎨 Utility Components

### WithTooltip

Wrapper component for adding tooltips.

```tsx
import { WithTooltip } from "@/components/ui/with-tooltip"

<WithTooltip content="This is a tooltip">
  <Button>Hover me</Button>
</WithTooltip>
```

### FancyTooltip

Enhanced tooltip with custom styling.

```tsx
import { FancyTooltip } from "@/components/ui/fancy-tooltip"

<FancyTooltip 
  content={<p>Rich tooltip content</p>}
  side="top"
  delayDuration={300}
  className="max-w-[220px]"
>
  <Button>Fancy tooltip</Button>
</FancyTooltip>
```

### Brand

Logo component with theme variants.

```tsx
import { Brand } from "@/components/ui/brand"

<Brand theme="light" />
<Brand theme="dark" />
```

### ScreenLoader

Full-screen loading component.

```tsx
import { ScreenLoader } from "@/components/ui/screen-loader"

<ScreenLoader />
```

## 🎭 Animation Components

### Motion Components

Framer Motion enhanced components.

```tsx
import { motion } from "framer-motion"

// Animated card
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  <Card>Content</Card>
</motion.div>

// Fade in animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <Content />
</motion.div>
```

### AnimatedTooltip

Tooltip with avatar stack animation.

```tsx
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"

<AnimatedTooltip 
  items={[
    { id: 1, name: "John Doe", designation: "Developer", image: "/avatar1.jpg" },
    { id: 2, name: "Jane Smith", designation: "Designer", image: "/avatar2.jpg" }
  ]}
/>
```

## 🎯 Custom Hooks

### useChatHandler

Hook for managing chat functionality.

```tsx
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"

const { 
  handleSendMessage,
  handleNewChat,
  handleFocusChatInput,
  isGenerating 
} = useChatHandler()
```

### useScroll

Hook for scroll management in chat.

```tsx
import { useScroll } from "@/components/chat/chat-hooks/use-scroll"

const {
  messagesStartRef,
  messagesEndRef,
  handleScroll,
  scrollToBottom,
  isAtBottom,
  isOverflowing
} = useScroll()
```

### useHotkey

Hook for keyboard shortcuts.

```tsx
import useHotkey from "@/lib/hooks/use-hotkey"

useHotkey("s", () => toggleSidebar())
useHotkey("cmd+k", () => openCommandPalette())
```

## 🎨 Styling Guidelines

### Tailwind Classes

Common utility classes used throughout the application:

```css
/* Layout */
.flex-center { @apply flex items-center justify-center; }
.flex-between { @apply flex items-center justify-between; }
.absolute-center { @apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2; }

/* Spacing */
.space-y-4 > * + * { margin-top: 1rem; }
.space-x-2 > * + * { margin-left: 0.5rem; }

/* Borders */
.border-primary { border-color: #e84315; }
.border-muted { border-color: #e5e5e5; }

/* Backgrounds */
.bg-gradient-primary { 
  background: linear-gradient(90deg, #e84315, #FF6B00, #e84315);
}
.bg-glass { 
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
```

### Component Variants

Using `class-variance-authority` for component variants:

```tsx
import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## 📱 Responsive Design

### Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Mobile-First Approach

```tsx
// Responsive classes
<div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
  Responsive width
</div>

// Hide/show on different screens
<div className="hidden md:block">
  Desktop only
</div>

<div className="block md:hidden">
  Mobile only
</div>
```

## ♿ Accessibility

### ARIA Labels

```tsx
<Button aria-label="Send message">
  <SendIcon />
</Button>

<Input aria-describedby="email-error" />
<div id="email-error" role="alert">
  Please enter a valid email
</div>
```

### Keyboard Navigation

```tsx
// Focus management
<Dialog onOpenChange={(open) => {
  if (open) {
    setTimeout(() => inputRef.current?.focus(), 0)
  }
}}>
```

### Screen Reader Support

```tsx
<div className="sr-only">
  Screen reader only content
</div>

<img src="..." alt="Descriptive alt text" />
```

This component library provides a solid foundation for building consistent, accessible, and beautiful user interfaces in DomusAI while maintaining the AlterDomus brand identity and Apple-inspired design principles.
