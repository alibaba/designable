# Technical Documentation - Formily Setters Package

## Overview
This package provides specialized property setter components for the Designable framework, enabling advanced configuration of form fields. It offers three primary setter components: DataSourceSetter, ReactionsSetter, and ValidatorSetter, each designed to handle complex configuration scenarios in a visual form designer environment.

## Architecture

### Module Structure

```
formily/setters/src/
├── index.ts              # Main entry point with explicit re-exports
├── components/           # Setter components
│   ├── DataSourceSetter/ # Data source configuration UI
│   ├── ReactionsSetter/  # Reactive logic configuration UI
│   └── ValidatorSetter/  # Validation rules configuration UI
├── locales/              # Multi-language support
└── types/                # TypeScript type definitions
```

## Core Modules

### 1. Entry Point (index.ts)

#### Purpose
Main module entry that initializes locales and exports all setter components with explicit re-exports for better tree-shaking.

```typescript
import './locales'
export * from './components'

// Explicit re-exports
export { ReactionsSetter } from './components/ReactionsSetter'
export { DataSourceSetter } from './components/DataSourceSetter'
export { ValidatorSetter } from './components/ValidatorSetter'
```

**Features:**
- Auto-initializes localization system
- Provides explicit named exports for better IDE support
- Ensures all components are properly exported

## Components

### 1. DataSourceSetter

#### Purpose
Visual editor for configuring data sources (options) for select-like components, supporting tree structures and custom key-value pairs.

#### File Structure
```
DataSourceSetter/
├── index.tsx              # Main component
├── TreePanel.tsx          # Tree view for data structure
├── DataSettingPanel.tsx   # Key-value pair editor
├── Header.tsx             # Panel header component
├── Title.tsx              # Tree node title renderer
├── shared.ts              # Utility functions
├── types.ts               # Type definitions
└── styles.less            # Component styles
```

#### Main Component (index.tsx)

```typescript
export interface IDataSourceSetterProps {
  className?: string
  style?: React.CSSProperties
  onChange: (dataSource: IDataSourceItem[]) => void
  value: IDataSourceItem[]
  allowTree?: boolean
  allowExtendOption?: boolean
  defaultOptionValue?: {
    label: string
    value: any
  }[]
  effects?: (form: Form<any>) => void
}
```

**Key Features:**

1. **Modal-Based UI**
   - Opens in a modal dialog for focused editing
   - 65% width with dual-panel layout
   - Observable tree data source for reactive updates

2. **Dual-Panel Layout**
   ```typescript
   <div className={`${prefix + '-layout'}`}>
     <div className={`${prefix + '-layout-item left'}`}>
       <TreePanel />  // Left: Tree structure
     </div>
     <div className={`${prefix + '-layout-item right'}`}>
       <DataSettingPanel />  // Right: Property editor
     </div>
   </div>
   ```

3. **Data Transformation**
   - `transformValueToData`: Converts flat data to tree structure with unique keys
   - `transformDataToValue`: Converts tree structure back to flat data format

4. **Observable State**
   ```typescript
   const treeDataSource: ITreeDataSource = useMemo(
     () =>
       observable({
         dataSource: transformValueToData(value),
         selectedKey: '',
       }),
     [value, modalVisible]
   )
   ```

#### TreePanel Component (TreePanel.tsx)

**Purpose:** Manages the tree structure of data source items with drag-and-drop support.

**Key Features:**

1. **Drag and Drop**
   ```typescript
   const limitTreeDrag = ({ dropPosition }) => {
     if (dropPosition === 0) {
       return false  // Prevent drop inside node if tree not allowed
     }
     return true
   }
   ```

2. **Add Node Functionality**
   - Generates unique UUID for each node
   - Creates default key-value pairs
   - Supports custom default values via props

3. **Tree Node Operations**
   - Drag to reorder
   - Drop to create hierarchy (if allowed)
   - Select to edit properties

4. **Visual Structure**
   ```typescript
   <Tree
     blockNode
     draggable={true}
     allowDrop={props.allowTree ? () => true : limitTreeDrag}
     defaultExpandAll
     showLine={{ showLeafIcon: false }}
     onSelect={(selectedKeys) => {
       props.treeDataSource.selectedKey = selectedKeys[0]?.toString()
     }}
   />
   ```

#### DataSettingPanel Component (DataSettingPanel.tsx)

