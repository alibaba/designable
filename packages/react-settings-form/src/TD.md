# Technical Documentation - React Settings Form Package

## Overview
The `@designable/react-settings-form` package provides a comprehensive property editing system for the Designable framework. It implements a rich collection of specialized form controls and style setters that enable visual editing of component properties, CSS styles, and advanced configuration options. Built on Formily's reactive form system, this package serves as the primary interface for property configuration in design tools.

## Architecture

### Module Structure

```
packages/react-settings-form/src/
├── index.ts                    # Main exports barrel
├── SettingsForm.tsx           # Main settings form component (110 lines)
├── SchemaField.tsx            # Schema field component registry
├── registry.ts                # CDN registry configuration
├── types.ts                   # TypeScript definitions
├── styles.less                # Global styles
├── components/                # Form control components (20+ components)
│   ├── index.ts               # Component exports
│   ├── ValueInput/            # Multi-type value input (113 lines)
│   ├── MonacoInput/           # Monaco code editor (327 lines)
│   ├── PolyInput/             # Polymorphic input system (133 lines)
│   ├── BoxStyleSetter/        # CSS box model editor (112 lines)
│   ├── DisplayStyleSetter/    # CSS display property setter
│   ├── FlexStyleSetter/       # Flexbox properties editor
│   ├── ColorInput/            # Color picker component
│   ├── SizeInput/             # Size/dimension input
│   ├── DrawerSetter/          # Drawer-based complex editor
│   ├── FoldItem/              # Collapsible form sections
│   └── ...                    # Additional specialized controls
├── effects/                   # React hooks and effects
│   ├── useLocales.tsx         # Internationalization effect (67 lines)
│   └── useSnapshot.tsx        # Auto-save functionality
├── locales/                   # Internationalization
│   ├── en-US.ts
│   ├── zh-CN.ts
│   └── ko-KR.ts
├── shared/                    # Shared utilities
│   ├── context.ts             # React context
│   └── loadScript.ts          # Dynamic script loading
└── types/
    └── less.d.ts              # CSS module types
```

### Purpose

This package provides:
1. **Property Editor UI**: Visual interface for editing component properties
2. **Style Setters**: Specialized controls for CSS property editing
3. **Advanced Inputs**: Code editor, color picker, size inputs, etc.
4. **Reactive Forms**: Auto-saving and real-time property updates
5. **Internationalization**: Multi-language support for form labels
6. **Extensibility**: Plugin system for custom property controls

## Core Components

### 1. SettingsForm - The Main Component

**Purpose:** The primary container that renders property editing forms for selected nodes.

**Key Features:**
- Automatic schema detection from selected nodes
- Real-time property synchronization
- Internationalization support
- Auto-save functionality
- Empty state handling

**Props Interface:**
```typescript
interface ISettingFormProps {
  className?: string
  style?: React.CSSProperties
  uploadAction?: string                    // File upload endpoint
  components?: Record<string, React.FC<any>>  // Custom components
  effects?: (form: Form) => void          // Custom form effects
  scope?: any                             // Additional scope variables
}
```

**Usage Example:**
```tsx
import { SettingsForm } from '@designable/react-settings-form'

<SettingsForm 
  uploadAction="https://api.example.com/upload"
  components={{
    CustomInput: MyCustomInput
  }}
  effects={(form) => {
    // Custom form effects
    form.setFieldState('customField', state => {
      state.visible = form.values.showCustom
    })
  }}
  scope={{
    $custom: customData
  }}
/>
```

**Architecture Pattern:**
```tsx
export const SettingsForm: React.FC<ISettingFormProps> = observer((props) => {
  // 1. Get current workspace and selected node
  const node = useSelectedNode(currentWorkspaceId)
  const operation = useOperation(currentWorkspaceId)
  
  // 2. Create reactive form with node properties
  const form = useMemo(() => {
    return createForm({
      initialValues: node?.designerProps?.defaultProps,
      values: node?.props,
      effects(form) {
        useLocales(node)      // Apply i18n
        useSnapshot(operation) // Auto-save
        props.effects?.(form)  // Custom effects
      }
    })
  }, [node, node?.props, schema, operation])

  // 3. Render form with schema or empty state
  return (
    <Form form={form}>
      <SchemaField 
        schema={node?.designerProps?.propsSchema}
        components={props.components}
        scope={{ $node: node, ...props.scope }}
      />
    </Form>
  )
})
```

**Performance Optimization:**
```typescript
// Uses optimized scheduler for reactive updates
{
  scheduler: (update) => {
    // Cancel previous idle request
    cancelIdle(GlobalState.idleRequest!)
    // Schedule update during browser idle time
    GlobalState.idleRequest = requestIdle(update, {
      timeout: 500
    })
  }
}
```

### 2. SchemaField - Component Registry

**Purpose:** Central registry of all available form components for schema rendering.

**Architecture:**
```tsx
export const SchemaField = createSchemaField({
  components: {
    // Basic Formily components
    FormItem,
    Input,
    NumberPicker,
    Select,
    Switch,
    
    // Custom Designable components  
    ValueInput,          // Multi-type value editor
    SizeInput,           // Size/dimension input
    ColorInput,          // Color picker
    MonacoInput,         // Code editor
    
    // Style setters
    BoxStyleSetter,      // Margin/padding editor
    BorderStyleSetter,   // Border properties
    FlexStyleSetter,     // Flexbox properties
    DisplayStyleSetter,  // CSS display modes
    
    // Layout components
    CollapseItem,        // Collapsible sections
    DrawerSetter,        // Complex drawer editor
    FoldItem,            // Expandable form groups
  }
})
```

