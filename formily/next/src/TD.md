# Technical Documentation - Formily Fusion Design (Next) Integration

## Overview
This package provides a complete integration between the Designable framework and Alibaba's Fusion Design (Next) UI library through Formily. It enables visual form design capabilities with Fusion Design components, offering a comprehensive set of pre-configured components, schemas, and localization support for building low-code form designers.

## Architecture

### Module Structure

```
formily/next/src/
├── index.ts              # Main entry point
├── shared.ts             # Shared utilities and helpers
├── components/           # Component implementations (27 components)
├── schemas/              # Component property schemas
├── locales/              # Internationalization
├── common/               # Common utilities and containers
└── hooks/                # Custom React hooks
```

## Core Modules

### 1. Entry Point (index.ts)

#### Purpose
Main module entry that exports all components, schemas, locales, and shared utilities for use in Designable applications.

```typescript
export * from './components/index'  
export * from './schemas/index'
export * from './locales/index'
export * from './shared'
```

### 2. Shared Utilities (shared.ts - 118 lines)

#### Purpose
Provides utility functions for component matching, node querying, and tree traversal operations. Nearly identical to the antd version with minor TypeScript improvements.

#### Key Functions

##### Component Matching
```typescript
matchComponent(node: TreeNode, name: ComponentNameMatcher, context?: any): boolean
```
- Matches component by name, array of names, or custom function
- Supports wildcard matching with `*`
- Checks `x-component` property

##### Child Component Matching
```typescript
matchChildComponent(node: TreeNode, name: ComponentNameMatcher, context?: any): boolean
```
- Matches child components using dot notation (e.g., `ArrayCards.Addition`)
- Validates component name existence before matching

##### Component Inclusion Check
```typescript
includesComponent(node: TreeNode, names: ComponentNameMatcher[], target?: TreeNode): boolean
```
- Checks if node matches any component in the names array

##### Node Querying
```typescript
queryNodesByComponentPath(node: TreeNode, path: ComponentNameMatcher[]): TreeNode[]
```
- Queries nodes by component path pattern
- Returns array of all matching nodes
- Uses reduce with explicit type annotation

```typescript
findNodeByComponentPath(node: TreeNode, path: ComponentNameMatcher[]): TreeNode | undefined
```
- Finds first node matching component path
- Returns single node or undefined
- Includes path validation

##### Array Item Detection
```typescript
matchArrayItemsNode(node: TreeNode): boolean
```
- Detects if node is an array item node
- Checks if parent type is 'array' and node is first child

##### Node ID Creation
```typescript
createNodeId(designer: Engine, id: string): Record<string, string>
```
- Creates node ID attribute for designer integration
- Extracts attribute name from designer props
- Returns strongly-typed record

##### Type Items Node Ensurer
```typescript
createEnsureTypeItemsNode(type: string): (node: TreeNode) => TreeNode
```
- Factory function to create node type validators
- Creates new node if not exists
- Prepends to parent node

## Component System

### Component Structure

Each component follows a consistent pattern:
1. **Preview Component** - Visual representation in designer
2. **Behavior Definition** - Designer interactions and properties
3. **Resource Definition** - Draggable palette item configuration

### Base Components

#### 1. Field Component (components/Field/preview.tsx)

##### Purpose
Core field component that renders different field types (Field, ObjectField, ArrayField, VoidField) based on schema configuration.

##### Type Definition
```typescript
export const Field: DnFC<ISchema> = observer((props) => {...})
```
- Uses `DnFC` (Designable Functional Component) type
- Typed with ISchema interface

##### Key Features

**Schema State Mapping**
```typescript
const SchemaStateMap = {
  title: 'title',
  description: 'description',
  default: 'value',
  enum: 'dataSource',
  readOnly: 'readOnly',
  writeOnly: 'editable',
  required: 'required',
  'x-content': 'content',
  'x-value': 'value',
  'x-editable': 'editable',
  'x-disabled': 'disabled',
  'x-read-pretty': 'readPretty',
  'x-read-only': 'readOnly',
  'x-visible': 'visible',
  'x-hidden': 'hidden',
  'x-display': 'display',
  'x-pattern': 'pattern',
}
```

