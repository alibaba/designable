import React from 'react'
import { usePrefix } from '../hooks'
import { Layout } from '../containers'
import cls from 'classnames'
export interface IStudioPanelProps {
  style?: React.CSSProperties
  className?: string
  logo?: React.ReactNode
  actions?: React.ReactNode
  prefixCls?: string
  theme?: string
}

const StudioPanelInternal: React.FC<IStudioPanelProps> = ({
  logo,
  actions,
  ...props
}) => {
  const prefix = usePrefix('main-panel')
  if (logo || actions) {
    return (
      <div
        {...props}
        className={cls(prefix + '-container', 'root', props.className)}
      >
        <div className={prefix + '-header'}>
          <div className={prefix + '-header-logo'}>{logo}</div>
          <div className={prefix + '-header-actions'}>{actions}</div>
        </div>
        <div className={prefix}>{props.children}</div>
      </div>
    )
  }
  return (
    <div {...props} className={cls(prefix, 'root')}>
      {props.children}
    </div>
  )
}

export const StudioPanel: React.FC<IStudioPanelProps> = (props) => {
  return (
    <Layout theme={props.theme} prefixCls={props.prefixCls}>
      <StudioPanelInternal {...props} />
    </Layout>
  )
}