**Schema Integration:**
```typescript
// Example schema that uses these components
const schema = {
  type: 'object',
  properties: {
    'field-properties': {
      type: 'void',
      'x-component': 'CollapseItem',
      title: 'Field Properties',
      properties: {
        title: {
          type: 'string',
          'x-component': 'Input',
          'x-decorator': 'FormItem'
        },
        size: {
          type: 'string', 
          'x-component': 'SizeInput',
          'x-decorator': 'FormItem'
        }
      }
    },
    'component-styles': {
      type: 'void',
      'x-component': 'CollapseItem', 
      title: 'Styles',
      properties: {
        'style.margin': {
          'x-component': 'BoxStyleSetter'
        },
        'style.display': {
          'x-component': 'DisplayStyleSetter'  
        }
      }
    }
  }
}
```

### 3. ValueInput - Universal Value Editor

**Purpose:** Polymorphic input that adapts to different value types (text, numbers, expressions, etc.).

**Key Features:**
- **Type Detection**: Automatically detects value type
- **Multiple Input Modes**: Text, number, boolean, expression, rich text
- **Expression Support**: JavaScript expressions with `{{}}` syntax
- **Rich Text Detection**: HTML content recognition
- **Modal Editing**: Complex values edited in popovers/modals

**Type System:**
```typescript
interface IPolyType {
  type: string                                    // Type identifier
  icon?: string                                  // Icon for type switcher
  component?: any                                // React component
  checker: (value: any) => boolean               // Type detection function
  toInputValue?: (value: any) => any            // Transform for input
  toChangeValue?: (value: any) => any           // Transform for output
}
```

**Supported Types:**
```typescript
const VALUE_TYPES = [
  {
    type: 'TEXT',
    icon: 'Text',
    component: Input,
    checker: (value) => typeof value === 'string' && !isExpression(value)
  },
  {
    type: 'EXPRESSION', 
    icon: 'Expression',
    component: ExpressionEditor,
    checker: (value) => /^\{\{.*\}\}$/.test(value),
    toInputValue: (value) => value.replace(/^\{\{(.*)\}\}$/, '$1'),
    toChangeValue: (value) => `{{${value}}}`
  },
  {
    type: 'NUMBER',
    icon: 'Number', 
    component: InputNumber,
    checker: (value) => typeof value === 'number'
  },
  {
    type: 'BOOLEAN',
    icon: 'Boolean',
    component: Switch, 
    checker: (value) => typeof value === 'boolean'
  }
]
```

**Usage Example:**
```tsx
<ValueInput 
  value="Hello World"           // String value
  onChange={(value) => updateNode({ title: value })}
/>

<ValueInput
  value="{{user.name}}"         // Expression value  
  onChange={(value) => updateNode({ title: value })}
/>

<ValueInput
  value={42}                    // Number value
  onChange={(value) => updateNode({ count: value })}
/>
```

### 4. MonacoInput - Code Editor

**Purpose:** Advanced code editor component powered by Monaco Editor (327 lines).

**Key Features:**
- **Multi-language Support**: JavaScript, CSS, JSON, HTML, etc.
- **IntelliSense**: Code completion and validation
- **Expression Mode**: Special mode for JavaScript expressions  
- **Type Definitions**: Custom TypeScript definitions support
- **Themes**: Light and dark themes
- **Help Integration**: Contextual help and documentation

**Props Interface:**
```typescript
interface MonacoInputProps extends EditorProps {
  helpLink?: string | boolean     // Help documentation link
  helpCode?: string              // Example code in help panel
  helpCodeViewWidth?: string     // Help panel width
  extraLib?: string              // Additional TypeScript definitions
  onChange?: (value: string) => void
}
```

**Language Modes:**
```typescript
// Special language modes for different contexts
'javascript'              // Standard JavaScript
'javascript.expression'   // JavaScript expressions ({{...}})
'css'                    // CSS styles
'json'                   // JSON configuration
'html'                   // HTML templates
'typescript'             // TypeScript with type checking
```

**Advanced Features:**
```tsx
// Expression validation with Babel parser
const validateExpression = (code: string) => {
  try {
    parseExpression(code, {
      plugins: ['jsx', 'typescript']
    })
    return { valid: true }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}

// Custom type definitions
<MonacoInput
  language="javascript"
  extraLib={`
    declare interface User {
      id: string
      name: string  
      email: string
    }
    declare const user: User
  `}
  value="user.name"
  onChange={handleChange}
/>
```

**Theme Configuration:**
```typescript
// Chrome theme
const chromeTheme = {
  base: 'vs' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '008000' },
    { token: 'keyword', foreground: '0000FF' },
    { token: 'string', foreground: 'A31515' }
  ],
  colors: {
    'editor.background': '#FFFFFF',
    'editor.foreground': '#000000'
  }
}

// Monokai theme  
const monokaiTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '75715E' },
    { token: 'keyword', foreground: 'F92672' },
    { token: 'string', foreground: 'E6DB74' }
  ],
  colors: {
    'editor.background': '#272822',
    'editor.foreground': '#F8F8F2'
  }
}
```

### 5. PolyInput - Polymorphic Input System

**Purpose:** Framework for creating inputs that can switch between different input types (133 lines).