**Expression Handling**
- Detects expressions in format: `{{expression}}`
- Filters expressions from schema values recursively
- Preserves expressions for display properties

**Field Type Rendering**
```typescript
if (props.type === 'object') {
  return (
    <Container>
      <ObjectField {...fieldProps} name={node.id}>{props.children}</ObjectField>
    </Container>
  )
} else if (props.type === 'array') {
  return <ArrayField {...fieldProps} name={node.id} />
} else if (node.props.type === 'void') {
  return (
    <VoidField {...fieldProps} name={node.id}>{props.children}</VoidField>
  )
}
return <InternalField {...fieldProps} name={node.id} />
```

**Editable Content**
- Title and description wrapped with `data-content-editable` attribute
- Enables inline editing in designer

#### 2. Input Component (components/Input/preview.ts)

##### Implementation
```typescript
export const Input: DnFC<React.ComponentProps<typeof FormilyInput>> = FormilyInput

Input.Behavior = createBehavior(
  {
    name: 'Input',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Input',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Input),
    },
    designerLocales: AllLocales.Input,
  },
  {
    name: 'Input.TextArea',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Input.TextArea',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Input.TextArea),
    },
    designerLocales: AllLocales.TextArea,
  }
)

Input.Resource = createResource(
  {
    icon: 'InputSource',
    elements: [{
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'Input',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
    }],
  },
  {
    icon: 'TextAreaSource',
    elements: [{
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'TextArea',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
      },
    }],
  }
)
```

##### Features
- Uses `DnFC` type for better type safety
- Extends base Field behavior
- Supports both Input and Input.TextArea variants
- Provides icon-based resources for palette

### Available Components (27 components)

#### Form Components
1. **Form** - Root form container
2. **Field** - Base field component

#### Input Components
3. **Input** - Text input with inner/addon elements
4. **Input.TextArea** - Multi-line text input
5. **Password** - Password input with visibility toggle
6. **NumberPicker** - Number input with increment/decrement

#### Selection Components
7. **Select** - Dropdown selection
8. **TreeSelect** - Tree-structured selection
9. **Cascader** - Cascading selection
10. **Radio** - Radio button group
11. **Checkbox** - Checkbox group
12. **Transfer** - Dual-list transfer

#### Date/Time Components
13. **DatePicker** - Date selection
14. **TimePicker** - Time selection

#### Interactive Components
15. **Range** - Range slider (Fusion-specific)
16. **Rating** - Star rating (Fusion-specific, different from Rate)
17. **Switch** - Toggle switch

#### Layout Components
18. **Card** - Card container
19. **Space** - Spacing layout
20. **FormLayout** - Form layout configuration
21. **FormGrid** - Grid-based layout
22. **FormTab** - Tab-based layout
23. **FormCollapse** - Collapsible sections

#### Container Components
24. **Object** - Object field container
25. **ArrayCards** - Card-based array field
26. **ArrayTable** - Table-based array field
27. **Text** - Static text display

### Differences from Ant Design Version

#### Component Variations
- **Range** instead of Slider (Fusion naming)
- **Rating** instead of Rate (different API)
- **Upload** component has Fusion-specific props

#### Styling
- Uses SCSS for Form component instead of LESS
- Fusion Design styling system
- Different class name conventions

### Complex Components

#### ArrayCards Component (components/ArrayCards/preview.tsx)

##### Purpose
Renders array fields as a collection of cards with built-in operations using Fusion Design Card component.

##### Type Definition
```typescript
export const ArrayCards: DnFC<CardProps> = observer((props) => {...})
```
- Typed with Fusion's CardProps from `@alifd/next/types/card`

##### Structure
```
ArrayCards
├── ArrayCards.Index      # Index display
├── Object (items)        # Item container
│   ├── User Fields       # Custom fields
│   ├── ArrayCards.Remove # Remove button
│   ├── ArrayCards.MoveUp # Move up button
│   └── ArrayCards.MoveDown # Move down button
└── ArrayCards.Addition   # Add button
```

