# Technical Documentation - Core Package

## Overview
The `@designable/core` package is the foundational engine of the Designable framework, providing the complete infrastructure for building visual design tools. It implements a sophisticated event-driven architecture with reactive state management, hierarchical tree operations, and extensible behavior patterns. This package serves as the core runtime that orchestrates all designer interactions, from drag-and-drop operations to undo/redo functionality.

## Architecture

### Module Structure

```
packages/core/src/
├── index.ts                    # Main exports barrel
├── externals.ts               # External API creators
├── internals.ts               # Internal utilities
├── registry.ts                # Global behavior/locale registry
├── types.ts                   # TypeScript definitions
├── presets.ts                 # Default configurations
├── models/                    # Core domain models (12 classes)
│   ├── Engine.ts              # Main designer engine
│   ├── TreeNode.ts            # Hierarchical component tree (908 lines)
│   ├── Workspace.ts           # Design workspace container
│   ├── Workbench.ts          # Multi-workspace manager
│   ├── Operation.ts           # Tree operations handler
│   ├── Selection.ts           # Node selection management
│   ├── Cursor.ts              # Mouse cursor state (204 lines)
│   ├── History.ts             # Undo/redo functionality
│   ├── Viewport.ts            # Viewport abstraction
│   ├── MoveHelper.ts          # Drag/drop assistance
│   ├── TransformHelper.ts     # Node transformation
│   └── ...                    # Additional helpers
├── events/                    # Event system (40+ events)
│   ├── cursor/                # Mouse/drag events
│   ├── mutation/              # Tree mutation events
│   ├── keyboard/              # Keyboard events
│   ├── history/               # History events
│   ├── viewport/              # Viewport events
│   └── workbench/             # Workbench events
├── drivers/                   # Event drivers (6 drivers)
│   ├── DragDropDriver.ts      # Drag and drop handling
│   ├── MouseMoveDriver.ts     # Mouse movement tracking
│   ├── KeyboardDriver.ts      # Keyboard input handling
│   └── ...                    # Additional drivers
├── effects/                   # Event effects (11 effects)
│   ├── useDragDropEffect.ts   # Drag/drop behavior
│   ├── useSelectionEffect.ts  # Selection handling
│   ├── useKeyboardEffect.ts   # Keyboard shortcuts
│   └── ...                    # Additional effects
└── shortcuts/                 # Keyboard shortcuts (5 categories)
    ├── UndoRedo.ts            # Undo/redo shortcuts
    ├── NodeMutation.ts        # Node manipulation
    └── ...                    # Additional shortcuts
```

### Core Philosophy

The core package follows these design principles:

1. **Event-Driven Architecture**: All interactions flow through a unified event system
2. **Reactive State Management**: Built on Formily's reactive system for automatic UI updates
3. **Hierarchical Data Model**: Tree-based component structure with parent-child relationships
4. **Extensible Behavior System**: Plugin-like behaviors for component-specific logic
5. **Multi-Workspace Support**: Handle multiple design canvases simultaneously
6. **Immutable History**: Complete undo/redo with serializable snapshots

## Core Models

### 1. Engine - The Heart of the System

**Purpose:** Central coordinator that orchestrates all designer functionality.

**Class Hierarchy:**
```typescript
Engine extends Event (from @designable/shared)
```

**Key Properties:**
```typescript
class Engine {
  id: string                    // Unique engine instance ID
  props: IEngineProps<Engine>   // Configuration options
  cursor: Cursor               // Mouse cursor state manager
  workbench: Workbench        // Multi-workspace container
  keyboard: Keyboard          // Keyboard input handler
  screen: Screen              // Screen size/type manager
}
```

**Core Methods:**

#### Constructor & Initialization
```typescript
constructor(props: IEngineProps<Engine>)
```

**Features:**
- Merges user props with default configuration
- Initializes all core subsystems
- Generates unique engine ID
- Sets up event system inheritance

#### Tree Management
```typescript
setCurrentTree(tree?: ITreeNode): void
getCurrentTree(): TreeNode
```

**Purpose:** Manages the active component tree.

**Usage:**
```typescript
const engine = new Engine({ /* config */ })

// Set initial tree
engine.setCurrentTree({
  componentName: 'Root',
  children: [
    { componentName: 'Button', props: { text: 'Click me' } }
  ]
})

// Get current tree for serialization
const currentTree = engine.getCurrentTree()
```

#### Node Operations
```typescript
getAllSelectedNodes(): TreeNode[]
findNodeById(id: string): TreeNode | undefined
findMovingNodes(): TreeNode[]
createNode(node: ITreeNode, parent?: TreeNode): TreeNode
```

**Examples:**
```typescript
// Get all selected nodes across workspaces
const selected = engine.getAllSelectedNodes()

// Find specific node
const button = engine.findNodeById('button-123')

// Create new node
const newNode = engine.createNode({
  componentName: 'Input',
  props: { placeholder: 'Enter text' }
})
```

#### Lifecycle Management
```typescript
mount(): void    // Attach to DOM
unmount(): void  // Clean up resources
```

**Default Configuration:**
```typescript
Engine.defaultProps = {
  shortcuts: [],                              // Keyboard shortcuts
  effects: [],                               // Event effects
  drivers: [],                               // Event drivers
  rootComponentName: 'Root',                 // Root component name
  sourceIdAttrName: 'data-designer-source-id',  // Drag source attribute
  nodeIdAttrName: 'data-designer-node-id',      // Node ID attribute
  // ... 10+ more configuration options
}
```

**Architecture Pattern:**
```
┌─────────────────────────────────────────────────────────────┐
│                        Engine                                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Cursor    │  │  Keyboard   │  │   Screen    │         │
│  │             │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  Workbench                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │ │
│  │  │ Workspace 1 │  │ Workspace 2 │  │ Workspace N │    │ │
│  │  │             │  │             │  │             │    │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2. TreeNode - The Component Hierarchy

**Purpose:** Represents individual components in the design tree with full manipulation capabilities.

**Class Features:**
- 908 lines of sophisticated tree operations
- Reactive state management with Formily
- Parent-child relationship management
- Serialization and deserialization
- Component behavior integration

**Key Properties:**
```typescript
class TreeNode {
  id: string                    // Unique node identifier
  parent: TreeNode             // Parent node reference
  root: TreeNode               // Root node reference
  children: TreeNode[]         // Child nodes array
  componentName: string        // Component type name
  props: Record<string, any>   // Component properties
  depth: number               // Tree depth level
  hidden: boolean             // Visibility state
  operation: Operation        // Associated operation context
}
```

**Core Methods:**

#### Tree Navigation
```typescript
get siblings(): TreeNode[]              // Sibling nodes
get index(): number                     // Index in parent
get previous(): TreeNode                // Previous sibling
get next(): TreeNode                    // Next sibling
get previousAll(): TreeNode[]           // All previous siblings
get nextAll(): TreeNode[]               // All next siblings
get isRoot(): boolean                   // Is root node
get isLeaf(): boolean                   // Is leaf node (no children)
get isFirst(): boolean                  // Is first child
get isLast(): boolean                   // Is last child
```

**Example:**
```typescript
const button = tree.findById('button-123')
console.log(button.index)           // 2 (third child)
console.log(button.siblings.length) // 4 (total siblings)
console.log(button.previous?.id)    // 'input-122'
console.log(button.isLast)          // false
```

#### Tree Manipulation
```typescript
append(...nodes: TreeNode[]): void             // Add as last children
prepend(...nodes: TreeNode[]): void            // Add as first children
insertAfter(...nodes: TreeNode[]): void        // Insert after this node
insertBefore(...nodes: TreeNode[]): void       // Insert before this node
insertChildren(start: number, ...nodes: TreeNode[]): void  // Insert at index
remove(): void                                  // Remove from tree
```

**Example:**
```typescript
const container = tree.findById('form-container')
const newField = engine.createNode({
  componentName: 'Input',
  props: { name: 'email', placeholder: 'Email' }
})

