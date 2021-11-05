export const Cascader = {
  'zh-CN': {
    title: '联级选择',
    settings: {
      'x-component-props': {
        changeOnSelect: {
          title: '选择时触发',
          tooltip: '点选每级菜单选项值都会发生变化',
        },
        displayRender: {
          title: '渲染函数',
          tooltip: '选择后展示的渲染函数，默认为label => label.join("/")	',
        },
        fieldNames: {
          title: '自定义字段名',
          tooltip:
            '默认值：{ label: "label", value: "value", children: "children" }',
        },
      },
    },
  },
  'en-US': {
    title: 'Cascader',
    settings: {
      'x-component-props': {
        changeOnSelect: {
          title: 'Change On Select',
          tooltip: 'Click on each level of menu option value will change',
        },
        displayRender: {
          title: 'Display Render',
          tooltip:
            'The rendering function displayed after selection, the default is label => label.join("/")	',
        },
        fieldNames: {
          title: 'Field Names',
          tooltip:
            'Defaults：{ label: "label", value: "value", children: "children" }',
        },
      },
    },
  },
}