**Architecture:**
```typescript
// Type switcher pattern
const createPolyInput = (polyTypes: IPolyType[]) => {
  return ({ value, onChange, exclude, include }) => {
    const [currentType, setCurrentType] = useState()
    const types = filterTypes(polyTypes, exclude, include)
    
    // Auto-detect current type based on value
    useEffect(() => {
      const matchedType = types.find(type => type.checker(value))
      if (matchedType) setCurrentType(matchedType.type)
    }, [value])
    
    const currentTypeConfig = types.find(t => t.type === currentType)
    const Component = currentTypeConfig?.component
    
    return (
      <div className="poly-input">
        {/* Type switcher button */}
        <Button onClick={() => switchToNextType()}>
          <IconWidget infer={currentTypeConfig.icon} />
        </Button>
        
        {/* Current input component */}
        <Component 
          value={currentTypeConfig.toInputValue?.(value) ?? value}
          onChange={(newValue) => {
            const transformed = currentTypeConfig.toChangeValue?.(newValue) ?? newValue
            onChange(transformed)
          }}
        />
      </div>
    )
  }
}
```

**Type Filter System:**
```typescript
// Include/exclude specific types
<PolyInput 
  value={value}
  onChange={onChange}
  exclude={['EXPRESSION']}     // Exclude expression type
  include={['TEXT', 'NUMBER']} // Only allow text and numbers
/>
```

**Example Implementation:**
```typescript
const ColorInput = createPolyInput([
  {
    type: 'HEX',
    icon: 'Color',
    component: HexColorPicker,
    checker: (value) => /^#[0-9A-F]{6}$/i.test(value)
  },
  {
    type: 'RGB',
    icon: 'ColorRGB', 
    component: RGBColorPicker,
    checker: (value) => /^rgb\(/.test(value),
    toInputValue: (value) => parseRGB(value),
    toChangeValue: (value) => `rgb(${value.r}, ${value.g}, ${value.b})`
  },
  {
    type: 'VARIABLE',
    icon: 'Variable',
    component: Input,
    checker: (value) => /^var\(--/.test(value)
  }
])
```

## Style Setter Components

### 1. BoxStyleSetter - Box Model Editor

**Purpose:** Visual editor for CSS box model properties (margin, padding, border) (112 lines).

**Key Features:**
- **Visual Box Model**: Interactive diagram representation
- **All/Individual Control**: Set all sides at once or individually
- **Live Preview**: Real-time visual feedback
- **Unit Support**: px, em, rem, %, auto, inherit

**Box Model Pattern:**
```typescript
// Parses CSS box model values: "10px 20px 30px 40px"
const BoxRex = /([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+))?)?)?/

const parseBoxValue = (value: string) => {
  const matched = value.match(BoxRex) || []
  return {
    top: matched[1],      // First value
    right: matched[2],    // Second value  
    bottom: matched[3],   // Third value
    left: matched[4]      // Fourth value
  }
}
```

**Position Handler System:**
```typescript
const createPositionHandler = (position: 'top' | 'right' | 'bottom' | 'left' | 'all') => {
  return {
    value: getPositionValue(position),
    onChange: (newValue: string) => {
      if (position === 'all') {
        // Set all four sides to same value
        onChange(`${newValue} ${newValue} ${newValue} ${newValue}`)
      } else {
        // Update individual side
        const values = parseBoxValue(currentValue)
        values[position] = newValue
        onChange(`${values.top} ${values.right} ${values.bottom} ${values.left}`)
      }
    }
  }
}
```

**Usage Example:**
```tsx
<BoxStyleSetter
  value="10px 20px 15px 5px"
  onChange={(value) => updateNodeStyle('margin', value)}
  labels={[
    <IconWidget infer="Top" />,
    <IconWidget infer="Right" />,
    <IconWidget infer="Bottom" />,
    <IconWidget infer="Left" />
  ]}
/>
```

**Visual Representation:**
```
┌─────────────────────────────────────────┐
│                 Top: 10px               │
├─────┬─────────────────────────────┬─────┤
│Left │                             │Right│
│5px  │        Content Area         │20px │
│     │                             │     │
├─────┴─────────────────────────────┴─────┤
│               Bottom: 15px              │
└─────────────────────────────────────────┘
```

### 2. DisplayStyleSetter - Display Mode Selector

**Purpose:** Visual selector for CSS display property with Flexbox integration.

**Key Features:**
- **Icon-based Selection**: Visual icons for each display type
- **Conditional Fields**: Shows flex properties when display: flex is selected
- **Reactive Interface**: Dynamic form based on selection

**Display Options:**
```tsx
const DISPLAY_OPTIONS = [
  {
    label: <IconWidget infer="DisplayBlock" size={16} />,
    value: 'block'
  },
  {
    label: <IconWidget infer="DisplayInlineBlock" size={16} />,
    value: 'inline-block'  
  },
  {
    label: <IconWidget infer="DisplayInline" size={16} />,
    value: 'inline'
  },
  {
    label: <IconWidget infer="DisplayFlex" size={16} />,
    value: 'flex'
  }
]
```

**Conditional Field Pattern:**
```tsx
export const DisplayStyleSetter = () => {
  return (
    <>
      {/* Main display selector */}
      <Radio.Group options={DISPLAY_OPTIONS} />
      
      {/* Conditional flex properties */}
      <Field
        name="flex"
        visible={false}
        reactions={(flexField) => {
          // Show flex properties only when display is flex
          flexField.visible = field.value === 'flex'
        }}
        component={[FlexStyleSetter]}
      />
    </>
  )
}
```

