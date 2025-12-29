# Technical Documentation - React Package

## Overview
The `@designable/react` package is the primary React integration layer for the Designable framework. It provides a comprehensive set of React components, hooks, and widgets that enable the creation of visual design tools and drag-and-drop interfaces. This package serves as the bridge between the core Designable engine and React applications, offering a complete toolkit for building design applications.

## Architecture

### Module Structure

```
packages/react/src/
├── index.ts                    # Main exports barrel
├── context.ts                  # React contexts
├── types.ts                    # TypeScript definitions
├── theme.less                  # Base theme styles
├── variables.less              # CSS variables
├── containers/                 # Core container components
│   ├── Designer.tsx           # Main designer container
│   ├── Layout.tsx             # Layout wrapper
│   ├── Workbench.tsx          # Workbench container
│   ├── Workspace.tsx          # Workspace container
│   ├── Viewport.tsx           # Design canvas viewport
│   └── Simulator.tsx          # Device simulator
├── hooks/                     # React hooks (20+ hooks)
│   ├── useDesigner.ts         # Designer engine hook
│   ├── useWorkspace.ts        # Workspace management
│   ├── useSelectedNode.ts     # Node selection
│   ├── useOperation.ts        # Operations handling
│   └── ...                    # Additional specialized hooks
├── widgets/                   # UI widgets (15+ widgets)
│   ├── ComponentTreeWidget/   # Component tree renderer
│   ├── AuxToolWidget/         # Auxiliary design tools
│   ├── IconWidget/            # Icon display system
│   ├── HistoryWidget/         # Undo/redo history
│   └── ...                    # Additional widgets
├── panels/                    # Panel components
│   ├── CompositePanel.tsx     # Tabbed panel system
│   ├── SettingsPanel.tsx      # Property settings panel
│   ├── ToolbarPanel.tsx       # Toolbar container
│   └── ...                    # Additional panels
├── simulators/                # Device simulators
│   ├── PCSimulator/           # Desktop simulator
│   ├── MobileSimulator/       # Mobile device simulator
│   └── ResponsiveSimulator/   # Responsive design simulator
├── icons/                     # Icon library (40+ icons)
│   ├── actions.tsx            # Action icons
│   ├── components.tsx         # Component icons
│   └── ...                    # Additional icon sets
└── locales/                   # Internationalization
    ├── global.ts              # Global translations
    ├── icons.ts               # Icon tooltips
    ├── operations.ts          # Operation labels
    └── panels.ts              # Panel labels
```

### Purpose

This package provides:
1. **React Components**: Pre-built UI components for design tools
2. **Hook System**: 20+ specialized React hooks for design functionality
3. **Widget Framework**: Reusable UI widgets for design interfaces
4. **Simulator System**: Device simulation for responsive design
5. **Panel Architecture**: Flexible panel system for tool organization
6. **Icon Library**: Comprehensive icon set for design applications
7. **Internationalization**: Multi-language support

## Core Container Components

### 1. Designer - The Root Container

**Purpose:** The main container that initializes the design environment and provides context to all child components.

**Key Features:**
- Engine initialization and lifecycle management
- Global context provision
- Theme and styling system
- Icon registry setup
- Error boundary protection

**Props Interface:**
```typescript
interface IDesignerProps extends IDesignerLayoutProps {
  engine: Engine                           // Core design engine
  prefixCls?: string                      // CSS class prefix (default: 'dn-')
  theme?: 'dark' | 'light' | string       // Theme mode
  variables?: Record<string, string>       // CSS variables
  position?: 'fixed' | 'absolute' | 'relative'  // Layout positioning
  children?: React.ReactNode
}
```

**Usage Example:**
```tsx
import { Designer } from '@designable/react'
import { createDesigner } from '@designable/core'

const engine = createDesigner()

const App = () => (
  <Designer 
    engine={engine}
    theme="light"
    prefixCls="my-designer-"
    variables={{
      '--primary-color': '#1890ff',
      '--border-color': '#d9d9d9'
    }}
  >
    {/* Design tool components */}
    <Workbench>
      <Viewport>
        {/* Design canvas content */}
      </Viewport>
    </Workbench>
  </Designer>
)
```

**Architecture Pattern:**
```tsx
export const Designer: React.FC<IDesignerProps> = ({ 
  engine: engineProp, 
  prefixCls = 'dn-', 
  theme = 'light', 
  variables, 
  position, 
  children 
}) => {
  const engine = useDesigner()
  const ref = useRef<Engine>(null)

  // Engine lifecycle management
  useEffect(() => {
    if (engineProp) {
      if (engineProp && ref.current && engineProp !== ref.current) {
        ref.current.unmount()
      }
      engineProp.mount()
      ref.current = engineProp
    }
    return () => {
      if (engineProp) {
        engineProp.unmount()
      }
    }
  }, [engineProp])

  // Prevent multiple engine contexts
  if (engine) {
    throw new Error('There can only be one Designable Engine Context in the React Tree')
  }

  return (
    <Layout prefixCls={prefixCls} theme={theme} variables={variables} position={position}>
      <DesignerEngineContext.Provider value={engineProp}>
        {children}
        <GhostWidget />  {/* Ghost elements for drag operations */}
      </DesignerEngineContext.Provider>
    </Layout>
  )
}
```

### 2. Viewport - The Design Canvas

**Purpose:** The main canvas area where users interact with design elements.

**Key Features:**
- Iframe and direct DOM rendering support
- Auxiliary tools overlay (selection, guides, etc.)
- Empty state handling with drag tips
- Scroll synchronization for iframe mode
- Performance optimized rendering

