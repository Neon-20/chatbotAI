"use client"

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect
} from "react"
import {
  CanvasState,
  CanvasHistory,
  CanvasAction,
  CanvasContextType,
  CanvasComponent,
  CanvasComponentType,
  CanvasPosition
} from "@/types/canvas"

// Initial state
const initialCanvasState: CanvasState = {
  id: "default",
  name: "Untitled Canvas",
  components: {},
  layers: [
    {
      id: "default-layer",
      name: "Layer 1",
      visible: true,
      locked: false,
      opacity: 1,
      components: []
    }
  ],
  selectedComponentIds: [],
  viewport: {
    zoom: 1,
    pan: { x: 0, y: 0 },
    gridSize: 20,
    showGrid: true,
    snapToGrid: true
  },
  lastSaved: new Date(),
  version: 1
}

const initialHistory: CanvasHistory = {
  past: [],
  present: initialCanvasState,
  future: []
}

// Reducer
function canvasReducer(
  history: CanvasHistory,
  action: CanvasAction
): CanvasHistory {
  const { past, present, future } = history

  switch (action.type) {
    case "ADD_COMPONENT": {
      const defaultProps = action.payload.defaultProps || {}
      const timestamp = Date.now()
      const newComponent: CanvasComponent = {
        id: `component-${timestamp}`,
        type: action.payload.type,
        name: `${action.payload.type}-${timestamp}`,
        position: action.payload.position,
        size: defaultProps.size || { width: 100, height: 40 },
        style: defaultProps.style || {},
        props: defaultProps.props || {},
        children: [],
        locked: false,
        visible: true,
        layer: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const newState: CanvasState = {
        ...present,
        components: {
          ...present.components,
          [newComponent.id]: newComponent
        },
        layers: present.layers.map(layer =>
          layer.id === "default-layer"
            ? { ...layer, components: [...layer.components, newComponent.id] }
            : layer
        ),
        selectedComponentIds: [newComponent.id]
      }

      return {
        past: [...past, present],
        present: newState,
        future: []
      }
    }

    case "UPDATE_COMPONENT": {
      const { id, updates } = action.payload
      const component = present.components[id]
      if (!component) return history

      const updatedComponent = {
        ...component,
        ...updates,
        updatedAt: new Date()
      }

      const newState: CanvasState = {
        ...present,
        components: {
          ...present.components,
          [id]: updatedComponent
        }
      }

      return {
        past: [...past, present],
        present: newState,
        future: []
      }
    }

    case "DELETE_COMPONENT": {
      const { id } = action.payload
      const { [id]: deleted, ...remainingComponents } = present.components

      const newState: CanvasState = {
        ...present,
        components: remainingComponents,
        layers: present.layers.map(layer => ({
          ...layer,
          components: layer.components.filter(compId => compId !== id)
        })),
        selectedComponentIds: present.selectedComponentIds.filter(
          compId => compId !== id
        )
      }

      return {
        past: [...past, present],
        present: newState,
        future: []
      }
    }

    case "SELECT_COMPONENT": {
      const { id, multiSelect } = action.payload
      const newSelectedIds = multiSelect
        ? present.selectedComponentIds.includes(id)
          ? present.selectedComponentIds.filter(compId => compId !== id)
          : [...present.selectedComponentIds, id]
        : [id]

      return {
        ...history,
        present: {
          ...present,
          selectedComponentIds: newSelectedIds
        }
      }
    }

    case "CLEAR_SELECTION": {
      return {
        ...history,
        present: {
          ...present,
          selectedComponentIds: []
        }
      }
    }

    case "UPDATE_VIEWPORT": {
      return {
        ...history,
        present: {
          ...present,
          viewport: {
            ...present.viewport,
            ...action.payload
          }
        }
      }
    }

    case "UNDO": {
      if (past.length === 0) return history
      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      }
    }

    case "REDO": {
      if (future.length === 0) return history
      const next = future[0]
      const newFuture = future.slice(1)
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      }
    }

    default:
      return history
  }
}

// Context
const CanvasContext = createContext<CanvasContextType | null>(null)

// Provider
export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const [history, dispatch] = useReducer(canvasReducer, initialHistory)
  const { present: state } = history

  const selectedComponents = state.selectedComponentIds
    .map(id => state.components[id])
    .filter(Boolean)

  const addComponent = useCallback(
    (
      type: CanvasComponentType,
      position: CanvasPosition,
      defaultProps?: Partial<CanvasComponent>
    ) => {
      dispatch({
        type: "ADD_COMPONENT",
        payload: { type, position, defaultProps }
      })
    },
    []
  )

  const updateComponent = useCallback(
    (id: string, updates: Partial<CanvasComponent>) => {
      dispatch({
        type: "UPDATE_COMPONENT",
        payload: { id, updates }
      })
    },
    []
  )

  const deleteComponent = useCallback((id: string) => {
    dispatch({
      type: "DELETE_COMPONENT",
      payload: { id }
    })
  }, [])

  const selectComponent = useCallback((id: string, multiSelect = false) => {
    dispatch({
      type: "SELECT_COMPONENT",
      payload: { id, multiSelect }
    })
  }, [])

  const clearSelection = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTION" })
  }, [])

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" })
  }, [])

  const redo = useCallback(() => {
    dispatch({ type: "REDO" })
  }, [])

  const save = useCallback(async () => {
    try {
      // Save to localStorage for now
      localStorage.setItem(`canvas-${state.id}`, JSON.stringify(state))
      console.log("Canvas saved successfully")
    } catch (error) {
      console.error("Failed to save canvas:", error)
    }
  }, [state])

  const load = useCallback(async (canvasId: string) => {
    try {
      const savedData = localStorage.getItem(`canvas-${canvasId}`)
      if (savedData) {
        const loadedState = JSON.parse(savedData)
        // TODO: Validate and dispatch LOAD action
        console.log("Canvas loaded successfully:", loadedState)
      }
    } catch (error) {
      console.error("Failed to load canvas:", error)
    }
  }, [])

  const exportCanvas = useCallback(() => {
    return JSON.stringify(state, null, 2)
  }, [state])

  const importCanvas = useCallback((data: string) => {
    try {
      const importedState = JSON.parse(data)
      // TODO: Validate and load imported state
      console.log("Importing canvas:", importedState)
    } catch (error) {
      console.error("Failed to import canvas:", error)
    }
  }, [])

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      save()
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [save])

  // Load canvas on mount
  useEffect(() => {
    const savedData = localStorage.getItem(`canvas-${state.id}`)
    if (savedData) {
      try {
        const loadedState = JSON.parse(savedData)
        // Only load if it's different from initial state
        if (Object.keys(loadedState.components).length > 0) {
          console.log("Loading saved canvas data")
        }
      } catch (error) {
        console.error("Failed to load saved canvas:", error)
      }
    }
  }, [])

  const contextValue: CanvasContextType = {
    state,
    history,
    dispatch,
    selectedComponents,
    addComponent,
    updateComponent,
    deleteComponent,
    selectComponent,
    clearSelection,
    undo,
    redo,
    save,
    load,
    exportCanvas,
    importCanvas
  }

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  )
}

// Hook
export function useCanvas() {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider")
  }
  return context
}