### 3. FlexStyleSetter - Flexbox Properties Editor

**Purpose:** Comprehensive editor for CSS Flexbox properties.

**Properties Covered:**
- **flex-direction**: row, column, row-reverse, column-reverse
- **justify-content**: flex-start, center, flex-end, space-between, space-around
- **align-items**: flex-start, center, flex-end, stretch, baseline  
- **flex-wrap**: nowrap, wrap, wrap-reverse
- **align-content**: flex-start, center, flex-end, space-between, space-around
- **gap**: Grid gap between items

**Visual Interface:**
```tsx
const FLEX_DIRECTION_OPTIONS = [
  { label: <IconWidget infer="FlexDirectionRow" />, value: 'row' },
  { label: <IconWidget infer="FlexDirectionColumn" />, value: 'column' },
  { label: <IconWidget infer="FlexDirectionRowReverse" />, value: 'row-reverse' },
  { label: <IconWidget infer="FlexDirectionColumnReverse" />, value: 'column-reverse' }
]

const JUSTIFY_CONTENT_OPTIONS = [
  { label: <IconWidget infer="JustifyStart" />, value: 'flex-start' },
  { label: <IconWidget infer="JustifyCenter" />, value: 'center' },
  { label: <IconWidget infer="JustifyEnd" />, value: 'flex-end' },
  { label: <IconWidget infer="JustifySpaceBetween" />, value: 'space-between' },
  { label: <IconWidget infer="JustifySpaceAround" />, value: 'space-around' }
]
```

### 4. BorderStyleSetter - Border Properties Editor

**Purpose:** Comprehensive border editing with style, width, and color controls.

**Border Properties:**
- **border-width**: Individual side widths
- **border-style**: solid, dashed, dotted, double, etc.
- **border-color**: Color picker integration
- **border-radius**: Corner radius (handled by separate component)

### 5. ColorInput - Advanced Color Picker

**Purpose:** Multi-format color picker supporting various color representations.

**Supported Formats:**
- **HEX**: #FF0000, #F00
- **RGB**: rgb(255, 0, 0)  
- **RGBA**: rgba(255, 0, 0, 0.5)
- **HSL**: hsl(0, 100%, 50%)
- **CSS Variables**: var(--primary-color)
- **Named Colors**: red, blue, transparent

**Color Picker Interface:**
```tsx
const ColorInput = createPolyInput([
  {
    type: 'COLOR',
    icon: 'Color',
    component: ({ value, onChange }) => (
      <ColorPicker 
        value={value}
        onChange={onChange}
        showText
        allowClear
        presets={[
          { label: 'Primary', colors: ['#1890ff', '#722ed1'] },
          { label: 'Success', colors: ['#52c41a', '#73d13d'] }
        ]}
      />
    ),
    checker: isColorValue
  },
  {
    type: 'VARIABLE',
    icon: 'Variable',
    component: Input,
    checker: (value) => /^var\(--/.test(value)
  }
])
```

### 6. SizeInput - Dimension Input

**Purpose:** Input for size values with unit selection and constraints.

**Supported Units:**
- **Absolute**: px, pt, pc, cm, mm, in
- **Relative**: em, rem, ch, ex, vw, vh, vmin, vmax
- **Percentage**: %  
- **Keywords**: auto, inherit, initial, unset

**Smart Unit Conversion:**
```typescript
const convertUnits = (value: string, fromUnit: string, toUnit: string) => {
  const numValue = parseFloat(value)
  
  // Conversion table (relative to px)
  const pxRatios = {
    px: 1,
    pt: 4/3,
    em: 16,    // Assumes 16px base
    rem: 16,
    '%': 1,    // Context dependent
  }
  
  if (fromUnit === toUnit) return value
  
  const pxValue = numValue * pxRatios[fromUnit]
  const newValue = pxValue / pxRatios[toUnit]
  
  return newValue + toUnit
}
```

### 7. DrawerSetter - Complex Property Editor

**Purpose:** Drawer-based editor for complex properties that need more space.

**Key Features:**
- **Modal Interface**: Slides out from side
- **Nested Forms**: Full form capabilities within drawer
- **Preview**: Real-time preview of changes
- **Validation**: Complete validation support

**Usage Pattern:**
```tsx
<DrawerSetter
  text="Configure Advanced Properties"
  title="Advanced Configuration" 
  width={600}
>
  <SchemaField
    schema={{
      type: 'object',
      properties: {
        advanced: {
          type: 'object',
          properties: {
            // Complex nested properties
            animation: {
              type: 'object',
              'x-component': 'AnimationEditor'
            },
            transform: {
              type: 'object', 
              'x-component': 'TransformEditor'
            }
          }
        }
      }
    }}
  />
</DrawerSetter>
```

## Effect System

### 1. useLocales - Internationalization

**Purpose:** Automatically applies translations to form fields based on current language (67 lines).

**Key Features:**
- **Automatic Translation**: Translates field titles, descriptions, tooltips
- **Icon Support**: Special syntax for icons in translations
- **Enum Translation**: Translates option lists
- **Dynamic Updates**: Reacts to language changes

