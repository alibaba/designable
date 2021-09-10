import { GlobalDragSource } from '@designable/core'
import { createFieldSchema } from '../components'
import * as AllLocales from '../locales/all'
import * as AllSchemas from '../schemas/all'

GlobalDragSource.appendSourcesByGroup('inputs', [
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Input),
    },
    designerLocales: AllLocales.Input,
    props: {
      title: 'Input',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Input.TextArea),
    },
    designerLocales: AllLocales.TextArea,
    props: {
      title: 'TextArea',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Select),
    },
    designerLocales: AllLocales.Select,
    props: {
      title: 'Select',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.TreeSelect),
    },
    designerLocales: AllLocales.TreeSelect,
    props: {
      title: 'Tree Select',
      'x-decorator': 'FormItem',
      'x-component': 'TreeSelect',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Cascader),
    },
    designerLocales: AllLocales.Cascader,
    props: {
      title: 'Cascader',
      'x-decorator': 'FormItem',
      'x-component': 'Cascader',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Radio.Group),
    },
    designerLocales: AllLocales.RadioGroup,
    props: {
      type: 'string | number',
      title: 'Radio Group',
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      enum: [
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 },
      ],
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Checkbox.Group),
    },
    designerLocales: AllLocales.CheckboxGroup,
    props: {
      type: 'Array<string | number>',
      title: 'Checkbox Group',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox.Group',
      enum: [
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 },
      ],
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Slider),
    },
    designerLocales: AllLocales.Slider,
    props: {
      type: 'number',
      title: 'Slider',
      'x-decorator': 'FormItem',
      'x-component': 'Slider',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Rate),
    },
    designerLocales: AllLocales.Rate,
    props: {
      type: 'number',
      title: 'Rate',
      'x-decorator': 'FormItem',
      'x-component': 'Rate',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.DatePicker),
    },
    designerLocales: AllLocales.DatePicker,
    props: {
      type: 'string',
      title: 'DatePicker',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.DatePicker.RangePicker),
    },
    designerLocales: AllLocales.DateRangePicker,
    props: {
      type: '[string,string]',
      title: 'DateRangePicker',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker.RangePicker',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.TimePicker),
    },
    designerLocales: AllLocales.TimePicker,
    props: {
      type: 'string',
      title: 'TimePicker',
      'x-decorator': 'FormItem',
      'x-component': 'TimePicker',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.TimePicker.RangePicker),
    },
    designerLocales: AllLocales.TimeRangePicker,
    props: {
      type: '[string,string]',
      title: 'TimeRangePicker',
      'x-decorator': 'FormItem',
      'x-component': 'TimePicker.RangePicker',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.NumberPicker),
    },
    designerLocales: AllLocales.NumberPicker,
    props: {
      type: 'number',
      title: 'NumberPicker',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Password),
    },
    designerLocales: AllLocales.Password,
    props: {
      type: 'string',
      title: 'Password',
      'x-decorator': 'FormItem',
      'x-component': 'Password',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Transfer),
    },
    designerLocales: AllLocales.Transfer,
    props: {
      type: 'Array<string>',
      title: 'Transfer',
      'x-decorator': 'FormItem',
      'x-component': 'Transfer',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Upload),
    },
    designerLocales: AllLocales.Upload,
    props: {
      type: 'Array<object>',
      title: 'Upload',
      'x-decorator': 'FormItem',
      'x-component': 'Upload',
      'x-component-props': {
        textContent: 'Upload',
      },
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Upload.Dragger),
    },
    designerLocales: AllLocales.UploadDragger,
    props: {
      type: 'Array<object>',
      title: 'Drag Upload',
      'x-decorator': 'FormItem',
      'x-component': 'Upload.Dragger',
      'x-component-props': {
        textContent: 'Click or drag file to this area to upload',
      },
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Switch),
    },
    designerLocales: AllLocales.Switch,
    props: {
      type: 'boolean',
      title: 'Switch',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
  },
  {
    componentName: 'DesignableField',
    designerProps: {
      propsSchema: createFieldSchema(),
    },
    designerLocales: AllLocales.ObjectLocale,
    props: {
      type: 'object',
    },
  },
])