##### Template System
```typescript
useDropTemplate('ArrayCards', (source) => {
  const indexNode = new TreeNode({...})
  const additionNode = new TreeNode({...})
  const removeNode = new TreeNode({...})
  const moveDownNode = new TreeNode({...})
  const moveUpNode = new TreeNode({...})
  
  const objectNode = new TreeNode({
    type: 'object',
    children: [indexNode, ...source, removeNode, moveDownNode, moveUpNode],
  })
  
  return [objectNode, additionNode]
})
```

##### Fusion-Specific Features
- Uses `@alifd/next` Card component
- `contentHeight="auto"` prop
- Different styling conventions
- Uses `ArrayBase.Item` with `record={null}` instead of `record={{}}`

## Schema System

### Schema Architecture

#### Purpose
Defines property configuration forms for each component in the designer's settings panel.

#### Schema Structure (schemas/Input.ts - 169 lines)

```typescript
export const Input: ISchema & { TextArea?: ISchema } = {
  type: 'object',
  properties: {
    size: {
      type: 'string',
      enum: ['small', 'medium', 'large', ''],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'medium',
      },
    },
    maxLength: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    showLimitHint: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    cutString: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    trim: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    placeholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    composition: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    hasClear: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    hasBorder: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    hint: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    innerBefore: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    innerAfter: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    addonTextBefore: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    addonTextAfter: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    autoFocus: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
  },
}
```

#### Fusion-Specific Properties

**Input Component**
- `showLimitHint`: Show character count limit
- `cutString`: Truncate string when max length exceeded
- `trim`: Remove leading/trailing spaces
- `composition`: Filter IME intermediate characters
- `hasClear`: Show clear button (vs `allowClear` in antd)
- `hasBorder`: Show border (vs `bordered` in antd)
- `hint`: Watermark hint text
- `innerBefore`/`innerAfter`: Inner addon elements
- `addonTextBefore`/`addonTextAfter`: Outer addon elements

#### CSS Style Schema (schemas/CSSStyle.ts)

Identical to antd version - provides comprehensive style configuration:
```typescript
export const CSSStyle: ISchema = {
  type: 'void',
  properties: {
    'style.width': { 'x-component': 'SizeInput' },
    'style.height': { 'x-component': 'SizeInput' },
    'style.display': { 'x-component': 'DisplayStyleSetter' },
    'style.background': { 'x-component': 'BackgroundStyleSetter' },
    'style.boxShadow': { 'x-component': 'BoxShadowStyleSetter' },
    'style.font': { 'x-component': 'FontStyleSetter' },
    'style.margin': { 'x-component': 'BoxStyleSetter' },
    'style.padding': { 'x-component': 'BoxStyleSetter' },
    'style.borderRadius': { 'x-component': 'BorderRadiusStyleSetter' },
    'style.border': { 'x-component': 'BorderStyleSetter' },
    'style.opacity': {
      'x-component': 'Slider',
      'x-component-props': {
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
  },
}
```

### Field Schema Helpers (components/Field/shared.ts - 222 lines)

#### createFieldSchema
```typescript
createFieldSchema(component?: ISchema, decorator: ISchema = AllSchemas.FormItem): ISchema
```

Creates comprehensive field property schema with:
- **field-group**: Basic field properties (name, title, description)
- **component-group**: Component-specific properties
- **decorator-group**: Decorator properties (e.g., FormItem)
- **component-style-group**: Component styles
- **decorator-style-group**: Decorator styles

Features:
- Reactive visibility based on selections
- Collapsible sections
- Style configuration integration
- Data source management
- Validation rules
- Reaction configuration

#### createComponentSchema
```typescript
createComponentSchema(component: ISchema, decorator: ISchema)
```

Creates isolated component and decorator schema groups without field properties.

## Localization System

### Structure

Each component has localized strings in two languages:
- **zh-CN**: Simplified Chinese
- **en-US**: English

**Note**: Unlike the antd version, this package does not include Korean (ko-KR) localization.

### Example (locales/Input.ts)