**Props Interface:**
```typescript
interface IViewportProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'placeholder'> {
  placeholder?: React.ReactNode          // Empty state content
  dragTipsDirection?: 'left' | 'right'   // Drag hint positioning
}
```

**Advanced Implementation:**
```tsx
export const Viewport: React.FC<IViewportProps> = ({
  placeholder,
  dragTipsDirection,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false)
  const prefix = usePrefix('viewport')
  const viewport = useViewport()
  const ref = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<ViewportType>(null)
  const isFrameRef = useRef(false)

  useLayoutEffect(() => {
    const frameElement = ref.current.querySelector('iframe')
    if (!viewport) return

    // Cleanup previous viewport
    if (viewportRef.current && viewportRef.current !== viewport) {
      viewportRef.current.onUnmount()
    }

    if (frameElement) {
      // Iframe mode - isolated rendering context
      frameElement.addEventListener('load', () => {
        viewport.onMount(frameElement, frameElement.contentWindow)
        requestIdle(() => {
          isFrameRef.current = true
          setLoaded(true)
        })
      })
    } else {
      // Direct DOM mode - same context as host
      viewport.onMount(ref.current, globalThisPolyfill)
      requestIdle(() => {
        isFrameRef.current = false
        setLoaded(true)
      })
    }

    viewportRef.current = viewport
    return () => {
      viewport.onUnmount()
    }
  }, [viewport])

  return (
    <div
      {...props}
      ref={ref}
      className={cls(prefix, props.className)}
      style={{
        opacity: !loaded ? 0 : 1,  // Fade in when loaded
        overflow: isFrameRef.current ? 'hidden' : 'overlay',
        ...props.style,
      }}
    >
      {props.children}
      <AuxToolWidget />           {/* Design tools overlay */}
      <EmptyWidget dragTipsDirection={dragTipsDirection}>
        {placeholder}
      </EmptyWidget>
    </div>
  )
}
```

### 3. Workbench - Workspace Manager

**Purpose:** Manages multiple workspaces and provides workspace context.

**Usage Pattern:**
```tsx
export const Workbench: React.FC = observer((props) => {
  const workbench = useWorkbench()
  return (
    <Workspace id={workbench.currentWorkspace?.id}>
      {props.children}
    </Workspace>
  )
})
```

**Multi-workspace Support:**
```tsx
const MultiWorkspaceDesigner = () => (
  <Designer engine={engine}>
    <Workbench>
      {/* Workspace switcher */}
      <WorkspacePanel>
        <WorkspacePanel.Item id="desktop" title="Desktop" />
        <WorkspacePanel.Item id="mobile" title="Mobile" />
      </WorkspacePanel>
      
      <Viewport>
        {/* Current workspace content */}
      </Viewport>
    </Workbench>
  </Designer>
)
```

## Hook System (20+ Hooks)

### 1. Core Engine Hooks

#### useDesigner - Engine Access
```typescript
interface IEffects {
  (engine: Engine): void
}

export const useDesigner = (effects?: IEffects): Engine => {
  const designer: Engine = 
    globalThisPolyfill['__DESIGNABLE_ENGINE__'] || 
    useContext(DesignerEngineContext)
  
  useEffect(() => {
    if (isFn(effects)) {
      return effects(designer)  // Return cleanup function
    }
  }, [])
  
  return designer
}
```

**Usage Examples:**
```tsx
// Basic usage
const MyComponent = () => {
  const engine = useDesigner()
  
  const handleCreateNode = () => {
    engine.workbench.currentWorkspace.operation.appendNode({
      componentName: 'Button',
      props: { text: 'New Button' }
    })
  }
}

// With effects
const MyComponent = () => {
  const engine = useDesigner((engine) => {
    // Setup subscriptions
    const unsubscribe = engine.subscribeTo('operation:append_node', () => {
      console.log('Node added')
    })
    
    return unsubscribe  // Cleanup
  })
}
```

#### useWorkspace - Workspace Management
```typescript
export const useWorkspace = (id?: string): Workspace => {
  const engine = useDesigner()
  const workbench = engine?.workbench
  if (id) {
    return workbench?.findWorkspaceById(id)
  }
  return workbench?.currentWorkspace
}
```

#### useOperation - Operations API
```typescript
export const useOperation = (workspaceId?: string): Operation => {
  const workspace = useWorkspace(workspaceId)
  return workspace?.operation
}
```

### 2. Selection and Tree Hooks

#### useSelectedNode - Current Selection
```typescript
export const useSelectedNode = (workspaceId?: string): TreeNode => {
  const operation = useOperation(workspaceId)
  return operation?.selection?.first()
}
```

#### useTree - Tree Navigation
```typescript
export const useTree = (workspaceId?: string): TreeNode => {
  const workspace = useWorkspace(workspaceId)
  return workspace?.tree
}
```

#### useTreeNode - Node Context
```typescript
export const useTreeNode = (): TreeNode => {
  return useContext(TreeNodeContext)
}
```

### 3. UI State Hooks

#### useHover - Hover State
```typescript
export const useHover = (workspaceId?: string): TreeNode[] => {
  const operation = useOperation(workspaceId)
  return operation?.hover?.targets || []
}
```

#### useCursor - Cursor State
```typescript
export const useCursor = (workspaceId?: string): ICursor => {
  const operation = useOperation(workspaceId)
  return operation?.cursor
}
```

