export const TreeSelect = {
  
  'en-US': {
    title: 'TreeSelect',
    settings: {
      'x-component-props': {
        mode: {
          title: 'Mode',
          dataSource: ['Multiple', 'Tags', 'Single']
},
        autoClearSearchValue: {
          title: 'Auto Clear Search Value',
          tooltip: 'Only used to multiple and tags mode'
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
          tooltip: 'Content displayed when tag is hidden'
},
        maxTagTextLength: 'Max Tag Text Length',
        notFoundContent: 'Not Found Content',
        showArrow: 'Show Arrow',
        virtual: 'Use Virtual Scroll',
        dropdownMatchSelectWidth: {
          title: 'Dropdown Match Select Width',
          tooltip:
            'By default, min-width will be set, and it will be ignored when the value is less than the width of the selection box. false will turn off virtual scrolling'
},
        showCheckedStrategy: {
          title: 'Show Checked Strategy',
          tooltip:
            'When configuring treeCheckable, define how to backfill the selected item. TreeSelect.SHOW_ALL: Show all selected nodes (including parent nodes). TreeSelect.SHOW_PARENT: Only display the parent node (when all child nodes under the parent node are selected). Only show child nodes by default',
          dataSource: ['Show All', 'Show Parent Node', 'Show Child Nodes']
},
        treeCheckable: 'Tree Checkable',
        treeDefaultExpandAll: 'Tree Default Expand All',
        treeDefaultExpandedKeys: {
          title: 'Tree Default Expanded Keys',
          tooltip: 'Format：Array<string | number>'
},
        treeNodeFilterProp: {
          title: 'Tree Node Filter Properties',
          tooltip:
            'The treeNode attribute corresponding to the input item filter'
},
        treeDataSimpleMode: {
          title: 'Tree Data Simple Mode',
          tooltip: `Use treeData in a simple format. For specific settings, refer to the settable type (the treeData should be a data structure like this: [{id:1, pId:0, value:'1', title:"test1",...} ,...], pId is the id of the parent node)`
},
        treeNodeLabelProp: {
          title: 'Tree Node Label Properties',
          tooltip: 'The default is title'
},
        filterTreeNode: 'Filter Tree Node'
}
}
}
}
