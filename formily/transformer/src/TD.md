# Technical Documentation - Formily Transformer Package

## Overview
This package provides bidirectional transformation utilities between Designable's tree node structure and Formily's JSON Schema format. It enables seamless conversion of visual form designs to executable schemas and vice versa, serving as the critical bridge between the designer interface and the runtime form system.

## Architecture

### Module Structure

```
formily/transformer/src/
└── index.ts              # Single-file module (147 lines)
```

### Purpose

The transformer package serves two primary functions:
1. **Design → Runtime**: Convert Designable tree nodes to Formily schemas for form rendering
2. **Runtime → Design**: Convert Formily schemas back to tree nodes for visual editing

## Core Concepts

### Data Structures

#### 1. ITreeNode (Designable)
```typescript
interface ITreeNode {
  id?: string
  componentName: string
  props?: Record<string, any>
  children?: ITreeNode[]
}
```
- Represents visual form structure in designer
- Hierarchical tree structure
- Component-based architecture
- Maintains designer metadata

#### 2. ISchema (Formily)
```typescript
interface ISchema {
  type?: string
  properties?: Record<string, ISchema>
  items?: ISchema
  'x-designable-id'?: string
  'x-index'?: number
  [key: string]: any
}
```
- JSON Schema-based configuration
- Describes form fields and validation
- Runtime executable format
- Preserves designer IDs for round-trip conversion

### Transformation Flow

```
┌─────────────────┐                    ┌─────────────────┐
│  Designable     │                    │    Formily      │
│   Tree Node     │  transformToSchema │  JSON Schema    │
│                 │ ──────────────────>│                 │
│  - Component    │                    │  - type         │
│  - Props        │                    │  - properties   │
│  - Children     │                    │  - items        │
│  - ID           │                    │  - x-* props    │
└─────────────────┘                    └─────────────────┘
         ▲                                      │
         │                                      │
         │         transformToTreeNode          │
         └──────────────────────────────────────┘
```

## Type Definitions

### ITransformerOptions

```typescript
export interface ITransformerOptions {
  designableFieldName?: string
  designableFormName?: string
}
```

**Properties:**
- `designableFieldName`: Component name for field nodes (default: `'Field'`)
- `designableFormName`: Component name for form root (default: `'Form'`)

**Purpose:** Allows customization of component names for different UI libraries (antd, next, etc.)

### IFormilySchema

```typescript
export interface IFormilySchema {
  schema?: ISchema
  form?: Record<string, any>
}
```

**Properties:**
- `schema`: The form field schema structure
- `form`: Form-level configuration (layout, validation, etc.)

**Purpose:** Separates form-level props from field-level schema

## Core Functions

### 1. createOptions

```typescript
const createOptions = (options: ITransformerOptions): ITransformerOptions => {
  return {
    designableFieldName: 'Field',
    designableFormName: 'Form',
    ...options,
  }
}
```

**Purpose:** Provides default options and merges with user options.

**Defaults:**
- `designableFieldName`: `'Field'`
- `designableFormName`: `'Form'`

**Use Case:** Ensures consistent behavior when options are partial or missing.

### 2. findNode

```typescript
const findNode = (node: ITreeNode, finder?: (node: ITreeNode) => boolean) => {
  if (!node) return
  if (finder && finder(node)) return node
  if (!node.children) return
  for (let i = 0; i < node.children.length; i++) {
    if (findNode(node.children[i])) return node.children[i]
  }
  return
}
```

**Purpose:** Recursively searches tree for a node matching criteria.

**Algorithm:**
1. Check if current node is null
2. Test current node with finder function
3. If no match, recursively search children
4. Return first matching node or undefined

**Use Case:** Locates the Form root node in the tree structure.

**Note:** Has a bug - should pass `finder` to recursive call:
```typescript
// Current (buggy)
if (findNode(node.children[i])) return node.children[i]

// Should be
if (findNode(node.children[i], finder)) return node.children[i]
```

### 3. transformToSchema (Primary Export)

```typescript
export const transformToSchema = (
  node: ITreeNode,
  options?: ITransformerOptions
): IFormilySchema
```

**Purpose:** Converts Designable tree nodes to Formily JSON Schema.

**Algorithm:**

1. **Initialize Options**
   ```typescript
   const realOptions = createOptions(options || {})
   ```

2. **Find Form Root**
   ```typescript
   const root = findNode(node, (child) => {
     return child.componentName === realOptions.designableFormName
   })
   ```

3. **Initialize Schema**
   ```typescript
   const schema = {
     type: 'object',
     properties: {},
   }
   ```

