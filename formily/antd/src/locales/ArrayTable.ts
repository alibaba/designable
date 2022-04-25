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
        tableLayout: {
          title: '表格布局',
          dataSource: ['自动', '固定'],
        },
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
        tableLayout: {
          title: 'Table Layout',
          dataSource: ['Auto', 'Fixed'],
        },
      },
    },
  },
  'ko-KR': {
    title: '배열 테이블',
    addSortHandle: '정렬 핸들 추가',
    addColumn: '열 추가',
    addIndex: '색인 추가',
    addOperation: '작업 추가',
    settings: {
      'x-component-props': {
        showHeader: '헤더 보여주기',
        sticky: '고정',
        align: {
          title: '정렬',
          dataSource: ['왼쪽', '오른쪽', '가운데'],
        },
        colSpan: 'colSpan',
        fixed: { title: '고정', dataSource: ['왼쪽', '오른쪽', '없음'] },
        width: '너비',
        defaultValue: '기본 값',
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
  'ko-KR': {
    title: '열',
    settings: {
      'x-component-props': {
        title: '제목',
        align: {
          title: '정렬',
          dataSource: ['왼쪽', '오른쪽', '가운데'],
        },
        colSpan: 'Col Span',
        width: '너비',
        fixed: {
          title: '고정',
          dataSource: ['왼쪽', '오른족', '없음'],
        },
      },
    },
  },
}
