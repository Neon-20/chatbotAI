"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent
} from "@dnd-kit/core"
import { CanvasProvider, useCanvas } from "./canvas-context"
import { CanvasToolbar } from "./canvas-toolbar"
import { ComponentLibrary } from "./component-library"
import { CanvasArea } from "./canvas-area"
import { PropertiesPanel } from "./properties-panel"
import { LayerPanel } from "./layer-panel"
import {
  DragItem,
  CanvasComponentType,
  ComponentLibraryItem
} from "@/types/canvas"
import { CanvasErrorBoundary } from "./canvas-error-boundary"

function CanvasWorkspaceInner() {
  const [activeDragItem, setActiveDragItem] = useState<DragItem | null>(null)
  const [isClient, setIsClient] = useState(false)
  const {
    addComponent,
    updateComponent,
    state,
    undo,
    redo,
    save,
    deleteComponent,
    selectedComponents,
    clearSelection
  } = useCanvas()

  // Prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey

      if (isCtrlOrCmd) {
        switch (e.key.toLowerCase()) {
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
            break
          case "y":
            e.preventDefault()
            redo()
            break
          case "s":
            e.preventDefault()
            save()
            break
          case "a":
            e.preventDefault()
            // TODO: Select all components
            break
          case "d":
            e.preventDefault()
            // TODO: Duplicate selected components
            break
        }
      } else {
        switch (e.key) {
          case "Delete":
          case "Backspace":
            e.preventDefault()
            selectedComponents.forEach(component => {
              deleteComponent(component.id)
            })
            break
          case "Escape":
            e.preventDefault()
            clearSelection()
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [undo, redo, save, deleteComponent, selectedComponents, clearSelection])

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="bg-background flex size-full items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading Canvas...</div>
          <div className="text-muted-foreground mt-2 text-sm">
            Initializing design workspace
          </div>
        </div>
      </div>
    )
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveDragItem(active.data.current as DragItem)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDragItem(null)

    if (!over) return

    const dragData = active.data.current as DragItem

    if (dragData.type === "LIBRARY_ITEM" && over.id === "canvas-area") {
      // Calculate drop position
      const canvasElement = document.querySelector(
        "[data-canvas-area]"
      ) as HTMLElement
      if (!canvasElement) return

      const rect = canvasElement.getBoundingClientRect()
      const dropEvent = event.activatorEvent as PointerEvent

      // Calculate position relative to canvas with zoom and pan
      const x =
        (dropEvent.clientX - rect.left - state.viewport.pan.x) /
        state.viewport.zoom
      const y =
        (dropEvent.clientY - rect.top - state.viewport.pan.y) /
        state.viewport.zoom

      // Add component at drop position with default props
      if (dragData.componentType) {
        // Get the library item to access default props
        const libraryItem = (dragData as any)
          .libraryItem as ComponentLibraryItem
        addComponent(
          dragData.componentType,
          { x: Math.max(0, x), y: Math.max(0, y) },
          libraryItem?.defaultProps
        )
      }
    } else if (dragData.type === "COMPONENT" && over.id === "canvas-area") {
      // Handle component repositioning
      const canvasElement = document.querySelector(
        "[data-canvas-area]"
      ) as HTMLElement
      if (!canvasElement) return

      const rect = canvasElement.getBoundingClientRect()
      const dropEvent = event.activatorEvent as PointerEvent

      // Calculate new position
      const x =
        (dropEvent.clientX - rect.left - state.viewport.pan.x) /
        state.viewport.zoom
      const y =
        (dropEvent.clientY - rect.top - state.viewport.pan.y) /
        state.viewport.zoom

      // Update component position
      updateComponent(dragData.id, {
        position: { x, y }
      })
    }
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        className="bg-background flex size-full flex-col"
        role="application"
        aria-label="Canvas Design Interface"
      >
        {/* Toolbar */}
        <div
          className="border-border bg-card border-b"
          role="toolbar"
          aria-label="Canvas Actions"
        >
          <CanvasToolbar />
        </div>

        {/* Main workspace */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar - Component Library */}
          <div className="border-border bg-card hidden w-80 border-r lg:block">
            <ComponentLibrary />
          </div>

          {/* Center - Canvas Area */}
          <div className="bg-muted/20 min-w-0 flex-1">
            <CanvasArea />
          </div>

          {/* Right sidebar - Properties and Layers */}
          <div className="border-border bg-card hidden w-80 border-l xl:block">
            <div className="flex h-full flex-col">
              <div className="border-border flex-1 border-b">
                <PropertiesPanel />
              </div>
              <div className="h-64">
                <LayerPanel />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet responsive panels */}
        <div className="lg:hidden">
          {/* TODO: Add mobile-friendly component library and properties panels */}
        </div>

        {/* Keyboard shortcuts help */}
        <div className="sr-only" aria-live="polite">
          Canvas keyboard shortcuts: Ctrl+Z to undo, Ctrl+Y to redo, Ctrl+S to
          save, Delete to remove selected components, Escape to clear selection
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeDragItem && (
          <div
            className="bg-primary/10 rounded-md p-2 text-sm font-medium"
            role="img"
            aria-label={`Dragging ${activeDragItem.componentType || activeDragItem.id}`}
          >
            {activeDragItem.componentType || activeDragItem.id}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export function CanvasWorkspace() {
  return (
    <CanvasErrorBoundary>
      <CanvasProvider>
        <CanvasWorkspaceInner />
      </CanvasProvider>
    </CanvasErrorBoundary>
  )
}
