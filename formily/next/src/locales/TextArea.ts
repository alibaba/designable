export const TextArea = {
  'zh-CN': {
    title: '多行输入',
    settings: {
      'x-component-props': {
        showLimitHint: '长度限制提示',
        cutString: {
          title: '截断',
          tooltip: '当设置最大长度后，超出是否截断字符串',
        },
        trim: {
          title: '修剪',
          tooltip: '移除首尾空格',
        },
        composition: '过滤输入法中间字母',
        hint: {
          title: '水印',
          tooltip: '值取自 Icon 的 type，与清除按钮在同一位置',
        },
        autoHeight: '自动高度',
        rows: '文本框高度',
      },
    },
  },
  'en-US': {
    title: 'TextArea',
    settings: {
      'x-component-props': {
        showLimitHint: 'Show Limit Hint',
        cutString: {
          title: 'Cut String',
          tooltip:
            'When the maxLength is set, whether to truncate the string is exceeded',
        },
        trim: {
          title: 'Trim',
          tooltip: 'Remove leading and trailing spaces',
        },
        composition: 'Filter Ime Middle Letters',
        hint: {
          title: 'Hint',
          tooltip:
            'The value is taken from the type of Icon and is in the same position as the clear button',
        },
        autoHeight: 'Auto Height',
        rows: 'Rows',
      },
    },
  },
}