```typescript
export const Input = {
  'zh-CN': {
    title: '输入框',
    settings: {
      'x-component-props': {
        showLimitHint: '长度限制提示',
        cutString: {
          title: '截断',
          tooltip: '当设置最大长度后，超出是否截断字符串',
        },
        trim: {
          title: '修剪',
          tooltip: '移除首尾空格',
        },
        composition: '过滤输入法中间字母',
        hint: {
          title: '水印',
          tooltip: '值取自 Icon 的 type，与清除按钮在同一位置',
        },
      },
    },
  },
  'en-US': {
    title: 'Input',
    settings: {
      'x-component-props': {
        showLimitHint: 'Show Limit Hint',
        cutString: {
          title: 'Cut String',
          tooltip: 'When the maxLength is set, whether to truncate the string is exceeded',
        },
        trim: {
          title: 'Trim',
          tooltip: 'Remove leading and trailing spaces',
        },
        composition: 'Filter Ime Middle Letters',
        hint: {
          title: 'Hint',
          tooltip: 'The value is taken from the type of Icon and is in the same position as the clear button',
        },
      },
    },
  },
}
```

### Locale Coverage

All 27 components have complete localization including:
- Component titles
- Property labels
- Help text and tooltips with nested structure
- Array operation labels (Add, Remove, Move Up, Move Down, Index)
- Fusion-specific property descriptions

### Localization Type System (locales/types.ts)

Provides TypeScript type definitions for locale objects, ensuring type safety across all translations.

## Common Utilities

### 1. Container Component (common/Container/index.tsx)

#### Purpose
Wraps components to make them droppable in the designer.

```typescript
export const Container: React.FC<{ children?: React.ReactNode }> = observer((props) => {
  return React.createElement(DroppableWidget as any, null, props.children)
})

export const withContainer = (Target: React.JSXElementConstructor<any>) => {
  return (props: any) => {
    return React.createElement(DroppableWidget as any, null, React.createElement(Target, props))
  }
}
```

Features:
- Observable for reactive updates
- Uses `React.createElement` instead of JSX
- DroppableWidget integration with type casting
- HOC pattern for wrapping components
- Explicit children type annotation

### 2. LoadTemplate Component (common/LoadTemplate/index.tsx)

#### Purpose
Renders action buttons for loading component templates.

```typescript
export interface ITemplateAction {
  title: React.ReactNode
  tooltip?: React.ReactNode
  icon?: string | React.ReactNode
  onClick: () => void
}

export const LoadTemplate: React.FC<ILoadTemplateProps> = (props) => {
  return (
    <NodeActionsWidget>
      {props.actions?.map((action, key) => (
        <NodeActionsWidget.Action {...action} key={key} />
      ))}
    </NodeActionsWidget>
  )
}
```

### 3. FormItemSwitcher Component (common/FormItemSwitcher/index.tsx)

#### Purpose
Toggle switch for enabling/disabling FormItem decorator using Fusion Switch component.

```typescript
export const FormItemSwitcher: React.FC<IFormItemSwitcherProps> = (props) => {
  return (
    <Switch
      checked={props.value === 'FormItem'}
      onChange={(value) => {
        props.onChange?.(value ? 'FormItem' : '')
      }}
    />
  )
}
```

**Note**: Uses Fusion's Switch component instead of Ant Design's.

## Custom Hooks

### useDropTemplate Hook (hooks/useDropTemplate.ts)

#### Purpose
Handles template generation when components are dropped onto array containers.

```typescript
export const useDropTemplate = (
  name: string,
  getChildren: (source: TreeNode[]) => TreeNode[]
) => {
  return useDesigner((designer: Engine) => {
    return designer.subscribeTo(AppendNodeEvent, (event: AppendNodeEvent) => {
      const { source, target } = event.data
      
      if (Array.isArray(target)) return
      if (!Array.isArray(source)) return
      
      if (
        matchComponent(target, (key: string) =>
          key === name && source.every((child) => !matchChildComponent(child, name))
        ) &&
        target.children.length === 0
      ) {
        target.setChildren(...getChildren(source))
        return false // Prevent default behavior
      }
    })
  })
}
```

