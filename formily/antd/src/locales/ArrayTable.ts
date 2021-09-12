export const ArrayTable = {
  'zh-CN': {
    title: '自增表格',
    addSortHandle: '添加排序',
    addColumn: '添加列',
    addIndex: '添加索引',
    addOperation: '添加操作',
    settings: {
      'x-component-props': {
        showHeader: '显示头部',
        sticky: '吸顶',
        align: {
          title: '对齐',
          dataSource: ['左', '右', '居中'],
        },
        colSpan: '跨列',
        fixed: { title: '固定列', dataSource: ['左', '右', '无'] },
        width: '宽度',
        defaultValue: '默认值',
      },
    },
  },
  'en-US': {
    title: 'Array Table',
    addSortHandle: 'Add Sort Handle',
    addColumn: 'Add Column',
    addIndex: 'Add Index',
    addOperation: 'Add Operations',
    settings: {
      'x-component-props': {
        showHeader: 'Show Header',
        sticky: 'Sticky',
        align: {
          title: 'Align',
          dataSource: ['Left', 'Right', 'Center'],
        },
        colSpan: 'Col Span',
        fixed: { title: 'Fixed', dataSource: ['Left', 'Right', 'None'] },
        width: 'Width',
        defaultValue: 'Default Value',
      },
    },
  },
}

export const ArrayTableColumn = {
  'zh-CN': {
    title: '表格列',
    settings: {
      'x-component-props': {
        title: '标题',
        align: {
          title: '内容对齐',
          dataSource: ['左', '右', '居中'],
        },
        colSpan: '跨列',
        width: '宽度',
        fixed: {
          title: '固定',
          dataSource: ['左', '右', '无'],
        },
      },
    },
  },
  'en-US': {
    title: 'Column',
    settings: {
      'x-component-props': {
        title: 'Title',
        align: {
          title: 'Align',
          dataSource: ['Left', 'Right', 'Center'],
        },
        colSpan: 'Col Span',
        width: 'Width',
        fixed: {
          title: 'Fixed',
          dataSource: ['Left', 'Right', 'None'],
        },
      },
    },
  },
}
