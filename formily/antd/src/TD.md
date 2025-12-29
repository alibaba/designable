# Technical Documentation - Formily Ant Design Integration

## Overview
This package provides a complete integration between the Designable framework and Ant Design components through Formily. It enables visual form design capabilities with Ant Design UI components, offering a comprehensive set of pre-configured components, schemas, and localization support for building low-code form designers.

## Architecture

### Module Structure

```
formily/antd/src/
├── index.ts              # Main entry point
├── shared.ts             # Shared utilities and helpers
├── global.d.ts           # TypeScript type declarations
├── components/           # Component implementations
├── schemas/              # Component property schemas
├── locales/              # Internationalization
├── common/               # Common utilities and containers
└── hooks/                # Custom React hooks
```

## Core Modules

### 1. Entry Point (index.ts)

#### Purpose
Main module entry that exports all components, schemas, and locales for use in Designable applications.

```typescript
export * from './components/index'
export * from './schemas/index'
export * from './locales/index'
```

### 2. Shared Utilities (shared.ts - 114 lines)

#### Purpose
Provides utility functions for component matching, node querying, and tree traversal operations.

#### Key Functions

##### Component Matching
```typescript
matchComponent(node: TreeNode, name: ComponentNameMatcher, context?: any)
```
- Matches component by name, array of names, or custom function
- Supports wildcard matching with `*`
- Returns boolean indicating match

##### Child Component Matching
```typescript
matchChildComponent(node: TreeNode, name: ComponentNameMatcher, context?: any)
```
- Matches child components using dot notation (e.g., `ArrayCards.Addition`)
- Useful for matching sub-components

##### Component Inclusion Check
```typescript
includesComponent(node: TreeNode, names: ComponentNameMatcher[], target?: TreeNode)
```
- Checks if node matches any component in the names array

##### Node Querying
```typescript
queryNodesByComponentPath(node: TreeNode, path: ComponentNameMatcher[]): TreeNode[]
```
- Queries nodes by component path pattern
- Returns array of matching nodes

```typescript
findNodeByComponentPath(node: TreeNode, path: ComponentNameMatcher[]): TreeNode | undefined
```
- Finds first node matching component path
- Returns single node or undefined

##### Array Item Detection
```typescript
matchArrayItemsNode(node: TreeNode)
```
- Detects if node is an array item node
- Checks if parent type is 'array' and node is first child

##### Node ID Creation
```typescript
createNodeId(designer: Engine, id: string)
```
- Creates node ID attribute for designer integration
- Returns record with designer's node ID attribute name

##### Type Items Node Ensurer
```typescript
createEnsureTypeItemsNode(type: string)
```
- Factory function to create node type validators
- Ensures node has children of specific type

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
- Filters expressions from schema values
- Preserves expressions for title and description

**Field Type Rendering**
```typescript
if (props.type === 'object') {
  return <ObjectField {...fieldProps} name={node.id}>{props.children}</ObjectField>
} else if (props.type === 'array') {
  return <ArrayField {...fieldProps} name={node.id} />
} else if (node.props.type === 'void') {
  return <VoidField {...fieldProps} name={node.id}>{props.children}</VoidField>
}
return <InternalField {...fieldProps} name={node.id} />
```

**Editable Content**
- Title and description wrapped with `data-content-editable` attribute
- Enables inline editing in designer

#### 2. Input Component (components/Input/preview.ts)