#### Features
- Subscribes to AppendNodeEvent
- Generates child structure from dropped components
- Validates source and target arrays
- Only triggers on empty containers
- Prevents duplicate template generation

## Array Component System

### Array Behaviors (components/ArrayBase/index.ts)

#### createArrayBehavior Factory

Generates complete behavior definitions for array components:

```typescript
createArrayBehavior(name: string)
```

Creates 6 behaviors:
1. **Base Array** - Main container with droppable support
2. **Addition** - Add new item button
3. **Remove** - Remove item button
4. **Index** - Item index display
5. **MoveUp** - Move item up
6. **MoveDown** - Move item down

#### Behavior Structure
```typescript
{
  name: 'ArrayCards',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'ArrayCards',
  designerProps: {
    droppable: true,
    propsSchema: createFieldSchema(AllSchemas.ArrayCards),
  },
  designerLocales: AllLocales.ArrayCards,
}
```

#### Sub-Component Behaviors
Each array operation has:
- Specific selector for x-component matching
- Drop constraints via allowDrop function
- Void field schema
- Localized labels from AllLocales

## Design Patterns

### 1. Component Extension Pattern

Components extend base Field behavior:
```typescript
{
  name: 'Input',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Input',
  designerProps: {...},
  designerLocales: {...}
}
```

### 2. Schema-Driven Configuration

Properties defined via JSON Schema:
```typescript
{
  type: 'string',
  'x-decorator': 'FormItem',
  'x-component': 'Input',
  'x-component-props': {
    placeholder: 'Enter value',
    hasClear: true
  }
}
```

### 3. Reactive State Management

Uses Formily reactive system:
```typescript
observer((props) => {
  const node = useTreeNode()
  // Component automatically re-renders on node changes
})
```

### 4. Template Generation Pattern

Dynamic child structure generation:
```typescript
useDropTemplate('ArrayCards', (source: TreeNode[]) => {
  // Generate structure from dropped source
  return [objectNode, additionNode]
})
```

### 5. Type-Safe Component Pattern

Uses DnFC for type safety:
```typescript
export const Input: DnFC<React.ComponentProps<typeof FormilyInput>> = FormilyInput
```

### 6. Localization Pattern

Centralized locale definitions with nested tooltips:
```typescript
{
  'zh-CN': {
    title: '输入框',
    settings: {
      'x-component-props': {
        property: {
          title: '属性',
          tooltip: '详细说明'
        }
      }
    }
  },
  'en-US': {...}
}
```

## Integration Points

### 1. Formily Integration
- Uses `@formily/next` components (Fusion Design bindings)
- Formily React for field management
- Formily reactive for state management
- FormItem from `@formily/next`

### 2. Designable Integration
- `@designable/core` for behaviors and resources
- `@designable/react` for designer UI components
- `@designable/formily-setters` for property setters
- `DnFC` type for component definitions

### 3. Fusion Design Integration
- Direct usage of `@alifd/next` components
- Fusion Design v1.x compatibility
- Custom styling via Less and SCSS files
- Fusion-specific component APIs

## Configuration Schema Structure

### Field Properties Schema Sections

1. **Field Group**
   - name: Field name
   - title: Display title
   - description: Help text
   - default: Default value
   - required: Required validation
   - pattern: Pattern validation
   - display: Display state
   - visible: Visibility state

2. **Component Group**
   - Component-specific properties
   - Visible when x-component is set
   - Uses component schema
   - Fusion-specific props

3. **Decorator Group**
   - FormItem properties
   - Label configuration
   - Layout settings
   - Visible when x-decorator is set

4. **Style Groups**
   - Component styles (CSS properties)
   - Decorator styles (CSS properties)
   - CSS property editors

5. **Advanced**
   - Data source configuration
   - Validation rules
   - Reactions (conditional logic)

## Component Lifecycle

### 1. Component Registration
```typescript
// In component file
Input.Behavior = createBehavior({...})
Input.Resource = createResource({...})
```

### 2. Behavior Definition
- Name and selector
- Extends base behaviors
- Designer properties
- Schema configuration
- Locales assignment

### 3. Resource Creation
- Icon assignment
- Default props
- Element structure with x-component