// Add new field to container
container.append(newField)

// Insert field before existing button
const button = container.findById('submit-button')
button.insertBefore(newField)
```

#### Tree Queries
```typescript
contains(node: TreeNode): boolean              // Check if contains node
eachChildren(callback: (node: TreeNode) => void): void  // Iterate children
map(callback: (node: TreeNode) => T): T[]       // Map over tree
filter(callback: (node: TreeNode) => boolean): TreeNode[]  // Filter nodes
find(finder: INodeFinder): TreeNode | undefined         // Find first match
findAll(finder: INodeFinder): TreeNode[]                // Find all matches
closest(finder: INodeFinder): TreeNode | undefined      // Find closest ancestor
```

**Example:**
```typescript
// Find all Input components
const inputs = tree.findAll(node => node.componentName === 'Input')

// Find parent Form
const form = input.closest(node => node.componentName === 'Form')

// Check if form contains specific field
const hasEmailField = form.contains(emailInput)

// Map component names
const componentNames = tree.map(node => node.componentName)
```

#### Designer Behavior Integration
```typescript
get designerProps(): IDesignerProps            // Get behavior config
get designerLocales(): IDesignerLocales        // Get locale config
allowAppend(nodes?: TreeNode[]): boolean       // Check if can append
allowSiblings(nodes?: TreeNode[]): boolean     // Check if can add siblings
allowDrop(): boolean                           // Check if can be drop target
allowDrag(): boolean                           // Check if can be dragged
allowClone(): boolean                          // Check if can be cloned
allowDelete(): boolean                         // Check if can be deleted
```

**Example:**
```typescript
const form = tree.findById('main-form')

// Check permissions before operations
if (form.allowAppend([newField])) {
  form.append(newField)
}

if (button.allowDrag()) {
  // Enable drag handle
  enableDragHandle(button)
}

// Get designer configuration
const config = button.designerProps
if (config.resizable) {
  enableResizeHandles(button)
}
```

#### Serialization
```typescript
serialize(): ITreeNode                         // Export to JSON
from(node: ITreeNode): void                   // Import from JSON
clone(parent?: TreeNode): TreeNode            // Deep clone node
```

**Example:**
```typescript
// Serialize tree for saving
const treeData = tree.serialize()
localStorage.setItem('design', JSON.stringify(treeData))

// Load tree from saved data
const savedData = JSON.parse(localStorage.getItem('design'))
tree.from(savedData)

// Clone node for copy/paste
const clonedButton = button.clone()
form.append(clonedButton)
```

#### Static Methods
```typescript
static findById(id: string): TreeNode          // Global node lookup
static sort(nodes: TreeNode[]): TreeNode[]     // Sort by tree order
static makeObservable(target: any): void       // Apply reactivity
```

**Global Node Registry:**
```typescript
// All TreeNode instances are globally registered
const anyNode = TreeNode.findById('button-123')
// Works from anywhere in the application
```

**Tree Traversal Algorithm:**

The TreeNode implements efficient tree traversal:

```typescript
// Depth-first traversal
function traverse(node: TreeNode, callback: (node: TreeNode) => void) {
  callback(node)
  node.children.forEach(child => traverse(child, callback))
}

// Usage in TreeNode.map()
map<T>(callback: (node: TreeNode) => T): T[] {
  const results: T[] = []
  traverse(this, node => results.push(callback(node)))
  return results
}
```

### 3. Workspace - Design Canvas Container

**Purpose:** Represents a single design canvas with its own tree, viewport, and operation history.

**Key Properties:**
```typescript
class Workspace {
  id: string                    // Unique workspace ID
  title: string                // Display title
  description: string          // Description text
  engine: Engine               // Parent engine reference
  viewport: Viewport           // Main viewport
  outline: Viewport            // Outline tree viewport
  operation: Operation         // Tree operations
  history: History<Workspace>  // Undo/redo history
  props: IWorkspaceProps      // Configuration
}
```

**Dual Viewport System:**

1. **Main Viewport**: The primary design canvas
   - Full drag/drop interaction
   - Visual component rendering
   - Direct manipulation
   - Insertion indicators

2. **Outline Viewport**: Tree structure view  
   - Hierarchical tree display
   - Block-level operations only
   - Navigation and selection
   - Structure overview

**Example:**
```typescript
const workspace = new Workspace(engine, {
  title: 'Main Design',
  description: 'Primary form layout',
  viewportElement: document.getElementById('canvas'),
  contentWindow: window
})

// Access different viewports
workspace.viewport.scrollTo(100, 200)      // Scroll main canvas
workspace.outline.selectNode(nodeId)       // Select in tree view

// Operation context
workspace.operation.selection.select(buttonNode)
workspace.operation.tree.append(newField)

