export const ArrayTable = {
  'zh-CN': {
    title: '自增表格',
    addSortHandle: '添加排序',
    addColumn: '添加列',
    addIndex: '添加索引',
    addOperation: '添加操作',
    settings: {
      'x-component-props': {
        primaryKey: '主键',
        tableLayout: {
          title: '表格布局',
          dataSource: ['自动', '固定'],
        },
        size: {
          title: '尺寸',
          dataSource: ['小', '中', '继承', '无'],
        },
        tableWidth: '表格宽度',
        hasHeader: '表格头',
        isZebra: '斑马线',
        emptyContent: '空内容文案',
        fixedHeader: '固定表格头',
        maxBodyHeight: {
          title: '最大主体高度',
          tooltip: '启用固定表格头时，超过此高度时会出现滚动条',
        },
        stickyHeader: '粘性头部',
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
        primaryKey: 'Primary Key',
        tableLayout: {
          title: 'Table Layout',
          dataSource: ['Auto', 'Fixed'],
        },
        size: {
          title: 'Size',
          dataSource: ['Small', 'Medium', 'Inherit', 'None'],
        },
        tableWidth: 'Table Width',
        hasHeader: 'Header',
        isZebra: 'Zebra',
        emptyContent: 'Empty Content',
        fixedHeader: 'Fixed Header',
        maxBodyHeight: {
          title: 'Max Body Height',
          tooltip:
            'When Fixed Header is enabled, scroll bars will appear when the height exceeds this height',
        },
        stickyHeader: 'Sticky Header',
      },
    },
  },
}

export const ArrayTableColumn = {
  'zh-CN': {
    title: '表格列',
    settings: {
      'x-component-props': {
        align: {
          title: '单元格对齐',
          dataSource: ['左', '中', '右'],
        },
        alignHeader: {
          title: '表格头对齐',
          tooltip: '不设置将与单元格对齐方式相同',
          dataSource: ['左', '中', '右'],
        },
        lock: {
          title: '锁列',
          dataSource: ['不锁', '左', '右', '锁'],
        },
        colSpan: '格数',
        wordBreak: {
          title: '单词打破',
          dataSource: ['全部', '单词'],
        },
      },
    },
  },
  'en-US': {
    title: 'Column',
    settings: {
      'x-component-props': {
        align: {
          title: 'Cell Alignment',
          dataSource: ['Left', 'Medium', 'Right'],
        },
        alignHeader: {
          title: 'Header alignment',
          tooltip:
            'If not set, the alignment will be the same as that of the Cell Alignment',
          dataSource: ['Left', 'Center', 'Right'],
        },
        lock: {
          title: 'Lock Column',
          dataSource: ['None', 'Left', 'Right', 'Lock'],
        },
        colSpan: 'Col Span',
        wordBreak: {
          title: 'Word Break',
          dataSource: ['All', 'Word'],
        },
      },
    },
  },
}
