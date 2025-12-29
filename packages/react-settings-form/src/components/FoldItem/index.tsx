import React, { Fragment, useRef, useMemo } from 'react'
import { FormItem, IFormItemProps } from '@formily/antd-v5'
import { useField, observer } from '@formily/react'
import { observable } from '@formily/reactive'
import { IconWidget, usePrefix } from '@designable/react'
import cls from 'classnames'

const ExpandedMap = new Map<string, boolean>()

interface IFoldItemProps extends IFormItemProps {
  children?: React.ReactNode
}

interface IFoldItemBaseProps {
  children?: React.ReactNode
}

export const FoldItem: React.FC<IFoldItemProps> & {
  Base?: React.FC<IFoldItemBaseProps>
  Extra?: React.FC<IFoldItemBaseProps>
} = observer(({ className, style, children, ...props }) => {
  const prefix = usePrefix('fold-item')
  const field = useField()
  const expand = useMemo(
    () => observable.ref(ExpandedMap.get(field.address.toString())),
    []
  )
  const slots = useRef({ base: null, extra: null })
  React.Children.forEach(children, (node) => {
    if (React.isValidElement(node)) {
      const nodeType = (node as any)?.['type']
      if (nodeType?.['displayName'] === 'FoldItem.Base') {
        slots.current.base = (node as any)['props'].children
      }
      if (nodeType?.['displayName'] === 'FoldItem.Extra') {
        slots.current.extra = (node as any)['props'].children
      }
    }
  })
  return (
    <div className={cls(prefix, className)}>
      <div
        className={prefix + '-base'}
        onClick={() => {
          expand.value = !expand.value
          ExpandedMap.set(field.address.toString(), expand.value)
        }}
      >
        <FormItem.BaseItem
          {...props}
          label={
            <span
              className={cls(prefix + '-title', {
                expand: expand.value,
              })}
            >
              {slots.current.extra && <IconWidget infer="Expand" size={10} />}
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
      {expand.value && slots.current.extra && (
        <div className={prefix + '-extra'}>{slots.current.extra}</div>
      )}
    </div>
  )
})

const Base: React.FC<IFoldItemBaseProps> = () => {
  return <Fragment />
}

Base.displayName = 'FoldItem.Base'

const Extra: React.FC<IFoldItemBaseProps> = () => {
  return <Fragment />
}

Extra.displayName = 'FoldItem.Extra'

FoldItem.Base = Base
FoldItem.Extra = Extra
