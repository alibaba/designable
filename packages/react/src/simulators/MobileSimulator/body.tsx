import { observer } from '@formily/reactive-react'
import React from 'react'
import { useScreen, usePrefix } from '../../hooks'

export interface IMobileBodyProps {}

export const MobileBody: React.FC<IMobileBodyProps> = observer((props) => {
  const screen = useScreen()
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
        <img
          src={
            screen.flip
              ? '//img.alicdn.com/tfs/TB1gj1O1eL2gK0jSZPhXXahvXXa-1420-690.png'
              : '//img.alicdn.com/tfs/TB1zlYLpRBh1e4jSZFhXXcC9VXa-690-1420.png'
          }
          style={{
            display: 'block',
            margin: '20px 0',
            width: screen.flip ? 946.667 : 460,
            height: screen.flip ? 460 : 946.667,
            boxShadow: '0 0 20px #0000004d',
            borderRadius: 60,
            backfaceVisibility: 'hidden',
          }}
        ></img>
        <div className={prefix + '-content'} style={getContentStyles()}>
          {props.children}
        </div>
      </div>
    </div>
  )
})

MobileBody.defaultProps = {}
