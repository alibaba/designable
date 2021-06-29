import { createSchemaField, SchemaComponents } from '@formily/react'
import {
  FormItem,
  Input,
  NumberPicker,
  DatePicker,
  TimePicker,
  Select,
  Radio,
  Switch,
  Space,
  ArrayItems,
  ArrayTable,
  FormCollapse,
  FormGrid,
  FormLayout,
  FormTab,
} from '@formily/antd'
import { Slider } from 'antd'
import {
  SizeInput,
  ColorInput,
  ImageInput,
  BackgroundImageInput,
  PositionInput,
  CornerInput,
  ValueInput,
  BoxStyleSetter,
  BorderStyleSetter,
  BorderRadiusStyleSetter,
  BackgroundStyleSetter,
  BoxShadowStyleSetter,
  FontStyleSetter,
  DisplayStyleSetter,
  FlexStyleSetter,
} from './components'
import { ISchema } from 'packages/core/lib'
import { ISchemaFieldProps } from '@formily/react/esm/types'

type ComposeSchemaField = React.FC<ISchemaFieldProps> & {
  Markup: React.FC<ISchema>
  String: React.FC<Omit<ISchema, 'type'>>
  Object: React.FC<Omit<ISchema, 'type'>>
  Array: React.FC<Omit<ISchema, 'type'>>
  Date: React.FC<Omit<ISchema, 'type'>>
  DateTime: React.FC<Omit<ISchema, 'type'>>
  Boolean: React.FC<Omit<ISchema, 'type'>>
  Number: React.FC<Omit<ISchema, 'type'>>
  Void: React.FC<Omit<ISchema, 'type'>>
}
export function composeSchemaField<
  Components extends SchemaComponents = SchemaComponents
>(extraComponents?: Components): ComposeSchemaField {
  return createSchemaField({
    components: {
      FormItem,
      Input,
      ValueInput,
      SizeInput,
      ColorInput,
      ImageInput,
      PositionInput,
      CornerInput,
      BackgroundImageInput,
      BackgroundStyleSetter,
      BoxStyleSetter,
      BorderStyleSetter,
      BorderRadiusStyleSetter,
      DisplayStyleSetter,
      BoxShadowStyleSetter,
      FlexStyleSetter,
      FontStyleSetter,
      NumberPicker,
      DatePicker,
      TimePicker,
      Select,
      Radio,
      Slider,
      Switch,
      Space,
      ArrayItems,
      ArrayTable,
      FormCollapse,
      FormGrid,
      FormLayout,
      FormTab,
      ...extraComponents,
    },
  })
}