**Purpose:** Provides an interface to edit key-value pairs for the selected tree node.

**Key Features:**

1. **Dynamic Form Generation**
   ```typescript
   const form = useMemo(() => {
     let values: any
     traverseTree(props.treeDataSource.dataSource, (dataItem) => {
       if (dataItem.key === props.treeDataSource.selectedKey) {
         values = dataItem
       }
     })
     return createForm({ values, effects })
   }, [props.treeDataSource.selectedKey])
   ```

2. **Key-Value Pair Editor**
   - ArrayItems component for dynamic list
   - Label field (can be disabled)
   - ValueInput for flexible value types
   - Remove button (conditional)

3. **Add Key-Value Pair**
   ```typescript
   <Button
     onClick={() => {
       form.setFieldState('map', (state) => {
         state.value.push({})
       })
     }}
   >
     Add Key Value Pair
   </Button>
   ```

#### Data Transformation Utilities (shared.ts)

**Key Functions:**

1. **traverseTree**
   ```typescript
   traverseTree<T extends INode>(
     data: T[],
     callback: (dataItem: T, i: number, data: T[]) => any
   )
   ```
   - Recursively traverses tree structure
   - Applies callback to each node

2. **transformValueToData**
   ```typescript
   transformValueToData(value: IDataSourceItem[]): INodeItem[]
   ```
   - Converts external data format to internal tree format
   - Generates unique keys for each node
   - Preserves children hierarchy

3. **transformDataToValue**
   ```typescript
   transformDataToValue(data: INodeItem[]): IDataSourceItem[]
   ```
   - Converts internal tree format back to external format
   - Maps key-value pairs to object properties
   - Maintains tree structure

#### Type Definitions (types.ts)

```typescript
export interface IDataSourceItem {
  label?: ''
  value?: any
  children?: any[]
}

export interface INodeItem {
  key: string
  duplicateKey?: string
  map?: { label: string; value: any }[]
  children?: INodeItem[]
}

export interface ITreeDataSource {
  dataSource: INodeItem[]
  selectedKey: string
}
```

### 2. ReactionsSetter

#### Purpose
Advanced configuration interface for setting up reactive logic between form fields, supporting both property reactions (expressions) and action reactions (statements).

#### File Structure
```
ReactionsSetter/
├── index.tsx                 # Main component (440 lines)
├── PathSelector.tsx          # Field path selector
├── FieldPropertySetter.tsx   # Property configuration
├── helpers.ts                # Code helpers and examples (394 lines)
├── declarations.ts           # TypeScript declarations
├── properties.ts             # Property schemas
├── types.ts                  # Type definitions
└── styles.less               # Component styles
```

#### Main Component (index.tsx)

```typescript
export interface IReactionsSetterProps {
  value?: IReaction
  onChange?: (value: IReaction) => void
}
```

**Key Features:**

1. **Modal-Based UI**
   - 70% width, centered modal
   - Destroys on close to reset state
   - Lazy initialization for performance

2. **Form Collapse Layout**
   ```typescript
   const formCollapse = useMemo(
     () => FormCollapse.createFormCollapse(['deps', 'state']),
     [modalVisible]
   )
   ```

3. **Schema Field Configuration**
   ```typescript
   const SchemaField = createSchemaField({
     components: {
       Card,
       FormCollapse,
       Input,
       TypeView,
       Select,
       FormItem,
       PathSelector,
       FieldPropertySetter,
       ArrayTable,
       MonacoInput,
     },
   })
   ```

4. **Lazy Initialization**
   ```typescript
   useEffect(() => {
     if (modalVisible) {
       requestIdle(() => {
         initDeclaration().then(() => {
           setInnerVisible(true)
         })
       }, { timeout: 400 })
     }
   }, [modalVisible])
   ```

5. **Field State Properties**
   - Comprehensive list of 25+ field properties
   - Type information for each property
   - Support for complex types (arrays, enums, objects)

#### Type View Component

**Purpose:** Displays property types with truncation for long values.

```typescript
const TypeView = ({ value }) => {
  const text = String(value)
  if (text.length <= 26) return <Tag>{text}</Tag>
  return (
    <Tag>
      <Tooltip title={<pre>{text}</pre>}>
        {text.substring(0, 24)}...
      </Tooltip>
    </Tag>
  )
}
```

#### PathSelector Component (PathSelector.tsx - 114 lines)