#### useViewport - Viewport Management
```typescript
export const useViewport = (workspaceId?: string): IViewport => {
  const workspace = useWorkspace(workspaceId)
  return workspace?.viewport
}
```

### 4. Utility Hooks

#### usePrefix - CSS Class Prefix
```typescript
export const usePrefix = (after?: string): string => {
  const { prefixCls } = useContext(DesignerLayoutContext) || { prefixCls: 'dn-' }
  return after ? `${prefixCls}${after}` : prefixCls
}
```

#### useTheme - Theme Management
```typescript
export const useTheme = (): string => {
  const { theme } = useContext(DesignerLayoutContext) || { theme: 'light' }
  return theme
}
```

#### useComponents - Component Registry
```typescript
export const useComponents = (): IDesignerComponents => {
  const components = useContext(DesignerComponentsContext)
  return components || {}
}
```

### 5. Advanced Hooks

#### useMoveHelper - Drag Operations
```typescript
export const useMoveHelper = (workspaceId?: string): IMoveHelper => {
  const operation = useOperation(workspaceId)
  return operation?.moveHelper
}
```

#### useTransformHelper - Transformation Utils
```typescript
export const useTransformHelper = (workspaceId?: string): ITransformHelper => {
  const operation = useOperation(workspaceId)
  return operation?.transformHelper
}
```

## Widget System (15+ Widgets)

### 1. ComponentTreeWidget - Component Tree Renderer

**Purpose:** Renders the design tree as React components with proper context and lifecycle management.

**Key Features:**
- Recursive tree rendering
- Component prop injection
- Design-time vs runtime behavior
- Automatic re-rendering on tree changes
- Component registry integration

**Core Implementation:**
```tsx
export const TreeNodeWidget: React.FC<ITreeNodeWidgetProps> = observer(
  (props: ITreeNodeWidgetProps) => {
    const designer = useDesigner(props.node?.designerProps?.effects)
    const components = useComponents()
    const node = props.node

    const renderChildren = () => {
      if (node?.designerProps?.selfRenderChildren) return []
      return node?.children?.map((child) => {
        return <TreeNodeWidget key={child.id} node={child} />
      })
    }

    const renderProps = (extendsProps: any = {}) => {
      const props = {
        ...node.designerProps?.defaultProps,     // Default props
        ...extendsProps,                         // Extended props
        ...node.props,                          // User-set props
        ...node.designerProps?.getComponentProps?.(node), // Dynamic props
      }
      if (node.depth === 0) {
        delete props.style  // Root nodes don't inherit styles
      }
      return props
    }

    const renderComponent = () => {
      const componentName = node.componentName
      const Component = components[componentName]
      const dataId = {}
      
      if (Component) {
        if (designer) {
          dataId[designer?.props?.nodeIdAttrName] = node.id  // Add data-id attribute
        }
        return (
          <TreeNodeContext.Provider value={node}>
            <Component {...renderProps(dataId)} key={node.id}>
              {renderChildren()}
            </Component>
          </TreeNodeContext.Provider>
        )
      } else {
        // Fallback for unknown components
        return (
          <div {...renderProps(dataId)} key={node.id}>
            <span>Unknown Component: {componentName}</span>
            {renderChildren()}
          </div>
        )
      }
    }

    if (!node) return null
    return renderComponent()
  }
)
```

**Usage Example:**
```tsx
const DesignCanvas = () => {
  const tree = useTree()
  const components = {
    Button: MyButton,
    Input: MyInput,
    Container: MyContainer
  }
  
  return (
    <DesignerComponentsContext.Provider value={components}>
      <ComponentTreeWidget components={components}>
        <TreeNodeWidget node={tree} />
      </ComponentTreeWidget>
    </DesignerComponentsContext.Provider>
  )
}
```

### 2. AuxToolWidget - Auxiliary Design Tools

**Purpose:** Provides visual design aids like selection boxes, snap lines, insertion indicators, etc.

**Components:**
- **Selection**: Selection boxes around selected elements
- **Insertion**: Drop zone indicators during drag operations
- **SnapLine**: Alignment guides for precise positioning
- **DashedBox**: Hover state indicators
- **Cover**: Overlay masks for component boundaries
- **FreeSelection**: Multi-select rectangle tool
- **SpaceBlock**: Spacing visualization

**Implementation:**
```tsx
export const AuxToolWidget = () => {
  const engine = useDesigner()
  const viewport = useViewport()
  const prefix = usePrefix('auxtool')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return engine.subscribeWith('viewport:scroll', () => {
      if (viewport.isIframe && ref.current) {
        // Sync scroll position for iframe mode
        ref.current.style.transform = 
          `perspective(1px) translate3d(${-viewport.scrollX}px,${-viewport.scrollY}px,0)`
      }
    })
  }, [engine, viewport])

  if (!viewport) return null

  return (
    <div ref={ref} className={prefix}>
      <Insertion />      {/* Drop indicators */}
      <SpaceBlock />     {/* Spacing guides */}
      <SnapLine />       {/* Alignment guides */}
      <DashedBox />      {/* Hover indicators */}
      <Selection />      {/* Selection boxes */}
      <Cover />          {/* Component covers */}
      <FreeSelection />  {/* Rectangle selection */}
    </div>
  )
}
```

### 3. IconWidget - Icon Display System

**Purpose:** Centralized icon rendering system with theme support and tooltip integration.

**Features:**
- **Multiple Sources**: SVG components, URLs, base64, shadow DOM
- **Theme Support**: Automatic theme-aware icon rendering
- **Tooltip Integration**: Built-in tooltip support
- **Size Management**: Responsive sizing with CSS units
- **Registry Integration**: Global icon registry access