##### Implementation
```typescript
export const Input: React.FC<React.ComponentProps<typeof FormilyInput>> = FormilyInput

Input.Behavior = createBehavior(
  {
    name: 'Input',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'Input',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Input),
    },
    designerLocales: AllLocales.Input,
  },
  {
    name: 'Input.TextArea',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'Input.TextArea',
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
- Extends base Field behavior
- Supports both Input and Input.TextArea variants
- Provides icon-based resources for palette

### Available Components (28 components)

#### Form Components
1. **Form** - Root form container
2. **Field** - Base field component

#### Input Components
3. **Input** - Text input with prefix/suffix
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
15. **Slider** - Value slider
16. **Rate** - Star rating
17. **Switch** - Toggle switch
18. **Upload** - File upload

#### Layout Components
19. **Card** - Card container
20. **Space** - Spacing layout
21. **FormLayout** - Form layout configuration
22. **FormGrid** - Grid-based layout
23. **FormTab** - Tab-based layout
24. **FormCollapse** - Collapsible sections

#### Container Components
25. **Object** - Object field container
26. **ArrayCards** - Card-based array field
27. **ArrayTable** - Table-based array field
28. **Text** - Static text display

### Complex Components

#### ArrayCards Component (components/ArrayCards/preview.tsx)

##### Purpose
Renders array fields as a collection of cards with built-in operations.

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
useDropTemplate('ArrayCards', (source: TreeNode[]) => {
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

##### Features
- Automatic template generation on drop
- Built-in CRUD operations
- Index display
- Card-based UI

## Schema System

### Schema Architecture

#### Purpose
Defines property configuration forms for each component in the designer's settings panel.

#### Schema Structure (schemas/Input.ts)

```typescript
export const Input: ISchema & { TextArea?: ISchema } = {
  type: 'object',
  properties: {
    addonBefore: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    addonAfter: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    prefix: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    suffix: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    allowClear: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    bordered: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    maxLength: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    placeholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    size: {
      type: 'string',
      enum: ['large', 'small', 'middle', ''],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'middle',
      },
    },
  },
}
```

#### CSS Style Schema (schemas/CSSStyle.ts)

Provides comprehensive style configuration:
```typescript
export const CSSStyle: ISchema = {
  type: 'void',
  properties: {
    'style.width': {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
    },
    'style.height': {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
    },
    'style.display': {
      'x-component': 'DisplayStyleSetter',
    },
    'style.background': {
      'x-component': 'BackgroundStyleSetter',
    },
    'style.boxShadow': {
      'x-component': 'BoxShadowStyleSetter',
    },
    'style.font': {
      'x-component': 'FontStyleSetter',
    },
    'style.margin': {
      'x-component': 'BoxStyleSetter',
    },
    'style.padding': {
      'x-component': 'BoxStyleSetter',
    },
    'style.borderRadius': {
      'x-component': 'BorderRadiusStyleSetter',
    },
    'style.border': {
      'x-component': 'BorderStyleSetter',
    },
    'style.opacity': {
      'x-decorator': 'FormItem',
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

### Field Schema Helpers (components/Field/shared.ts)

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

Each component has localized strings in three languages:
- **zh-CN**: Simplified Chinese
- **en-US**: English
- **ko-KR**: Korean

### Example (locales/Input.ts)

```typescript
export const Input = {
  'zh-CN': {
    title: '输入框',
    settings: {
      'x-component-props': {
        addonAfter: '后缀标签',
        addonBefore: '前缀标签',
        maxLength: '最大长度',
        prefix: '前缀',
        suffix: '后缀',
        autoSize: {
          title: '自适应高度',
          tooltip: '可设置为 true | false 或对象：{ minRows: 2, maxRows: 6 }',
        },
        showCount: '是否展示字数',
        checkStrength: '检测强度',
      },
    },
  },
  'en-US': {
    title: 'Input',
    settings: {
      'x-component-props': {
        addonAfter: 'Addon After',
        addonBefore: 'Addon Before',
        maxLength: 'Max Length',
        prefix: 'Prefix',
        suffix: 'Suffix',
        autoSize: 'Auto Size',
        showCount: 'Show Count',
        checkStrength: 'Check Strength',
      },
    },
  },
  'ko-KR': {
    title: '입력',
    settings: {
      'x-component-props': {
        addonAfter: '애드온 후',
        addonBefore: '애드온 전',
        maxLength: '최대 길이',
        prefix: '접두사',
        suffix: '접미사',
        autoSize: '자동 크기 맞춤',
        showCount: '개수 보여주기',
        checkStrength: '강도 체크',
      },
    },
  },
}
```

### Locale Coverage

All 28 components have complete localization including:
- Component titles
- Property labels
- Help text and tooltips
- Array operation labels (Add, Remove, Move Up, Move Down, Index)
- Validation messages

## Common Utilities

### 1. Container Component (common/Container/index.tsx)

#### Purpose
Wraps components to make them droppable in the designer.

```typescript
export const Container: React.FC = observer((props) => {
  return <DroppableWidget>{props.children}</DroppableWidget>
})

export const withContainer = (Target: React.JSXElementConstructor<any>) => {
  return (props: any) => {
    return (
      <DroppableWidget>
        <Target {...props} />
      </DroppableWidget>
    )
  }
}
```

Features:
- Observable for reactive updates
- DroppableWidget integration
- HOC pattern for wrapping components

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
Toggle switch for enabling/disabling FormItem decorator.

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
      
      if (
        matchComponent(target, name) &&
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
1. **Base Array** - Main container
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
- Specific selector
- Drop constraints (allowDrop)
- Void field schema
- Localized labels

## Design Patterns

### 1. Component Extension Pattern

Components extend base Field behavior:
```typescript
{
  name: 'Input',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Input',
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
    placeholder: 'Enter value'
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

### 5. Localization Pattern

Centralized locale definitions:
```typescript
{
  'zh-CN': { title: '输入框', settings: {...} },
  'en-US': { title: 'Input', settings: {...} },
  'ko-KR': { title: '입력', settings: {...} }
}
```

## Integration Points

### 1. Formily Integration
- Uses `@formily/antd-v5` components
- Formily React for field management
- Formily reactive for state management

### 2. Designable Integration
- `@designable/core` for behaviors and resources
- `@designable/react` for designer UI components
- `@designable/formily-setters` for property setters

### 3. Ant Design Integration
- Direct usage of antd components
- Ant Design v5 compatibility
- Custom styling via Less files

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

3. **Decorator Group**
   - FormItem properties
   - Label configuration
   - Layout settings
   - Visible when x-decorator is set

4. **Style Groups**
   - Component styles
   - Decorator styles
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

### 3. Resource Creation
- Icon assignment
- Default props
- Element structure

### 4. Runtime Rendering
- Schema to props conversion
- Expression evaluation
- Field type detection
- Component instantiation

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
```

### 4. Component Composition

Sub-component pattern:
```typescript
Input.TextArea  // Sub-component
ArrayCards.Addition  // Array operation
FormTab.TabPane  // Tab panel
```

## Styling System

### LESS Modules
- Component-specific styles
- CSS modules pattern
- Scoped class names

### Style Files
- `components/ArrayCards/styles.less`
- `components/ArrayTable/styles.less`
- `components/Form/styles.less`
- `components/FormGrid/styles.less`
- `components/Text/styles.less`
- `common/Container/styles.less`

## Development Guidelines

### Adding New Components

1. **Create Component Structure**
   ```
   components/MyComponent/
   ├── index.ts
   ├── preview.tsx
   └── styles.less (optional)
   ```

2. **Implement Preview Component**
   ```typescript
   export const MyComponent = FormilyMyComponent
   
   MyComponent.Behavior = createBehavior({
     name: 'MyComponent',
     extends: ['Field'],
     selector: (node) => node.props?.['x-component'] === 'MyComponent',
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

3. **Create Schema**
   ```typescript
   // schemas/MyComponent.ts
   export const MyComponent: ISchema = {
     type: 'object',
     properties: {
       // Component properties
     }
   }
   ```

4. **Add Localization**
   ```typescript
   // locales/MyComponent.ts
   export const MyComponent = {
     'zh-CN': { title: '我的组件', settings: {...} },
     'en-US': { title: 'My Component', settings: {...} },
     'ko-KR': { title: '내 구성 요소', settings: {...} }
   }
   ```

5. **Export from Index**
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
- **@formily/antd-v5**: Ant Design components for Formily
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
- **antd**: Ant Design component library
- **antd styles**: Component styles

### Build Tools
- **TypeScript**: Type system
- **Less**: CSS preprocessor

## Best Practices

### 1. Component Design
- Extend base Field behavior
- Use schema-driven configuration
- Provide comprehensive localization
- Include proper TypeScript types

### 2. Schema Definition
- Group related properties
- Use appropriate component types
- Set sensible defaults
- Include validation constraints

### 3. Behavior Configuration
- Clear selector logic
- Proper parent-child relationships
- Droppable constraints
- Operation permissions

### 4. Localization
- Complete translations for all languages
- Descriptive property labels
- Helpful tooltips
- Consistent terminology

### 5. Styling
- Use CSS modules
- Scope styles to component
- Follow Ant Design design system
- Maintain responsive design

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
- Use efficient node queries
- Minimize tree traversals
- Batch node updates

## Extension Points

### Custom Setters
Create custom property editors:
```typescript
import { createBehavior } from '@designable/core'

{
  propsSchema: {
    customProp: {
      'x-component': 'MyCustomSetter',
    }
  }
}
```

### Custom Validators
Add validation rules in schema:
```typescript
{
  'x-validator': [
    {
      required: true,
      message: 'Required field'
    }
  ]
}
```

### Custom Reactions
Add conditional logic:
```typescript
{
  'x-reactions': [
    {
      when: '{{$form.values.condition}}',
      fulfill: {
        state: { visible: true }
      },
      otherwise: {
        state: { visible: false }
      }
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **Component Not Appearing**
   - Check behavior registration
   - Verify resource definition
   - Ensure proper exports

2. **Properties Not Showing**
   - Verify schema definition
   - Check locale strings
   - Validate x-component values

3. **Drag-Drop Not Working**
   - Check droppable configuration
   - Verify allowDrop logic
   - Test component selectors

4. **Styling Issues**
   - Import Less files
   - Check CSS module usage
   - Verify class name references

## Related Documentation

- [Formily Documentation](https://formilyjs.org/)
- [Ant Design Documentation](https://ant.design/)
- [Designable GitHub](https://github.com/alibaba/designable)
- Main README: `../../README.md`
- Package README: `../README.md`

## Summary

This package provides:
- **28 pre-configured components** for form design
- **Complete schema system** for property configuration
- **Multi-language support** (Chinese, English, Korean)
- **Array components** with CRUD operations
- **Style configuration** for all components
- **Template generation** for complex structures
- **Reactive state management** via Formily
- **Seamless Ant Design integration**

The architecture emphasizes:
- **Modularity**: Each component is self-contained
- **Extensibility**: Easy to add new components
- **Type Safety**: Full TypeScript support
- **Internationalization**: Built-in i18n
- **Developer Experience**: Clear patterns and conventions

---

**Last Updated**: December 26, 2025  
**Version**: Based on current codebase  
**Maintainer**: Designable Team
