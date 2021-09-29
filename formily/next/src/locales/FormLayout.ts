export const FormLayout = {
  'zh-CN': {
    title: '表单布局',
    settings: {
      'x-component-props': {
        labelCol: '标签网格宽度',
        wrapperCol: '组件网格宽度',
        colon: '是否有冒号',
        labelAlign: {
          title: '标签对齐',
          dataSource: ['左对齐', '右对齐', '继承'],
        },
        wrapperAlign: {
          title: '组件对齐',
          dataSource: ['左对齐', '右对齐', '继承'],
        },
        labelWrap: '标签换行',
        wrapperWrap: '组件换行',
        labelWidth: '标签宽度',
        wrapperWidth: '组件宽度',
        fullness: '组件占满',
        inset: '内联布局',
        shallow: '是否浅传递',
        bordered: '是否有边框',
        size: { title: '尺寸', dataSource: ['大', '小', '默认', '继承'] },
        layout: { title: '布局', dataSource: ['水平', '垂直', '内联', '继承'] },
        feedbackLayout: {
          title: '反馈布局',
          dataSource: ['宽松', '紧凑', '弹层', '无', '继承'],
        },
        tooltipLayout: {
          title: '提示布局',
          dataSource: ['图标', '文本', '继承'],
        },
      },
    },
  },
  'en-US': {
    title: 'Form Layout',
    settings: {
      'x-component-props': {
        labelCol: 'Label Col',
        wrapperCol: 'Wrapper Col',
        colon: 'Colon',
        labelAlign: {
          title: 'Label Align',
          dataSource: ['Left', 'Right', 'Inherit'],
        },
        wrapperAlign: {
          title: 'Wrapper Align',
          dataSource: ['Left', 'Right', 'Inherit'],
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
          dataSource: ['Large', 'Small', 'Default', 'Inherit'],
        },
        layout: {
          title: 'Layout',
          dataSource: ['Horizontal', 'Vertical', 'Inline', 'Inherit'],
        },
        feedbackLayout: {
          title: 'Feedback Layout',
          dataSource: ['Loose', 'Terse', 'Popup', 'None', 'Inherit'],
        },
        tooltipLayout: {
          title: 'Tooltip Layout',
          dataSource: ['Icon', 'Text', 'Inherit'],
        },
      },
    },
  },
}