**Purpose:** Intelligent field path selector that understands form structure and generates valid paths.

**Key Features:**

1. **Path Transformation**
   - Absolute paths for non-array fields
   - Relative paths for array item fields
   - Dots notation for depth traversal

2. **Tree Structure Generation**
   ```typescript
   const transformDataSource = (node: TreeNode) => {
     // Finds root node
     // Transforms children recursively
     // Generates proper paths based on context
   }
   ```

3. **Array Field Handling**
   ```typescript
   const transformRelativePath = (arrayNode: TreeNode, targetNode: TreeNode) => {
     if (targetNode.depth === currentNode.depth)
       return `.${targetNode.props.name || targetNode.id}`
     return `${dots(currentNode.depth - arrayNode.depth)}[].${targetPath(
       arrayNode,
       targetNode
     )}`
   }
   ```

4. **Smart Filtering**
   - Excludes current node
   - Excludes void nodes without valid children
   - Excludes array nodes that don't contain current node

#### Helper System (helpers.ts - 394 lines)

**Purpose:** Provides comprehensive code examples and documentation for expression writing.

**Helper Categories:**

1. **GlobalHelper** - Context variables documentation
   ```typescript
   /** 
    * 1. `$self` is the current Field Model 
    * 2. `$form` is the current Form Model 
    * 3. `$deps` is the dependencies value
    * 4. `$observable` function for persistent state
    * 5. `$memo` function for persistent data
    * 6. `$effect` function for side-effect logic
    * 7. `$props` function for component props
    **/
   ```

2. **BooleanHelper** - Boolean expression examples
   - Static boolean values
   - Equal/not equal comparisons
   - And/or logic
   - Greater/less than comparisons
   - Not logic

3. **DisplayHelper** - Display state examples
   - Static modes ('none', 'visible', 'hidden')
   - Conditional expressions
   - Ternary operators

4. **PatternHelper** - Pattern state examples
   - Field patterns (editable, disabled, readOnly, readPretty)
   - Conditional pattern switching

5. **StateHelper** - State property examples
   - All field state properties
   - Value transformations
   - State calculations

6. **FulfillRunHelper** - Action reaction examples
   - Statement-based logic
   - Side-effect handling
   - Form manipulation

#### Type Definitions (types.ts)

```typescript
export interface IReaction {
  dependencies?: {
    [key: string]: string  // Variable name: field path
  }
  fulfill?: {
    state?: {
      [key: string]: string  // Property: expression
    }
    schema?: {
      [key: string]: string  // Schema property: expression
    }
  }
}
```

### 3. ValidatorSetter

#### Purpose
Configuration interface for form field validation rules with support for multiple validation types and triggers.

#### Main Component (index.tsx - 173 lines)

```typescript
export interface IValidatorSetterProps {
  value?: any
  onChange?: (value: any) => void
}
```

**Key Features:**

1. **ArrayItems-Based UI**
   - Sortable validation rules
   - Drawer-based detailed configuration
   - Add/Remove/Move operations

2. **Validation Rule Schema**
   ```typescript
   const ValidatorSchema: ISchema = {
     type: 'array',
     items: {
       type: 'object',
       'x-decorator': 'ArrayItems.Item',
       properties: {
         sortable: { 'x-component': 'ArrayItems.SortHandle' },
         drawer: {
           'x-component': 'DrawerSetter',
           properties: {
             triggerType: { enum: ['onInput', 'onFocus', 'onBlur'] },
             validator: { 'x-component': 'ValueInput' },
             message: { 'x-component': 'Input.TextArea' },
             format: { 'x-component': 'Select' },
             pattern: { 'x-component': 'Input', prefix: '/', suffix: '/' },
             len: { 'x-component': 'NumberPicker' },
             max: { 'x-component': 'NumberPicker' },
             min: { 'x-component': 'NumberPicker' },
             exclusiveMaximum: { 'x-component': 'NumberPicker' },
             exclusiveMinimum: { 'x-component': 'NumberPicker' },
             whitespace: { 'x-component': 'Switch' },
             required: { 'x-component': 'Switch' },
           }
         },
         moveDown: { 'x-component': 'ArrayItems.MoveDown' },
         moveUp: { 'x-component': 'ArrayItems.MoveUp' },
         remove: { 'x-component': 'ArrayItems.Remove' },
       }
     }
   }
   ```

