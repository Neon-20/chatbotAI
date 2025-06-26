"use client"

import { useCallback, useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { useCanvas } from "./canvas-context"
import { CanvasComponent as CanvasComponentType } from "@/types/canvas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CanvasComponentProps {
  component: CanvasComponentType
  isSelected: boolean
}

export function CanvasComponent({
  component,
  isSelected
}: CanvasComponentProps) {
  const { selectComponent, updateComponent } = useCanvas()
  const [isResizing, setIsResizing] = useState(false)

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: component.id,
      data: {
        type: "COMPONENT",
        id: component.id
      }
    })

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      selectComponent(component.id, e.ctrlKey || e.metaKey)
    },
    [component.id, selectComponent]
  )

  const handleResize = useCallback(
    (direction: string, e: React.MouseEvent) => {
      e.stopPropagation()
      setIsResizing(true)

      const startX = e.clientX
      const startY = e.clientY
      const startWidth = component.size.width
      const startHeight = component.size.height

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX
        const deltaY = e.clientY - startY

        let newWidth = startWidth
        let newHeight = startHeight

        if (direction.includes("right"))
          newWidth = Math.max(20, startWidth + deltaX)
        if (direction.includes("left"))
          newWidth = Math.max(20, startWidth - deltaX)
        if (direction.includes("bottom"))
          newHeight = Math.max(20, startHeight + deltaY)
        if (direction.includes("top"))
          newHeight = Math.max(20, startHeight - deltaY)

        updateComponent(component.id, {
          size: { width: newWidth, height: newHeight }
        })
      }

      const handleMouseUp = () => {
        setIsResizing(false)
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [component.id, component.size, updateComponent]
  )

  const renderComponent = () => {
    const commonProps = {
      className: cn(component.props.className),
      style: {
        ...component.style,
        width: "100%",
        height: "100%"
      }
    }

    try {
      switch (component.type) {
        case "button":
          return (
            <Button
              {...commonProps}
              variant={component.props.variant as any}
              size={component.props.size as any}
              disabled={component.props.disabled}
            >
              {component.props.text || "Button"}
            </Button>
          )

        case "text":
          return (
            <div
              {...commonProps}
              className={cn("flex items-center", commonProps.className)}
            >
              {component.props.text || "Text"}
            </div>
          )

        case "input":
          return (
            <Input
              {...commonProps}
              placeholder={component.props.placeholder}
              value={component.props.value as string}
              disabled={component.props.disabled}
            />
          )

        case "textarea":
          return (
            <Textarea
              {...commonProps}
              placeholder={component.props.placeholder}
              value={component.props.value as string}
              disabled={component.props.disabled}
            />
          )

        case "checkbox":
          return (
            <div
              className="flex items-center justify-center"
              style={{ width: "100%", height: "100%" }}
            >
              <Checkbox
                checked={component.props.checked}
                disabled={component.props.disabled}
              />
            </div>
          )

        case "radio":
          return (
            <div
              className="flex items-center justify-center"
              style={{ width: "100%", height: "100%" }}
            >
              <RadioGroup>
                <RadioGroupItem
                  value="option"
                  checked={component.props.checked}
                  disabled={component.props.disabled}
                />
              </RadioGroup>
            </div>
          )

        case "select":
          return (
            <Select
              value={component.props.value as string}
              disabled={component.props.disabled}
            >
              <SelectTrigger {...commonProps}>
                <SelectValue placeholder="Select option..." />
              </SelectTrigger>
              <SelectContent>
                {component.props.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )

        case "slider":
          return (
            <div
              className="flex items-center px-3"
              style={{ width: "100%", height: "100%" }}
            >
              <Slider
                value={[(component.props.value as number) || 50]}
                min={component.props.min || 0}
                max={component.props.max || 100}
                step={component.props.step || 1}
                disabled={component.props.disabled}
                className="flex-1"
              />
            </div>
          )

        case "switch":
          return (
            <div
              className="flex items-center justify-center"
              style={{ width: "100%", height: "100%" }}
            >
              <Switch
                checked={component.props.checked}
                disabled={component.props.disabled}
              />
            </div>
          )

        case "progress":
          return (
            <div
              className="flex items-center px-2"
              style={{ width: "100%", height: "100%" }}
            >
              <Progress
                value={(component.props.value as number) || 50}
                className="flex-1"
              />
            </div>
          )

        case "separator":
          return (
            <Separator
              {...commonProps}
              orientation={
                component.size.width > component.size.height
                  ? "horizontal"
                  : "vertical"
              }
            />
          )

        case "card":
          return (
            <Card {...commonProps} className={cn("p-4", commonProps.className)}>
              {component.props.text || "Card Content"}
            </Card>
          )

        case "badge":
          return (
            <div
              className="flex items-center justify-center"
              style={{ width: "100%", height: "100%" }}
            >
              <Badge variant={component.props.variant as any}>
                {component.props.text || "Badge"}
              </Badge>
            </div>
          )

        case "image":
          return (
            <img
              {...commonProps}
              src={component.props.src || "/placeholder.svg"}
              alt={component.props.alt || "Image"}
              className={cn("object-cover", commonProps.className)}
            />
          )

        case "container":
          return (
            <div
              {...commonProps}
              className={cn(
                "border-muted-foreground/30 border border-dashed",
                commonProps.className
              )}
            >
              {component.props.text || "Container"}
            </div>
          )

        case "dialog":
          return (
            <Card {...commonProps} className={cn("p-6", commonProps.className)}>
              <div className="mb-2 text-lg font-semibold">Dialog Title</div>
              <div className="text-muted-foreground text-sm">
                {component.props.text || "Dialog content goes here..."}
              </div>
            </Card>
          )

        default:
          return (
            <div
              {...commonProps}
              className={cn(
                "flex items-center justify-center border border-dashed border-red-500 bg-red-50 text-red-600",
                commonProps.className
              )}
            >
              Unknown: {component.type}
            </div>
          )
      }
    } catch (error) {
      console.error("Error rendering component:", error)
      return (
        <div
          className="flex items-center justify-center border border-dashed border-red-500 bg-red-50 p-2 text-xs text-red-600"
          style={{ width: "100%", height: "100%" }}
        >
          Error: {component.type}
        </div>
      )
    }
  }

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        left: component.position.x,
        top: component.position.y,
        width: component.size.width,
        height: component.size.height,
        zIndex: component.style.zIndex || component.layer,
        opacity: component.visible ? component.style.opacity || 1 : 0.3,
        ...style
      }}
      className={cn(
        "group",
        isSelected && "ring-primary ring-2 ring-offset-2",
        component.locked && "pointer-events-none opacity-50"
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${component.type} component: ${component.name}`}
      aria-selected={isSelected}
      aria-describedby={`component-${component.id}-description`}
      {...listeners}
      {...attributes}
    >
      {renderComponent()}

      {/* Selection handles */}
      {isSelected && !component.locked && (
        <>
          {/* Resize handles */}
          <div
            className="bg-primary absolute -bottom-1 -right-1 size-3 cursor-se-resize"
            onMouseDown={e => handleResize("bottom-right", e)}
          />
          <div
            className="bg-primary absolute -right-1 top-1/2 size-3 -translate-y-1/2 cursor-e-resize"
            onMouseDown={e => handleResize("right", e)}
          />
          <div
            className="bg-primary absolute -bottom-1 left-1/2 size-3 -translate-x-1/2 cursor-s-resize"
            onMouseDown={e => handleResize("bottom", e)}
          />

          {/* Component label */}
          <div className="bg-primary text-primary-foreground absolute -top-6 left-0 rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100">
            {component.name}
          </div>
        </>
      )}

      {/* Screen reader description */}
      <div id={`component-${component.id}-description`} className="sr-only">
        {component.type} component at position {component.position.x},{" "}
        {component.position.y} with size {component.size.width} by{" "}
        {component.size.height}
      </div>
    </div>
  )
}
