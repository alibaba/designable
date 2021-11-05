export const FormTab = {
  'zh-CN': {
    title: '选项卡',
    addTabPane: '添加选项卡',
    settings: {
      'x-component-props': {
        size: {
          title: '尺寸',
          dataSource: ['小', '中', '继承'],
        },
        shape: {
          title: '外观',
          dataSource: ['纯净', '包裹', '文本', '胶囊'],
        },
        animation: '动画过渡',
        excessMode: {
          title: '滑动模式',
          tooltip: '选项卡过多时，如何滑动？',
          dataSource: ['滑动器', '下拉列表'],
        },
        tabPosition: {
          title: '选项卡位置',
          dataSource: ['上', '下', '左', '右'],
        },
        triggerType: {
          title: '选项卡激活方式',
          tooltip: '激活选项卡的触发方式',
          dataSource: ['点击', '移入'],
        },
      },
    },
  },
  'en-US': {
    title: 'Tabs',
    addTabPane: 'Add Panel',
    settings: {
      'x-component-props': {
        size: {
          title: 'Size',
          dataSource: ['Small', 'Medium', 'Inherit'],
        },
        shape: {
          title: 'Shape',
          dataSource: ['Pure', 'Wrapper', 'Text', 'Capsule'],
        },
        animation: 'Transition',
        excessMode: {
          title: 'Excess Mode',
          tooltip: 'When there are too many tabs, how to slide?',
          dataSource: ['Slider', 'Dropdown'],
        },
        tabPosition: {
          title: 'Tab Position',
          dataSource: ['Top', 'Bottom', 'Left', 'Right'],
        },
        triggerType: {
          title: 'Trigger Type',
          tooltip: 'Trigger method of activation tab',
          dataSource: ['Click', 'Hover'],
        },
      },
    },
  },
}

export const FormTabPane = {
  'zh-CN': {
    title: '选项卡面板',
  },
  'en-US': {
    title: 'Tab Panel',
  },
}
