export const TreeSelect = {
  'zh-CN': {
    title: '树选择',
    settings: {
      'x-component-props': {
        mode: {
          title: '模式',
          dataSource: ['多选', '标签', '单选'],
        },
        autoClearSearchValue: {
          title: '选中自动清除',
          tooltip: '仅在多选或者标签模式下支持',
        },
        defaultActiveFirstOption: '默认高亮第一个选项',
        defaultOpen: '默认展开',
        filterOption: '选项筛选器',
        filterSort: '选项排序器',
        labelInValue: {
          title: '标签值',
          tooltip:
            '是否把每个选项的 label 包装到 value 中，会把 Select 的 value 类型从 string 变为 { value: string, label: ReactNode } 的格式',
        },
        listHeight: '弹窗滚动高度',
        maxTagCount: {
          title: '最多标签数量',
          tooltip: '最多显示多少个 tag，响应式模式会对性能产生损耗',
        },
        maxTagPlaceholder: {
          title: '最多标签占位',
          tooltip: '隐藏 tag 时显示的内容',
        },
        maxTagTextLength: '最多标签文本长度',
        showArrow: '显示箭头',
        virtual: '开启虚拟滚动',
        dropdownMatchSelectWidth: {
          title: '下拉选择器同宽',
          tooltip:
            '默认将设置 min-width，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动',
        },
        showCheckedStrategy: {
          title: '复选回显策略',
          tooltip:
            '配置 treeCheckable 时，定义选中项回填的方式。TreeSelect.SHOW_ALL: 显示所有选中节点(包括父节点)。TreeSelect.SHOW_PARENT: 只显示父节点(当父节点下所有子节点都选中时)。 默认只显示子节点',
          dataSource: ['显示所有', '显示父节点', '显示子节点'],
        },
        treeCheckable: '开启复选',
        treeDefaultExpandAll: '默认展开所有',
        treeDefaultExpandedKeys: {
          title: '默认展开选项',
          tooltip: '格式：Array<string | number>',
        },
        treeNodeFilterProp: {
          title: '节点过滤属性',
          tooltip: '输入项过滤对应的 treeNode 属性',
        },
        treeDataSimpleMode: {
          title: '使用简单数据结构',
          tooltip: `使用简单格式的 treeData，具体设置参考可设置的类型 (此时 treeData 应变为这样的数据结构: [{id:1, pId:0, value:'1', title:"test1",...},...]， pId 是父节点的 id)`,
        },
        treeNodeLabelProp: { title: '标签显示名称', tooltip: '默认为title' },
        filterTreeNode: '节点过滤器',
      },
    },
  },
  'en-US': {
    title: 'TreeSelect',
    settings: {
      'x-component-props': {
        mode: {
          title: 'Mode',
          dataSource: ['Multiple', 'Tags', 'Single'],
        },
        autoClearSearchValue: {
          title: 'Auto Clear Search Value',
          tooltip: 'Only used to multiple and tags mode',
        },
        defaultActiveFirstOption: 'Default Active First Option',
        defaultOpen: 'Default Open',
        filterOption: 'Filter Option',
        filterSort: 'Filter Sort',
        labelInValue: 'Label In Value',
        listHeight: 'List Height',
        maxTagCount: 'Max Tag Count',
        maxTagPlaceholder: {
          title: 'Max Tag Placeholder',
          tooltip: 'Content displayed when tag is hidden',
        },
        maxTagTextLength: 'Max Tag Text Length',
        notFoundContent: 'Not Found Content',
        showArrow: 'Show Arrow',
        virtual: 'Use Virtual Scroll',
        dropdownMatchSelectWidth: {
          title: 'Dropdown Match Select Width',
          tooltip:
            'By default, min-width will be set, and it will be ignored when the value is less than the width of the selection box. false will turn off virtual scrolling',
        },
        showCheckedStrategy: {
          title: 'Show Checked Strategy',
          tooltip:
            'When configuring treeCheckable, define how to backfill the selected item. TreeSelect.SHOW_ALL: Show all selected nodes (including parent nodes). TreeSelect.SHOW_PARENT: Only display the parent node (when all child nodes under the parent node are selected). Only show child nodes by default',
          dataSource: ['Show All', 'Show Parent Node', 'Show Child Nodes'],
        },
        treeCheckable: 'Tree Checkable',
        treeDefaultExpandAll: 'Tree Default Expand All',
        treeDefaultExpandedKeys: {
          title: 'Tree Default Expanded Keys',
          tooltip: 'Format：Array<string | number>',
        },
        treeNodeFilterProp: {
          title: 'Tree Node Filter Properties',
          tooltip:
            'The treeNode attribute corresponding to the input item filter',
        },
        treeDataSimpleMode: {
          title: 'Tree Data Simple Mode',
          tooltip: `Use treeData in a simple format. For specific settings, refer to the settable type (the treeData should be a data structure like this: [{id:1, pId:0, value:'1', title:"test1",...} ,...], pId is the id of the parent node)`,
        },
        treeNodeLabelProp: {
          title: 'Tree Node Label Properties',
          tooltip: 'The default is title',
        },
        filterTreeNode: 'Filter Tree Node',
      },
    },
  },
}
