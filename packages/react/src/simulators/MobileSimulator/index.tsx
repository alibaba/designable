import React from 'react'
import { MobileBody } from './body'
import { usePrefix } from '../../hooks'
import cls from 'classnames'
import './styles.less'
export interface IMobileSimulatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  style?: React.CSSProperties
}

export const MobileSimulator: React.FC<IMobileSimulatorProps> = (props) => {
  const prefix = usePrefix('mobile-simulator')
  return (
    <div {...props} className={cls(prefix, props.className)}>
      <div className={prefix + '-content'}>
        <MobileBody>{props.children}</MobileBody>
      </div>
    </div>
  )
}
