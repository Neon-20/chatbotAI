"use client"

import { useCanvas } from "./canvas-context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Lock, Unlock, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function LayerPanel() {
  const { state, selectedComponents, selectComponent, updateComponent } =
    useCanvas()
  const { components, layers } = state

  const getComponentsInLayer = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId)
    if (!layer) return []

    return layer.components
      .map(componentId => components[componentId])
      .filter(Boolean)
      .sort((a, b) => (b.style.zIndex || 0) - (a.style.zIndex || 0))
  }

  const handleComponentClick = (
    componentId: string,
    event: React.MouseEvent
  ) => {
    selectComponent(componentId, event.ctrlKey || event.metaKey)
  }

  const toggleComponentVisibility = (componentId: string) => {
    const component = components[componentId]
    if (component) {
      updateComponent(componentId, { visible: !component.visible })
    }
  }

  const toggleComponentLock = (componentId: string) => {
    const component = components[componentId]
    if (component) {
      updateComponent(componentId, { locked: !component.locked })
    }
  }

  const isComponentSelected = (componentId: string) => {
    return selectedComponents.some(comp => comp.id === componentId)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-border border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Layers</h2>
          <Button variant="ghost" size="sm" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {layers.map(layer => {
            const layerComponents = getComponentsInLayer(layer.id)

            return (
              <div key={layer.id} className="mb-4">
                {/* Layer header */}
                <div className="bg-muted/50 mb-2 flex items-center justify-between rounded-md px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-6 p-0"
                      onClick={() => {
                        // TODO: Toggle layer visibility
                      }}
                    >
                      {layer.visible ? (
                        <Eye className="size-3" />
                      ) : (
                        <EyeOff className="size-3" />
                      )}
                    </Button>
                    <span className="text-sm font-medium">{layer.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-6 p-0"
                      onClick={() => {
                        // TODO: Toggle layer lock
                      }}
                    >
                      {layer.locked ? (
                        <Lock className="size-3" />
                      ) : (
                        <Unlock className="size-3" />
                      )}
                    </Button>
                    <span className="text-muted-foreground text-xs">
                      {layerComponents.length}
                    </span>
                  </div>
                </div>

                {/* Layer components */}
                <div className="space-y-1 pl-4">
                  {layerComponents.length === 0 ? (
                    <div className="text-muted-foreground py-4 text-center text-xs">
                      No components in this layer
                    </div>
                  ) : (
                    layerComponents.map(component => (
                      <div
                        key={component.id}
                        className={cn(
                          "hover:bg-accent group flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm",
                          isComponentSelected(component.id) &&
                            "bg-primary/10 text-primary"
                        )}
                        onClick={e => handleComponentClick(component.id, e)}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <div
                            className="size-3 rounded-sm border"
                            style={{
                              backgroundColor:
                                component.style.backgroundColor || "#ffffff",
                              borderColor:
                                component.style.borderColor || "#e5e7eb"
                            }}
                          />
                          <span className="truncate">{component.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {component.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-6 p-0"
                            onClick={e => {
                              e.stopPropagation()
                              toggleComponentVisibility(component.id)
                            }}
                          >
                            {component.visible ? (
                              <Eye className="size-3" />
                            ) : (
                              <EyeOff className="size-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-6 p-0"
                            onClick={e => {
                              e.stopPropagation()
                              toggleComponentLock(component.id)
                            }}
                          >
                            {component.locked ? (
                              <Lock className="size-3" />
                            ) : (
                              <Unlock className="size-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Layer stats */}
      <div className="border-border text-muted-foreground border-t p-3 text-xs">
        <div className="flex justify-between">
          <span>Total Components: {Object.keys(components).length}</span>
          <span>Selected: {selectedComponents.length}</span>
        </div>
      </div>
    </div>
  )
}