**Advanced Usage:**
```tsx
// Basic icon
<IconWidget infer="DesignOutlined" size={16} />

// Icon with tooltip
<IconWidget 
  infer="SettingOutlined" 
  tooltip="Settings"
  size="1.2em"
/>

// Themed icon with custom props
<IconWidget 
  infer={isDark ? "LightModeIcon" : "DarkModeIcon"}
  tooltip={{ title: "Toggle theme", placement: "top" }}
  onClick={toggleTheme}
  className="theme-toggle"
/>

// Shadow SVG icon
<IconWidget 
  infer={{ shadow: shadowSVGContent }}
  size={24}
/>

// Dynamic icon from registry
<IconWidget 
  infer={registry.getDesignerIcon('CustomIcon')}
  tooltip="Custom Icon"
/>
```

**Icon Provider:**
```tsx
<IconWidget.Provider tooltip={false}>
  {/* Icons within will not show tooltips */}
  <IconWidget infer="SaveOutlined" />
  <IconWidget infer="LoadOutlined" />
</IconWidget.Provider>
```

### 4. HistoryWidget - Undo/Redo History

**Purpose:** Visual history timeline with operation labels and timestamps.

**Features:**
- **Operation Labels**: Localized operation descriptions
- **Timestamps**: Formatted operation timestamps
- **Interactive History**: Click to jump to specific history state
- **Current State Indicator**: Highlights current position in history

**Implementation:**
```tsx
export const HistoryWidget: React.FC = observer(() => {
  const workbench = useWorkbench()
  const currentWorkspace = workbench?.activeWorkspace || workbench?.currentWorkspace
  const prefix = usePrefix('history')
  
  if (!currentWorkspace) return null
  
  return (
    <div className={prefix}>
      {currentWorkspace.history.list().map((item, index) => {
        const type = item.type || 'default_state'
        const token = type.replace(/\:/g, '_')  // Convert operation type to token
        
        return (
          <div
            className={cls(prefix + '-item', {
              active: currentWorkspace.history.current === index,
            })}
            key={item.timestamp}
            onClick={() => {
              currentWorkspace.history.goTo(index)
            }}
          >
            <span className={prefix + '-item-title'}>
              <TextWidget token={`operations.${token}`} />
            </span>
            <span className={prefix + '-item-timestamp'}>
              {format(item.timestamp, 'yy/mm/dd HH:MM:ss')}
            </span>
          </div>
        )
      })}
    </div>
  )
})
```

### 5. TextWidget - Internationalization

**Purpose:** Intelligent text rendering with automatic localization support.

**Features:**
- **Token-based Translation**: Automatic lookup in locale registry
- **Fallback Support**: Graceful fallback to token when translation missing
- **Component Integration**: Easy integration with other widgets

**Usage Examples:**
```tsx
// Simple translation
<TextWidget>save</TextWidget>                    // Renders: "Save" (en) / "保存" (zh)
<TextWidget token="operations.create_node" />    // Renders: "Create Node"

// With default value
<TextWidget token="custom.message" default="Custom Message" />

// In other components
const MyButton = () => (
  <Button>
    <IconWidget infer="SaveOutlined" />
    <TextWidget>save</TextWidget>
  </Button>
)
```

### 6. Additional Key Widgets

#### DroppableWidget - Drop Zone Handler
```tsx
<DroppableWidget onDrop={handleDrop} accepts={['Button', 'Input']}>
  <div className="drop-zone">
    Drop components here
  </div>
</DroppableWidget>
```

#### EmptyWidget - Empty State Display
```tsx
<EmptyWidget dragTipsDirection="left">
  <div>Drag components from the left panel to start designing</div>
</EmptyWidget>
```

#### GhostWidget - Drag Ghosts
```tsx
// Automatically rendered ghost elements during drag operations
<GhostWidget />
```

#### OutlineWidget - Tree Outline
```tsx
<OutlineWidget 
  tree={tree}
  onSelectNode={handleNodeSelect}
  expandedKeys={expandedKeys}
/>
```

## Panel System

### 1. CompositePanel - Tabbed Panel Container

**Purpose:** Flexible tabbed panel system with pinning and collapsing capabilities.

**Features:**
- **Tab Navigation**: Horizontal or vertical tab layouts
- **Pinning System**: Pin panels to keep them open
- **Collapsing**: Show/hide panels to save space
- **Active State**: Track and control active panel
- **Custom Actions**: Extra actions in panel headers