### 4. Runtime Rendering
- Schema to props conversion
- Expression evaluation and filtering
- Field type detection
- Component instantiation
- Fusion component rendering

## Advanced Features

### 1. Expression System

Supports expressions in schema:
```typescript
'{{$form.values.field}}'  // Form value reference
'{{!!$form.values["x-component"]}}'  // Boolean expression
```

### 2. Conditional Visibility

Schema reactions for dynamic UI:
```typescript
'x-reactions': {
  fulfill: {
    state: {
      visible: '{{!!$form.values["x-component"]}}'
    }
  }
}
```

### 3. Content Editable

Inline editing in designer:
```typescript
<span data-content-editable="title">{title}</span>
<span data-content-editable="description">{description}</span>
<span data-content-editable="x-component-props.title">{props.title}</span>
```

### 4. Component Composition

Sub-component pattern:
```typescript
Input.TextArea  // Sub-component
ArrayCards.Addition  // Array operation
FormTab.TabPane  // Tab panel
```

### 5. Type Safety

Strong typing throughout:
```typescript
DnFC<ISchema>  // Component type
ISchema & { TextArea?: ISchema }  // Schema type
Record<string, string>  // Node ID type
```

## Styling System

### Style Technologies
- **LESS**: Component-specific styles (most components)
- **SCSS**: Form component styles
- CSS modules pattern
- Scoped class names

### Style Files
- `components/ArrayCards/styles.less`
- `components/ArrayTable/styles.less`
- `components/Form/styles.scss` (unique to this package)
- `components/FormGrid/styles.less`
- `components/Text/styles.less`
- `common/Container/styles.less`

### Fusion Design Styling
- Uses Fusion Design theme variables
- Compatible with Fusion Design customization
- Different class naming conventions from antd

## Fusion-Specific Features

### 1. Component API Differences

**Input Component**
```typescript
// Fusion Next
hasClear: boolean      // vs allowClear in antd
hasBorder: boolean     // vs bordered in antd
hint: string          // Watermark hint
innerBefore/innerAfter // Inner addon elements
addonTextBefore/addonTextAfter // Outer addon elements
showLimitHint: boolean // Character count display
cutString: boolean    // Auto-truncate
trim: boolean         // Auto-trim
composition: boolean  // IME filtering
```

**Size Options**
```typescript
// Fusion Next sizes
'small' | 'medium' | 'large'  // vs 'small' | 'middle' | 'large' in antd
```

**Card Component**
```typescript
// Fusion Next
contentHeight: 'auto'  // Specific to Fusion
```

### 2. ArrayBase Differences

```typescript
// Fusion Next
<ArrayBase.Item index={0} record={null}>

// Ant Design
<ArrayBase.Item index={0} record={{}}>
```

### 3. Import Sources

```typescript
// Fusion Next
import { Input } from '@formily/next'
import { Card } from '@alifd/next'
import { CardProps } from '@alifd/next/types/card'

// Ant Design
import { Input } from '@formily/antd-v5'
import { Card } from 'antd'
import { CardProps } from 'antd'
```

## Development Guidelines

### Adding New Components

1. **Create Component Structure**
   ```
   components/MyComponent/
   ├── index.ts
   ├── preview.tsx
   └── styles.less (or styles.scss)
   ```

2. **Implement Preview Component**
   ```typescript
   import { MyComponent as FormilyMyComponent } from '@formily/next'
   import { DnFC } from '@designable/react'
   
   export const MyComponent: DnFC<React.ComponentProps<typeof FormilyMyComponent>> = 
     FormilyMyComponent
   
   MyComponent.Behavior = createBehavior({
     name: 'MyComponent',
     extends: ['Field'],
     selector: (node) => node.props['x-component'] === 'MyComponent',
     designerProps: {
       propsSchema: createFieldSchema(AllSchemas.MyComponent),
     },
     designerLocales: AllLocales.MyComponent,
   })
   
   MyComponent.Resource = createResource({
     icon: 'MyComponentSource',
     elements: [{
       componentName: 'Field',
       props: {
         type: 'string',
         title: 'My Component',
         'x-decorator': 'FormItem',
         'x-component': 'MyComponent',
       },
     }],
   })
   ```

