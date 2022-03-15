import { ISchema } from '@formily/json-schema'
import {
  ReactionsSetter,
  DataSourceSetter,
  ValidatorSetter,
} from '@inbiz/react-settings-form'
import { FormItemSwitcher } from '../common/FormItemSwitcher'
import { CSSStyle } from './CSSStyle'
import { FormItem } from './FormItem'

export const createComponentSchema = (
  component: ISchema,
  decorator: ISchema
) => {
  return {
    'component-group': component && {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-component"]}}',
          },
        },
      },
      properties: {
        'x-component-props': component,
      },
    },
    'decorator-group': decorator && {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: false },
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-decorator"]}}',
          },
        },
      },
      properties: {
        'x-decorator-props': decorator,
      },
    },
    'component-style-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: false },
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-component"]}}',
          },
        },
      },
      properties: {
        'x-component-props.style': CSSStyle,
      },
    },
    'decorator-style-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: false },
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-decorator"]}}',
          },
        },
      },
      properties: {
        'x-decorator-props.style': CSSStyle,
      },
    },
  }
}

export const createFieldSchema = (
  component?: ISchema,
  decorator: ISchema = FormItem
): ISchema => {
  return {
    type: 'object',
    properties: {
      'field-group': {
        type: 'void',
        'x-component': 'CollapseItem',
        properties: {
          name: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          title: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          description: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
          },
          'x-display': {
            type: 'string',
            enum: ['visible', 'hidden', 'none', ''],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              defaultValue: 'visible',
            },
          },
          'x-pattern': {
            type: 'string',
            enum: ['editable', 'disabled', 'readOnly', 'readPretty', ''],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              defaultValue: 'editable',
            },
          },
          default: {
            'x-decorator': 'FormItem',
            'x-component': 'ValueInput',
          },
          enum: {
            'x-decorator': 'FormItem',
            'x-component': DataSourceSetter,
          },
          'x-reactions': {
            'x-decorator': 'FormItem',
            'x-component': ReactionsSetter,
          },
          'x-validator': {
            type: 'array',
            'x-component': ValidatorSetter,
          },
          required: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
          },
        },
      },
      ...createComponentSchema(component, decorator),
    },
  }
}

export const createVoidFieldSchema = (
  component?: ISchema,
  decorator: ISchema = FormItem
) => {
  return {
    type: 'object',
    properties: {
      'field-group': {
        type: 'void',
        'x-component': 'CollapseItem',
        properties: {
          name: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          title: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-reactions': {
              fulfill: {
                state: {
                  hidden: '{{$form.values["x-decorator"] !== "FormItem"}}',
                },
              },
            },
          },
          description: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-reactions': {
              fulfill: {
                state: {
                  hidden: '{{$form.values["x-decorator"] !== "FormItem"}}',
                },
              },
            },
          },
          'x-display': {
            type: 'string',
            enum: ['visible', 'hidden', 'none', ''],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              defaultValue: 'visible',
            },
          },
          'x-pattern': {
            type: 'string',
            enum: ['editable', 'disabled', 'readOnly', 'readPretty', ''],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              defaultValue: 'editable',
            },
          },
          'x-reactions': {
            'x-decorator': 'FormItem',
            'x-component': ReactionsSetter,
          },
          'x-decorator': {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': FormItemSwitcher,
          },
        },
      },
      ...createComponentSchema(component, decorator),
    },
  }
}

// 创建inbiz属性面板
export const createInbizSchema = ({
  attribute,
  style,
  senior,
}: {
  attribute: { [key: string]: ISchema }
  style?: { [key: string]: ISchema }
  senior?: { [key: string]: ISchema }
}): ISchema => {
  return {
    type: 'object',
    properties: {
      form: {
        type: 'void',
        'x-component': 'FormTab',
        properties: {
          attribute: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: '属性',
            },
            properties: {
              name: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              ...attribute,
            },
          },
          style: style && {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: '样式',
            },
            properties: style,
          },
          senior: senior && {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: '高级',
            },
            properties: senior,
          },
        },
      },
    },
  }
}

// 基础字段模块
export const createBaseSchema = (component?: { [key: string]: ISchema }) => {
  return {
    base: {
      type: 'void',
      'x-component': 'CollapseItem',
      properties: {
        title: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        description: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
        },
        'x-display': {
          type: 'string',
          enum: ['visible', 'hidden', 'none', ''],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            defaultValue: 'visible',
          },
        },
        'x-pattern': {
          type: 'string',
          enum: ['editable', 'disabled', 'readOnly', 'readPretty', ''],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            defaultValue: 'editable',
          },
        },
        'x-component-props': component && {
          type: 'object',
          properties: component,
        },
        /* default: {
          'x-decorator': 'FormItem',
          'x-component': 'ValueInput',
        },
        enum: {
          'x-decorator': 'FormItem',
          'x-component': DataSourceSetter,
        },
        'x-reactions': {
          'x-decorator': 'FormItem',
          'x-component': ReactionsSetter,
        },
        'x-validator': {
          type: 'array',
          'x-component': ValidatorSetter,
        },*/
      },
    },
  }
}
// 校验模块
export const createValidatorSchema = (
  validator = false,
  component?: { [key: string]: ISchema }
) => {
  return {
    validator: {
      type: 'void',
      'x-component': 'CollapseItem',
      properties: {
        'x-validator': validator && {
          type: 'array',
          'x-component': ValidatorSetter,
        },
        required: {
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
        },
        ...component,
      },
    },
  }
}

// 创建组件样式
export const createComponentStyleSchema = (component?: {
  [key: string]: ISchema
}) => {
  return {
    'component-style': {
      type: 'void',
      'x-component': 'CollapseItem',
      properties: {
        'x-component-props': {
          type: 'object',
          properties: {
            className: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            ...component,
          },
        },
      },
    },
  }
}
// 容器样式
export const createDecoratorStyleSchema = () => {
  return {
    'decorator-style-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: false },
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-decorator"]}}',
          },
        },
      },
      properties: {
        'x-decorator-props.style': CSSStyle,
      },
    },
  }
}

// 创建绑定模型属性
export const createModelSchema = (component?: { [key: string]: ISchema }) => {
  return {
    'x-component-props': {
      type: 'object',
      properties: {
        model: {
          type: 'object',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        ...component,
      },
    },
  }
}

// 创建 数据源
export const createSoureSchema = (component?: { [key: string]: ISchema }) => {
  return {
    soure: {
      type: 'void',
      'x-component': 'CollapseItem',
      properties: {
        'x-component-props': {
          type: 'object',
          properties: {
            sourcetype: {
              type: 'string',
              enum: ['model', 'api'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
            },
            sourceModel: {
              type: 'object',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            ...component,
          },
        },
      },
    },
  }
}