3. **Validation Types Supported**
   - **Trigger Types**: onInput, onFocus, onBlur
   - **Format Validation**: URL, Email, Number, Integer, ID, Phone, Currency, Chinese, Date, Zip
   - **Custom Validator**: JavaScript function expression
   - **Pattern**: Regular expression
   - **Length Constraints**: len, max, min, exclusiveMaximum, exclusiveMinimum
   - **Whitespace**: No whitespace check
   - **Required**: Required field validation
   - **Message**: Custom error message

4. **FoldItem Wrapper**
   ```typescript
   return (
     <FoldItem label={field.title}>
       <SchemaContext.Provider value={ValidatorSchema}>
         <ArrayField name="rules" />
       </SchemaContext.Provider>
     </FoldItem>
   )
   ```

## Localization System

### Structure

All three setter components have complete localization in three languages:
- **zh-CN**: Simplified Chinese
- **en-US**: English
- **ko-KR**: Korean

### Locale Files

#### zh-CN.ts (101 lines)
```typescript
export default {
  'zh-CN': {
    settings: {
      'x-validator': {
        title: '校验规则',
        addValidatorRules: '添加校验规则',
        // ... detailed Chinese translations
      }
    },
    SettingComponents: {
      DataSourceSetter: {
        nodeProperty: '节点属性',
        // ... DataSourceSetter translations
      },
      ReactionsSetter: {
        configureReactions: '配置响应器',
        // ... ReactionsSetter translations
      },
      ValidatorSetter: {
        formats: [/* Chinese format labels */]
      }
    }
  }
}
```

#### en-US.ts (103 lines)
```typescript
export default {
  'en-US': {
    settings: {
      'x-validator': {
        title: 'Validator',
        addValidatorRules: 'Add Validator Rules',
        // ... detailed English translations
      }
    },
    SettingComponents: {
      DataSourceSetter: {
        nodeProperty: 'Node Property',
        // ... DataSourceSetter translations
      },
      ReactionsSetter: {
        configureReactions: 'Configure',
        // ... ReactionsSetter translations
      },
      ValidatorSetter: {
        formats: [/* English format labels */]
      }
    }
  }
}
```

#### ko-KR.ts
Similar structure with Korean translations.

### Validation Format Localization

Each language provides localized format labels:
```typescript
const ValidatorFormats = [
  { label: 'URL地址', value: 'url' },      // zh-CN
  { label: 'URL', value: 'url' },          // en-US
  { label: '邮箱格式', value: 'email' },    // zh-CN
  { label: 'Email', value: 'email' },      // en-US
  // ... 10 format types total
]
```

## Design Patterns

### 1. Modal-Based Configuration Pattern

All three setters use modal dialogs for focused configuration:
```typescript
<Button onClick={openModal}>
  <TextWidget token="..." />
</Button>
<Modal
  visible={modalVisible}
  onCancel={closeModal}
  onOk={() => {
    onChange(transformedValue)
    closeModal()
  }}
>
  {/* Configuration UI */}
</Modal>
```

**Benefits:**
- Focused editing experience
- Prevents accidental changes
- Clear apply/cancel actions
- Better UX for complex configurations

### 2. Observable State Pattern

Uses Formily's reactive system for state management:
```typescript
const treeDataSource: ITreeDataSource = useMemo(
  () => observable({
    dataSource: [...],
    selectedKey: '',
  }),
  [dependencies]
)
```

**Benefits:**
- Automatic UI updates
- No manual state synchronization
- Performance optimization
- Reactive data flow

### 3. Data Transformation Pattern

Separates internal and external data formats:
```typescript
// External format (API/props)
IDataSourceItem[] { label, value, children }

// Internal format (UI state)
INodeItem[] { key, map, children }

// Transformers
transformValueToData(external) → internal
transformDataToValue(internal) → external
```

**Benefits:**
- Clean separation of concerns
- Easier testing
- Format flexibility
- Type safety

### 4. Schema-Driven Configuration

Uses JSON Schema for dynamic form generation:
```typescript
const ValidatorSchema: ISchema = {
  type: 'array',
  items: {
    properties: {
      // ... field definitions
    }
  }
}

<SchemaContext.Provider value={ValidatorSchema}>
  <ArrayField name="rules" />
</SchemaContext.Provider>
```

**Benefits:**
- Declarative configuration
- Easy to extend
- Type-safe
- Reusable patterns

### 5. Lazy Initialization Pattern

