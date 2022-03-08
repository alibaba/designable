import React from 'react';
import { observer } from '@formily/reactive-react';
import { usePrefixCls } from '../../common/__builtins__';
import { usePrefix } from '@inbiz/react';
import cls from 'classnames';
export const Test = observer((props) => {
  const prefixCls = usePrefixCls('Test');
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
  );
});