// History tracking
workspace.history.push('Added new field')
workspace.history.undo()
```

### 4. Operation - Tree Operations Manager

**Purpose:** Centralized hub for all tree manipulation operations and state management.

**Key Properties:**
```typescript
class Operation {
  workspace: Workspace         // Parent workspace
  engine: Engine              // Engine reference
  tree: TreeNode              // Root tree node
  selection: Selection        // Selection manager
  hover: Hover               // Hover state
  transformHelper: TransformHelper  // Transform operations
  moveHelper: MoveHelper      // Move operations
  requests: { snapshot: number | null }  // Async operation tracking
}
```

**Core Responsibilities:**

1. **Tree Management**: Root tree node and structure
2. **Selection Management**: Track selected nodes
3. **Hover State**: Mouse hover interactions
4. **Move Operations**: Drag and drop handling
5. **Transform Operations**: Resize, rotate, translate
6. **History Integration**: Automatic snapshot creation
7. **Event Dispatching**: Operation-level events

**Methods:**
```typescript
dispatch(event: ICustomEvent, callback?: () => void): void
snapshot(type?: string): void              // Create history snapshot
from(operation?: IOperation): void         // Load from serialized state
serialize(): IOperation                    // Export current state
```

**Operation Flow:**
```typescript
// Typical operation sequence
operation.selection.select(button)         // 1. Select target
operation.moveHelper.dragStart()          // 2. Start drag
operation.tree.append(newNode)            // 3. Modify tree
operation.snapshot('Added component')     // 4. Save history
operation.dispatch(new ComponentAdded())  // 5. Notify listeners
```

### 5. Selection - Node Selection Management

**Purpose:** Manages which nodes are currently selected for operations.

**Key Properties:**
```typescript
class Selection {
  operation: Operation         // Parent operation
  selected: string[]          // Selected node IDs
  indexes: Record<string, boolean>  // Fast lookup index
}
```

**Selection Methods:**
```typescript
select(id: string | TreeNode): void              // Select single node
batchSelect(ids: (string | TreeNode)[]): void    // Select multiple nodes
add(id: string | TreeNode): void                 // Add to selection
remove(id: string | TreeNode): void              // Remove from selection
clear(): void                                     // Clear all selection
toggle(id: string | TreeNode): void              // Toggle selection
```

**Selection Queries:**
```typescript
get selectedNodes(): TreeNode[]                  // Get selected node objects
get first(): TreeNode                           // First selected node
get last(): TreeNode                            // Last selected node
get length(): number                            // Selection count
has(id: string | TreeNode): boolean             // Check if selected
```

**Example Usage:**
```typescript
const selection = workspace.operation.selection

// Single selection
selection.select('button-123')

// Multiple selection
selection.batchSelect(['input-1', 'input-2', 'button-3'])

// Add to existing selection
selection.add('checkbox-4')

// Check selection
if (selection.has('button-123')) {
  // Button is selected
}

// Get selected nodes for operations
const selected = selection.selectedNodes
selected.forEach(node => {
  // Apply operation to each selected node
  applyStyle(node, { color: 'red' })
})
```

### 6. Cursor - Mouse State Management

**Purpose:** Tracks mouse position, drag state, and cursor appearance (204 lines).

**Enums:**
```typescript
enum CursorStatus {
  Normal = 'NORMAL',      // Default state
  DragStart = 'DRAG_START',  // Starting drag
  Dragging = 'DRAGGING',     // Currently dragging  
  DragStop = 'DRAG_STOP'     // Ending drag
}

enum CursorDragType {
  Move = 'MOVE',          // Moving components
  Resize = 'RESIZE',      // Resizing components
  Rotate = 'ROTATE',      // Rotating components
  Scale = 'SCALE',        // Scaling components
  Translate = 'TRANSLATE', // Free positioning
  Round = 'ROUND'         // Corner rounding
}

enum CursorType {
  Normal = 'NORMAL',      // Standard cursor
  Selection = 'SELECTION', // Selection mode
  Sketch = 'SKETCH'       // Drawing mode
}
```

**Position Tracking:**
```typescript
interface ICursorPosition {
  pageX?: number          // Page coordinates
  pageY?: number
  clientX?: number        // Viewport coordinates
  clientY?: number
  topPageX?: number       // Top-level page coordinates
  topPageY?: number
  topClientX?: number     // Top-level viewport coordinates
  topClientY?: number
}
```

**Key Properties:**
```typescript
class Cursor {
  engine: Engine
  status: CursorStatus     // Current drag status
  position: ICursorPosition  // Current position
  dragStartPosition: ICursorPosition  // Drag start position
  dragEndPosition: ICursorPosition    // Drag end position
  type: CursorType        // Cursor mode
  dragType: CursorDragType  // Type of drag operation
  view: Window            // Window context
}
```

**Methods:**
```typescript
setStyle(style: string): void           // Set cursor CSS style
setPosition(position: ICursorPosition): void  // Update position
setStatus(status: CursorStatus): void   // Update drag status
setType(type: CursorType): void        // Set cursor mode
```

**Position Delta Calculation:**
```typescript
// Built-in delta calculation for drag operations
const delta = calcPositionDelta(
  cursor.dragEndPosition,
  cursor.dragStartPosition
)

// Returns delta for all coordinate systems:
// { pageX: 50, pageY: 30, clientX: 50, clientY: 30, ... }
```

### 7. History - Undo/Redo Management  

**Purpose:** Complete undo/redo system with serializable snapshots.

**Key Properties:**
```typescript
class History<T extends ISerializable> {
  context: ISerializable   // The object being tracked
  current: number         // Current position in history
  history: HistoryItem<T>[]  // History stack
  maxSize: number         // Maximum history items (default: 100)
  locking: boolean        // Prevent modifications during operations
}
```

**History Item Structure:**
```typescript
interface HistoryItem<T> {
  data: T                 // Serialized state
  type?: string          // Operation description
  timestamp: number      // When created
}
```

**Core Methods:**
```typescript
push(type?: string): void              // Save current state
undo(): boolean                        // Go back one step
redo(): boolean                        // Go forward one step
goTo(index: number): void             // Jump to specific point
clear(): void                         // Clear all history
list(): HistoryItem<T>[]              // Get full history
```

**Properties:**
```typescript
get allowUndo(): boolean              // Can undo
get allowRedo(): boolean              // Can redo
```

**Usage Example:**
```typescript
const history = workspace.history

// Make changes and save
operation.tree.append(newNode)
history.push('Added new component')

// Make more changes
operation.selection.select(newNode)
history.push('Selected component')

// Undo operations
if (history.allowUndo) {
  history.undo()  // Back to previous state
}

// Redo operations
if (history.allowRedo) {
  history.redo()  // Forward to next state
}

// View history
const historyList = history.list()
historyList.forEach(item => {
  console.log(`${item.type} at ${new Date(item.timestamp)}`)
})
```

**Automatic Snapshotting:**

The Operation class automatically creates history snapshots:

```typescript
class Operation {
  snapshot(type?: string) {
    // Use requestIdle for performance
    this.requests.snapshot = requestIdle(() => {
      this.workspace.history.push(type)
    })
  }
}