4. **Recursive Schema Creation**
   ```typescript
   const createSchema = (node: ITreeNode, schema: ISchema = {}) => {
     // Copy props (except for root)
     if (node !== root) {
       Object.assign(schema, clone(node.props))
     }
     
     // Add designable ID for round-trip
     schema['x-designable-id'] = node.id
     
     // Handle array type
     if (schema.type === 'array') {
       // First child becomes items schema
       if (node.children && node.children[0]) {
         if (node.children[0].componentName === realOptions.designableFieldName) {
           schema.items = createSchema(node.children[0])
           schema['x-index'] = 0
         }
       }
       // Remaining children become additional properties
       if (node.children) {
         node.children.slice(1).forEach((child, index) => {
           if (child.componentName !== realOptions.designableFieldName) return
           const key = (child.props && child.props.name) || child.id
           schema.properties = schema.properties || {}
           if (typeof key === 'string' && schema.properties) {
             (schema.properties as any)[key] = createSchema(child)
             (schema.properties as any)[key]['x-index'] = index
           }
         })
       }
     } else {
       // Handle object/other types
       if (node.children) {
         node.children.forEach((child, index) => {
           if (child.componentName !== realOptions.designableFieldName) return
           const key = (child.props && child.props.name) || child.id
           schema.properties = schema.properties || {}
           if (typeof key === 'string' && schema.properties) {
             (schema.properties as any)[key] = createSchema(child)
             (schema.properties as any)[key]['x-index'] = index
           }
         })
       }
     }
     return schema
   }
   ```

5. **Return Result**
   ```typescript
   return { 
     form: clone(root.props), 
     schema: createSchema(root, schema) 
   }
   ```

**Special Handling:**

- **Array Fields**: First child becomes `items`, others become `properties`
- **x-designable-id**: Preserved for round-trip conversion
- **x-index**: Records original order for UI reconstruction
- **Root Props**: Separated into `form` property
- **Field Filtering**: Only processes nodes matching `designableFieldName`

**Example Transformation:**

Input (Tree Node):
```typescript
{
  componentName: 'Form',
  props: { layout: 'horizontal' },
  children: [
    {
      id: 'field1',
      componentName: 'Field',
      props: {
        name: 'username',
        type: 'string',
        title: 'Username',
        'x-component': 'Input'
      },
      children: []
    }
  ]
}
```

Output (Schema):
```typescript
{
  form: { layout: 'horizontal' },
  schema: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        title: 'Username',
        'x-component': 'Input',
        'x-designable-id': 'field1',
        'x-index': 0
      }
    }
  }
}
```

### 4. transformToTreeNode (Primary Export)

```typescript
export const transformToTreeNode = (
  formily: IFormilySchema = {},
  options?: ITransformerOptions
) => ITreeNode
```

**Purpose:** Converts Formily JSON Schema to Designable tree nodes.

**Algorithm:**

1. **Initialize Options**
   ```typescript
   const realOptions = createOptions(options || {})
   ```

2. **Create Root Node**
   ```typescript
   const root: ITreeNode = {
     componentName: realOptions.designableFormName,
     props: formily.form,
     children: [],
   }
   ```

3. **Create Schema Instance**
   ```typescript
   const schema = new Schema(formily.schema || {})
   ```

4. **Clean Props Function**
   ```typescript
   const cleanProps = (props: any) => {
     if (props['name'] === props['x-designable-id']) {
       delete props.name
     }
     delete props['version']
     delete props['_isJSONSchemaObject']
     return props
   }
   ```
   - Removes schema-internal properties
   - Cleans up redundant name property
   - Strips JSON Schema metadata

5. **Recursive Tree Building**
   ```typescript
   const appendTreeNode = (parent: ITreeNode, schema: Schema) => {
     if (!schema) return
     
     // Create current node
     const current = {
       id: schema['x-designable-id'] || uid(),
       componentName: realOptions.designableFieldName,
       props: cleanProps(schema.toJSON(false)),
       children: [],
     }
     
     // Add to parent
     if (parent.children) {
       parent.children.push(current)
     }
     
     // Handle array items
     if (schema.items && !Array.isArray(schema.items)) {
       appendTreeNode(current, schema.items)
     }
     
     // Handle object properties
     schema.mapProperties((schema) => {
       schema['x-designable-id'] = schema['x-designable-id'] || uid()
       appendTreeNode(current, schema)
     })
   }
   ```

