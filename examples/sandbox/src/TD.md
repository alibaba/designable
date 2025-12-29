# Technical Documentation - Designable Sandbox Example

## Overview
This is a sandbox example application demonstrating the Designable framework - a low-code visual designer built with React. It provides a drag-and-drop interface for creating form-based UIs with real-time preview capabilities.

## Architecture

### Core Files

1. **main.tsx** - Application entry point and main configuration
2. **content.tsx** - Component rendering logic for the designer canvas
3. **sandbox.tsx** - Sandbox initialization and bootstrapping

## File Breakdown

### 1. main.tsx (415 lines)

#### Purpose
Main application file that configures the Designable designer with behaviors, resources, and the complete UI layout.

#### Key Components

##### Designer Configuration
- **Engine**: Uses `createDesigner()` to initialize the designer engine
- **Behaviors**: Defines component behaviors and properties schema
- **Resources**: Creates draggable component resources for the component palette

##### Component Behaviors

###### RootBehavior
```typescript
const RootBehavior = createBehavior({
  name: 'Root',
  selector: 'Root',
  designerProps: { droppable: true },
  designerLocales: {...}
})
```
- Defines the root container behavior
- Allows components to be dropped into it

###### InputBehavior
```typescript
const InputBehavior = createBehavior({
  name: 'Input',
  selector: (node) => node.componentName === 'Field' && node.props['x-component'] === 'Input',
  designerProps: {
    propsSchema: {...}
  }
})
```
- Configures Input field component
- Defines comprehensive property schema including:
  - Field properties (title, hidden, default value)
  - Style properties (width, height, display, background, box shadow, font, margin, padding, border radius, border)
  - Supports multi-language localization (zh-CN, en-US, ko-KR)

###### CardBehavior
```typescript
const CardBehavior = createBehavior({
  name: 'Card',
  selector: 'Card',
  designerProps: { droppable: true }
})
```
- Defines Card container component
- Allows nested components

##### Resource Definitions

###### Input Resource
```typescript
const Input = createResource({
  title: { 'zh-CN': '输入框', 'en-US': 'Input', 'ko-KR': '입력 상자' },
  icon: 'InputSource',
  elements: [{
    componentName: 'Field',
    props: {
      title: '输入框',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input'
    }
  }]
})
```

###### Card Resource
```typescript
const Card = createResource({
  title: { 'zh-CN': '卡片', 'en-US': 'Card', 'ko-KR': '카드 상자' },
  icon: 'CardSource',
  elements: [{
    componentName: 'Card',
    props: { title: '卡片' }
  }]
})
```

##### UI Layout Structure

```
Designer
└── Workbench
    └── StudioPanel
        ├── Logo
        ├── Actions (Language switcher, GitHub link, Save/Publish buttons)
        ├── CompositePanel (Left sidebar)
        │   ├── Component Panel (Resource widgets)
        │   ├── Outline Tree Panel
        │   └── History Panel
        ├── WorkspacePanel (Center canvas)
        │   ├── ToolbarPanel
        │   │   ├── DesignerToolsWidget
        │   │   └── ViewToolsWidget
        │   └── ViewportPanel
        │       ├── Designable View (Sandbox)
        │       └── JSON Tree View (Monaco Editor)
        └── SettingsPanel (Right sidebar)
            └── SettingsForm
```

##### Special Features

1. **React 19 Compatibility Warning Suppression**
```typescript
const originalConsoleWarn = console.warn
console.warn = function (...args: any[]) {
  if (args[0]?.includes('antd v5 support React is 16 ~ 18')) {
    return
  }
  originalConsoleWarn.apply(console, args)
}
```

2. **Multi-language Support**
- Supports English (en-US), Simplified Chinese (zh-CN), and Korean (ko-KR)
- Language switcher in Actions component
- Automatic fallback to zh-cn if unsupported locale detected

3. **Sandbox Integration**
```typescript
<Sandbox
  jsAssets={[
    'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
  ]}
/>
```

### 2. content.tsx (45 lines)

#### Purpose
Defines the visual components that render on the designer canvas.

#### Key Components

##### ComponentTreeWidget
Renders the component tree with custom component implementations.

##### Field Component
```typescript
Field: observer((props) => {
  const node = useTreeNode()
  return (
    <span {...props} style={{...}}>
      <span data-content-editable="title">{node.props.title}</span>
      {props.children}
    </span>
  )
})
```
- Observable component (reactive to state changes)
- Displays editable title via `data-content-editable` attribute
- Styled with gray background and border