// Automatically called after operations
operation.tree.append(node)
operation.snapshot('Added component')  // Auto-saved
```

## Event System

The core package implements a comprehensive event system with 40+ event types organized into categories.

### Event Categories

#### 1. Cursor Events (Mouse/Drag)
```typescript
// Mouse interaction events
MouseMoveEvent        // Mouse movement
MouseClickEvent       // Mouse clicks
DragStartEvent        // Drag initiation
DragMoveEvent         // During drag
DragStopEvent         // Drag completion
```

#### 2. Mutation Events (Tree Changes)
```typescript
// Tree structure events
AppendNodeEvent       // Node appended
PrependNodeEvent      // Node prepended  
InsertAfterEvent      // Node inserted after
InsertBeforeEvent     // Node inserted before
RemoveNodeEvent       // Node removed
CloneNodeEvent        // Node cloned
UpdateNodePropsEvent  // Node properties updated
SelectNodeEvent       // Node selected
UnSelectNodeEvent     // Node unselected
HoverNodeEvent        // Node hovered
```

#### 3. Keyboard Events
```typescript
KeyDownEvent          // Key pressed
KeyUpEvent            // Key released
```

#### 4. History Events
```typescript
HistoryPushEvent      // History saved
HistoryUndoEvent      // Undo performed
HistoryRedoEvent      // Redo performed
HistoryGotoEvent      // Jump to history point
```

#### 5. Viewport Events  
```typescript
ViewportResizeEvent   // Viewport size changed
ViewportScrollEvent   // Viewport scrolled
```

#### 6. Workbench Events
```typescript
AddWorkspaceEvent     // Workspace added
RemoveWorkspaceEvent  // Workspace removed
SwitchWorkspaceEvent  // Active workspace changed
```

### Event Architecture

**Base Classes:**

All events extend from abstract base classes:

```typescript
// Cursor events
abstract class AbstractCursorEvent extends ICustomEvent {
  type: string
  data: {
    clientX: number
    clientY: number
    pageX: number
    pageY: number
    target: EventTarget
    view: Window
  }
}

// Mutation events
abstract class AbstractMutationNodeEvent extends ICustomEvent {
  type: string
  data: {
    source: TreeNode | TreeNode[]  // Source nodes
    target: TreeNode               // Target node
  }
}
```

**Event Flow:**

```
User Action → Driver → Event → Effect → State Change → UI Update
     ↓           ↓        ↓        ↓         ↓          ↓
  Mouse Click → MouseDriver → MouseClickEvent → useSelectionEffect → Selection.select() → UI highlights
```

### Example Event Usage

```typescript
// Subscribe to specific events
engine.subscribeTo(DragStartEvent, (event) => {
  console.log('Drag started at:', event.data.clientX, event.data.clientY)
  const target = event.data.target as HTMLElement
  // Handle drag start
})

// Subscribe to mutation events
engine.subscribeTo(AppendNodeEvent, (event) => {
  console.log('Node appended:', event.data.source)
  console.log('To parent:', event.data.target)
  // Handle tree change
})

// Dispatch custom events
operation.dispatch(new SelectNodeEvent({
  target: parentNode,
  source: [selectedNode]
}))
```

## Driver System

Drivers are the interface between DOM events and the internal event system. They translate raw browser events into structured designer events.

### Available Drivers

#### 1. DragDropDriver (144 lines)
**Purpose:** Handles mouse drag and drop operations.

**Key Features:**
- Drag threshold detection (distance/time)
- Global drag state management
- Context menu prevention during drag
- Cross-frame drag support

**Event Flow:**
```
mousedown → Distance Check → dragstart → mousemove → dragend → mouseup
     ↓           ↓              ↓           ↓           ↓        ↓
  Track Start → Check Threshold → DragStartEvent → DragMoveEvent → DragStopEvent
```

#### 2. MouseMoveDriver
**Purpose:** Tracks mouse movement for hover effects and positioning.

#### 3. KeyboardDriver  
**Purpose:** Handles keyboard input and shortcuts.

#### 4. MouseClickDriver
**Purpose:** Processes mouse clicks for selection.

#### 5. ViewportResizeDriver
**Purpose:** Monitors viewport size changes.

#### 6. ViewportScrollDriver
**Purpose:** Tracks viewport scrolling.

### Driver Implementation

```typescript
export class DragDropDriver extends EventDriver<Engine> {
  onMouseDown = (e: MouseEvent) => {
    // Ignore non-left clicks, ctrl/meta clicks
    if (e.button !== 0 || e.ctrlKey || e.metaKey) return
    
    // Ignore content editable elements
    if ((e.target as any)?.isContentEditable) return
    
    // Track drag start
    GlobalState.startEvent = e
    this.batchAddEventListener('mouseup', this.onMouseUp)
    this.batchAddEventListener('mousemove', this.onDistanceChange)
  }

  onDistanceChange = (e: MouseEvent) => {
    const distance = calcDistance(GlobalState.startEvent, e)
    if (distance > DRAG_THRESHOLD) {
      this.startDrag(e)
    }
  }

  startDrag = (e: MouseEvent) => {
    this.dispatch(new DragStartEvent({
      clientX: e.clientX,
      clientY: e.clientY,
      target: e.target,
      view: e.view
    }))
  }
}
```

## Effect System

Effects are the business logic layer that responds to events and updates application state. They bridge events to model changes.

### Available Effects

#### 1. useDragDropEffect (194 lines)
**Purpose:** Implements complete drag and drop behavior.

**Key Features:**
- Source detection (component palette vs existing nodes)
- Multi-node selection drag
- Drop target validation  
- Insertion position calculation
- Auto-scroll during drag

**Flow:**
```typescript
DragStartEvent → Identify drag source → Start move operation
     ↓
DragMoveEvent → Find drop target → Calculate insertion position → Show indicators  
     ↓
DragStopEvent → Validate drop → Execute tree mutation → Update history
```

#### 2. useSelectionEffect
**Purpose:** Handles node selection logic.

#### 3. useKeyboardEffect  
**Purpose:** Processes keyboard shortcuts.

#### 4. useAutoScrollEffect
**Purpose:** Auto-scroll during drag operations.

#### 5. useCursorEffect
**Purpose:** Manages cursor appearance.

### Effect Implementation

```typescript
export const useDragDropEffect = (engine: Engine) => {
  // Handle drag start
  engine.subscribeTo(DragStartEvent, (event) => {
    const target = event.data.target as HTMLElement
    
    // Find the draggable element
    const el = target.closest(`[${engine.props.nodeIdAttrName}]`)
    const nodeId = el?.getAttribute(engine.props.nodeIdAttrName)
    
    if (nodeId) {
      const node = engine.findNodeById(nodeId)
      if (node?.allowDrag()) {
        // Start drag operation
        engine.workbench.eachWorkspace(workspace => {
          workspace.operation.moveHelper.dragStart({
            dragNodes: [node]
          })
        })
      }
    }
  })

  // Handle drag move  
  engine.subscribeTo(DragMoveEvent, (event) => {
    // Find drop target and calculate position
    const dropTarget = findDropTarget(event.data)
    const insertPosition = calculateInsertPosition(event.data, dropTarget)
    
    // Update move helper with new position
    engine.workbench.eachWorkspace(workspace => {
      workspace.operation.moveHelper.dragMove({
        dropTarget,
        insertPosition
      })
    })
  })

  // Handle drag stop
  engine.subscribeTo(DragStopEvent, (event) => {
    // Execute the drop operation
    engine.workbench.eachWorkspace(workspace => {
      workspace.operation.moveHelper.dragEnd()
    })
  })
}
```

## Behavior System

The behavior system allows components to define custom design-time behavior through a declarative configuration system.

### Behavior Definition

```typescript
interface IDesignerProps {
  // Basic properties
  title?: string              // Display name
  icon?: string              // Component icon
  description?: string       // Description text
  
