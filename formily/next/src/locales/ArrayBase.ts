import { GlobalRegistry } from '@designable/core'

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    Previews: {
      droppable: '可以拖入组件',
      addTabPane: '添加选项卡',
      addCollapsePanel: '添加手风琴卡片',
      addTableColumn: '添加表格列',
      addTableSortHandle: '添加排序',
      addIndex: '添加索引',
      addOperation: '添加操作',
    },
  },
})

export const ArrayAddition = {
  'zh-CN': {
    title: '添加按钮',
    settings: {
      'x-component-props': {
        method: {
          title: '添加方法',
          dataSource: ['尾部', '头部'],
        },
        defaultValue: '默认值',
      },
    },
  },
  'en-US': {
    title: 'Addition',
    settings: {
      'x-component-props': {
        method: {
          title: 'Method',
          dataSource: ['Push', 'Unshift'],
        },
        defaultValue: 'Default Value',
      },
    },
  },
}

export const ArrayRemove = {
  'zh-CN': {
    title: '删除按钮',
  },
  'en-US': {
    title: 'Remove',
  },
}

export const ArrayMoveUp = {
  'zh-CN': {
    title: '上移按钮',
  },
  'en-US': {
    title: 'Move Up',
  },
}

export const ArrayMoveDown = {
  'zh-CN': {
    title: '下移按钮',
  },
  'en-US': {
    title: 'Move Down',
  },
}

export const ArrayIndex = {
  'zh-CN': {
    title: '索引标识',
  },
  'en-US': {
    title: 'Index',
  },
}

export const ArraySortHandle = {
  'zh-CN': {
    title: '排序标识',
  },
  'en-US': {
    title: 'Sort Handle',
  },
}