6. **Process Top-Level Properties**
   ```typescript
   schema.mapProperties((schema) => {
     schema['x-designable-id'] = schema['x-designable-id'] || uid()
     appendTreeNode(root, schema)
   })
   ```

7. **Return Root Node**
   ```typescript
   return root
   ```

**Special Handling:**

- **ID Generation**: Uses existing `x-designable-id` or generates new UID
- **Props Cleaning**: Removes internal Schema properties
- **Array Items**: Processed as first child
- **Properties**: Recursively converted to child nodes
- **Schema Methods**: Uses Formily's `mapProperties()` for traversal

**Example Transformation:**

Input (Schema):
```typescript
{
  form: { layout: 'horizontal' },
  schema: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        title: 'Username',
        'x-component': 'Input',
        'x-designable-id': 'field1',
        'x-index': 0
      }
    }
  }
}
```

Output (Tree Node):
```typescript
{
  componentName: 'Form',
  props: { layout: 'horizontal' },
  children: [
    {
      id: 'field1',
      componentName: 'Field',
      props: {
        name: 'username',
        type: 'string',
        title: 'Username',
        'x-component': 'Input'
      },
      children: []
    }
  ]
}
```

## Design Patterns

### 1. Bidirectional Transformation Pattern

Enables round-trip conversion without data loss:

```typescript
// Design → Runtime
const schema = transformToSchema(treeNode)

// Runtime → Design
const treeNode = transformToTreeNode(schema)

// Should be equivalent to original
```

**Key Techniques:**
- Preserve `x-designable-id` for node identity
- Store `x-index` for order preservation
- Separate form-level and field-level props
- Clean internal properties on reverse transform

### 2. Recursive Tree Traversal Pattern

Both transformations use recursive algorithms:

```typescript
const processNode = (node, accumulator) => {
  // Process current node
  // Recursively process children
  // Return accumulated result
}
```

**Benefits:**
- Handles arbitrary nesting depth
- Clean, functional approach
- Easy to understand and maintain

### 3. Options Pattern

Flexible configuration with sensible defaults:

```typescript
const createOptions = (options) => ({
  ...defaults,
  ...options
})
```

**Benefits:**
- Backward compatible
- Easy to extend
- Clear default behavior

### 4. Type-Specific Handling Pattern

Different logic for different schema types:

```typescript
if (schema.type === 'array') {
  // Array-specific logic
} else {
  // Object/default logic
}
```

**Benefits:**
- Handles schema type variations
- Follows JSON Schema conventions
- Maintains Formily compatibility

## Array Field Handling

### Special Considerations

Array fields have unique transformation requirements:

**Schema Structure:**
```typescript
{
  type: 'array',
  items: {
    type: 'object',
    properties: { ... }  // Item schema
  },
  properties: { ... }  // Additional UI properties
}
```

**Tree Structure:**
```typescript
{
  componentName: 'Field',
  props: { type: 'array' },
  children: [
    { /* First child = items schema */ },
    { /* Additional children = properties */ }
  ]
}
```

**Transformation Logic:**

1. **To Schema**: First child → `items`, others → `properties`
2. **To Tree**: `items` → first child, `properties` → additional children

**Example:**

```typescript
// Array field with operations
{
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  },
  properties: {
    addition: {
      type: 'void',
      'x-component': 'ArrayCards.Addition'
    }
  }
}
```

## Property Preservation

### x-designable-id

**Purpose:** Maintains node identity across transformations.

**Behavior:**
- Preserved in schema during `transformToSchema`
- Used to restore node ID in `transformToTreeNode`
- Generated if missing using `uid()`

**Use Case:** Enables undo/redo, change tracking, and node selection.

### x-index

**Purpose:** Preserves original order of fields.

**Behavior:**
- Added during `transformToSchema` with child index
- Used by designer UI for field ordering
- Not used in reverse transformation

**Use Case:** Maintains visual order in designer when schema is reloaded.

### Props Cloning

**Purpose:** Prevents mutation of original data.

**Implementation:**
```typescript
Object.assign(schema, clone(node.props))
```

**Use Case:** Safe transformation without side effects.

## Integration Points

### 1. Formily Integration

**Dependencies:**
- `@formily/json-schema`: Schema class and utilities

**Usage:**
```typescript
import { ISchema, Schema } from '@formily/json-schema'

const schema = new Schema(formilySchema)
schema.mapProperties((prop) => { ... })
```

**Methods Used:**
- `Schema.toJSON(false)`: Converts to plain object
- `schema.mapProperties()`: Iterates over properties
- `schema.items`: Access array items schema

### 2. Designable Integration

