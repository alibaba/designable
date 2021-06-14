import React, { useState } from 'react'
import { TextWidget, IconWidget } from '../widgets'
import { usePrefix } from '../hooks'
import cls from 'classnames'
export interface ISettingPanelProps {
  title?: React.ReactNode
  extra?: React.ReactNode
}

export const SettingsPanel: React.FC<ISettingPanelProps> = (props) => {
  const prefix = usePrefix('settings-panel')
  const [pinning, setPinning] = useState(false)
  const [visible, setVisible] = useState(true)

  if (!visible)
    return (
      <div
        className={prefix + '-opener'}
        onClick={() => {
          setVisible(true)
        }}
      >
        <IconWidget infer="Setting" size={20} />
      </div>
    )
  return (
    <div className={cls(prefix, { pinning })}>
      <div className={prefix + '-header'}>
        <div className={prefix + '-header-title'}>
          <TextWidget>{props.title}</TextWidget>
        </div>
        <div className={prefix + '-header-actions'}>
          <div className={prefix + '-header-extra'}>{props.extra}</div>
          {!pinning && (
            <IconWidget
              infer="PushPinOutlined"
              className={prefix + '-header-pin'}
              onClick={() => {
                setPinning(!pinning)
              }}
            />
          )}
          {pinning && (
            <IconWidget
              infer="PushPinFilled"
              className={prefix + '-pin-filled'}
              onClick={() => {
                setPinning(!pinning)
              }}
            />
          )}
          <IconWidget
            infer="Close"
            className={prefix + '-header-close'}
            onClick={() => {
              setVisible(false)
            }}
          />
        </div>
      </div>
      <div className={prefix + '-body'}>{props.children}</div>
    </div>
  )
}