**Translation Pattern:**
```typescript
export const useLocales = (node: TreeNode) => {
  onFieldReact('*', (field) => {
    // Convert field path: 'style.margin.top' -> 'settings.style.margin.top'
    const path = field.path.toString().replace(/\.[\d+]/g, '')
    const token = `settings.${path}`
    
    // Get translation from node or global registry
    const title = node.getMessage(`${token}.title`) || 
                  GlobalRegistry.getDesignerMessage(`${token}.title`)
    const description = node.getMessage(`${token}.description`)
    const tooltip = node.getMessage(`${token}.tooltip`)
    
    // Apply translations
    if (title) field.title = title
    if (description) field.description = description
    if (tooltip) field.decorator[1].tooltip = tooltip
  })
}
```

**Icon Syntax:**
```typescript
// Special syntax: @IconName:Tooltip
const takeIcon = (message: string) => {
  const matched = message.match(/@([^:\s]+)(?:\s*\:\s*([\s\S]+))?/)
  if (matched) return [matched[1], matched[2]]  // [iconName, tooltip]
  return undefined
}

// Usage in locale files
const locales = {
  'en-US': {
    settings: {
      'style.display': {
        title: '@Display:Display mode',
        enum: {
          block: '@DisplayBlock:Block display',
          flex: '@DisplayFlex:Flexbox display'
        }
      }
    }
  }
}
```

### 2. useSnapshot - Auto-Save Functionality

**Purpose:** Automatically saves property changes to history with debouncing.

**Implementation:**
```typescript
export const useSnapshot = (operation: Operation) => {
  onFieldInputValueChange('*', () => {
    // Debounce saves to avoid too many history entries
    clearTimeout(timeRequest)
    timeRequest = setTimeout(() => {
      operation.snapshot('update:node:props')
    }, 1000)  // 1 second debounce
  })
}
```

**Benefits:**
- **Performance**: Avoids excessive history entries
- **User Experience**: Automatic saving without user intervention
- **Undo/Redo**: Maintains proper history for undo functionality

## Internationalization System

### Locale Structure

```typescript
// English locales
export default {
  'en-US': {
    SettingComponents: {
      ValueInput: {
        expression: 'Expression'
      },
      MonacoInput: {
        helpDocument: 'Help Documents'
      },
      ColorInput: {
        transparent: 'Transparent',
        gradient: 'Gradient'
      },
      SizeInput: {
        auto: 'Auto',
        inherit: 'Inherit'
      },
      BoxStyleSetter: {
        all: 'All Sides',
        top: 'Top',
        right: 'Right', 
        bottom: 'Bottom',
        left: 'Left'
      }
    }
  }
}
```

**Chinese Locales:**
```typescript
export default {
  'zh-CN': {
    SettingComponents: {
      ValueInput: {
        expression: '表达式'
      },
      MonacoInput: {
        helpDocument: '帮助文档'
      },
      ColorInput: {
        transparent: '透明',
        gradient: '渐变'
      },
      SizeInput: {
        auto: '自动',
        inherit: '继承'
      },
      BoxStyleSetter: {
        all: '全部',
        top: '上',
        right: '右',
        bottom: '下', 
        left: '左'
      }
    }
  }
}
```

**Korean Locales:**
```typescript
export default {
  'ko-KR': {
    SettingComponents: {
      ValueInput: {
        expression: '표현'
      },
      MonacoInput: {
        helpDocument: '도움말 문서'
      },
      ColorInput: {
        transparent: '투명한',
        gradient: '그라디언트'
      },
      SizeInput: {
        auto: '자동',
        inherit: '상속'
      },
      BoxStyleSetter: {
        all: '모든 면',
        top: '위',
        right: '오른쪽',
        bottom: '아래',
        left: '왼쪽'
      }
    }
  }
}
```

## Advanced Components

### 1. FoldItem - Collapsible Form Sections

**Purpose:** Creates expandable/collapsible form sections for better organization.

**Features:**
- **Base/Extra Pattern**: Show essential controls by default, advanced in expanded state
- **Smooth Animation**: CSS transitions for expand/collapse
- **Memory**: Remembers expanded state per section

**Usage Pattern:**
```tsx
<FoldItem label="Typography Settings">
  <FoldItem.Base>
    {/* Always visible essential controls */}
    <Input name="fontSize" />
    <Select name="fontFamily" />
  </FoldItem.Base>
  <FoldItem.Extra>
    {/* Advanced controls shown when expanded */}
    <SizeInput name="lineHeight" />
    <NumberPicker name="letterSpacing" />
    <NumberPicker name="wordSpacing" />
  </FoldItem.Extra>
</FoldItem>
```

### 2. CollapseItem - Accordion Sections

**Purpose:** Full accordion-style collapsible sections for grouping related properties.

**Integration with Formily:**
```tsx
const schema = {
  type: 'object',
  properties: {
    'field-properties': {
      type: 'void',
      'x-component': 'CollapseItem',
      title: 'Field Properties',
      properties: {
        title: {
          type: 'string',
          'x-component': 'Input'
        },
        placeholder: {
          type: 'string',
          'x-component': 'Input'
        }
      }
    },
    'component-styles': {
      type: 'void',
      'x-component': 'CollapseItem',
      title: 'Component Styles', 
      properties: {
        'style.width': {
          'x-component': 'SizeInput'
        },
        'style.height': {
          'x-component': 'SizeInput'  
        }
      }
    }
  }
}
```

### 3. InputItems - Array Input Manager

**Purpose:** Manages arrays of input values with add/remove capabilities.

**Features:**
- **Dynamic Addition**: Add new items to array
- **Removal**: Remove individual items
- **Reordering**: Drag and drop reordering
- **Validation**: Per-item validation support

