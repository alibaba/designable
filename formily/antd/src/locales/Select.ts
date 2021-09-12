export const Select = {
  'zh-CN': {
    title: '选择框',
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
        dropdownMatchSelectWidth: {
          title: '下拉菜单和选择器同宽',
          tooltip:
            '默认将设置 min-width，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动',
        },
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
      },
    },
  },
  'en-US': {
    title: 'Select',
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
        dropdownMatchSelectWidth: 'Dropdown Match Select Width',
        defaultOpen: 'Default Open',
        filterOption: 'Filter Option',
        filterSort: 'Filter Sort',
        labelInValue: 'label InValue',
        listHeight: 'List Height',
        maxTagCount: 'Max Tag Count',
        maxTagPlaceholder: {
          title: 'Max Tag Placeholder',
          tooltip: 'Content displayed when tag is hidden',
        },
        maxTagTextLength: 'Max Tag Text Length',
        showArrow: 'Show Arrow',
        virtual: 'Use Virtual Scroll',
      },
    },
  },
}
