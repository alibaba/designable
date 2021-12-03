export const Select = {
  'zh-CN': {
    title: '选择框',
    settings: {
      'x-component-props': {
        filterLocal: '本地过滤',
        filter: '过滤方法',
        autoHighlightFirstItem: '自动高亮首项',
        mode: {
          title: '模式',
          dataSource: ['单选', '多选', '标签'],
        },
        notFoundContent: {
          title: '无内容提示',
          tooltip: '弹层内容为空的文案',
        },
        showDataSourceChildren: {
          title: '展示可选项子节点',
        },
        hasSelectAll: '多选模式下是否可全选',
        cacheValue: {
          title: '缓存选中值',
          tooltip: '可选项变化的时是否保留已选的内容',
        },
        tagInline: '标签行内展示',
        tagClosable: '标签可关闭',
        adjustTagSize: {
          title: '调整标签大小',
          tooltip: '调整标签大小与选择器相同',
        },
        maxTagCount: '最多展示标签数量',
        hiddenSelected: '选择后立即隐藏菜单',
        popupAutoFocus: '弹出菜单时自动聚焦',
      },
    },
  },
  'en-US': {
    title: 'Select',
    settings: {
      'x-component-props': {
        filterLocal: 'Local Filter',
        filter: 'Filter Function',
        autoHighlightFirstItem: 'Auto highlight first item',
        mode: {
          title: 'Mode',
          dataSource: ['Single', 'Multiple', 'Tags'],
        },
        notFoundContent: 'No Content Prompt',
        showDataSourceChildren: 'Show Data Source Children',
        hasSelectAll: 'Can Select All',
        cacheValue: {
          title: 'Cache Value',
          tooltip:
            'Do you want to keep the selected value when the data source changes',
        },
        tagInline: 'Tag Inline',
        tagClosable: 'Tag Closable',
        adjustTagSize: {
          title: 'Adjust Tag Size',
          tooltip: 'Adjust the tag the same as the selector',
        },
        maxTagCount: 'Max Tag Count',
        hiddenSelected: 'Hidden Selected',
        popupAutoFocus: 'Popup Auto Focus',
      },
    },
  },
}