  // Capabilities
  draggable?: boolean        // Can be dragged (default: true)
  droppable?: boolean        // Can accept drops (default: true)
  deletable?: boolean        // Can be deleted (default: true)
  cloneable?: boolean        // Can be copied (default: true)
  
  // Layout behavior
  inlineChildrenLayout?: boolean     // Force inline children
  selfRenderChildren?: boolean       // Custom child rendering
  
  // Interaction callbacks
  allowAppend?: (target: TreeNode, sources?: TreeNode[]) => boolean
  allowSiblings?: (target: TreeNode, sources?: TreeNode[]) => boolean
  allowDrop?: (target: TreeNode) => boolean
  getDragNodes?: (node: TreeNode) => TreeNode | TreeNode[]
  getDropNodes?: (node: TreeNode, parent: TreeNode) => TreeNode | TreeNode[]
  getComponentProps?: (node: TreeNode) => any
  
  // Schema and props
  propsSchema?: ISchema      // Formily schema for properties
  defaultProps?: any         // Default component props
  
  // Advanced features
  resizable?: IResizable     // Resize configuration
  translatable?: ITranslate  // Free positioning
}
```

### Behavior Creation

```typescript
import { createBehavior } from '@designable/core'

const ButtonBehavior = createBehavior({
  name: 'Button',
  selector: 'Button',           // Component name to match
  designerProps: {
    title: 'Button Component',
    icon: 'ButtonIcon',
    draggable: true,
    droppable: false,          // Buttons don't accept children
    resizable: {
      width: (node, element) => ({
        plus: () => { /* increase width */ },
        minus: () => { /* decrease width */ }
      })
    },
    propsSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          title: 'Button Text',
          'x-component': 'Input'
        },
        type: {
          type: 'string',
          title: 'Button Type',
          enum: ['primary', 'secondary', 'danger'],
          'x-component': 'Select'
        }
      }
    },
    defaultProps: {
      text: 'Click Me',
      type: 'primary'
    },
    allowAppend: () => false,    // No children allowed
    allowSiblings: () => true    // Can have siblings
  }
})
```

### Form Container Behavior

```typescript
const FormBehavior = createBehavior({
  name: 'Form',
  selector: 'Form',
  designerProps: {
    title: 'Form Container',
    icon: 'FormIcon',
    droppable: true,            // Accept form fields
    inlineChildrenLayout: false, // Block layout
    allowAppend: (target, sources) => {
      // Only allow form field components
      return sources?.every(node => 
        ['Input', 'Select', 'Checkbox', 'Button'].includes(node.componentName)
      ) ?? false
    },
    getDropNodes: (node, parent) => {
      // Wrap dropped components in FormItem
      if (parent.componentName === 'Form' && 
          node.componentName !== 'FormItem') {
        return {
          componentName: 'FormItem',
          props: { label: node.componentName },
          children: [node]
        }
      }
      return node
    },
    propsSchema: {
      type: 'object',
      properties: {
        layout: {
          type: 'string',
          title: 'Form Layout',
          enum: ['horizontal', 'vertical', 'inline'],
          'x-component': 'Select'
        },
        size: {
          type: 'string', 
          title: 'Form Size',
          enum: ['small', 'medium', 'large'],
          'x-component': 'Select'
        }
      }
    }
  }
})
```

### Behavior Registration

```typescript
import { GlobalRegistry } from '@designable/core'

// Register multiple behaviors
GlobalRegistry.setDesignerBehaviors([
  ButtonBehavior,
  FormBehavior,
  InputBehavior,
  SelectBehavior
])

// Behaviors are automatically applied when nodes are created
const button = engine.createNode({ componentName: 'Button' })
console.log(button.designerProps.title)  // 'Button Component'
console.log(button.allowAppend())        // false
```

## Shortcut System

Keyboard shortcuts provide efficient interaction methods for power users.

### Built-in Shortcuts

#### 1. Undo/Redo
```typescript
const UndoMutation = new Shortcut({
  codes: [
    [KeyCode.Meta, KeyCode.Z],      // Cmd+Z (Mac)
    [KeyCode.Control, KeyCode.Z]    // Ctrl+Z (Windows/Linux)
  ],
  handler(context) {
    context.workspace.history.undo()
    context.workspace.operation.hover.clear()
  }
})

const RedoMutation = new Shortcut({  
  codes: [
    [KeyCode.Meta, KeyCode.Shift, KeyCode.Z],  // Cmd+Shift+Z
    [KeyCode.Control, KeyCode.Shift, KeyCode.Z] // Ctrl+Shift+Z
  ],
  handler(context) {
    context.workspace.history.redo()
    context.workspace.operation.hover.clear()
  }
})
```

#### 2. Node Manipulation
```typescript
const DeleteMutation = new Shortcut({
  codes: [[KeyCode.Delete], [KeyCode.Backspace]],
  handler(context) {
    const selectedNodes = context.workspace.operation.selection.selectedNodes
    selectedNodes.forEach(node => {
      if (node.allowDelete()) {
        node.remove()
      }
    })
    context.workspace.operation.snapshot('Deleted nodes')
  }
})
```

#### 3. Selection  
```typescript
const SelectAllMutation = new Shortcut({
  codes: [
    [KeyCode.Meta, KeyCode.A],     // Cmd+A
    [KeyCode.Control, KeyCode.A]   // Ctrl+A
  ],
  handler(context) {
    const allNodes = context.workspace.operation.tree.filter(
      node => node !== context.workspace.operation.tree
    )
    context.workspace.operation.selection.batchSelect(allNodes)
  }
})
```

### Custom Shortcuts

```typescript
import { Shortcut, KeyCode } from '@designable/core'

const CustomShortcut = new Shortcut({
  codes: [[KeyCode.Control, KeyCode.D]],  // Ctrl+D
  handler(context) {
    // Custom logic
    const selected = context.workspace.operation.selection.selectedNodes
    selected.forEach(node => {
      const clone = node.clone()
      node.insertAfter(clone)
    })
    context.workspace.operation.snapshot('Duplicated nodes')
  }
})