**Dependencies:**
- `@designable/core`: ITreeNode type
- `@designable/shared`: Utility functions

**Usage:**
```typescript
import { ITreeNode } from '@designable/core'
import { clone, uid } from '@designable/shared'
```

**Utilities Used:**
- `clone()`: Deep clones objects
- `uid()`: Generates unique identifiers

### 3. Usage in Applications

**Designer → Runtime:**
```typescript
import { transformToSchema } from '@designable/formily-transformer'

// In designer component
const handleSave = () => {
  const { schema, form } = transformToSchema(designerTree)
  saveToBackend({ schema, form })
}
```

**Runtime → Designer:**
```typescript
import { transformToTreeNode } from '@designable/formily-transformer'

// When loading saved form
const loadForm = async () => {
  const formilySchema = await fetchFromBackend()
  const treeNode = transformToTreeNode(formilySchema)
  designerEngine.setCurrentTree(treeNode)
}
```

## Known Issues and Limitations

### 1. findNode Bug

**Issue:** Recursive call doesn't pass `finder` function.

**Current Code:**
```typescript
if (findNode(node.children[i])) return node.children[i]
```

**Should Be:**
```typescript
if (findNode(node.children[i], finder)) return node.children[i]
```

**Impact:** Function may not find nodes correctly in deep trees.

**Workaround:** Currently works because finder is checked at each level first.

### 2. x-index Ordering

**Limitation:** `x-index` is generated but not used in `transformToTreeNode`.

**Impact:** Field order may not be preserved exactly when converting back.

**Potential Solution:** Sort children by `x-index` before creating tree nodes.

### 3. Component Name Filtering

**Limitation:** Non-field components are skipped entirely.

**Impact:** Cannot include decorative or layout components in schema.

**Use Case:** May need separate handling for non-field components.

### 4. Schema Type Validation

**Limitation:** No validation that schema types are compatible with tree structure.

**Impact:** Invalid schemas may produce unexpected results.

**Potential Solution:** Add schema validation before transformation.

## Best Practices

### 1. Always Provide Options

```typescript
// Good
const schema = transformToSchema(tree, {
  designableFieldName: 'Field',
  designableFormName: 'Form'
})

// Acceptable (uses defaults)
const schema = transformToSchema(tree)
```

### 2. Preserve IDs

```typescript
// Ensure IDs are set before transformation
if (!node.id) {
  node.id = uid()
}
```

### 3. Clone Before Mutation

```typescript
// Good
const treeCopy = clone(originalTree)
const schema = transformToSchema(treeCopy)

// Risky (may mutate original)
const schema = transformToSchema(originalTree)
```

### 4. Validate Schema Structure

```typescript
// Validate before transformation
if (!formilySchema.schema) {
  formilySchema.schema = { type: 'object', properties: {} }
}
```

### 5. Handle Empty States

```typescript
// Check for root node
const result = transformToSchema(tree)
if (!result.schema.properties || 
    Object.keys(result.schema.properties).length === 0) {
  // Handle empty form
}
```

## Testing Strategies

### Unit Tests

**Test Transformations:**
```typescript
describe('transformToSchema', () => {
  it('should convert simple tree to schema', () => {
    const tree = {
      componentName: 'Form',
      props: {},
      children: [
        {
          componentName: 'Field',
          props: { name: 'field1', type: 'string' },
          children: []
        }
      ]
    }
    const result = transformToSchema(tree)
    expect(result.schema.properties.field1).toBeDefined()
    expect(result.schema.properties.field1.type).toBe('string')
  })
})
```

### Round-Trip Tests

**Test Bidirectional Conversion:**
```typescript
describe('round-trip transformation', () => {
  it('should preserve data through forward and back conversion', () => {
    const original = createComplexTreeNode()
    const schema = transformToSchema(original)
    const restored = transformToTreeNode(schema)
    
    // Compare structures (ignoring generated IDs)
    expect(normalizeTree(restored)).toEqual(normalizeTree(original))
  })
})
```

### Edge Cases

**Test Boundary Conditions:**
```typescript
describe('edge cases', () => {
  it('should handle empty tree', () => {
    const result = transformToSchema({ componentName: 'Form', children: [] })
    expect(result.schema.type).toBe('object')
  })
  
  it('should handle deeply nested arrays', () => {
    const tree = createNestedArrayTree()
    const result = transformToSchema(tree)
    expect(result.schema.properties.array.items).toBeDefined()
  })
})
```

## Performance Considerations

### 1. Deep Cloning

**Cost:** Cloning large tree structures can be expensive.