3. **Create Fusion-Specific Schema**
   ```typescript
   // schemas/MyComponent.ts
   export const MyComponent: ISchema = {
     type: 'object',
     properties: {
       size: {
         type: 'string',
         enum: ['small', 'medium', 'large', ''],
         'x-decorator': 'FormItem',
         'x-component': 'Select',
         'x-component-props': {
           defaultValue: 'medium',
         },
       },
       // Fusion-specific properties
       hasBorder: {
         type: 'boolean',
         'x-decorator': 'FormItem',
         'x-component': 'Switch',
       },
     }
   }
   ```

4. **Add Localization (zh-CN and en-US only)**
   ```typescript
   // locales/MyComponent.ts
   export const MyComponent = {
     'zh-CN': {
       title: '我的组件',
       settings: {
         'x-component-props': {
           property: {
             title: '属性',
             tooltip: '详细说明'
           }
         }
       }
     },
     'en-US': {
       title: 'My Component',
       settings: {
         'x-component-props': {
           property: {
             title: 'Property',
             tooltip: 'Detailed description'
           }
         }
       }
     }
   }
   ```

5. **Export from Indexes**
   ```typescript
   // components/index.ts
   export * from './MyComponent/index'
   
   // schemas/all.ts
   export * from './MyComponent'
   
   // locales/all.ts
   export * from './MyComponent'
   ```

## Technology Stack

### Core Dependencies
- **React**: UI library
- **@formily/core**: Form state management
- **@formily/react**: React bindings for Formily
- **@formily/next**: Fusion Design components for Formily
- **@formily/reactive**: Reactive state management
- **@formily/reactive-react**: React integration for reactive
- **@formily/shared**: Shared utilities
- **@formily/json-schema**: JSON Schema support

### Designable Dependencies
- **@designable/core**: Designer engine core
- **@designable/react**: React bindings for Designable
- **@designable/shared**: Shared utilities
- **@designable/formily-setters**: Property setters

### UI Framework
- **@alifd/next**: Alibaba Fusion Design component library
- **@alifd/next/types**: TypeScript type definitions

### Build Tools
- **TypeScript**: Type system with strict typing
- **Less**: CSS preprocessor (most components)
- **SCSS**: CSS preprocessor (Form component)

## Best Practices

### 1. Component Design
- Use `DnFC` type for all components
- Extend base Field behavior
- Use schema-driven configuration
- Provide complete localization (zh-CN and en-US)
- Include proper TypeScript types
- Follow Fusion Design API conventions

### 2. Schema Definition
- Use Fusion-specific property names
- Group related properties
- Use appropriate component types
- Set sensible defaults
- Include validation constraints
- Consider Fusion size options (small/medium/large)

### 3. Behavior Configuration
- Clear selector logic with type safety
- Proper parent-child relationships
- Droppable constraints
- Operation permissions
- Explicit x-component matching

### 4. Localization
- Complete translations for zh-CN and en-US
- Use nested structure for complex tooltips
- Descriptive property labels
- Helpful tooltips with usage examples
- Consistent terminology
- Fusion-specific feature descriptions

### 5. Styling
- Use Less or SCSS as appropriate
- Scope styles to component
- Follow Fusion Design design system
- Maintain responsive design
- Use Fusion theme variables

### 6. Type Safety
- Use DnFC for component typing
- Explicit type annotations
- Proper generic usage
- Avoid 'any' types where possible

## Performance Considerations

### 1. Observable Components
- Use observer HOC for reactive components
- Minimize unnecessary re-renders
- Optimize tree traversal operations

### 2. Schema Evaluation
- Cache schema transformations
- Filter expressions efficiently
- Lazy load property panels

### 3. Tree Operations
- Use efficient node queries with type safety
- Minimize tree traversals
- Batch node updates
- Validate paths before querying

## Key Differences Summary: Next vs Ant Design

### 1. UI Library
- **Next**: Alibaba Fusion Design (`@alifd/next`)
- **Ant Design**: Ant Design (`antd`)

