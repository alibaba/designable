export const TreeSelect = {
  'zh-CN': {
    title: '树选择',
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
        treeCheckable: {
          title: '勾选树',
          tooltip: '下拉框中的树是否支持勾选节点的复选框',
        },
        treeCheckStrictly: {
          title: '严格树勾选',
          tooltip:
            '下拉框中的树勾选节点复选框是否完全受控（父子节点选中状态不再关联）',
        },
        treeCheckedStrategy: {
          title: '勾选树策略',
          tooltip: '选中时回填的方式',
          dataSource: ['只返回父节点', '只返回子节点', '返回所有选中的节点'],
        },
        treeDefaultExpandAll: '默认展开所有节点',
      },
    },
  },
  'en-US': {
    title: 'TreeSelect',
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
        treeCheckable: {
          title: 'Tree Checkable',
          tooltip:
            'Whether the tree in the drop-down box supports checking the check box of the node',
        },
        treeCheckStrictly: {
          title: 'Tree Check Strictly',
          tooltip:
            'Check whether the node check box in the tree in the drop-down box is completely controlled (the selected status of parent and child nodes is no longer associated)',
        },
        treeCheckedStrategy: {
          title: 'Tree Checked Strategy',
          tooltip: 'How to backfill when selected',
          dataSource: [
            'Return only parents',
            'Return only children',
            'Returns all selected',
          ],
        },
        treeDefaultExpandAll: 'Expand All By Default',
      },
    },
  },
}
