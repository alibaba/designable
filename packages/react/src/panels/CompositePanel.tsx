import React, { useState } from 'react'
import cls from 'classnames'
import { IconWidget, TextWidget } from '../widgets'
import { usePrefix } from '../hooks'

export interface ICompositePanelItemProps {
  title?: React.ReactNode
  icon?: React.ReactNode
  href?: string
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

export const CompositePanel: React.FC & {
  Item?: React.FC<ICompositePanelItemProps>
} = (props) => {
  const prefix = usePrefix('composite-panel')
  const [activeKey, setActiveKey] = useState(0)
  const [pinning, setPinning] = useState(false)
  const [visible, setVisible] = useState(true)
  const items = parseItems(props.children)
  const currentItem = items?.[activeKey]
  const content = currentItem?.children

  const renderContent = () => {
    if (!content || !visible) return
    return (
      <div className={cls(prefix + '-tabs-content', { pinning })}>
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
    <div className={prefix}>
      <div className={prefix + '-tabs'}>
        {items.map((item, index) => {
          const takeTab = () => {
            if (item.href) {
              return <a href={item.href}>{item.icon}</a>
            }
            return <IconWidget infer={item.icon} />
          }
          return (
            <div
              className={cls(prefix + '-tabs-pane', {
                active: activeKey === index,
              })}
              key={index}
              onClick={() => {
                if (index === activeKey) {
                  setVisible(!visible)
                } else {
                  setVisible(true)
                }
                setActiveKey(index)
              }}
            >
              {takeTab()}
            </div>
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
