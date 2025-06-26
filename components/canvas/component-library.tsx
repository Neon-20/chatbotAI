"use client"

import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComponentLibraryItem, CanvasComponentType } from "@/types/canvas"
import {
  MousePointer2,
  Type,
  Square,
  Image,
  FileText,
  CheckSquare,
  Circle,
  ToggleLeft,
  BarChart3,
  Minus,
  Box,
  Tag,
  MessageSquare,
  ChevronDown,
  Search
} from "lucide-react"

const componentLibrary: ComponentLibraryItem[] = [
  // Basic Components
  {
    id: "button",
    type: "button",
    name: "Button",
    description: "Interactive button component",
    icon: MousePointer2,
    category: "basic",
    defaultProps: {
      size: { width: 100, height: 40 },
      props: { text: "Button" },
      style: { backgroundColor: "#dc2626", color: "#ffffff", borderRadius: 6 }
    }
  },
  {
    id: "text",
    type: "text",
    name: "Text",
    description: "Text display component",
    icon: Type,
    category: "basic",
    defaultProps: {
      size: { width: 120, height: 24 },
      props: { text: "Sample Text" },
      style: { fontSize: 16 }
    }
  },
  {
    id: "image",
    type: "image",
    name: "Image",
    description: "Image display component",
    icon: Image,
    category: "basic",
    defaultProps: {
      size: { width: 150, height: 100 },
      props: { src: "/placeholder.svg", alt: "Placeholder" },
      style: { borderRadius: 4 }
    }
  },
  {
    id: "card",
    type: "card",
    name: "Card",
    description: "Card container component",
    icon: Square,
    category: "layout",
    defaultProps: {
      size: { width: 200, height: 150 },
      style: { backgroundColor: "#ffffff", borderRadius: 8, padding: 16 }
    }
  },
  {
    id: "badge",
    type: "badge",
    name: "Badge",
    description: "Badge component for labels",
    icon: Tag,
    category: "basic",
    defaultProps: {
      size: { width: 80, height: 24 },
      props: { text: "Badge" },
      style: { backgroundColor: "#f1530d", color: "#ffffff", borderRadius: 12 }
    }
  },

  // Form Components
  {
    id: "input",
    type: "input",
    name: "Input",
    description: "Text input field",
    icon: FileText,
    category: "form",
    defaultProps: {
      size: { width: 200, height: 40 },
      props: { placeholder: "Enter text..." },
      style: { borderRadius: 4, padding: 8 }
    }
  },
  {
    id: "textarea",
    type: "textarea",
    name: "Textarea",
    description: "Multi-line text input",
    icon: FileText,
    category: "form",
    defaultProps: {
      size: { width: 200, height: 100 },
      props: { placeholder: "Enter text..." },
      style: { borderRadius: 4, padding: 8 }
    }
  },
  {
    id: "checkbox",
    type: "checkbox",
    name: "Checkbox",
    description: "Checkbox input",
    icon: CheckSquare,
    category: "form",
    defaultProps: {
      size: { width: 20, height: 20 },
      props: { checked: false }
    }
  },
  {
    id: "radio",
    type: "radio",
    name: "Radio",
    description: "Radio button input",
    icon: Circle,
    category: "form",
    defaultProps: {
      size: { width: 20, height: 20 },
      props: { checked: false }
    }
  },
  {
    id: "select",
    type: "select",
    name: "Select",
    description: "Dropdown select input",
    icon: ChevronDown,
    category: "form",
    defaultProps: {
      size: { width: 200, height: 40 },
      props: {
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
          { label: "Option 3", value: "3" }
        ]
      },
      style: { borderRadius: 4, padding: 8 }
    }
  },
  {
    id: "slider",
    type: "slider",
    name: "Slider",
    description: "Range slider input",
    icon: BarChart3,
    category: "form",
    defaultProps: {
      size: { width: 200, height: 20 },
      props: { min: 0, max: 100, value: 50 }
    }
  },
  {
    id: "switch",
    type: "switch",
    name: "Switch",
    description: "Toggle switch input",
    icon: ToggleLeft,
    category: "form",
    defaultProps: {
      size: { width: 44, height: 24 },
      props: { checked: false }
    }
  },

  // Layout Components
  {
    id: "container",
    type: "container",
    name: "Container",
    description: "Generic container component",
    icon: Box,
    category: "layout",
    defaultProps: {
      size: { width: 300, height: 200 },
      style: { backgroundColor: "#f8f9fa", borderRadius: 8, padding: 16 }
    }
  },
  {
    id: "separator",
    type: "separator",
    name: "Separator",
    description: "Visual separator line",
    icon: Minus,
    category: "layout",
    defaultProps: {
      size: { width: 200, height: 1 },
      style: { backgroundColor: "#e5e7eb" }
    }
  },

  // Feedback Components
  {
    id: "progress",
    type: "progress",
    name: "Progress",
    description: "Progress bar component",
    icon: BarChart3,
    category: "feedback",
    defaultProps: {
      size: { width: 200, height: 8 },
      props: { value: 50, max: 100 },
      style: { borderRadius: 4 }
    }
  },
  {
    id: "dialog",
    type: "dialog",
    name: "Dialog",
    description: "Modal dialog component",
    icon: MessageSquare,
    category: "feedback",
    defaultProps: {
      size: { width: 400, height: 300 },
      props: { text: "Dialog Content" },
      style: { backgroundColor: "#ffffff", borderRadius: 8, padding: 24 }
    }
  }
]

export function DraggableComponent({ item }: { item: ComponentLibraryItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: {
        type: "LIBRARY_ITEM",
        componentType: item.type,
        id: item.id,
        libraryItem: item
      }
    })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1
      }
    : undefined

  const IconComponent = item.icon

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="border-border bg-card hover:bg-accent/50 flex cursor-grab items-center gap-3 rounded-md border p-3 active:cursor-grabbing"
    >
      <div className="bg-primary/10 flex size-8 items-center justify-center rounded-md">
        <IconComponent className="text-primary size-4" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{item.name}</div>
        <div className="text-muted-foreground text-xs">{item.description}</div>
      </div>
    </div>
  )
}

export function ComponentLibrary() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredComponents = componentLibrary.filter(
    item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const componentsByCategory = {
    basic: filteredComponents.filter(item => item.category === "basic"),
    form: filteredComponents.filter(item => item.category === "form"),
    layout: filteredComponents.filter(item => item.category === "layout"),
    feedback: filteredComponents.filter(item => item.category === "feedback")
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-border border-b p-4">
        <h2 className="text-lg font-semibold">Components</h2>
        <div className="relative mt-3">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="basic" className="p-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="text-xs">
              Basic
            </TabsTrigger>
            <TabsTrigger value="form" className="text-xs">
              Form
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">
              Layout
            </TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs">
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-4 space-y-2">
            {componentsByCategory.basic.map(item => (
              <DraggableComponent key={item.id} item={item} />
            ))}
          </TabsContent>

          <TabsContent value="form" className="mt-4 space-y-2">
            {componentsByCategory.form.map(item => (
              <DraggableComponent key={item.id} item={item} />
            ))}
          </TabsContent>

          <TabsContent value="layout" className="mt-4 space-y-2">
            {componentsByCategory.layout.map(item => (
              <DraggableComponent key={item.id} item={item} />
            ))}
          </TabsContent>

          <TabsContent value="feedback" className="mt-4 space-y-2">
            {componentsByCategory.feedback.map(item => (
              <DraggableComponent key={item.id} item={item} />
            ))}
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  )
}
