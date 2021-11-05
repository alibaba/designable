export const Range = {
  'zh-CN': {
    title: '范围',
    settings: {
      'x-component-props': {
        slider: {
          title: '滑块个数',
          dataSource: ['单个', '两个'],
        },
        step: {
          title: '步长',
          tooltip: '取值必须大于 0，并且可被 (最大值 - 最小值) 整除',
        },
        marks: {
          title: '标记',
          tooltip:
            '刻度数值显示逻辑（false 代表不显示，array 枚举显示的值，number 代表按 number 平分，object 表示按 key 划分，value 值显示）',
        },
        marksPosition: {
          title: '标记位置',
          dataSource: ['上方', '下方'],
        },
        hasTip: '显示提示',
        reverse: {
          title: '反转',
          tooltip: '选中态反转',
        },
        pure: '纯净渲染',
        fixedWidth: {
          title: '是否为拖动线段类型',
        },
        tooltipVisible: '默认展示提示',
      },
    },
  },
  'en-US': {
    title: 'Range',
    settings: {
      'x-component-props': {
        slider: {
          title: 'Slider',
          dataSource: ['Single', 'Double'],
        },
        step: {
          title: 'Step',
          tooltip:
            'The value must be greater than 0 and can be divided by (max - min)',
        },
        marks: {
          title: 'Marks',
          tooltip:
            'False means not to display, Array enumeration shows the value, Number means to divide equally by number, Object means to divide by key, and value is displayed)',
        },
        marksPosition: {
          title: 'Marks Position',
          dataSource: ['Top', 'Bottom'],
        },
        hasTip: 'Show Tips',
        reverse: {
          title: 'Reversal',
          tooltip: 'Selected state inversion',
        },
        pure: 'Pure Rendering',
        fixedWidth: {
          title: 'Fixed Width',
        },
        tooltipVisible: 'Tooltips Visible',
      },
    },
  },
}
