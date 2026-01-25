export const Field = {
  
  'en-US': {
    settings: {
      name: 'Name',
      title: 'Title',
      required: 'Required',
      description: 'Description',
      default: 'Default',
      enum: 'Options',
      'x-display': {
        title: 'Display State',
        tooltip:
          'When the display value is "None", the data will be "Hidden" and deleted. When the display value is hidden, only the UI will be hidden',
        dataSource: ['Visible', 'Hidden', 'None', 'Inherit']
},
      'x-pattern': {
        title: 'UI Pattern',
        dataSource: [
          'Editable',
          'Disabled',
          'ReadOnly',
          'ReadPretty',
          'Inherit',
        ]
},
      'x-validator': 'Validator',
      'x-decorator': 'Decorator',
      'x-reactions': 'Reactions',
      'field-group': 'Field Properties',
      'component-group': 'Component Properties',
      'decorator-group': 'Decorator Properties',
      'component-style-group': 'Component Style',
      'decorator-style-group': 'Decorator Style',
      'x-component-props': {
        size: {
          title: 'Size',
          dataSource: ['Large', 'Small', 'Default', 'Inherit']
},
        allowClear: 'Allow Clear',
        autoFocus: 'Auto Focus',
        showSearch: 'Show Search',
        notFoundContent: 'Not Found Content',
        bordered: 'Bordered',
        placeholder: 'Placeholder',
        style: {
          width: 'Width',
          height: 'Height',
          display: 'Display',
          background: 'Background',
          boxShadow: 'Box Shadow',
          font: 'Font',
          margin: 'Margin',
          padding: 'Padding',
          borderRadius: 'Radius',
          border: 'Border',
          opacity: 'Opacity'
}
},
      'x-decorator-props': {
        addonAfter: 'Addon After',
        addonBefore: 'Addon Before',
        tooltip: 'Tooltip',
        asterisk: 'Asterisk',
        gridSpan: 'Grid Span',
        labelCol: 'Label Col',
        wrapperCol: 'Wrapper Col',
        colon: 'Colon',
        labelAlign: {
          title: 'Label Align',
          dataSource: ['Left', 'Right', 'Inherit']
},
        wrapperAlign: {
          title: 'Wrapper Align',
          dataSource: ['Left', 'Right', 'Inherit']
},
        labelWrap: 'Label Wrap',
        wrapperWrap: 'Wrapper Wrap',
        labelWidth: 'Label Width',
        wrapperWidth: 'Wrapper Width',
        fullness: 'Fullness',
        inset: 'Inset',
        shallow: 'Shallow',
        bordered: 'Bordered',
        size: {
          title: 'Size',
          dataSource: ['Large', 'Small', 'Default', 'Inherit']
},
        layout: {
          title: 'Layout',
          dataSource: ['Vertical', 'Horizontal', 'Inline', 'Inherit']
},
        feedbackLayout: {
          title: 'Feedback Layout',
          dataSource: ['Loose', 'Terse', 'Popup', 'None', 'Inherit']
},
        tooltipLayout: {
          title: 'Tooltip Layout',
          dataSource: ['Icon', 'Text', 'Inherit']
},
        style: {
          width: 'Width',
          height: 'Height',
          display: 'Display',
          background: 'Background',
          boxShadow: 'Box Shadow',
          font: 'Font',
          margin: 'Margin',
          padding: 'Padding',
          borderRadius: 'Radius',
          border: 'Border',
          opacity: 'Opacity'
}
}
}
}
}
