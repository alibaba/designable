import React from 'react'
import { connect } from '@formily/react'
import { usePrefixCls } from '../../common/__builtins__'
import cls from 'classnames'
const Test1 = (props) => {
  const prefixCls = usePrefixCls('Test')
  console.log(props)
  return (
    <div
      {...props}
      className={cls(prefixCls)}
      style={{
        ...props.style,
        background: '#eee',
        border: '1px solid #ddd',
        display: 'flex',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <span> 我是帅哥</span>
    </div>
  )
}
// 根据默认值类型， 格式化默认值
Test1.defaultValueFormate = (defaultValue: string, _defaultType: string) => {
  return defaultValue
}

export const Test = connect(Test1)