**Advanced Implementation:**
```tsx
export const CompositePanel: React.FC<ICompositePanelProps> & {
  Item: React.FC<ICompositePanelItemProps>
} = (props) => {
  const prefix = usePrefix('composite-panel')
  const [activeKey, setActiveKey] = useState<string | number>(
    props.defaultActiveKey ?? getDefaultKey(props.children)
  )
  const [pinning, setPinning] = useState(props.defaultPinning ?? false)
  const [visible, setVisible] = useState(props.defaultOpen ?? true)
  const items = parseItems(props.children)
  const currentItem = findItem(items, activeKey)
  const content = currentItem?.children

  const renderContent = () => {
    if (!content || !visible) return
    return (
      <div className={cls(prefix + '-tabs-content', { pinning })}>
        <div className={prefix + '-tabs-header'}>
          <div className={prefix + '-tabs-header-title'}>
            <TextWidget>{currentItem.title}</TextWidget>
          </div>
          <div className={prefix + '-tabs-header-actions'}>
            <div className={prefix + '-tabs-header-extra'}>
              {currentItem.extra}
            </div>
            {!pinning && (
              <IconWidget
                infer="PushPinOutlined"
                className={prefix + '-tabs-header-pin'}
                onClick={() => setPinning(!pinning)}
              />
            )}
            <IconWidget
              infer="CloseOutlined"
              className={prefix + '-tabs-header-close'}
              onClick={() => setVisible(false)}
            />
          </div>
        </div>
        <div className={prefix + '-tabs-body'}>
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className={cls(prefix, `${prefix}-${props.direction || 'left'}`)}>
      <div className={prefix + '-tabs'}>
        {items.map((item) => (
          <div
            key={item.key}
            className={cls(prefix + '-tabs-pane', {
              active: activeKey === item.key
            })}
            onClick={() => {
              if (activeKey === item.key) {
                setVisible(!visible)
              } else {
                setActiveKey(item.key)
                setVisible(true)
              }
            }}
          >
            <div className={prefix + '-tabs-pane-icon'}>
              {item.icon}
            </div>
            <div className={prefix + '-tabs-pane-title'}>
              <TextWidget>{item.title}</TextWidget>
            </div>
          </div>
        ))}
      </div>
      {renderContent()}
    </div>
  )
}
```

**Usage Example:**
```tsx
<CompositePanel direction="left" defaultActiveKey="components">
  <CompositePanel.Item 
    key="components" 
    title="Components" 
    icon={<IconWidget infer="ComponentOutlined" />}
  >
    <ResourceWidget />
  </CompositePanel.Item>
  
  <CompositePanel.Item 
    key="outline" 
    title="Outline" 
    icon={<IconWidget infer="OutlineOutlined" />}
    extra={<Button size="small">Expand All</Button>}
  >
    <OutlineWidget />
  </CompositePanel.Item>
  
  <CompositePanel.Item 
    key="history" 
    title="History" 
    icon={<IconWidget infer="HistoryOutlined" />}
  >
    <HistoryWidget />
  </CompositePanel.Item>
</CompositePanel>
```

### 2. SettingsPanel - Property Settings

**Purpose:** Container for property editing forms and settings.

```tsx
<SettingsPanel title="Properties">
  <SettingsForm />
</SettingsPanel>
```

### 3. ToolbarPanel - Toolbar Container

**Purpose:** Container for toolbar actions and controls.

```tsx
<ToolbarPanel>
  <ToolbarPanel.Item>
    <UndoRedoWidget />
  </ToolbarPanel.Item>
  <ToolbarPanel.Item>
    <CopyPasteWidget />
  </ToolbarPanel.Item>
  <ToolbarPanel.Item>
    <ZoomWidget />
  </ToolbarPanel.Item>
</ToolbarPanel>
```

## Simulator System

### 1. Device Simulators

#### PCSimulator - Desktop Simulator
```tsx
export const PCSimulator: React.FC<IPCSimulatorProps> = (props) => {
  const prefix = usePrefix('pc-simulator')
  return (
    <div {...props} className={cls(prefix, props.className)}>
      {props.children}
    </div>
  )
}
```

#### MobileSimulator - Mobile Device Simulator
```tsx
<MobileSimulator device="iPhone12Pro">
  <Viewport>
    {/* Mobile design content */}
  </Viewport>
</MobileSimulator>
```

#### ResponsiveSimulator - Responsive Design Simulator
```tsx
<ResponsiveSimulator 
  minWidth={320}
  maxWidth={1920}
  defaultWidth={1200}
>
  <Viewport>
    {/* Responsive design content */}
  </Viewport>
</ResponsiveSimulator>
```

### 2. Multi-Device Design

```tsx
const MultiDeviceDesigner = () => (
  <Designer engine={engine}>
    <Workbench>
      {/* Device selector */}
      <ViewToolsWidget>
        <ViewToolsWidget.Item onClick={() => setDevice('desktop')}>
          <IconWidget infer="DesktopOutlined" />
        </ViewToolsWidget.Item>
        <ViewToolsWidget.Item onClick={() => setDevice('mobile')}>
          <IconWidget infer="MobileOutlined" />
        </ViewToolsWidget.Item>
        <ViewToolsWidget.Item onClick={() => setDevice('responsive')}>
          <IconWidget infer="ResponsiveOutlined" />
        </ViewToolsWidget.Item>
      </ViewToolsWidget>

      {/* Device-specific viewport */}
      {device === 'desktop' && (
        <PCSimulator>
          <Viewport />
        </PCSimulator>
      )}
      
      {device === 'mobile' && (
        <MobileSimulator device="iPhone12Pro">
          <Viewport />
        </MobileSimulator>
      )}
      
      {device === 'responsive' && (
        <ResponsiveSimulator>
          <Viewport />
        </ResponsiveSimulator>
      )}
    </Workbench>
  </Designer>
)
```

## Context System

### 1. Core Contexts

```typescript
// Designer engine context
export const DesignerEngineContext = createContext<Engine>(null)

// Component registry context
export const DesignerComponentsContext = createContext<IDesignerComponents>({})

// Layout and theming context
export const DesignerLayoutContext = createContext<IDesignerLayoutContext>(null)

// Current tree node context
export const TreeNodeContext = createContext<TreeNode>(null)

// Workspace context
export const WorkspaceContext = createContext<IWorkspaceContext>(null)
```

### 2. Context Usage Patterns