Defers heavy initialization until needed:
```typescript
useEffect(() => {
  if (modalVisible) {
    requestIdle(() => {
      initDeclaration().then(() => {
        setInnerVisible(true)
      })
    }, { timeout: 400 })
  }
}, [modalVisible])
```

**Benefits:**
- Better initial performance
- Smoother UX
- Resource optimization
- Progressive loading

## Advanced Features

### 1. Tree Manipulation

**DataSourceSetter** provides sophisticated tree operations:

**Drag and Drop Algorithm:**
```typescript
const dropHandler = (info) => {
  const dropKey = info.node?.key
  const dragKey = info.dragNode?.key
  const dropPosition = info.dropPosition
  
  // Find and remove drag object
  let dragObj: INodeItem
  traverseTree(data, (item, index, arr) => {
    if (arr[index].key === dragKey) {
      arr.splice(index, 1)
      dragObj = item
    }
  })
  
  // Insert at new position
  if (!info.dropToGap) {
    // Drop inside node
    traverseTree(data, (item) => {
      if (item.key === dropKey) {
        item.children = item.children || []
        item.children.unshift(dragObj)
      }
    })
  } else {
    // Drop between nodes
    // ... position calculation
  }
}
```

### 2. Path Resolution

**ReactionsSetter** implements intelligent path resolution:

**Features:**
- Absolute paths for simple fields
- Relative paths with array notation
- Depth-aware path generation
- Parent-child relationship tracking

**Example Paths:**
```javascript
'field1'                    // Sibling field
'parent.child'              // Nested field
'.field2'                   // Same level in array
'...[].parent.field'        // Parent array item field
```

### 3. Expression Helpers

**ReactionsSetter** provides extensive code examples:

**GlobalHelper Context:**
```javascript
$self       // Current field model
$form       // Form model
$deps       // Dependencies object
$observable // Observable state creator
$memo       // Memoization function
$effect     // Side-effect handler
$props      // Props setter
```

**Expression Examples:**
```javascript
// Boolean
$deps.status === 'active'

// Display
$deps.type === 'pro' ? 'visible' : 'hidden'

// Pattern
$deps.mode === 'edit' ? 'editable' : 'readOnly'

// Value
$deps.price * $deps.quantity
```

### 4. Type System Integration

**ValidatorSetter** integrates with Formily's type system:

**Validation Rule Types:**
```typescript
interface IValidatorRule {
  triggerType?: 'onInput' | 'onFocus' | 'onBlur'
  validator?: string | Function
  message?: string
  format?: ValidatorFormat
  pattern?: string | RegExp
  len?: number
  max?: number
  min?: number
  exclusiveMaximum?: number
  exclusiveMinimum?: number
  whitespace?: boolean
  required?: boolean
}
```

## Integration Points

### 1. Formily Integration

**Core Dependencies:**
- `@formily/core`: Form and field models
- `@formily/react`: React bindings and Schema system
- `@formily/antd-v5`: UI components
- `@formily/reactive`: Observable state management
- `@formily/shared`: Utility functions

**Usage:**
```typescript
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import { Form, ArrayItems } from '@formily/antd-v5'
import { observable } from '@formily/reactive'
import { clone, uid } from '@formily/shared'
```

### 2. Designable Integration

**Core Dependencies:**
- `@designable/core`: TreeNode, GlobalRegistry
- `@designable/react`: Hooks and widgets
- `@designable/react-settings-form`: Settings components
- `@designable/shared`: Utility functions

**Usage:**
```typescript
import { TreeNode } from '@designable/core'
import { usePrefix, TextWidget } from '@designable/react'
import { MonacoInput, ValueInput } from '@designable/react-settings-form'
```

### 3. Ant Design Integration

**UI Components:**
- Modal, Button, Tree, TreeSelect
- Tag, Tooltip, Card, Select
- Form components from @formily/antd-v5

## Component Usage

### DataSourceSetter Usage

```typescript
import { DataSourceSetter } from '@designable/formily-setters'

<DataSourceSetter
  value={dataSource}
  onChange={(dataSource) => {
    // Handle data source change
  }}
  allowTree={true}
  allowExtendOption={true}
  defaultOptionValue={[
    { label: 'label', value: 'Label' },
    { label: 'value', value: 'value' }
  ]}
  effects={(form) => {
    // Custom form effects
  }}
/>
```