**Optimization:**
```typescript
// Use shallow clone when deep clone not needed
const props = { ...node.props }  // Shallow

// Use deep clone only for nested structures
const props = clone(node.props)  // Deep
```

### 2. Recursive Traversal

**Cost:** O(n) where n is number of nodes.

**Characteristics:**
- Unavoidable for tree processing
- Single-pass algorithm
- No redundant traversals

### 3. UID Generation

**Cost:** Minimal, but called for every node.

**Optimization:**
```typescript
// Reuse existing IDs when possible
const id = schema['x-designable-id'] || uid()
```

### 4. Schema Instance Creation

**Cost:** Creating Schema instances has overhead.

**Optimization:**
```typescript
// Only create Schema once per transformation
const schema = new Schema(formily.schema || {})
```

## Use Cases

### 1. Save Designer State

```typescript
const saveDesign = () => {
  const tree = designerEngine.getCurrentTree()
  const { schema, form } = transformToSchema(tree)
  
  localStorage.setItem('savedForm', JSON.stringify({ schema, form }))
}
```

### 2. Load Designer State

```typescript
const loadDesign = () => {
  const saved = JSON.parse(localStorage.getItem('savedForm'))
  const tree = transformToTreeNode(saved)
  
  designerEngine.setCurrentTree(tree)
}
```

### 3. Export Form Schema

```typescript
const exportSchema = () => {
  const tree = designerEngine.getCurrentTree()
  const { schema, form } = transformToSchema(tree)
  
  // Use in Formily Form component
  return (
    <Form {...form}>
      <SchemaField schema={schema} />
    </Form>
  )
}
```

### 4. Import External Schema

```typescript
const importSchema = async (url: string) => {
  const response = await fetch(url)
  const formilySchema = await response.json()
  
  const tree = transformToTreeNode(formilySchema)
  designerEngine.setCurrentTree(tree)
}
```

### 5. Schema Migration

```typescript
const migrateSchema = (oldSchema: IFormilySchema) => {
  // Convert to tree for manipulation
  const tree = transformToTreeNode(oldSchema)
  
  // Modify tree structure
  modifyTreeStructure(tree)
  
  // Convert back to schema
  return transformToSchema(tree)
}
```

## Extension Points

### Custom Component Names

```typescript
// For different UI libraries
const options = {
  designableFieldName: 'FormItem',
  designableFormName: 'FormContainer'
}

const schema = transformToSchema(tree, options)
```

### Custom Property Handling

Extend transformations for custom properties:

```typescript
const customTransformToSchema = (node, options) => {
  const result = transformToSchema(node, options)
  
  // Add custom processing
  processCustomProps(result.schema)
  
  return result
}
```

### Schema Validation

Add validation layer:

```typescript
const validatedTransform = (node, options) => {
  const result = transformToSchema(node, options)
  
  validateSchema(result.schema)
  
  return result
}
```

## Type Safety

### TypeScript Benefits

**Strong Typing:**
```typescript
const schema: IFormilySchema = transformToSchema(tree)
// schema.schema is typed as ISchema
// schema.form is typed as Record<string, any>
```

**Type Inference:**
```typescript
const tree = transformToTreeNode(schema)
// tree is inferred as ITreeNode
```

**Compile-Time Safety:**
```typescript
// TypeScript catches incorrect usage
transformToSchema(123)  // Error: number not assignable to ITreeNode
```

## Summary

This package provides:
- **Bidirectional transformation** between tree and schema formats
- **Simple API** with two main functions
- **Flexible configuration** via options
- **ID preservation** for round-trip conversion
- **Type safety** with TypeScript
- **Zero dependencies** (only peer dependencies)
- **Small footprint** (147 lines)

The architecture emphasizes:
- **Simplicity**: Single-file implementation
- **Clarity**: Clear recursive algorithms
- **Flexibility**: Configurable component names
- **Reliability**: Preserves data through transformations
- **Integration**: Works seamlessly with Formily and Designable

**Key Strengths:**
- Essential bridge between designer and runtime
- Clean, functional implementation
- Handles complex nested structures
- Preserves metadata for round-trips
- Minimal external dependencies

**Considerations:**
- Bug in findNode needs fixing
- x-index preservation could be improved
- Limited validation of input data
- Performance adequate for typical use cases

---

**Last Updated**: December 26, 2025  
**Version**: Based on current codebase  
**Maintainer**: Designable Team  
**Package Purpose**: Bidirectional transformation between tree nodes and schemas  
**Lines of Code**: 147