```tsx
<InputItems
  value={['item1', 'item2', 'item3']}
  onChange={(items) => updateProperty(items)}
  renderItem={(item, index) => (
    <Input 
      value={item}
      onChange={(value) => updateItem(index, value)}
    />
  )}
  addable
  removable
  sortable
/>
```

### 4. PositionInput - Position Value Editor

**Purpose:** Editor for CSS position-related properties.

**Properties:**
- **position**: static, relative, absolute, fixed, sticky
- **top, right, bottom, left**: Offset values
- **z-index**: Stacking order

### 5. CornerInput - Border Radius Editor

**Purpose:** Visual editor for border-radius properties.

**Features:**
- **Individual Corners**: Control each corner separately
- **Uniform Radius**: Set all corners at once
- **Visual Preview**: Shows rounded corners preview
- **Unit Support**: px, em, %, etc.

## Integration Patterns

### 1. Custom Component Registration

```tsx
import { SchemaField } from '@designable/react-settings-form'

// Create custom component
const CustomRangeInput = ({ value, onChange }) => (
  <div>
    <Slider 
      range
      value={value}
      onChange={onChange}
      min={0}
      max={100}
    />
    <div>Range: {value[0]} - {value[1]}</div>
  </div>
)

// Register with SchemaField
const CustomSchemaField = createSchemaField({
  components: {
    ...SchemaField.components,
    CustomRangeInput
  }
})

// Use in SettingsForm
<SettingsForm
  components={{
    CustomRangeInput
  }}
/>
```

### 2. Custom Effects Integration

```tsx
import { useFormEffects } from '@formily/react'

const customEffects = (form: Form) => {
  useFormEffects(() => {
    // Custom validation
    onFieldValidateStart('email', (field) => {
      if (!field.value?.includes('@')) {
        field.setFeedback({
          type: 'error',
          messages: ['Invalid email format']
        })
      }
    })
    
    // Field dependencies
    onFieldValueChange('showAdvanced', (field) => {
      form.setFieldState('advancedOptions', state => {
        state.visible = field.value
      })
    })
    
    // Dynamic schema updates
    onFieldInit('componentType', (field) => {
      field.reactions = [(field) => {
        const schema = getSchemaForComponent(field.value)
        form.setFieldState('properties', state => {
          state.componentProps.schema = schema
        })
      }]
    })
  })
}

<SettingsForm effects={customEffects} />
```

### 3. Schema-Driven Property Panels

```tsx
// Define behavior with complete property schema
const ButtonBehavior = createBehavior({
  name: 'Button',
  selector: 'Button',
  designerProps: {
    propsSchema: {
      type: 'object',
      properties: {
        // Basic properties
        'basic-properties': {
          type: 'void',
          'x-component': 'CollapseItem',
          'x-component-props': { title: 'Basic Properties' },
          properties: {
            text: {
              type: 'string',
              title: 'Button Text',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: 'Enter button text'
              }
            },
            type: {
              type: 'string', 
              title: 'Button Type',
              enum: ['primary', 'secondary', 'danger', 'link'],
              'x-decorator': 'FormItem',
              'x-component': 'Select'
            },
            size: {
              type: 'string',
              title: 'Size',
              enum: ['small', 'middle', 'large'],
              'x-decorator': 'FormItem', 
              'x-component': 'Radio.Group'
            },
            disabled: {
              type: 'boolean',
              title: 'Disabled',
              'x-decorator': 'FormItem',
              'x-component': 'Switch'
            }
          }
        },
        
        // Style properties
        'style-properties': {
          type: 'void',
          'x-component': 'CollapseItem',
          'x-component-props': { title: 'Style Properties' },
          properties: {
            'style.width': {
              type: 'string',
              title: 'Width',
              'x-decorator': 'FormItem',
              'x-component': 'SizeInput'
            },
            'style.height': {
              type: 'string',
              title: 'Height', 
              'x-decorator': 'FormItem',
              'x-component': 'SizeInput'
            },
            'style.margin': {
              type: 'string',
              title: 'Margin',
              'x-component': 'BoxStyleSetter'
            },
            'style.padding': {
              type: 'string',
              title: 'Padding',
              'x-component': 'BoxStyleSetter'
            },
            'style.backgroundColor': {
              type: 'string',
              title: 'Background Color',
              'x-decorator': 'FormItem',
              'x-component': 'ColorInput'
            },
            'style.border': {
              type: 'string',
              title: 'Border',
              'x-component': 'BorderStyleSetter'
            },
            'style.borderRadius': {
              type: 'string',
              title: 'Border Radius',
              'x-component': 'BorderRadiusStyleSetter'
            }
          }
        },
        
        // Advanced properties
        'advanced-properties': {
          type: 'void',
          'x-component': 'CollapseItem',
          'x-component-props': { title: 'Advanced Properties' },
          properties: {
            onClick: {
              type: 'string',
              title: 'Click Handler',
              'x-decorator': 'FormItem',
              'x-component': 'ValueInput',
              'x-component-props': {
                include: ['EXPRESSION']  // Only allow expressions
              }
            },
            customClass: {
              type: 'string',
              title: 'Custom CSS Class',
              'x-decorator': 'FormItem',
              'x-component': 'Input'
            },
            conditionalDisplay: {
              type: 'void',
              title: 'Conditional Display',
              'x-decorator': 'FormItem',
              'x-component': 'DrawerSetter',
              'x-component-props': {
                text: 'Configure Conditions'
              },
              properties: {
                condition: {
                  type: 'string',
                  title: 'Show When',
                  'x-decorator': 'FormItem',
                  'x-component': 'MonacoInput',
                  'x-component-props': {
                    language: 'javascript.expression'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
})
```