// Register with engine
const engine = new Engine({
  shortcuts: [CustomShortcut]
})
```

## Registry System

The GlobalRegistry manages behaviors, locales, and icons for the entire design system.

### Registry Structure

```typescript
interface IGlobalRegistry {
  // Behavior management
  setDesignerBehaviors(behaviors: IBehaviorLike[]): void
  getDesignerBehaviors(node: TreeNode): IBehavior[]
  
  // Locale management  
  setDesignerLanguage(language: string): void
  setDesignerLocales(locales: IDesignerLocales): void
  
  // Icon management
  setDesignerIcons(icons: IDesignerIcons): void
  getDesignerIcon(name: string): any
}
```

### Usage Examples

```typescript
import { GlobalRegistry, createBehavior } from '@designable/core'

// Register behaviors
GlobalRegistry.setDesignerBehaviors([
  ButtonBehavior,
  FormBehavior,
  InputBehavior
])

// Set language
GlobalRegistry.setDesignerLanguage('en-US')

// Register locales
GlobalRegistry.setDesignerLocales({
  'en-US': {
    components: {
      Button: 'Button',
      Form: 'Form',
      Input: 'Input Field'
    }
  },
  'zh-CN': {
    components: {
      Button: '按钮',
      Form: '表单',
      Input: '输入框'
    }
  }
})

// Register icons
GlobalRegistry.setDesignerIcons({
  Button: ButtonIcon,
  Form: FormIcon,
  Input: InputIcon
})

// Registry is used automatically
const button = engine.createNode({ componentName: 'Button' })
const behaviors = GlobalRegistry.getDesignerBehaviors(button)
const icon = GlobalRegistry.getDesignerIcon('Button')
```

## Type System

The core package provides comprehensive TypeScript definitions for type safety and developer experience.

### Core Interfaces

```typescript
// Engine configuration
interface IEngineProps<T = Event> extends IEventProps<T> {
  shortcuts?: Shortcut[]
  sourceIdAttrName?: string
  nodeIdAttrName?: string  
  contentEditableAttrName?: string
  outlineNodeIdAttrName?: string
  defaultComponentTree?: ITreeNode
  defaultScreenType?: ScreenType
  rootComponentName?: string
}

// Tree node data  
interface ITreeNode {
  componentName?: string
  sourceName?: string
  operation?: Operation
  hidden?: boolean
  isSourceNode?: boolean
  id?: string
  props?: Record<string | number | symbol, any>
  children?: ITreeNode[]
}

// Engine context (passed to shortcuts/effects)
interface IEngineContext {
  workspace: Workspace
  workbench: Workbench
  engine: Engine
  viewport: Viewport
}
```

### Designer Behavior Types

```typescript
interface IDesignerProps {
  // Meta information
  package?: string           // NPM package name
  version?: string          // Version number
  title?: string           // Display title
  description?: string     // Component description
  icon?: string           // Icon identifier
  
  // Capabilities
  droppable?: boolean      // Can accept children
  draggable?: boolean      // Can be dragged
  deletable?: boolean      // Can be deleted
  cloneable?: boolean      // Can be cloned
  
  // Advanced features
  resizable?: IResizable   // Resize configuration
  translatable?: ITranslate // Transform configuration
  
  // Schema integration
  propsSchema?: ISchema    // Formily JSON Schema
  defaultProps?: any       // Default properties
  
  // Validation callbacks
  allowAppend?: (target: TreeNode, sources?: TreeNode[]) => boolean
  allowSiblings?: (target: TreeNode, sources?: TreeNode[]) => boolean  
  allowDrop?: (target: TreeNode) => boolean
  
  // Transformation callbacks
  getDragNodes?: (node: TreeNode) => TreeNode | TreeNode[]
  getDropNodes?: (node: TreeNode, parent: TreeNode) => TreeNode | TreeNode[]
  getComponentProps?: (node: TreeNode) => any
}

// Resize configuration
interface IResizable {
  width?: (node: TreeNode, element: Element) => {
    plus: () => void
    minus: () => void  
  }
  height?: (node: TreeNode, element: Element) => {
    plus: () => void
    minus: () => void
  }
}

// Transform configuration
interface ITranslate {
  x: (node: TreeNode, element: HTMLElement, diffX: string | number) => {
    translate: () => void
  }
  y: (node: TreeNode, element: HTMLElement, diffY: string | number) => {
    translate: () => void
  }
}
```

## Usage Examples

### Basic Engine Setup

```typescript
import {
  Engine,
  DragDropDriver,
  useDragDropEffect,
  UndoMutation,
  RedoMutation
} from '@designable/core'

// Create engine with configuration
const engine = new Engine({
  // Event drivers
  drivers: [
    new DragDropDriver()
  ],
  
  // Event effects  
  effects: [
    useDragDropEffect
  ],
  
  // Keyboard shortcuts
  shortcuts: [
    UndoMutation,
    RedoMutation
  ],
  
  // Initial tree
  defaultComponentTree: {
    componentName: 'Root',
    children: [
      {
        componentName: 'Form',
        props: { title: 'Contact Form' },
        children: [
          {
            componentName: 'Input',
            props: { name: 'name', placeholder: 'Your name' }
          },
          {
            componentName: 'Input', 
            props: { name: 'email', placeholder: 'Your email' }
          },
          {
            componentName: 'Button',
            props: { text: 'Submit', type: 'primary' }
          }
        ]
      }
    ]
  }
})

// Mount to DOM
engine.mount()

// Access current tree
const tree = engine.getCurrentTree()
console.log('Tree structure:', tree.serialize())
```

### Workspace Management

```typescript
// Create workspace
const workspace = new Workspace(engine, {
  id: 'main-workspace',
  title: 'Main Design',
  viewportElement: document.getElementById('canvas'),
  contentWindow: window
})

// Add to workbench
engine.workbench.addWorkspace(workspace)
engine.workbench.switchWorkspace(workspace.id)

// Access workspace operations
const operation = workspace.operation

// Tree operations
const button = operation.tree.findById('submit-button')
const newField = engine.createNode({
  componentName: 'Input',
  props: { name: 'phone', placeholder: 'Phone number' }
})
button.insertBefore(newField)

// Selection operations
operation.selection.select(newField)
operation.selection.add(button)  // Multi-select

// History operations
operation.snapshot('Added phone field')
workspace.history.undo()  // Remove phone field
workspace.history.redo()  // Add it back
```

### Tree Manipulation

```typescript
const tree = engine.getCurrentTree()

// Find nodes
const form = tree.find(node => node.componentName === 'Form')
const inputs = tree.findAll(node => node.componentName === 'Input')

// Tree structure operations
const emailInput = tree.findById('email-input')
const phoneInput = engine.createNode({
  componentName: 'Input',
  props: { name: 'phone', placeholder: 'Phone number' }
})

// Insert phone input after email input  
emailInput.insertAfter(phoneInput)

// Move submit button to end
const submitButton = form.find(node => node.componentName === 'Button')
form.append(submitButton)  // Moves to end