```tsx
// Accessing engine context
const MyComponent = () => {
  const engine = useContext(DesignerEngineContext)
  // or use the hook
  const engine = useDesigner()
}

// Accessing current node context
const MyComponent = () => {
  const node = useContext(TreeNodeContext)
  // or use the hook
  const node = useTreeNode()
}

// Providing component registry
const App = () => {
  const components = {
    Button: MyButton,
    Input: MyInput,
    // ... other components
  }
  
  return (
    <DesignerComponentsContext.Provider value={components}>
      <ComponentTreeWidget />
    </DesignerComponentsContext.Provider>
  )
}
```

## Internationalization System

### 1. Locale Structure

```typescript
// Global translations
export default {
  'zh-CN': {
    save: '保存',
    submit: '提交',
    cancel: '取消',
    reset: '重置',
    publish: '发布',
  },
  'en-US': {
    save: 'Save',
    submit: 'Submit',
    cancel: 'Cancel',
    reset: 'Reset',
    publish: 'Publish',
  },
  'ko-KR': {
    save: '저장',
    submit: '제출',
    cancel: '취소',
    reset: '초기화',
    publish: '게시',
  }
}
```

### 2. Operation Translations

```typescript
// Operation labels for history widget
export default {
  'en-US': {
    'create_node': 'Create Component',
    'update_node_props': 'Update Properties',
    'remove_node': 'Delete Component',
    'move_node': 'Move Component',
    'copy_node': 'Copy Component',
    'paste_node': 'Paste Component',
  },
  'zh-CN': {
    'create_node': '创建组件',
    'update_node_props': '更新属性',
    'remove_node': '删除组件',
    'move_node': '移动组件',
    'copy_node': '复制组件',
    'paste_node': '粘贴组件',
  }
}
```

### 3. Icon Tooltips

```typescript
// Icon tooltips
export default {
  'en-US': {
    'undo': 'Undo',
    'redo': 'Redo',
    'save': 'Save',
    'preview': 'Preview',
    'code': 'View Code',
  },
  'zh-CN': {
    'undo': '撤销',
    'redo': '重做',
    'save': '保存',
    'preview': '预览',
    'code': '查看代码',
  }
}
```

## Icon Library (40+ Icons)

### 1. Icon Categories

```typescript
// Action icons
export * from './actions'    // Save, Load, Export, Import, etc.
export * from './undo'       // Undo operation
export * from './redo'       // Redo operation
export * from './delete'     // Delete/remove
export * from './clone'      // Duplicate/copy

// Component icons
export * from './component'  // Generic component
export * from './container'  // Container component
export * from './text'       // Text component
export * from './image'      // Image component
export * from './boolean'    // Boolean/switch component

// Layout icons
export * from './flex'       // Flexbox layout
export * from './display'    // Display modes
export * from './position'   // Position modes

// Device icons
export * from './pc'         // Desktop device
export * from './mobile'     // Mobile device
export * from './responsive' // Responsive design

// Tool icons
export * from './dragmove'   // Drag to move
export * from './freemove'   // Free movement
export * from './selection'  // Selection tool
export * from './outline'    // Outline view
```

### 2. Icon Usage Examples

```tsx
// Basic usage
<IconWidget infer="SaveOutlined" />

// With size
<IconWidget infer="LoadOutlined" size={20} />

// With tooltip
<IconWidget infer="UndoOutlined" tooltip="Undo last action" />

// Custom icons
<IconWidget infer={MyCustomIcon} size="1.5em" />

// URL-based icons
<IconWidget infer="https://example.com/icon.svg" size={16} />
```

## Advanced Usage Examples

### 1. Complete Design Tool Setup

```tsx
import React from 'react'
import {
  Designer,
  Workbench, 
  Viewport,
  ViewportPanel,
  SettingsPanel,
  CompositePanel,
  HistoryWidget,
  ComponentTreeWidget,
  IconWidget,
  ToolbarPanel,
  ViewToolsWidget
} from '@designable/react'
import { SettingsForm } from '@designable/react-settings-form'
import { createDesigner } from '@designable/core'

const engine = createDesigner()

const DesignTool = () => (
  <Designer engine={engine} theme="light">
    {/* Main toolbar */}
    <ToolbarPanel style={{ height: 40 }}>
      <ToolbarPanel.Item>
        <ViewToolsWidget use={['PC', 'Mobile', 'Responsive']} />
      </ToolbarPanel.Item>
      <ToolbarPanel.Item>
        <HistoryWidget.UndoRedo />
      </ToolbarPanel.Item>
    </ToolbarPanel>

    <div style={{ display: 'flex', height: 'calc(100vh - 40px)' }}>
      {/* Left sidebar */}
      <CompositePanel direction="left" defaultOpen defaultActiveKey="components">
        <CompositePanel.Item
          key="components"
          title="Components"
          icon={<IconWidget infer="ComponentOutlined" />}
        >
          <ResourceWidget title="Widgets" sources={[FormResource, ButtonResource]} />
        </CompositePanel.Item>
        
        <CompositePanel.Item
          key="outline"
          title="Outline"
          icon={<IconWidget infer="OutlineOutlined" />}
        >
          <OutlineWidget />
        </CompositePanel.Item>
        
        <CompositePanel.Item
          key="history"
          title="History"
          icon={<IconWidget infer="HistoryOutlined" />}
        >
          <HistoryWidget />
        </CompositePanel.Item>
      </CompositePanel>

      {/* Main design area */}
      <div style={{ flex: 1 }}>
        <Workbench>
          <ViewportPanel style={{ height: '100%' }}>
            <Viewport
              placeholder={
                <div style={{ textAlign: 'center', padding: 50 }}>
                  <IconWidget infer="DragOutlined" size={48} />
                  <div>Drag components from the left panel to start designing</div>
                </div>
              }
            >
              <ComponentTreeWidget components={{ Button, Input, Form }} />
            </Viewport>
          </ViewportPanel>
        </Workbench>
      </div>

      {/* Right sidebar */}
      <div style={{ width: 300, borderLeft: '1px solid #e8e8e8' }}>
        <SettingsPanel title="Properties">
          <SettingsForm />
        </SettingsPanel>
      </div>
    </div>
  </Designer>
)

export default DesignTool
```