**Use Cases:**
- Select component options
- Radio group options
- Checkbox group options
- Tree select data
- Cascader data

### ReactionsSetter Usage

```typescript
import { ReactionsSetter } from '@designable/formily-setters'

<ReactionsSetter
  value={reaction}
  onChange={(reaction) => {
    // Handle reaction configuration
  }}
/>
```

**Configuration Structure:**
```typescript
{
  dependencies: {
    status: 'order.status',
    total: 'order.total'
  },
  fulfill: {
    state: {
      visible: "$deps.status === 'confirmed'",
      disabled: "$deps.total < 100"
    },
    schema: {
      title: "$deps.status + ' Details'"
    }
  }
}
```

### ValidatorSetter Usage

```typescript
import { ValidatorSetter } from '@designable/formily-setters'

<ValidatorSetter
  value={validators}
  onChange={(validators) => {
    // Handle validators change
  }}
/>
```

**Configuration Structure:**
```typescript
[
  {
    triggerType: 'onBlur',
    required: true,
    message: 'This field is required'
  },
  {
    triggerType: 'onInput',
    format: 'email',
    message: 'Please enter a valid email'
  },
  {
    pattern: '^[A-Za-z0-9]+$',
    message: 'Only alphanumeric characters allowed'
  }
]
```

## Best Practices

### 1. Data Source Configuration

**DO:**
- Use meaningful labels and values
- Keep tree depth reasonable (< 5 levels)
- Provide default option values
- Use allowTree only when needed

**DON'T:**
- Create deeply nested trees unnecessarily
- Use duplicate keys manually
- Modify internal data structure directly

### 2. Reactions Configuration

**DO:**
- Keep expressions simple and readable
- Use descriptive variable names
- Comment complex logic
- Test expressions thoroughly
- Use TypeScript types when possible

**DON'T:**
- Write overly complex expressions
- Use undocumented context variables
- Ignore error handling
- Create circular dependencies

### 3. Validation Configuration

**DO:**
- Order rules from general to specific
- Provide clear error messages
- Use appropriate trigger types
- Combine multiple rules when needed
- Use format validation when available

**DON'T:**
- Duplicate validation logic
- Create conflicting rules
- Use complex regex without testing
- Omit error messages

### 4. Performance Optimization

**DO:**
- Use useMemo for expensive calculations
- Implement lazy initialization
- Use observable state sparingly
- Clean up effects properly

**DON'T:**
- Create unnecessary observables
- Skip dependency arrays
- Perform heavy calculations in render
- Keep unused data in memory

## Type Safety

### Type Definitions

The package provides comprehensive TypeScript types:

```typescript
// DataSourceSetter types
interface IDataSourceItem {
  label?: string
  value?: any
  children?: any[]
}

interface ITreeDataSource {
  dataSource: INodeItem[]
  selectedKey: string
}

// ReactionsSetter types
interface IReaction {
  dependencies?: { [key: string]: string }
  fulfill?: {
    state?: { [key: string]: string }
    schema?: { [key: string]: string }
  }
}

// ValidatorSetter types
interface IValidatorSetterProps {
  value?: any
  onChange?: (value: any) => void
}
```

### Generic Patterns

Components use generic patterns for flexibility:

```typescript
const traverseTree = <T extends INode>(
  data: T[],
  callback: (dataItem: T, i: number, data: T[]) => any
) => {
  // Implementation
}
```

## Styling System

### LESS Modules

Each component has its own LESS file:
- `DataSourceSetter/styles.less`
- `ReactionsSetter/styles.less`
- `ValidatorSetter`: Uses inline styles and Ant Design classes

### Theme Integration

Components use Designable's theming system:

```typescript
const theme = useTheme()
const prefix = usePrefix('data-source-setter')

className={`${prefix} ${prefix + '-' + theme}`}
```

### Layout Patterns

**Dual-Panel Layout (DataSourceSetter):**
```css
.data-source-setter-layout {
  display: flex;
  &-item {
    &.left { flex: 1; }
    &.right { flex: 2; }
  }
}
```

## Error Handling

### Validation Error Handling

**ValidatorSetter** handles validation errors gracefully:
- Invalid regex patterns
- Type mismatches
- Missing required fields
- Conflicting rules

### Path Resolution Error Handling

**PathSelector** handles edge cases:
- Circular references
- Invalid paths
- Missing nodes
- Void field chains

