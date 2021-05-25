import React from 'react'
import { usePrefix } from '../hooks'
export interface ISettingPanelProps {
  title?: React.ReactNode
  extra?: React.ReactNode
}

export const SettingsPanel: React.FC<ISettingPanelProps> = (props) => {
  const prefix = usePrefix('settings-panel')

  return (
    <div className={prefix}>
      <div className={prefix + '-header'}>
        <div className={prefix + '-header-title'}>{props.title}</div>
        <div className={prefix + '-header-actions'}>
          <div className={prefix + '-header-extra'}>{props.extra}</div>
        </div>
      </div>
      <div className={prefix + '-body'}>{props.children}</div>
    </div>
  )
}