##### Card Component
```typescript
Card: (props) => {
  return (
    <div {...props} style={{...}}>
      {props.children ? props.children : <span>拖拽字段进入该区域</span>}
    </div>
  )
}
```
- Container component with minimum height of 150px
- Shows placeholder text when empty: "拖拽字段进入该区域" (Drag fields into this area)
- Uses flexbox for center alignment

### 3. sandbox.tsx (7 lines)

#### Purpose
Bootstraps the sandbox environment for isolated component rendering.

#### Implementation
```typescript
renderSandboxContent(() => {
  return <Content />
})
```
- Uses `renderSandboxContent` from `@designable/react-sandbox`
- Renders the Content component in an isolated iframe environment
- Ensures designer changes don't affect the main application

## Technology Stack

### Core Libraries
- **React 18+**: UI library
- **@designable/core**: Designer engine core
- **@designable/react**: React bindings for Designable
- **@designable/react-settings-form**: Settings form components
- **@designable/react-sandbox**: Sandbox rendering environment
- **@formily/react**: Formily reactive form library
- **@formily/reactive-react**: Reactive React bindings
- **Ant Design (antd)**: UI component library
- **Monaco Editor**: Code editor integration

### Build Tools
- **Vite**: Build tool (as indicated by vite.config.ts in parent folder)
- **TypeScript**: Type system

## Key Patterns and Concepts

### 1. Behavior-Driven Design
Components are defined using behaviors that specify:
- Selectors for component matching
- Designer properties (droppable, resizable, etc.)
- Property schemas for settings panel
- Localized labels and descriptions

### 2. Resource-Based Components
Components are registered as resources that can be dragged from the palette:
- Multi-language titles
- Icon associations
- Default element structure

### 3. Observer Pattern
Uses MobX-style observers for reactive state management:
- `@formily/reactive-react` for reactive components
- Automatic re-rendering on state changes

### 4. Sandbox Isolation
Components render in an isolated iframe:
- Prevents style conflicts
- Allows safe execution of user-defined code
- External CDN assets for dependencies

### 5. Property Schema System
Formily-based schema for defining component properties:
- Nested object structures
- Various input types (Input, Switch, ValueInput, etc.)
- Style setters (SizeInput, DisplayStyleSetter, etc.)
- Drawer-based complex editors

## Localization

Supports three languages with complete translations:
- **zh-CN**: Simplified Chinese (default)
- **en-US**: English
- **ko-KR**: Korean

Localized elements:
- Component titles and descriptions
- Property labels
- UI panels and actions
- Source categories

## Extension Points

### Adding New Components
1. Define behavior with `createBehavior()`
2. Register behavior in `GlobalRegistry.setDesignerBehaviors()`
3. Create resource with `createResource()`
4. Add to ResourceWidget sources
5. Implement renderer in content.tsx

### Customizing Property Panel
Modify the `propsSchema` in component behaviors:
- Add new properties
- Create custom setters
- Organize with CollapseItem containers

### Adding Views
Create new ViewPanel types in ViewportPanel:
- Current views: DESIGNABLE, JSONTREE
- Can add custom view renderers

## Workflow

1. **Component Selection**: User drags component from left panel
2. **Canvas Drop**: Component drops onto canvas (ViewportPanel)
3. **Rendering**: Content.tsx renders component in sandbox
4. **Property Edit**: Right panel (SettingsPanel) shows component properties
5. **Real-time Update**: Changes reflect immediately via reactive state
6. **Preview**: Sandbox shows live preview of designed UI

## Development Notes

### Console Warning Suppression
The application suppresses Ant Design v5 React compatibility warnings for React 19, allowing for smoother development experience without affecting functionality.

### Asset Loading
External React and ReactDOM are loaded from CDN in the sandbox environment to ensure consistent runtime behavior.

### State Management
- Designer state managed by Designable engine
- Component state reactive via Formily
- UI state via React hooks and observers

## Future Enhancements

Potential areas for expansion:
- Additional component types
- Custom style setters
- Export/import functionality
- Code generation features
- Template system
- Plugin architecture

## Related Documentation

- [Designable GitHub](https://github.com/alibaba/designable)
- Main project README: `../../README.md`
- Package documentation: See individual package READMEs

---

**Last Updated**: December 26, 2025  
**Version**: Based on current codebase  
**Maintainer**: Designable Team
