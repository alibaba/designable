import React from 'react'
import { useTheme } from '@inbiz/react'

const logo = {
  dark: 'http://www.inbiz.top/templets/default/image/logo-inbiz.svg',
  light:
    'http://www.inbiz.top/templets/default/image/logo-inbiz.svg',
}

export const LogoWidget: React.FC = () => {
  const url = logo[useTheme()]
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
      <img
        src={url}
        style={{ margin: '12px 20px', height: 18, width: 'auto' }}
      />
    </div>
  )
}
