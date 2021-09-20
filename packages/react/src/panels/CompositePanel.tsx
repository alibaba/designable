import React, { useEffect, useState } from 'react'
import { isValid } from '@designable/shared'
import cls from 'classnames'
import { IconWidget, TextWidget } from '../widgets'
import { usePrefix } from '../hooks'

export interface ICompositePanelProps {
  direction?: 'left' | 'right'
  defaultOpen?: boolean
  defaultPinning?: boolean
  defaultActiveKey?: number
  activeKey?: number
  onChange?: (activeKey: number) => void
}
export interface ICompositePanelItemProps {
  shape?: 'tab' | 'button' | 'link'
  title?: React.ReactNode
  icon?: React.ReactNode
  href?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  extra?: React.ReactNode
}

const parseItems = (
  children: React.ReactNode
): React.PropsWithChildren<ICompositePanelItemProps>[] => {
  const items = []
  React.Children.forEach(children, (child) => {
    if (child['type'] === CompositePanel.Item) {
      items.push(child['props'])
    }
  })
  return items
}

export const CompositePanel: React.FC<ICompositePanelProps> & {
  Item?: React.FC<ICompositePanelItemProps>
} = (props) => {
  const prefix = usePrefix('composite-panel')
  const [activeKey, setActiveKey] = useState(props.defaultActiveKey ?? 0)
  const [pinning, setPinning] = useState(props.defaultPinning ?? false)
  const [visible, setVisible] = useState(props.defaultOpen ?? true)
  const items = parseItems(props.children)
  const currentItem = items?.[activeKey]
  const content = currentItem?.children

  useEffect(() => {
    if (isValid(props.activeKey)) {
      if (props.activeKey !== activeKey) {
        setActiveKey(props.activeKey)
      }
    }
  }, [props.activeKey, activeKey])

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
            return <IconWidget infer={item.icon} />
          }
          const shape = item.shape ?? 'tab'
          const Comp = shape === 'link' ? 'a' : 'div'
          return (
            <Comp
              className={cls(prefix + '-tabs-pane', {
                active: activeKey === index,
              })}
              key={index}
              href={item.href}
              onClick={(e: any) => {
                if (shape === 'tab') {
                  if (index === activeKey) {
                    setVisible(!visible)
                  } else {
                    setVisible(true)
                  }
                  setActiveKey(index)
                }
                item.onClick?.(e)
                props.onChange?.(index)
              }}
            >
              {takeTab()}
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
