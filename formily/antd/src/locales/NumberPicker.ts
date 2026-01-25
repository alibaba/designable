export const NumberPicker = {
  
  'en-US': {
    title: 'NumberInput',
    settings: {
      'x-component-props': {
        formatter: {
          title: 'Format Converter',
          tooltip: 'Format：function(value: number | string): string'
},
        keyboard: 'Enable Shortcut Keys',
        parser: {
          title: 'Format Parser',
          tooltip:
            'Specify the method of converting back to numbers from the format converter, and use it with the format converter, the format:function(string): number'
},
        decimalSeparator: 'Decimal Separator',
        precision: 'Precision',
        max: 'Max',
        min: 'Min',
        step: 'Step',
        stringMode: {
          title: 'String Format',
          tooltip:
            'Support high-precision decimals after opening. At the same time onChange will return string type'
}
}
}
}
}
