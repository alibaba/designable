import {
  InputSource,
  CardSource,
} from '@designable/react'

import {
  createResource,
  createBehavior,
  GlobalRegistry,
  createDesigner,
} from '@designable/core'


// Register icons
GlobalRegistry.registerDesignerIcons({
  InputSource,
  CardSource,
})

// Behaviors
export const RootBehavior = createBehavior({
  name: 'Root',
  selector: 'Root',
  designerProps: { droppable: true },
  designerLocales: {
    'en-US': { title: 'Root' },
  },
})

export const InputBehavior = createBehavior({
  name: 'Input',
  selector: (node) => node.componentName === 'Field' && node.props['x-component'] === 'Input',
  designerProps: {
    propsSchema: {
      type: 'object',
      $namespace: 'Field',
      properties: {
        'field-properties': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '字段属性',
          properties: {
            title: { type: 'string', 'x-decorator': 'FormItem', 'x-component': 'Input' },
            hidden: { type: 'string', 'x-decorator': 'FormItem', 'x-component': 'Switch' },
            default: { 'x-decorator': 'FormItem', 'x-component': 'ValueInput' },
            test: {
              type: 'void',
              title: '测试',
              'x-decorator': 'FormItem',
              'x-component': 'DrawerSetter',
              'x-component-props': { text: '打开抽屉' },
              properties: {
                test: { type: 'string', title: '测试输入', 'x-decorator': 'FormItem', 'x-component': 'Input' },
              },
            },
          },
        },
        'component-styles': {
          type: 'void',
          title: '样式',
          'x-component': 'CollapseItem',
          properties: {
            'style.width': { type: 'string', 'x-decorator': 'FormItem', 'x-component': 'SizeInput' },
            'style.height': { type: 'string', 'x-decorator': 'FormItem', 'x-component': 'SizeInput' },
            'style.display': { 'x-component': 'DisplayStyleSetter' },
            'style.background': { 'x-component': 'BackgroundStyleSetter' },
            'style.boxShadow': { 'x-component': 'BoxShadowStyleSetter' },
            'style.font': { 'x-component': 'FontStyleSetter' },
            'style.margin': { 'x-component': 'BoxStyleSetter' },
            'style.padding': { 'x-component': 'BoxStyleSetter' },
            'style.borderRadius': { 'x-component': 'BorderRadiusStyleSetter' },
            'style.border': { 'x-component': 'BorderStyleSetter' },
          },
        },
      },
    },
  },
  designerLocales: {
    'en-US': {
      title: 'Input',
      settings: {
        title: 'Title',
        hidden: 'Hidden',
        default: 'Default Value',
        style: {
          width: 'Width',
          height: 'Height',
          display: 'Display',
          background: 'Background',
          boxShadow: 'Box Shadow',
          font: 'Font',
          margin: 'Margin',
          padding: 'Padding',
          borderRadius: 'Border Radius',
          border: 'Border',
        },
      },
    },
  },
})

export const CardBehavior = createBehavior({
  name: 'Card',
  selector: 'Card',
  designerProps: { droppable: true },
  designerLocales: {
    'en-US': { title: 'Card' },
  },
})

GlobalRegistry.setDesignerBehaviors([
  RootBehavior,
  InputBehavior,
  CardBehavior,
])

export const Input = createResource({
  title: {
    'zh-CN': '输入框',
    'en-US': 'Input',
    'ko-KR': '입력 상자',
  },
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: '输入框',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
    },
  ],
})

export const Card = createResource({
  title: {
    'zh-CN': '卡片',
    'en-US': 'Card',
    'ko-KR': '카드 상자',
  },
  icon: 'CardSource',
  elements: [
    {
      componentName: 'Card',
      props: {
        title: '卡片',
      },
    },
  ],
})

GlobalRegistry.registerDesignerLocales({
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Displays: 'Displays',
      Feedbacks: 'Feedbacks',
    },
  },
})

export const engine = createDesigner()
