import { observer } from '@formily/reactive-react'
import React from 'react'
import { useScreen, usePrefix, useTheme } from '../../hooks'

export interface IMobileBodyProps {
  children?: React.ReactNode
}

// CSS-based phone frame styles instead of external images
const getFrameStyles = (theme: string, flip: boolean): React.CSSProperties => ({
  display: 'block',
  margin: '20px 0',
  width: flip ? 946.667 : 460,
  height: flip ? 460 : 946.667,
  boxShadow: '0 0 20px #0000004d',
  borderRadius: 60,
  backfaceVisibility: 'hidden',
  backgroundColor: theme === 'dark' ? '#1f1f1f' : '#ffffff',
  border: `12px solid ${theme === 'dark' ? '#333' : '#e8e8e8'}`,
  position: 'relative' as const,
})

export const MobileBody: React.FC<IMobileBodyProps> = observer((props) => {
  const screen = useScreen()
  const theme = useTheme()
  const prefix = usePrefix('mobile-simulator-body')
  const getContentStyles = (): React.CSSProperties => {
    if (screen.flip) {
      return {
        position: 'absolute',
        width: 736,
        height: 414,
        top: 43.3333,
        left: 106.667,
        overflow: 'hidden',
      }
    }
    return {
      position: 'absolute',
      width: 414,
      height: 736,
      top: 126.667,
      left: 23.3333,
      overflow: 'hidden',
    }
  }

  return (
    <div
      className={prefix}
      style={{
        alignItems: screen.flip ? 'center' : '',
        minWidth: screen.flip ? 1000 : 0,
      }}
    >
      <div
        className={prefix + '-wrapper'}
        style={{
          position: 'relative',
          minHeight: screen.flip ? 0 : 1000,
        }}
      >
        <div style={getFrameStyles(theme, screen.flip)}>
          <div className={prefix + '-content'} style={getContentStyles()}>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
})