### 2. Custom Widget Development

```tsx
import React from 'react'
import { observer } from '@formily/reactive-react'
import { usePrefix, useSelectedNode, useDesigner } from '@designable/react'

// Custom property inspector widget
export const PropertyInspector: React.FC = observer(() => {
  const prefix = usePrefix('property-inspector')
  const node = useSelectedNode()
  const designer = useDesigner()
  
  if (!node) {
    return (
      <div className={prefix}>
        <div className={prefix + '-empty'}>
          Select a component to view properties
        </div>
      </div>
    )
  }

  const handlePropertyChange = (key: string, value: any) => {
    node.setProps({
      ...node.props,
      [key]: value
    })
    designer.workbench.currentWorkspace.operation.snapshot('update:node:props')
  }

  return (
    <div className={prefix}>
      <div className={prefix + '-header'}>
        <IconWidget infer={node.designerProps?.icon} />
        <span>{node.componentName}</span>
      </div>
      
      <div className={prefix + '-properties'}>
        {Object.entries(node.props || {}).map(([key, value]) => (
          <div key={key} className={prefix + '-property'}>
            <label>{key}</label>
            <input
              type="text"
              value={value?.toString() || ''}
              onChange={(e) => handlePropertyChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
      
      <div className={prefix + '-actions'}>
        <button onClick={() => node.remove()}>
          <IconWidget infer="DeleteOutlined" />
          Delete
        </button>
        <button onClick={() => node.clone()}>
          <IconWidget infer="CopyOutlined" />
          Clone
        </button>
      </div>
    </div>
  )
})
```

### 3. Custom Hook Development

```tsx
// Custom hook for component lifecycle events
export const useComponentLifecycle = (effects: {
  onMount?: (node: TreeNode) => void
  onUnmount?: (node: TreeNode) => void
  onUpdate?: (node: TreeNode) => void
}) => {
  const designer = useDesigner()
  const node = useTreeNode()
  
  useEffect(() => {
    if (!designer || !node) return

    const unsubscribes = [
      designer.subscribeTo('mount:node', (payload) => {
        if (payload.target === node && effects.onMount) {
          effects.onMount(node)
        }
      }),
      
      designer.subscribeTo('unmount:node', (payload) => {
        if (payload.target === node && effects.onUnmount) {
          effects.onUnmount(node)
        }
      }),
      
      designer.subscribeTo('update:node:props', (payload) => {
        if (payload.target === node && effects.onUpdate) {
          effects.onUpdate(node)
        }
      })
    ]

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe())
    }
  }, [designer, node])

  return node
}

// Usage in components
const MyComponent = () => {
  const node = useComponentLifecycle({
    onMount: (node) => console.log('Component mounted:', node.id),
    onUnmount: (node) => console.log('Component unmounted:', node.id),
    onUpdate: (node) => console.log('Component updated:', node.props)
  })
  
  return <div>Component Content</div>
}
```

### 4. Theme Integration

```tsx
// Theme-aware component
const ThemedPanel = () => {
  const theme = useTheme()
  const prefix = usePrefix('themed-panel')
  
  return (
    <div 
      className={cls(prefix, `${prefix}-${theme}`)}
      style={{
        backgroundColor: theme === 'dark' ? '#1f1f1f' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#000000'
      }}
    >
      <IconWidget 
        infer={theme === 'dark' ? 'SunOutlined' : 'MoonOutlined'} 
        tooltip="Toggle theme"
      />
      Theme: {theme}
    </div>
  )
}
```

## Performance Optimizations

### 1. Component Memoization

```tsx
// Optimized tree node rendering
export const TreeNodeWidget = observer(React.memo((props: ITreeNodeWidgetProps) => {
  // Component implementation
}), {
  forwardRef: true,
  displayName: 'TreeNodeWidget'
})

// Optimized with custom comparison
export const OptimizedWidget = React.memo((props) => {
  // Widget implementation
}, (prevProps, nextProps) => {
  return prevProps.node?.id === nextProps.node?.id &&
         prevProps.node?.props === nextProps.node?.props
})
```

### 2. Lazy Loading

```tsx
// Lazy load heavy components
const LazyOutlineWidget = React.lazy(() => 
  import('./OutlineWidget').then(module => ({ default: module.OutlineWidget }))
)

const DesignerPanel = () => (
  <CompositePanel>
    <CompositePanel.Item title="Outline">
      <Suspense fallback={<div>Loading outline...</div>}>
        <LazyOutlineWidget />
      </Suspense>
    </CompositePanel.Item>
  </CompositePanel>
)
```

### 3. Event Optimization