// Clone input for address
const addressInput = emailInput.clone()
addressInput.props.name = 'address'
addressInput.props.placeholder = 'Your address'
phoneInput.insertAfter(addressInput)

// Remove a field
const nameInput = form.find(node => node.props?.name === 'name')
nameInput.remove()

// Validate operations
if (form.allowAppend([phoneInput])) {
  form.append(phoneInput)
}

// Tree traversal
form.eachChildren(child => {
  console.log('Child:', child.componentName, child.props)
})

// Tree queries
const hasRequiredFields = form.findAll(node => 
  node.props?.required === true
).length > 0

// Serialization
const treeData = tree.serialize()
localStorage.setItem('design', JSON.stringify(treeData))
```

### Event Handling

```typescript
// Subscribe to specific events
engine.subscribeTo(SelectNodeEvent, (event) => {
  const selectedNodes = event.data.source
  console.log('Selected nodes:', selectedNodes.map(n => n.componentName))
  
  // Update property panel
  updatePropertyPanel(selectedNodes)
})

engine.subscribeTo(DragStartEvent, (event) => {
  console.log('Drag started at:', event.data.clientX, event.data.clientY)
  // Show drop indicators
  showDropIndicators()
})

engine.subscribeTo(AppendNodeEvent, (event) => {
  const newNode = event.data.source[0]
  const parent = event.data.target
  console.log(`Added ${newNode.componentName} to ${parent.componentName}`)
  
  // Auto-select new node
  workspace.operation.selection.select(newNode)
  
  // Save history
  workspace.operation.snapshot(`Added ${newNode.componentName}`)
})

// Custom event dispatch
workspace.operation.dispatch(new SelectNodeEvent({
  target: tree,
  source: [button, input]
}))
```

### Behavior Integration

```typescript
import { createBehavior, GlobalRegistry } from '@designable/core'

// Define custom behavior
const CardBehavior = createBehavior({
  name: 'Card',
  selector: 'Card',
  designerProps: {
    title: 'Card Container',
    icon: 'CardIcon',
    droppable: true,
    allowAppend: (target, sources) => {
      // Only allow certain components in cards
      const allowedComponents = ['Text', 'Image', 'Button', 'List']
      return sources?.every(node => 
        allowedComponents.includes(node.componentName)
      ) ?? false
    },
    resizable: {
      width: (node, element) => ({
        plus: () => {
          const currentWidth = element.offsetWidth
          element.style.width = (currentWidth + 20) + 'px'
        },
        minus: () => {
          const currentWidth = element.offsetWidth  
          element.style.width = Math.max(100, currentWidth - 20) + 'px'
        }
      })
    },
    propsSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          title: 'Card Title',
          'x-component': 'Input'
        },
        shadow: {
          type: 'boolean', 
          title: 'Show Shadow',
          'x-component': 'Switch'
        },
        bordered: {
          type: 'boolean',
          title: 'Show Border', 
          'x-component': 'Switch'
        }
      }
    },
    defaultProps: {
      title: 'Card Title',
      shadow: true,
      bordered: false
    }
  }
})

// Register behavior
GlobalRegistry.setDesignerBehaviors([CardBehavior])

// Use in tree
const card = engine.createNode({
  componentName: 'Card',
  props: { title: 'My Card' }
})

// Behavior is automatically applied
console.log(card.designerProps.title)    // 'Card Container'
console.log(card.allowAppend([textNode])) // true (Text allowed)
console.log(card.allowAppend([formNode])) // false (Form not allowed)
```

### Advanced Patterns

#### Multi-Workspace Designer

```typescript
// Create multiple workspaces for different screen sizes
const mobileWorkspace = new Workspace(engine, {
  title: 'Mobile View',
  viewportElement: document.getElementById('mobile-canvas')
})

const desktopWorkspace = new Workspace(engine, {
  title: 'Desktop View', 
  viewportElement: document.getElementById('desktop-canvas')
})

engine.workbench.addWorkspace(mobileWorkspace)
engine.workbench.addWorkspace(desktopWorkspace)

// Sync trees between workspaces
mobileWorkspace.operation.tree.onUpdate(() => {
  const mobileTree = mobileWorkspace.operation.tree.serialize()
  const adaptedTree = adaptTreeForDesktop(mobileTree)
  desktopWorkspace.operation.tree.from(adaptedTree)
})

// Switch active workspace
engine.workbench.switchWorkspace('mobile-workspace')
```

#### Custom Tree Operations

```typescript
class CustomOperation extends Operation {
  // Custom bulk operations
  bulkUpdateProps(nodeIds: string[], props: any) {
    const nodes = nodeIds.map(id => this.tree.findById(id)).filter(Boolean)
    
    nodes.forEach(node => {
      Object.assign(node.props, props)
    })
    
    this.dispatch(new UpdateNodePropsEvent({
      target: this.tree,
      source: nodes
    }))
    
    this.snapshot('Bulk update properties')
  }
  
  // Smart grouping
  groupNodes(nodeIds: string[], groupType: string = 'Container') {
    const nodes = nodeIds.map(id => this.tree.findById(id)).filter(Boolean)
    if (nodes.length < 2) return
    
    // Find common parent
    const commonParent = findCommonParent(nodes)
    const insertIndex = Math.min(...nodes.map(n => n.index))
    
    // Create group container
    const group = this.engine.createNode({
      componentName: groupType,
      props: { grouped: true }
    })
    
    // Move nodes into group
    nodes.forEach(node => {
      node.remove()
      group.append(node)
    })
    
    // Insert group at original position
    commonParent.insertChildren(insertIndex, group)
    
    this.selection.select(group)
    this.snapshot(`Grouped ${nodes.length} nodes`)
  }
}
```

#### Performance Optimization

```typescript
// Batch operations for better performance
const batchUpdate = () => {
  // Disable reactive updates during batch
  const workspace = engine.workbench.currentWorkspace
  workspace.history.locking = true
  
  try {
    // Multiple tree operations
    const form = tree.find(node => node.componentName === 'Form')
    for (let i = 0; i < 100; i++) {
      const field = engine.createNode({
        componentName: 'Input',
        props: { name: `field_${i}` }
      })
      form.append(field)
    }
  } finally {
    // Re-enable updates and save single snapshot
    workspace.history.locking = false
    workspace.operation.snapshot('Added 100 fields')
  }
}

// Use requestIdle for non-critical operations
import { requestIdle } from '@designable/shared'

const optimizeTree = () => {
  requestIdle(() => {
    // Cleanup empty containers
    tree.findAll(node => 
      node.children.length === 0 && 
      node.componentName === 'Container'
    ).forEach(node => node.remove())
    
    // Merge adjacent text nodes
    mergeAdjacentTextNodes(tree)
  })
}
```

## Integration Points

### With Designable React

```typescript
// React integration uses core models directly
import { useContext } from 'react'
import { DesignerContext } from '@designable/react'

