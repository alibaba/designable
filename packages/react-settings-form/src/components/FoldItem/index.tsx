import React, { Fragment, useState, useRef } from 'react'
import { FormItem, IFormItemProps } from '@formily/antd'
import { useField } from '@formily/react'
import { IconWidget, usePrefix } from '@designable/react'
import cls from 'classnames'
import './styles.less'

const ExpandedMap = new Map<string, boolean>()

export const FoldItem = ({
  className,
  style,
  children,
  ...props
}: React.PropsWithChildren<IFormItemProps>) => {
  const prefix = usePrefix('fold-item')
  const field = useField()
  const [expand, setExpand] = useState(
    ExpandedMap.get(field.address.toString())
  )
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
      <div
        className={prefix + '-base'}
        onClick={() => {
          const newExpaned = !expand
          setExpand(newExpaned)
          ExpandedMap.set(field.address.toString(), newExpaned)
        }}
      >
        <FormItem.BaseItem
          {...props}
          label={
            <span
              className={cls(prefix + '-title', {
                expand,
              })}
            >
              <IconWidget infer="Expand" size={10} />
              {props.label}
            </span>
          }
        >
          <div
            style={{ width: '100%' }}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            {slots.current.base}
          </div>
        </FormItem.BaseItem>
      </div>
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
