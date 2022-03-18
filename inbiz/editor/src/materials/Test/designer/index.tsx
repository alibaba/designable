import { DnFC } from '@inbiz/react'
import { createBehavior, createResource } from '@inbiz/core'
import { Test as PreviewTest } from '../preview'
import { Test as TestLocale } from './locale'
import { useForm, useField } from '@formily/react'
import {
  createInbizSchema,
  createBaseSchema,
  createValidatorSchema,
  createComponentStyleSchema,
  createDecoratorStyleSchema,
  createModelSchema,
  createSoureSchema,
} from '../../Field'

export const Test: DnFC<any> = PreviewTest
Test.Behavior = createBehavior({
  name: 'Test',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Test',
  designerProps: {
    propsSchema: createInbizSchema({
      attribute: {
        ...createBaseSchema({
          defaultType: {
            type: 'string',
            enum: ['Input', 'Select'],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            // 'x-reactions': {
            //   target: 'form.attribute.base.x-component-props.test3',
            //   fulfill: {
            //     state: {
            //       visible: "{{$self.value == 'show'}}",
            //     },
            //   },
            // },
          },
          default: {
            'x-decorator': 'FormItem',
            // 'x-component': 'ValueInput',
            enum: ['input', 'select'],
            'x-reactions': {
              dependencies: ['.defaultType'],
              fulfill: {
                schema: {
                  'x-component': '{{$deps[0]}}',
                  'x-value': '',
                },
              },
            },
          },
          test: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              tab: '${default}',
            },
            // 'x-reactions': {
            //   dependencies: ['.isShow'],
            //   fulfill: {
            //     state: {
            //       visible: "{{$deps[0] == 'show'}}",
            //     },
            //   },
            // },
          },
          test3: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component-props': {
              tab: '${default}',
            },
            'x-component': (props) => {
              // 表单内所有数据
              window.formu = useForm()
              window.uf = useField()
              return <div {...props}>11111</div>
            },
          },
        }),
        ...createValidatorSchema(true),
      },
      style: {
        ...createComponentStyleSchema(),
        ...createDecoratorStyleSchema(),
      },
      senior: {
        ...createModelSchema(),
        ...createSoureSchema(),
      },
    }),
  },
  designerLocales: {
    'zh-CN': {
      title: 'eform示例',
      describe: '2222',
      settings: {
        'x-component-props': {
          defaultType: {
            title: '默认值类型',
            dataSource: ['输入框', '下拉框'],
          },
          default: '默认值',
          test: {
            title: 'aaaa',
            tooltip: '提示提示',
            default: '999',
          },
          test3: '自定义test3',
          labelAlign: {
            title: '标签对齐',
            dataSource: ['左对齐', '右对齐'],
          },
          test2: '自定义组件',
        },
      },
    },
  },
})

Test.Resource = createResource({
  icon: 'CardSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'Test',
        'x-decorator': 'FormItem',
        'x-component': 'Test',
        'x-component-props': {
          defaultType: 'Input',
        },
      },
    },
  ],
})