### 2. Component Count
- **Next**: 27 components
- **Ant Design**: 28 components (includes Rate vs Rating distinction)

### 3. Language Support
- **Next**: 2 languages (zh-CN, en-US)
- **Ant Design**: 3 languages (zh-CN, en-US, ko-KR)

### 4. Component Naming
- **Next**: Range, Rating
- **Ant Design**: Slider, Rate

### 5. Component APIs
- **Next**: Fusion-specific props (hasClear, hasBorder, hint, etc.)
- **Ant Design**: Ant Design props (allowClear, bordered, etc.)

### 6. Size Options
- **Next**: small, medium, large
- **Ant Design**: small, middle, large

### 7. Styling
- **Next**: LESS and SCSS
- **Ant Design**: LESS only

### 8. Type System
- **Next**: Uses DnFC type extensively
- **Ant Design**: Less strict typing

### 9. Code Quality
- **Next**: More explicit type annotations
- **Ant Design**: More permissive typing

## Troubleshooting

### Common Issues

1. **Component Not Appearing**
   - Check behavior registration
   - Verify resource definition
   - Ensure proper exports
   - Verify Fusion component imports

2. **Properties Not Showing**
   - Verify schema definition
   - Check locale strings (zh-CN and en-US)
   - Validate x-component values
   - Check Fusion-specific property names

3. **Drag-Drop Not Working**
   - Check droppable configuration
   - Verify allowDrop logic
   - Test component selectors
   - Validate array type matching

4. **Styling Issues**
   - Import Less/SCSS files
   - Check CSS module usage
   - Verify class name references
   - Ensure Fusion theme is loaded

5. **Type Errors**
   - Use correct DnFC type
   - Import Fusion types properly
   - Check CardProps import path
   - Verify generic type parameters

## Migration from Ant Design Version

### Steps to Adapt Code

1. **Change Imports**
   ```typescript
   // From
   import { Input } from '@formily/antd-v5'
   
   // To
   import { Input } from '@formily/next'
   ```

2. **Update Property Names**
   ```typescript
   // Ant Design
   allowClear: true, bordered: true
   
   // Fusion Next
   hasClear: true, hasBorder: true
   ```

3. **Adjust Size Values**
   ```typescript
   // Ant Design
   size: 'middle'
   
   // Fusion Next
   size: 'medium'
   ```

4. **Update Locale Files**
   - Remove ko-KR translations
   - Keep zh-CN and en-US only

5. **Adjust Component References**
   ```typescript
   // Ant Design
   Rate, Slider
   
   // Fusion Next
   Rating, Range
   ```

## Related Documentation

- [Formily Documentation](https://formilyjs.org/)
- [Fusion Design Documentation](https://fusion.design/)
- [Alibaba Fusion Next](https://github.com/alibaba-fusion/next)
- [Designable GitHub](https://github.com/alibaba/designable)
- Main README: `../../README.md`
- Package README: `../README.md`

## Summary

This package provides:
- **27 pre-configured Fusion Design components** for form design
- **Complete schema system** with Fusion-specific properties
- **Bi-lingual support** (Chinese and English)
- **Array components** with CRUD operations
- **Style configuration** for all components
- **Template generation** for complex structures
- **Reactive state management** via Formily
- **Seamless Fusion Design integration**
- **Strong type safety** with DnFC pattern

The architecture emphasizes:
- **Modularity**: Each component is self-contained
- **Extensibility**: Easy to add new components
- **Type Safety**: Full TypeScript support with DnFC
- **Internationalization**: Built-in i18n (zh-CN, en-US)
- **Developer Experience**: Clear patterns and conventions
- **Fusion Design Compatibility**: Native Fusion component support

Key Advantages:
- **Type Safety**: Enhanced type checking with DnFC
- **Fusion Design**: Native Alibaba UI library support
- **Code Quality**: Explicit type annotations throughout
- **Consistency**: Uniform API across all components

---

**Last Updated**: December 26, 2025  
**Version**: Based on current codebase  
**Maintainer**: Designable Team  
**UI Library**: Alibaba Fusion Design (Next)
