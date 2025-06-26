"use client"

import { useRef, useCallback, useState, useEffect } from "react"
import { useDroppable } from "@dnd-kit/core"
import { useCanvas } from "./canvas-context"
import { CanvasComponent } from "./canvas-component"
import { CanvasPosition } from "@/types/canvas"

export function CanvasArea() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState<CanvasPosition>({
    x: 0,
    y: 0
  })

  const { state, dispatch, clearSelection, addComponent } = useCanvas()
  const { viewport, components, selectedComponentIds } = state

  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-area",
    data: {
      type: "CANVAS"
    }
  })

  // Handle canvas click for selection
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        clearSelection()
      }
    },
    [clearSelection]
  )

  // Handle mouse wheel for zooming
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        const newZoom = Math.min(Math.max(viewport.zoom * delta, 0.1), 5)

        dispatch({
          type: "UPDATE_VIEWPORT",
          payload: { zoom: newZoom }
        })
      }
    },
    [viewport.zoom, dispatch]
  )

  // Handle panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle mouse or Alt+Left mouse
      e.preventDefault()
      setIsPanning(true)
      setLastPanPoint({ x: e.clientX, y: e.clientY })
    }
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        const deltaX = e.clientX - lastPanPoint.x
        const deltaY = e.clientY - lastPanPoint.y

        dispatch({
          type: "UPDATE_VIEWPORT",
          payload: {
            pan: {
              x: viewport.pan.x + deltaX,
              y: viewport.pan.y + deltaY
            }
          }
        })

        setLastPanPoint({ x: e.clientX, y: e.clientY })
      }
    },
    [isPanning, lastPanPoint, viewport.pan, dispatch]
  )

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  // Handle drop from component library
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      // Calculate position relative to canvas with zoom and pan
      const x = (e.clientX - rect.left - viewport.pan.x) / viewport.zoom
      const y = (e.clientY - rect.top - viewport.pan.y) / viewport.zoom

      // This will be handled by the DndContext in canvas-workspace
      // The actual drop logic is in the canvas context
    },
    [viewport]
  )

  // Grid pattern
  const gridPattern = `
    <defs>
      <pattern id="grid" width="${viewport.gridSize * viewport.zoom}" height="${viewport.gridSize * viewport.zoom}" patternUnits="userSpaceOnUse">
        <path d="M ${viewport.gridSize * viewport.zoom} 0 L 0 0 0 ${viewport.gridSize * viewport.zoom}" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  `

  return (
    <div className="bg-background relative size-full overflow-hidden">
      <div
        ref={node => {
          canvasRef.current = node
          setNodeRef(node)
        }}
        data-canvas-area
        className={`cursor- relative size-full${isPanning ? "grabbing" : "default"} ${isOver ? "bg-primary/5" : ""}`}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        role="main"
        aria-label="Canvas design area"
        tabIndex={0}
        style={{
          transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})`,
          transformOrigin: "0 0"
        }}
      >
        {/* Grid */}
        {viewport.showGrid && (
          <svg
            className="text-muted-foreground pointer-events-none absolute inset-0 size-full"
            style={{
              transform: `translate(${-viewport.pan.x / viewport.zoom}px, ${-viewport.pan.y / viewport.zoom}px) scale(${1 / viewport.zoom})`
            }}
          >
            <defs>
              <pattern
                id="grid"
                width={viewport.gridSize}
                height={viewport.gridSize}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${viewport.gridSize} 0 L 0 0 0 ${viewport.gridSize}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        )}

        {/* Canvas components */}
        <div className="relative">
          {Object.values(components).map(component => (
            <CanvasComponent
              key={component.id}
              component={component}
              isSelected={selectedComponentIds.includes(component.id)}
            />
          ))}
        </div>

        {/* Drop indicator */}
        {isOver && (
          <div className="border-primary/50 bg-primary/5 pointer-events-none absolute inset-0 border-2 border-dashed" />
        )}
      </div>

      {/* Canvas info overlay */}
      <div className="bg-card/80 text-muted-foreground absolute bottom-4 left-4 rounded-md px-3 py-2 text-xs backdrop-blur-sm">
        <div>Zoom: {Math.round(viewport.zoom * 100)}%</div>
        <div>
          Pan: {Math.round(viewport.pan.x)}, {Math.round(viewport.pan.y)}
        </div>
        <div>Grid: {viewport.showGrid ? "On" : "Off"}</div>
      </div>

      {/* Instructions overlay */}
      {Object.keys(components).length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground text-center">
            <div className="text-lg font-medium">Welcome to Canvas</div>
            <div className="mt-2 text-sm">
              Drag components from the library to start building
            </div>
            <div className="mt-1 text-xs">
              • Ctrl/Cmd + Wheel to zoom • Alt + Drag to pan • Middle mouse to
              pan
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
