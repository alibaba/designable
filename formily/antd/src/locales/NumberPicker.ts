export const NumberPicker = {
  'zh-CN': {
    title: '数字输入',
    settings: {
      'x-component-props': {
        formatter: {
          title: '格式转换器',
          tooltip: '格式：function(value: number | string): string',
        },
        keyboard: '启用快捷键',
        parser: {
          title: '格式解析器',
          tooltip:
            '指定从 格式转换器 里转换回数字的方式，和 格式转换器 搭配使用,格式：function(string): number',
        },
        decimalSeparator: '小数点',
        precision: '数字精度',
        max: '最大值',
        min: '最小值',
        step: '步长',
        stringMode: {
          title: '字符串格式',
          tooltip: '开启后支持高精度小数。同时 onChange 将返回 string 类型',
        },
      },
    },
  },
  'en-US': {
    title: 'NumberInput',
    settings: {
      'x-component-props': {
        formatter: {
          title: 'Format Converter',
          tooltip: 'Format：function(value: number | string): string',
        },
        keyboard: 'Enable Shortcut Keys',
        parser: {
          title: 'Format Parser',
          tooltip:
            'Specify the method of converting back to numbers from the format converter, and use it with the format converter, the format:function(string): number',
        },
        decimalSeparator: 'Decimal Separator',
        precision: 'Precision',
        max: 'Max',
        min: 'Min',
        step: 'Step',
        stringMode: {
          title: 'String Format',
          tooltip:
            'Support high-precision decimals after opening. At the same time onChange will return string type',
        },
      },
    },
  },
  'ko-KR': {
    title: '숫자 입력',
    settings: {
      'x-component-props': {
        formatter: {
          title: '포맷 컨버터',
          tooltip: '형식: function(value: number | string): string',
        },
        keyboard: '숏컷 키 활성화',
        parser: {
          title: '포멧 파서',
          tooltip:
            '문자열을 숫자로 변환하는 포맷 컨버터를 만들고 사용하세요, 형식 :function(string): number',
        },
        decimalSeparator: '소수 구분 기호',
        precision: '정밀도',
        max: '최대값',
        min: '최소값',
        step: '스탭',
        stringMode: {
          title: '문자열 형식',
          tooltip:
            '높은 정밀도 소수를 지원합니다. onChange에서 문자열 타입으로 반환됩니다.',
        },
      },
    },
  },
}
