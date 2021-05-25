import React, { Fragment, useState, useRef } from 'react'
import { FormItem, IFormItemProps } from '@formily/antd'
import { IconWidget, usePrefix } from '@designable/react'
import cls from 'classnames'
import './styles.less'

export const FoldItem = ({
  className,
  style,
  children,
  ...props
}: React.PropsWithChildren<IFormItemProps>) => {
  const prefix = usePrefix('fold-item')
  const [expand, setExpand] = useState(false)
  const slots = useRef({ base: null, extra: null })
  React.Children.forEach(children, (node) => {
    if (React.isValidElement(node)) {
      if (node?.['type']?.['displayName'] === 'FoldItem.Base') {
        slots.current.base = node['props'].children
      }
      if (node?.['type']?.['displayName'] === 'FoldItem.Extra') {
        slots.current.extra = node['props'].children
      }
    }
  })
  return (
    <div className={cls(prefix, className)}>
      <FormItem.BaseItem
        {...props}
        label={
          <span
            className={cls(prefix + '-title', {
              expand,
            })}
            onClick={() => {
              setExpand(!expand)
            }}
          >
            <IconWidget infer="Expand" size={10} />
            {props.label}
          </span>
        }
      >
        {slots.current.base}
      </FormItem.BaseItem>
      {expand && <div className={prefix + '-extra'}>{slots.current.extra}</div>}
    </div>
  )
}

const Base: React.FC = () => {
  return <Fragment />
}

Base.displayName = 'FoldItem.Base'

const Extra: React.FC = () => {
  return <Fragment />
}

Extra.displayName = 'FoldItem.Extra'

FoldItem.Base = Base
FoldItem.Extra = Extra
