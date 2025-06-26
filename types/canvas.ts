export interface CanvasPosition {
  x: number
  y: number
}

export interface CanvasSize {
  width: number
  height: number
}

export interface CanvasBounds extends CanvasPosition, CanvasSize {}

export type CanvasComponentType =
  | "button"
  | "input"
  | "text"
  | "image"
  | "card"
  | "badge"
  | "dialog"
  | "select"
  | "checkbox"
  | "radio"
  | "textarea"
  | "slider"
  | "switch"
  | "progress"
  | "separator"
  | "container"

export interface CanvasComponentStyle {
  backgroundColor?: string
  color?: string
  fontSize?: number
  fontWeight?: string
  padding?: number
  margin?: number
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  opacity?: number
  zIndex?: number
  boxShadow?: string
}

export interface CanvasComponentProps {
  // Common props for all components
  id?: string
  className?: string
  style?: React.CSSProperties

  // Component-specific props
  text?: string
  placeholder?: string
  src?: string
  alt?: string
  href?: string
  disabled?: boolean
  checked?: boolean
  value?: string | number
  min?: number
  max?: number
  step?: number
  options?: Array<{ label: string; value: string }>
  variant?: string
  size?: string

  // Event handlers
  onClick?: string // JavaScript code as string
  onChange?: string
  onSubmit?: string
}

export interface CanvasComponent {
  id: string
  type: CanvasComponentType
  name: string
  position: CanvasPosition
  size: CanvasSize
  style: CanvasComponentStyle
  props: CanvasComponentProps
  parentId?: string
  children: string[]
  locked: boolean
  visible: boolean
  layer: number
  createdAt: Date
  updatedAt: Date
}

export interface CanvasLayer {
  id: string
  name: string
  visible: boolean
  locked: boolean
  opacity: number
  components: string[]
}

export interface CanvasViewport {
  zoom: number
  pan: CanvasPosition
  gridSize: number
  showGrid: boolean
  snapToGrid: boolean
}

export interface CanvasHistory {
  past: CanvasState[]
  present: CanvasState
  future: CanvasState[]
}

export interface CanvasState {
  id: string
  name: string
  components: Record<string, CanvasComponent>
  layers: CanvasLayer[]
  selectedComponentIds: string[]
  viewport: CanvasViewport
  lastSaved: Date
  version: number
}

export interface CanvasAction {
  type:
    | "ADD_COMPONENT"
    | "UPDATE_COMPONENT"
    | "DELETE_COMPONENT"
    | "MOVE_COMPONENT"
    | "RESIZE_COMPONENT"
    | "SELECT_COMPONENT"
    | "DESELECT_COMPONENT"
    | "CLEAR_SELECTION"
    | "UPDATE_VIEWPORT"
    | "UNDO"
    | "REDO"
    | "SAVE"
    | "LOAD"
  payload?: any
}

export interface ComponentLibraryItem {
  id: string
  type: CanvasComponentType
  name: string
  description: string
  icon: React.ComponentType
  defaultProps: Partial<CanvasComponent>
  category: "basic" | "form" | "layout" | "data" | "feedback"
}

export interface CanvasContextType {
  state: CanvasState
  history: CanvasHistory
  dispatch: (action: CanvasAction) => void
  selectedComponents: CanvasComponent[]
  addComponent: (
    type: CanvasComponentType,
    position: CanvasPosition,
    defaultProps?: Partial<CanvasComponent>
  ) => void
  updateComponent: (id: string, updates: Partial<CanvasComponent>) => void
  deleteComponent: (id: string) => void
  selectComponent: (id: string, multiSelect?: boolean) => void
  clearSelection: () => void
  undo: () => void
  redo: () => void
  save: () => Promise<void>
  load: (canvasId: string) => Promise<void>
  exportCanvas: () => string
  importCanvas: (data: string) => void
}

export interface DragItem {
  type: "COMPONENT" | "LIBRARY_ITEM"
  id: string
  componentType?: CanvasComponentType
  position?: CanvasPosition
}

export interface DropResult {
  position: CanvasPosition
  targetId?: string
}