## Usage Examples

### Basic Settings Form

```tsx
import React from 'react'
import { SettingsForm } from '@designable/react-settings-form'
import { Designer, SettingsPanel } from '@designable/react'

const App = () => (
  <Designer engine={engine}>
    {/* Other design components */}
    
    <SettingsPanel title="Property Settings">
      <SettingsForm 
        uploadAction="https://api.example.com/upload"
      />
    </SettingsPanel>
  </Designer>
)
```

### Custom Components Integration

```tsx
import { SettingsForm, createPolyInput } from '@designable/react-settings-form'

// Create custom input component
const IconPicker = createPolyInput([
  {
    type: 'ICON_SELECT',
    icon: 'Icon',
    component: ({ value, onChange }) => (
      <Select
        value={value}
        onChange={onChange}
        showSearch
        optionFilterProp="children"
      >
        {iconList.map(icon => (
          <Option key={icon.name} value={icon.name}>
            <Icon type={icon.name} /> {icon.name}
          </Option>
        ))}
      </Select>
    ),
    checker: (value) => iconList.some(icon => icon.name === value)
  },
  {
    type: 'ICON_URL',
    icon: 'Link',
    component: Input,
    checker: (value) => /^https?:\/\/.*\.(png|jpg|svg)$/i.test(value)
  }
])

<SettingsForm
  components={{
    IconPicker
  }}
/>
```

### Advanced Schema Configuration

```tsx
const AdvancedFormBehavior = createBehavior({
  name: 'AdvancedForm',
  selector: 'Form',
  designerProps: {
    propsSchema: {
      type: 'object',
      properties: {
        layout: {
          type: 'object',
          'x-component': 'CollapseItem',
          'x-component-props': { title: 'Layout Settings' },
          properties: {
            layout: {
              type: 'string',
              title: 'Form Layout',
              enum: ['horizontal', 'vertical', 'inline'],
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group'
            },
            labelCol: {
              type: 'object',
              title: 'Label Column',
              'x-decorator': 'FormItem',
              'x-component': 'DrawerSetter',
              'x-component-props': { text: 'Configure Label Column' },
              properties: {
                span: {
                  type: 'number',
                  title: 'Span',
                  minimum: 1,
                  maximum: 24,
                  'x-decorator': 'FormItem',
                  'x-component': 'NumberPicker'
                },
                offset: {
                  type: 'number', 
                  title: 'Offset',
                  minimum: 0,
                  maximum: 24,
                  'x-decorator': 'FormItem',
                  'x-component': 'NumberPicker'
                }
              }
            }
          }
        },
        validation: {
          type: 'object',
          'x-component': 'CollapseItem', 
          'x-component-props': { title: 'Validation Settings' },
          properties: {
            validateTrigger: {
              type: 'string',
              title: 'Validate Trigger',
              enum: ['onChange', 'onBlur', 'onSubmit'],
              'x-decorator': 'FormItem',
              'x-component': 'Select'
            },
            scrollToError: {
              type: 'boolean',
              title: 'Scroll to Error',
              'x-decorator': 'FormItem',
              'x-component': 'Switch'
            }
          }
        }
      }
    }
  }
})
```

### Monaco Editor Integration

```tsx
const CodeEditorComponent = () => (
  <MonacoInput
    language="javascript"
    height={400}
    value="const hello = 'world'"
    onChange={(code) => updateNodeProperty('onClick', `{{${code}}}`)}
    extraLib={`
      // Custom type definitions
      declare interface NodeContext {
        node: TreeNode
        engine: Engine
        form: FormInstance
      }
      declare const context: NodeContext
    `}
    helpCode={`
      // Example: Show alert on click
      const handleClick = () => {
        alert('Button clicked!')
      }
      
      // Example: Update form field  
      const updateField = (value) => {
        context.form.setFieldValue('fieldName', value)
      }
    `}
  />
)
```

## Performance Optimizations

### 1. Lazy Loading

```typescript
// Components are loaded only when needed
const LazyMonacoInput = React.lazy(() => 
  import('./MonacoInput').then(module => ({ default: module.MonacoInput }))
)

// Usage with Suspense
<Suspense fallback={<Spin />}>
  <LazyMonacoInput {...props} />
</Suspense>
```

### 2. Debounced Updates

```typescript
// Auto-save with debouncing
let timeRequest: NodeJS.Timeout | null = null

export const useSnapshot = (operation: Operation) => {
  onFieldInputValueChange('*', () => {
    if (timeRequest) clearTimeout(timeRequest)
    timeRequest = setTimeout(() => {
      operation.snapshot('update:node:props')
    }, 1000)  // 1 second debounce
  })
}
```

### 3. Optimized Rendering

```typescript
// Use requestIdle for non-critical updates
export const SettingsForm = observer(props => {
  // ... component logic
}, {
  scheduler: (update) => {
    cancelIdle(GlobalState.idleRequest!)
    GlobalState.idleRequest = requestIdle(update, {
      timeout: 500
    })
  }
})
```

## Best Practices

### 1. Schema Organization