### Data Transformation Error Handling

**DataSourceSetter** handles:
- Malformed data
- Missing keys
- Invalid tree structures
- Duplicate keys

## Performance Considerations

### 1. Lazy Loading

**ReactionsSetter** uses lazy initialization:
```typescript
requestIdle(() => {
  initDeclaration().then(() => {
    setInnerVisible(true)
  })
}, { timeout: 400 })
```

### 2. Memoization

All components use useMemo for expensive operations:
```typescript
const form = useMemo(() => createForm({ values }), [dependencies])
const treeDataSource = useMemo(() => observable({ ... }), [value, modalVisible])
```

### 3. Observable Optimization

Observables are created sparingly and disposed properly:
- Only for truly reactive data
- Within useMemo for stability
- Recreated only when necessary

### 4. Tree Traversal Optimization

Tree operations are optimized:
- Early termination when possible
- Minimal tree rebuilds
- Efficient search algorithms

## Troubleshooting

### Common Issues

1. **DataSource Not Updating**
   - Check if onChange is called
   - Verify data transformation
   - Ensure observable is tracking changes

2. **Reactions Not Working**
   - Validate expression syntax
   - Check dependency paths
   - Verify field existence
   - Test with simple expressions first

3. **Validation Not Triggering**
   - Check trigger type configuration
   - Verify rule order
   - Test format validators
   - Check custom validator syntax

4. **Path Selector Empty**
   - Ensure parent node exists
   - Check for valid field types
   - Verify node structure
   - Look for void field chains

5. **Modal Not Opening**
   - Check button click handler
   - Verify state management
   - Look for console errors
   - Test in isolation

## Testing Strategies

### Unit Testing

**Test Data Transformations:**
```typescript
describe('transformValueToData', () => {
  it('should convert flat data to tree', () => {
    const input = [
      { label: 'A', value: 1 },
      { label: 'B', value: 2, children: [...] }
    ]
    const output = transformValueToData(input)
    expect(output[0]).toHaveProperty('key')
    expect(output[0].map).toContainEqual({ label: 'label', value: 'A' })
  })
})
```

### Integration Testing

**Test Component Interaction:**
```typescript
describe('DataSourceSetter', () => {
  it('should update value when tree node is modified', () => {
    const onChange = jest.fn()
    render(<DataSourceSetter value={[]} onChange={onChange} />)
    // Interact with tree
    // Verify onChange called with correct data
  })
})
```

### E2E Testing

**Test Complete Workflows:**
- Open modal → Add node → Edit properties → Save
- Create dependency → Configure reaction → Apply
- Add validator → Configure rule → Test validation

## Future Enhancements

### Potential Features

1. **DataSourceSetter**
   - Import/export data
   - Bulk edit operations
   - Data validation
   - Template library

2. **ReactionsSetter**
   - Visual expression builder
   - Debugging tools
   - Reaction templates
   - Dependency graph visualization

3. **ValidatorSetter**
   - Custom validator library
   - Validator composition
   - Test case generation
   - Validation preview

## Related Documentation

- [Formily Documentation](https://formilyjs.org/)
- [Ant Design Documentation](https://ant.design/)
- [Designable GitHub](https://github.com/alibaba/designable)
- Main README: `../../../README.md`

## Summary

This package provides:
- **3 specialized setter components** for advanced configuration
- **Tree-based data structure editor** with drag-and-drop
- **Reactive logic configurator** with expression support
- **Validation rule builder** with multiple formats
- **Multi-language support** (Chinese, English, Korean)
- **Type-safe APIs** with comprehensive TypeScript types
- **Performance optimizations** with lazy loading and memoization
- **Extensive helper system** for expression writing

The architecture emphasizes:
- **Separation of Concerns**: Clean component boundaries
- **Type Safety**: Full TypeScript support
- **Performance**: Optimized rendering and state management
- **Extensibility**: Easy to add new features
- **Developer Experience**: Clear APIs and comprehensive examples
- **User Experience**: Modal-based focused editing
- **Internationalization**: Complete localization support

**Key Strengths:**
- Sophisticated tree manipulation
- Intelligent path resolution
- Expression helper system
- Schema-driven validation
- Observable state management
- Comprehensive error handling

---

**Last Updated**: December 26, 2025  
**Version**: Based on current codebase  
**Maintainer**: Designable Team  
**Package Purpose**: Advanced property setters for form designer
