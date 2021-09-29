export const FormTab = {
  'zh-CN': {
    title: '选项卡',
    addTabPane: '添加选项卡',
    settings: {
      'x-component-props': {
        animated: '启用动画过渡',
        centered: '标签居中',
        tab: '选项名称',
        type: {
          title: '类型',
          dataSource: [
            { label: '线框', value: 'line' },
            { label: '卡片', value: 'card' },
          ],
        },
      },
    },
  },
  'en-US': {
    title: 'Tabs',
    addTabPane: 'Add Panel',
    settings: {
      'x-component-props': {
        animated: 'Enable Animated',
        centered: 'Label Centered',
        tab: 'Tab Title',
        type: {
          title: 'Type',
          dataSource: [
            { label: 'Line', value: 'line' },
            { label: 'Card', value: 'card' },
          ],
        },
      },
    },
  },
}

export const FormTabPane = {
  'zh-CN': {
    title: '选项卡面板',
    settings: {
      'x-component-props': {
        tab: '面板标题',
      },
    },
  },
  'en-US': {
    title: 'Tab Panel',
    settings: {
      'x-component-props': {
        tab: 'Pane Title',
      },
    },
  },
}
