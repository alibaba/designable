import React from 'react';
import { observer } from '@formily/reactive-react';
import { usePrefixCls } from '../../common/__builtins__';
import cls from 'classnames';
export const FreeCard = observer((props) => {
  const prefixCls = usePrefixCls('FreeCard', props);
  return (
    <div
      {...props}
      className={cls(prefixCls, props.className)}
      style={{
        width: 400,
        height: 400,
        ...props.style,
        background: '#eee',
        border: '1px solid #ddd',
        display: 'flex',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {props.children ? props.children : <span>拖拽字段进入该区域</span>}
    </div>
  );
});