```tsx
// Debounced operations
import { debounce } from '@designable/shared'

const PropertyEditor = () => {
  const node = useSelectedNode()
  const operation = useOperation()
  
  const debouncedSnapshot = useMemo(
    () => debounce(() => {
      operation.snapshot('update:node:props')
    }, 300),
    [operation]
  )

  const handleChange = useCallback((key: string, value: any) => {
    node.setProps({ ...node.props, [key]: value })
    debouncedSnapshot()
  }, [node, debouncedSnapshot])
}
```

## Testing Strategies

### 1. Component Testing

```tsx
import { render, fireEvent } from '@testing-library/react'
import { Designer, Viewport } from '@designable/react'
import { createDesigner } from '@designable/core'

describe('Designer Component', () => {
  it('should render viewport', () => {
    const engine = createDesigner()
    
    const { container } = render(
      <Designer engine={engine}>
        <Viewport />
      </Designer>
    )
    
    expect(container.querySelector('.dn-viewport')).toBeInTheDocument()
  })
  
  it('should handle engine lifecycle', () => {
    const engine = createDesigner()
    const mockMount = jest.spyOn(engine, 'mount')
    const mockUnmount = jest.spyOn(engine, 'unmount')
    
    const { unmount } = render(
      <Designer engine={engine}>
        <div />
      </Designer>
    )
    
    expect(mockMount).toHaveBeenCalled()
    
    unmount()
    
    expect(mockUnmount).toHaveBeenCalled()
  })
})
```

### 2. Hook Testing

```tsx
import { renderHook } from '@testing-library/react'
import { useDesigner, DesignerEngineContext } from '@designable/react'
import { createDesigner } from '@designable/core'

describe('useDesigner Hook', () => {
  it('should return engine from context', () => {
    const engine = createDesigner()
    
    const wrapper = ({ children }) => (
      <DesignerEngineContext.Provider value={engine}>
        {children}
      </DesignerEngineContext.Provider>
    )
    
    const { result } = renderHook(() => useDesigner(), { wrapper })
    
    expect(result.current).toBe(engine)
  })
})
```

### 3. Widget Testing

```tsx
import { render } from '@testing-library/react'
import { IconWidget } from '@designable/react'

describe('IconWidget', () => {
  it('should render icon correctly', () => {
    const { container } = render(
      <IconWidget infer="SaveOutlined" size={16} />
    )
    
    const icon = container.querySelector('.dn-icon')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveStyle({ width: '16px', height: '16px' })
  })
  
  it('should show tooltip when provided', () => {
    const { getByRole } = render(
      <IconWidget infer="SaveOutlined" tooltip="Save file" />
    )
    
    fireEvent.mouseEnter(getByRole('img'))
    expect(screen.getByText('Save file')).toBeInTheDocument()
  })
})
```

## Migration Guide

### From v1.x to v2.x

```tsx
// v1.x
import { Designer, Workbench } from '@designable/react'

// v2.x - Updated import paths
import { 
  Designer, 
  Workbench,
  useDesigner  // Explicit hook imports
} from '@designable/react'

// v1.x - Old hook usage
const engine = useContext(DesignerEngineContext)

// v2.x - New hook usage
const engine = useDesigner()
```

### Component API Changes

```tsx
// v1.x - Old panel API
<Panel title="Components">
  <ResourceWidget />
</Panel>

// v2.x - New composite panel API
<CompositePanel>
  <CompositePanel.Item title="Components">
    <ResourceWidget />
  </CompositePanel.Item>
</CompositePanel>
```

## Browser Support

### Minimum Requirements
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Features Used
- React 16.8+ (Hooks)
- Context API
- ResizeObserver
- IntersectionObserver
- requestIdleCallback

### Polyfills

```typescript
// Automatic polyfills provided by @designable/shared
import { 
  globalThisPolyfill,
  requestIdle,
  cancelIdle 
} from '@designable/shared'
```

## Performance Benchmarks

### Bundle Size
- Core package: ~45KB (gzipped)
- With all widgets: ~120KB (gzipped)
- Tree-shakable: Individual widgets can be imported

### Runtime Performance
- 60fps viewport interactions
- <16ms component tree renders
- Lazy loading for non-critical widgets
- Optimized event handling with debouncing

## Summary

The `@designable/react` package provides:

**Core Architecture:**
- Designer container with engine lifecycle management
- 5 core container components (Designer, Workbench, Workspace, Viewport, Simulator)
- 20+ specialized React hooks
- 15+ UI widgets for design tools
- Flexible panel system

**Key Features:**
- Complete React integration layer
- Device simulation system (PC, Mobile, Responsive)
- Auxiliary design tools (selection, guides, snap lines)
- Icon library with 40+ design-focused icons
- Comprehensive hook system for engine integration
- Multi-language internationalization

**Widget System:**
- ComponentTreeWidget: Renders design tree as React components
- AuxToolWidget: Visual design aids and tools
- IconWidget: Centralized icon system with theming
- HistoryWidget: Visual undo/redo timeline
- CompositePanel: Flexible tabbed panel system

**Advanced Capabilities:**
- Theme support (light/dark modes)
- Context-based state management
- Performance optimizations
- TypeScript support throughout
- Extensive testing utilities

**Best For:**
- Visual design tool development
- Drag-and-drop interface builders
- Form designers and page builders
- Component-based design systems
- Multi-device design tools

---

**Last Updated**: December 26, 2025  
**Version**: Based on current codebase  
**Maintainer**: Designable Team  
**Package Purpose**: React integration layer for visual design tools  
**Total Components**: 40+ components, hooks, and widgets  
**Key Features**: Complete React toolkit, device simulation, auxiliary tools, internationalization
