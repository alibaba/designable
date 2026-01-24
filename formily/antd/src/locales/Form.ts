import { createLocales } from '@sulesky/core'
import { Component } from './Component'

export const Form = createLocales(Component, {
  
  'en-US': {
    title: 'Form',
    settings: {
      labelCol: 'Label Col',
      wrapperCol: 'Wrapper Col',
      colon: 'Colon',
      labelAlign: {
        title: 'Label Align',
        dataSource: ['Left', 'Right', 'Inherit']
},
      wrapperAlign: {
        title: 'Wrapper Align',
        dataSource: ['Left', 'Right', 'Inherit']
},
      labelWrap: 'Label Wrap',
      wrapperWrap: 'Wrapper Wrap',
      labelWidth: 'Label Width',
      wrapperWidth: 'Wrapper Width',
      fullness: 'Fullness',
      inset: 'Inset',
      shallow: 'Shallow',
      bordered: 'Bordered',
      size: {
        title: 'Size',
        dataSource: ['Large', 'Small', 'Default', 'Inherit']
},
      layout: {
        title: 'Layout',
        dataSource: ['Vertical', 'Horizontal', 'Inline', 'Inherit']
},
      feedbackLayout: {
        title: 'Feedback Layout',
        dataSource: ['Loose', 'Terse', 'Popup', 'None', 'Inherit']
},
      tooltipLayout: {
        title: 'Tooltip Layout',
        dataSource: ['Icon', 'Text', 'Inherit']
}
}
}
})