const PropertyPanel = () => {
  const engine = useContext(DesignerContext)
  const selectedNodes = engine.workbench.currentWorkspace.operation.selection.selectedNodes
  
  return (
    <div>
      {selectedNodes.map(node => (
        <PropertyEditor key={node.id} node={node} />
      ))}
    </div>
  )
}
```

### With Formily Transformer

```typescript
import { transformToSchema, transformToTreeNode } from '@designable/formily-transformer'

// Export design to Formily schema
const exportToFormily = () => {
  const tree = engine.getCurrentTree()
  const { schema, form } = transformToSchema(tree)
  
  return {
    schema,
    form,
    metadata: {
      version: '1.0',
      exported: new Date().toISOString()
    }
  }
}

// Import Formily schema to design
const importFromFormily = (formilyData) => {
  const tree = transformToTreeNode(formilyData)
  engine.setCurrentTree(tree)
}
```

## Best Practices

### 1. Always Use Snapshots

```typescript
// Good - save history after operations
operation.tree.append(newNode)
operation.snapshot('Added component')

// Bad - no history tracking
operation.tree.append(newNode)
```

### 2. Check Permissions

```typescript
// Good - validate before operations
if (parent.allowAppend([newChild])) {
  parent.append(newChild)
  operation.snapshot('Added child')
}

// Bad - assume operations will succeed
parent.append(newChild)  // May fail
```

### 3. Use Events for Coordination

```typescript
// Good - use events for loose coupling
engine.subscribeTo(SelectNodeEvent, (event) => {
  updatePropertyPanel(event.data.source)
})

// Bad - direct coupling
operation.selection.onSelect = (nodes) => {
  updatePropertyPanel(nodes)  // Tight coupling
}
```

### 4. Batch Reactive Updates

```typescript
// Good - batch related changes
workspace.history.locking = true
try {
  // Multiple operations
} finally {
  workspace.history.locking = false
  operation.snapshot('Batch operation')
}

// Bad - individual snapshots
operation.tree.append(node1)
operation.snapshot('Added node1')
operation.tree.append(node2)  
operation.snapshot('Added node2')
```

### 5. Clean Up Subscriptions

```typescript
// Good - store unsubscribe functions
class MyComponent {
  unsubscribes: (() => void)[] = []
  
  mount() {
    this.unsubscribes.push(
      engine.subscribeTo(SelectNodeEvent, this.handleSelect)
    )
  }
  
  unmount() {
    this.unsubscribes.forEach(unsub => unsub())
  }
}

// Bad - memory leaks
engine.subscribeTo(SelectNodeEvent, handler)  // Never cleaned up
```

## Testing Strategies

### Unit Testing Models

```typescript
import { Engine, TreeNode } from '@designable/core'

describe('TreeNode', () => {
  let engine: Engine
  let tree: TreeNode

  beforeEach(() => {
    engine = new Engine({})
    tree = engine.getCurrentTree()
  })

  it('should append nodes correctly', () => {
    const child = engine.createNode({ componentName: 'Button' })
    tree.append(child)
    
    expect(tree.children).toHaveLength(1)
    expect(tree.children[0]).toBe(child)
    expect(child.parent).toBe(tree)
  })

  it('should maintain tree depth', () => {
    const form = engine.createNode({ componentName: 'Form' })
    const input = engine.createNode({ componentName: 'Input' })
    
    tree.append(form)
    form.append(input)
    
    expect(tree.depth).toBe(0)
    expect(form.depth).toBe(1)
    expect(input.depth).toBe(2)
  })
})
```

### Integration Testing

```typescript
describe('Drag and Drop', () => {
  it('should handle complete drag flow', () => {
    const engine = new Engine({
      drivers: [new DragDropDriver()],
      effects: [useDragDropEffect]
    })
    
    // Simulate drag start
    const button = engine.getCurrentTree().findById('button-1')
    engine.cursor.setStatus(CursorStatus.DragStart)
    engine.dispatch(new DragStartEvent({
      target: button.element,
      clientX: 100,
      clientY: 100
    }))
    
    // Verify drag state
    expect(engine.cursor.status).toBe(CursorStatus.Dragging)
    expect(engine.workbench.currentWorkspace.operation.moveHelper.dragNodes)
      .toContain(button)
    
    // Simulate drop
    engine.dispatch(new DragStopEvent({
      target: form.element,
      clientX: 200,
      clientY: 200
    }))
    
    // Verify final state
    expect(button.parent).toBe(form)
  })
})
```

## Performance Considerations

### Memory Management
- TreeNode instances are globally registered but cleaned up when removed
- Event subscriptions use WeakMap for automatic cleanup
- History maintains maximum size limit (default: 100 items)

### Reactivity Optimization
- Use `locking` to batch reactive updates
- RequestIdle for non-critical operations
- Shallow comparison in reactive computations

### Tree Operations
- O(1) node lookup by ID using global registry
- O(n) tree traversal operations
- Efficient parent-child relationship updates

## Browser Support

### Minimum Requirements
- Modern ES6+ browsers
- Support for Proxy (reactive system requirement)
- RequestAnimationFrame and RequestIdleCallback

### Dependencies
- `@formily/reactive`: Reactive state management
- `@formily/json-schema`: Schema definitions
- `@designable/shared`: Utility functions

## Summary

The `@designable/core` package provides:

**Architecture:**
- Event-driven design with 40+ event types
- Reactive state management with Formily
- Hierarchical tree-based data model
- Extensible behavior system
- Multi-workspace support

**Core Models:**
- Engine: Central coordinator
- TreeNode: Component hierarchy (908 lines)
- Workspace: Design canvas container
- Operation: Tree manipulation hub
- Selection: Multi-node selection
- History: Complete undo/redo (126 lines)
- Cursor: Mouse state tracking (204 lines)

**Event System:**
- 6 event drivers for DOM interaction
- 11 effects for business logic
- Comprehensive event types for all operations
- Driver → Event → Effect → State pattern

**Behavior System:**
- Declarative component configuration
- Runtime permission checking
- Schema integration with Formily
- Global behavior registry

**Key Features:**
- Complete drag and drop
- Keyboard shortcuts (5 categories)
- Multi-level undo/redo
- Type-safe TypeScript APIs
- Cross-workspace operations
- Serializable tree state

**Best For:**
- Visual form designers
- Page builders
- Component composers
- Design tools
- Low-code platforms

---

**Last Updated**: December 26, 2025  
**Version**: Based on current codebase  
**Maintainer**: Designable Team  
**Package Purpose**: Core engine for visual design tools  
**Total Lines**: ~4000+ across all modules  
**Key Classes**: Engine, TreeNode, Workspace, Operation, Selection, History, Cursor
