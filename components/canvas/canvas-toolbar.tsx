"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { WithTooltip } from "@/components/ui/with-tooltip"
import { useCanvas } from "./canvas-context"
import {
  Save,
  Undo,
  Redo,
  Download,
  Upload,
  Grid3X3,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Eye,
  Settings
} from "lucide-react"

export function CanvasToolbar() {
  const {
    state,
    history,
    undo,
    redo,
    save,
    exportCanvas,
    importCanvas,
    dispatch
  } = useCanvas()

  const handleZoomIn = () => {
    const newZoom = Math.min(state.viewport.zoom * 1.2, 5)
    dispatch({
      type: "UPDATE_VIEWPORT",
      payload: { zoom: newZoom }
    })
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(state.viewport.zoom / 1.2, 0.1)
    dispatch({
      type: "UPDATE_VIEWPORT",
      payload: { zoom: newZoom }
    })
  }

  const handleResetZoom = () => {
    dispatch({
      type: "UPDATE_VIEWPORT",
      payload: { zoom: 1, pan: { x: 0, y: 0 } }
    })
  }

  const handleToggleGrid = () => {
    dispatch({
      type: "UPDATE_VIEWPORT",
      payload: { showGrid: !state.viewport.showGrid }
    })
  }

  const handleExport = () => {
    const data = exportCanvas()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${state.name}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target?.result as string
          importCanvas(data)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  return (
    <div className="flex items-center gap-2 p-2">
      {/* File operations */}
      <div className="flex items-center gap-1">
        <WithTooltip
          display="Save Canvas"
          trigger={
            <Button
              variant="ghost"
              size="sm"
              onClick={save}
              className="size-8 p-0"
            >
              <Save className="size-4" />
            </Button>
          }
        />
        <WithTooltip
          display="Export Canvas"
          trigger={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="size-8 p-0"
            >
              <Download className="size-4" />
            </Button>
          }
        />
        <WithTooltip
          display="Import Canvas"
          trigger={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleImport}
              className="size-8 p-0"
            >
              <Upload className="size-4" />
            </Button>
          }
        />
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Edit operations */}
      <div className="flex items-center gap-1">
        <WithTooltip
          display="Undo"
          trigger={
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              className="size-8 p-0"
            >
              <Undo className="size-4" />
            </Button>
          }
        />
        <WithTooltip
          display="Redo"
          trigger={
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              className="size-8 p-0"
            >
              <Redo className="size-4" />
            </Button>
          }
        />
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* View operations */}
      <div className="flex items-center gap-1">
        <WithTooltip
          display="Zoom In"
          trigger={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="size-8 p-0"
            >
              <ZoomIn className="size-4" />
            </Button>
          }
        />
        <WithTooltip
          display="Zoom Out"
          trigger={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="size-8 p-0"
            >
              <ZoomOut className="size-4" />
            </Button>
          }
        />
        <WithTooltip
          display="Reset View"
          trigger={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
              className="size-8 p-0"
            >
              <RotateCcw className="size-4" />
            </Button>
          }
        />
        <WithTooltip
          display="Toggle Grid"
          trigger={
            <Button
              variant={state.viewport.showGrid ? "default" : "ghost"}
              size="sm"
              onClick={handleToggleGrid}
              className="size-8 p-0"
            >
              <Grid3X3 className="size-4" />
            </Button>
          }
        />
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Canvas info */}
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Zoom: {Math.round(state.viewport.zoom * 100)}%</span>
        <span>•</span>
        <span>Components: {Object.keys(state.components).length}</span>
      </div>

      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-1">
        <WithTooltip
          display="Preview"
          trigger={
            <Button variant="ghost" size="sm" className="size-8 p-0">
              <Eye className="size-4" />
            </Button>
          }
        />
        <WithTooltip
          display="Settings"
          trigger={
            <Button variant="ghost" size="sm" className="size-8 p-0">
              <Settings className="size-4" />
            </Button>
          }
        />
      </div>
    </div>
  )
}
