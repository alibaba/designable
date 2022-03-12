import React, { useEffect, useRef, useState } from 'react'
import { isValid } from '@designable/shared'
import cls from 'classnames'
import { IconWidget, TextWidget } from '../widgets'
import { usePrefix } from '../hooks'

export interface ICompositePanelProps {
  direction?: 'left' | 'right'
  showNavTitle?: boolean
  defaultOpen?: boolean
  defaultPinning?: boolean
  defaultActiveKey?: number
  activeKey?: number | string
  onChange?: (activeKey: number | string) => void
}
export interface ICompositePanelItemProps {
  shape?: 'tab' | 'button' | 'link'
  title?: React.ReactNode
  icon?: React.ReactNode
  key?: number | string
  href?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  extra?: React.ReactNode
}

const parseItems = (
  children: React.ReactNode
): React.PropsWithChildren<ICompositePanelItemProps>[] => {
  const items = []
  React.Children.forEach(children, (child, index) => {
    if (child?.['type'] === CompositePanel.Item) {
      items.push({ key: child['key'] ?? index, ...child['props'] })
    }
  })
  return items
}

const findItem = (
  items: React.PropsWithChildren<ICompositePanelItemProps>[],
  key: string | number
) => {
  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    if (key === index) return item
    if (key === item.key) return item
  }
}

const getDefaultKey = (children: React.ReactNode) => {
  const items = parseItems(children)
  return items?.[0].key
}

export const CompositePanel: React.FC<ICompositePanelProps> & {
  Item: React.FC<ICompositePanelItemProps>
} = (props) => {
  const prefix = usePrefix('composite-panel')
  const [activeKey, setActiveKey] = useState<string | number>(
    props.defaultActiveKey ?? getDefaultKey(props.children)
  )
  const activeKeyRef = useRef(null)
  const [pinning, setPinning] = useState(props.defaultPinning ?? false)
  const [visible, setVisible] = useState(props.defaultOpen ?? true)
  const items = parseItems(props.children)
  const currentItem = findItem(items, activeKey)
  const content = currentItem?.children

  activeKeyRef.current = activeKey

  useEffect(() => {
    if (isValid(props.activeKey)) {
      if (props.activeKey !== activeKeyRef.current) {
        setActiveKey(props.activeKey)
      }
    }
  }, [props.activeKey])

  const renderContent = () => {
    if (!content || !visible) return
    return (
      <div
        className={cls(prefix + '-tabs-content', {
          pinning,
        })}
      >
        <div className={prefix + '-tabs-header'}>
          <div className={prefix + '-tabs-header-title'}>
            <TextWidget>{currentItem.title}</TextWidget>
          </div>
          <div className={prefix + '-tabs-header-actions'}>
            <div className={prefix + '-tabs-header-extra'}>
              {currentItem.extra}
            </div>
            {!pinning && (
              <IconWidget
                infer="PushPinOutlined"
                className={prefix + '-tabs-header-pin'}
                onClick={() => {
                  setPinning(!pinning)
                }}
              />
            )}
            {pinning && (
              <IconWidget
                infer="PushPinFilled"
                className={prefix + '-tabs-header-pin-filled'}
                onClick={() => {
                  setPinning(!pinning)
                }}
              />
            )}
            <IconWidget
              infer="Close"
              className={prefix + '-tabs-header-close'}
              onClick={() => {
                setVisible(false)
              }}
            />
          </div>
        </div>
        <div className={prefix + '-tabs-body'}>{content}</div>
      </div>
    )
  }

  return (
    <div
      className={cls(prefix, {
        [`direction-${props.direction}`]: !!props.direction,
      })}
    >
      <div className={prefix + '-tabs'}>
        {items.map((item, index) => {
          const takeTab = () => {
            if (item.href) {
              return <a href={item.href}>{item.icon}</a>
            }
            return (
              <IconWidget
                tooltip={
                  props.showNavTitle
                    ? null
                    : {
                        title: <TextWidget>{item.title}</TextWidget>,
                        placement:
                          props.direction === 'right' ? 'left' : 'right',
                      }
                }
                infer={item.icon}
              />
            )
          }
          const shape = item.shape ?? 'tab'
          const Comp = shape === 'link' ? 'a' : 'div'
          return (
            <Comp
              className={cls(prefix + '-tabs-pane', {
                active: activeKey === item.key,
              })}
              key={index}
              href={item.href}
              onClick={(e: any) => {
                if (shape === 'tab') {
                  if (activeKey === item.key) {
                    setVisible(!visible)
                  } else {
                    setVisible(true)
                  }
                  if (!props?.activeKey || !props?.onChange)
                    setActiveKey(item.key)
                }
                item.onClick?.(e)
                props.onChange?.(item.key)
              }}
            >
              {takeTab()}
              {props.showNavTitle && item.title ? (
                <div className={prefix + '-tabs-pane-title'}>
                  <TextWidget>{item.title}</TextWidget>
                </div>
              ) : null}
            </Comp>
          )
        })}
      </div>
      {renderContent()}
    </div>
  )
}

CompositePanel.Item = () => {
  return <React.Fragment />
}