```typescript
// Good - organized into logical sections
const schema = {
  type: 'object',
  properties: {
    'basic-props': {
      type: 'void',
      'x-component': 'CollapseItem',
      title: 'Basic Properties',
      properties: { /* basic properties */ }
    },
    'style-props': {
      type: 'void',
      'x-component': 'CollapseItem', 
      title: 'Style Properties',
      properties: { /* style properties */ }
    },
    'advanced-props': {
      type: 'void',
      'x-component': 'CollapseItem',
      title: 'Advanced Properties', 
      properties: { /* advanced properties */ }
    }
  }
}

// Bad - flat structure
const schema = {
  type: 'object',
  properties: {
    title: { /* ... */ },
    width: { /* ... */ },
    onClick: { /* ... */ },
    backgroundColor: { /* ... */ }
    // ... all mixed together
  }
}
```

### 2. Component Reusability

```typescript
// Good - reusable component with props
export const StyleSection = ({ properties }) => ({
  type: 'void',
  'x-component': 'CollapseItem',
  'x-component-props': { title: 'Styles' },
  properties
})

// Usage
const buttonSchema = {
  properties: {
    styles: StyleSection({
      'style.width': { 'x-component': 'SizeInput' },
      'style.height': { 'x-component': 'SizeInput' }
    })
  }
}
```

### 3. Type Safety

```typescript
// Define proper TypeScript interfaces
interface IButtonProps {
  text: string
  type: 'primary' | 'secondary' | 'danger'
  size: 'small' | 'medium' | 'large'
  disabled: boolean
  onClick?: string  // Expression
}

// Use in schema with proper typing
const buttonSchema: ISchema = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      title: 'Button Text',
      'x-component': 'Input'
    }
    // ... properly typed properties
  }
}
```

### 4. Performance Considerations

```typescript
// Good - memoize expensive computations
const ExpensiveComponent = React.memo(({ value, onChange }) => {
  const processedValue = useMemo(() => {
    return complexProcessing(value)
  }, [value])
  
  return <div>{processedValue}</div>
})

// Good - debounce frequent updates  
const DebouncedInput = ({ onChange, ...props }) => {
  const debouncedOnChange = useMemo(
    () => debounce(onChange, 300),
    [onChange]
  )
  
  return <Input onChange={debouncedOnChange} {...props} />
}
```

## Testing Strategies

### Component Testing

```typescript
import { render, fireEvent } from '@testing-library/react'
import { ValueInput } from '@designable/react-settings-form'

describe('ValueInput', () => {
  it('should detect text values', () => {
    const { getByRole } = render(
      <ValueInput value="Hello World" />
    )
    
    expect(getByRole('textbox')).toBeInTheDocument()
  })
  
  it('should detect expression values', () => {
    const { getByText } = render(
      <ValueInput value="{{user.name}}" />  
    )
    
    expect(getByText('Expression')).toBeInTheDocument()
  })
  
  it('should handle value changes', () => {
    const handleChange = jest.fn()
    const { getByRole } = render(
      <ValueInput value="" onChange={handleChange} />
    )
    
    fireEvent.change(getByRole('textbox'), {
      target: { value: 'New Value' }
    })
    
    expect(handleChange).toHaveBeenCalledWith('New Value')
  })
})
```

### Integration Testing

```typescript
import { render, fireEvent } from '@testing-library/react'
import { SettingsForm } from '@designable/react-settings-form'
import { Designer } from '@designable/react'

describe('SettingsForm Integration', () => {
  it('should render form for selected node', () => {
    const engine = createEngine()
    const button = engine.createNode({
      componentName: 'Button',
      props: { text: 'Click me' }
    })
    
    const { getByDisplayValue } = render(
      <Designer engine={engine}>
        <SettingsForm />
      </Designer>
    )
    
    // Select the button node
    engine.workbench.currentWorkspace.operation.selection.select(button)
    
    // Should show button's text property
    expect(getByDisplayValue('Click me')).toBeInTheDocument()
  })
})
```

## Browser Support

### Minimum Requirements
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Dependencies
- React 16.8+ (Hooks support)
- @formily/core and @formily/react
- @formily/antd-v5
- Ant Design 5.x
- Monaco Editor (lazy loaded)

## Summary

The `@designable/react-settings-form` package provides:

**Core Features:**
- Complete property editing system
- 20+ specialized form controls
- Advanced style setters for CSS properties
- Monaco code editor integration
- Multi-type value inputs (text, expressions, etc.)

**Key Components:**
- SettingsForm: Main container (110 lines)
- ValueInput: Universal value editor (113 lines)
- MonacoInput: Code editor (327 lines)
- PolyInput: Type-switching input system (133 lines)
- BoxStyleSetter: CSS box model editor (112 lines)

**Advanced Features:**
- Reactive forms with auto-save
- Internationalization (3 languages)
- Custom component extensibility
- Schema-driven configuration
- Performance optimizations

**Style Setters:**
- Display mode selector with Flexbox integration
- Border properties editor
- Color picker with multiple formats
- Size input with unit conversion
- Box model visual editor

**Effects System:**
- Automatic internationalization
- Debounced auto-save
- Custom validation support
- Field dependency management

**Best For:**
- Visual form designers
- Property panels in design tools
- Advanced configuration interfaces
- Schema-driven forms
- Multi-language applications

---

**Last Updated**: December 26, 2025  
**Version**: Based on current codebase  
**Maintainer**: Designable Team  
**Package Purpose**: Property editing system for visual design tools  
**Total Components**: 20+ specialized form controls  
**Key Features**: Advanced style setters, code editor, multi-type inputs, auto-save
