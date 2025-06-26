"use client"

import { useCanvas } from "./canvas-context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Trash2, Copy, Lock, Unlock, Eye, EyeOff } from "lucide-react"

export function PropertiesPanel() {
  const { selectedComponents, updateComponent, deleteComponent } = useCanvas()
  const selectedComponent = selectedComponents[0] // For now, handle single selection

  if (!selectedComponent) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-border border-b p-4">
          <h2 className="text-lg font-semibold">Properties</h2>
        </div>
        <div className="text-muted-foreground flex flex-1 items-center justify-center text-center">
          <div>
            <div className="text-sm">No component selected</div>
            <div className="mt-1 text-xs">
              Select a component to edit its properties
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handlePropertyChange = (property: string, value: any) => {
    if (property.startsWith("style.")) {
      const styleProp = property.replace("style.", "")
      updateComponent(selectedComponent.id, {
        style: {
          ...selectedComponent.style,
          [styleProp]: value
        }
      })
    } else if (property.startsWith("props.")) {
      const propName = property.replace("props.", "")
      updateComponent(selectedComponent.id, {
        props: {
          ...selectedComponent.props,
          [propName]: value
        }
      })
    } else if (property.startsWith("position.")) {
      const positionProp = property.replace("position.", "")
      updateComponent(selectedComponent.id, {
        position: {
          ...selectedComponent.position,
          [positionProp]: Number(value)
        }
      })
    } else if (property.startsWith("size.")) {
      const sizeProp = property.replace("size.", "")
      updateComponent(selectedComponent.id, {
        size: {
          ...selectedComponent.size,
          [sizeProp]: Number(value)
        }
      })
    } else {
      updateComponent(selectedComponent.id, {
        [property]: value
      })
    }
  }

  const handleDelete = () => {
    deleteComponent(selectedComponent.id)
  }

  const handleDuplicate = () => {
    // TODO: Implement duplication
    console.log("Duplicate component:", selectedComponent.id)
  }

  const toggleLock = () => {
    handlePropertyChange("locked", !selectedComponent.locked)
  }

  const toggleVisibility = () => {
    handlePropertyChange("visible", !selectedComponent.visible)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-border border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Properties</h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVisibility}
              className="size-8 p-0"
            >
              {selectedComponent.visible ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLock}
              className="size-8 p-0"
            >
              {selectedComponent.locked ? (
                <Lock className="size-4" />
              ) : (
                <Unlock className="size-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDuplicate}
              className="size-8 p-0"
            >
              <Copy className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive size-8 p-0"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
        <div className="text-muted-foreground mt-2 text-sm">
          {selectedComponent.type} • {selectedComponent.name}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="content" className="p-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="component-name">Name</Label>
              <Input
                id="component-name"
                value={selectedComponent.name}
                onChange={e => handlePropertyChange("name", e.target.value)}
              />
            </div>

            {/* Component-specific content properties */}
            {(selectedComponent.type === "button" ||
              selectedComponent.type === "text" ||
              selectedComponent.type === "badge" ||
              selectedComponent.type === "card" ||
              selectedComponent.type === "container" ||
              selectedComponent.type === "dialog") && (
              <div className="space-y-2">
                <Label htmlFor="text-content">Text</Label>
                <Textarea
                  id="text-content"
                  value={selectedComponent.props.text || ""}
                  onChange={e =>
                    handlePropertyChange("props.text", e.target.value)
                  }
                  rows={3}
                />
              </div>
            )}

            {(selectedComponent.type === "input" ||
              selectedComponent.type === "textarea") && (
              <div className="space-y-2">
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                  id="placeholder"
                  value={selectedComponent.props.placeholder || ""}
                  onChange={e =>
                    handlePropertyChange("props.placeholder", e.target.value)
                  }
                />
              </div>
            )}

            {selectedComponent.type === "image" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="image-src">Image URL</Label>
                  <Input
                    id="image-src"
                    value={selectedComponent.props.src || ""}
                    onChange={e =>
                      handlePropertyChange("props.src", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-alt">Alt Text</Label>
                  <Input
                    id="image-alt"
                    value={selectedComponent.props.alt || ""}
                    onChange={e =>
                      handlePropertyChange("props.alt", e.target.value)
                    }
                  />
                </div>
              </>
            )}

            {(selectedComponent.type === "slider" ||
              selectedComponent.type === "progress") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    value={selectedComponent.props.value || 0}
                    onChange={e =>
                      handlePropertyChange(
                        "props.value",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                {selectedComponent.type === "slider" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="min">Min</Label>
                      <Input
                        id="min"
                        type="number"
                        value={selectedComponent.props.min || 0}
                        onChange={e =>
                          handlePropertyChange(
                            "props.min",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max">Max</Label>
                      <Input
                        id="max"
                        type="number"
                        value={selectedComponent.props.max || 100}
                        onChange={e =>
                          handlePropertyChange(
                            "props.max",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {(selectedComponent.type === "checkbox" ||
              selectedComponent.type === "switch" ||
              selectedComponent.type === "radio") && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="checked"
                  checked={selectedComponent.props.checked || false}
                  onCheckedChange={checked =>
                    handlePropertyChange("props.checked", checked)
                  }
                />
                <Label htmlFor="checked">Checked</Label>
              </div>
            )}
          </TabsContent>

          <TabsContent value="style" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bg-color">Background Color</Label>
              <Input
                id="bg-color"
                type="color"
                value={selectedComponent.style.backgroundColor || "#ffffff"}
                onChange={e =>
                  handlePropertyChange("style.backgroundColor", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="text-color">Text Color</Label>
              <Input
                id="text-color"
                type="color"
                value={selectedComponent.style.color || "#000000"}
                onChange={e =>
                  handlePropertyChange("style.color", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  value={[selectedComponent.style.fontSize || 16]}
                  onValueChange={([value]) =>
                    handlePropertyChange("style.fontSize", value)
                  }
                  min={8}
                  max={72}
                  step={1}
                  className="flex-1"
                />
                <span className="w-12 text-sm">
                  {selectedComponent.style.fontSize || 16}px
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="border-radius">Border Radius</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  value={[selectedComponent.style.borderRadius || 0]}
                  onValueChange={([value]) =>
                    handlePropertyChange("style.borderRadius", value)
                  }
                  min={0}
                  max={50}
                  step={1}
                  className="flex-1"
                />
                <span className="w-12 text-sm">
                  {selectedComponent.style.borderRadius || 0}px
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="opacity">Opacity</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  value={[selectedComponent.style.opacity || 1]}
                  onValueChange={([value]) =>
                    handlePropertyChange("style.opacity", value)
                  }
                  min={0}
                  max={1}
                  step={0.1}
                  className="flex-1"
                />
                <span className="w-12 text-sm">
                  {Math.round((selectedComponent.style.opacity || 1) * 100)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="padding">Padding</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  value={[selectedComponent.style.padding || 0]}
                  onValueChange={([value]) =>
                    handlePropertyChange("style.padding", value)
                  }
                  min={0}
                  max={50}
                  step={1}
                  className="flex-1"
                />
                <span className="w-12 text-sm">
                  {selectedComponent.style.padding || 0}px
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pos-x">X Position</Label>
                <Input
                  id="pos-x"
                  type="number"
                  value={selectedComponent.position.x}
                  onChange={e =>
                    handlePropertyChange("position.x", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pos-y">Y Position</Label>
                <Input
                  id="pos-y"
                  type="number"
                  value={selectedComponent.position.y}
                  onChange={e =>
                    handlePropertyChange("position.y", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={selectedComponent.size.width}
                  onChange={e =>
                    handlePropertyChange("size.width", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={selectedComponent.size.height}
                  onChange={e =>
                    handlePropertyChange("size.height", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="z-index">Z-Index</Label>
              <Input
                id="z-index"
                type="number"
                value={selectedComponent.style.zIndex || 0}
                onChange={e =>
                  handlePropertyChange("style.zIndex", Number(e.target.value))
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="layer">Layer</Label>
              <Input
                id="layer"
                type="number"
                value={selectedComponent.layer}
                onChange={e =>
                  handlePropertyChange("layer", Number(e.target.value))
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  )
}
