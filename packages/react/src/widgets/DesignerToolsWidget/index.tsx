import React, { Fragment, useRef } from 'react'
import { Button, InputNumber } from 'antd'
import { observer } from '@formily/reactive-react'
import { CursorType, ScreenType } from '@designable/core'
import {
  useCursor,
  useHistory,
  useScreen,
  usePrefix,
  useWorkbench,
} from '../../hooks'
import { IconWidget } from '../IconWidget'
import cls from 'classnames'
import './styles.less'

type DesignerToolsType = 'HISTORY' | 'CURSOR' | 'SCREEN_TYPE'

export type IDesignerToolsWidgetProps = {
  className?: string
  style?: React.CSSProperties
  use?: DesignerToolsType[]
}

export const DesignerToolsWidget: React.FC<IDesignerToolsWidgetProps> =
  observer((props) => {
    const screen = useScreen()
    const cursor = useCursor()
    const workbench = useWorkbench()
    const history = useHistory()
    const sizeRef = useRef<{ width?: any; height?: any }>({})
    const prefix = usePrefix('designer-tools')
    const renderHistoryController = () => {
      if (!props.use.includes('HISTORY')) return null
      return (
        <Button.Group size="small" style={{ marginRight: 20 }}>
          <Button
            size="small"
            disabled={!history?.allowUndo}
            onClick={() => {
              history.undo()
            }}
          >
            <IconWidget infer="Undo" />
          </Button>
          <Button
            size="small"
            disabled={!history?.allowRedo}
            onClick={() => {
              history.redo()
            }}
          >
            <IconWidget infer="Redo" />
          </Button>
        </Button.Group>
      )
    }

    const renderCursorController = () => {
      if (workbench.type !== 'DESIGNABLE') return null
      if (!props.use.includes('CURSOR')) return null
      return (
        <Button.Group size="small" style={{ marginRight: 20 }}>
          <Button
            size="small"
            disabled={cursor.type === CursorType.Normal}
            onClick={() => {
              cursor.setType(CursorType.Normal)
            }}
          >
            <IconWidget infer="Move" />
          </Button>
          <Button
            size="small"
            disabled={cursor.type === CursorType.Selection}
            onClick={() => {
              cursor.setType(CursorType.Selection)
            }}
          >
            <IconWidget infer="Selection" />
          </Button>
        </Button.Group>
      )
    }

    const renderResponsiveController = () => {
      if (!props.use.includes('SCREEN_TYPE')) return null
      if (screen.type !== ScreenType.Responsive) return null
      return (
        <Fragment>
          <InputNumber
            size="small"
            value={screen.width}
            style={{ width: 70, textAlign: 'center' }}
            onChange={(value) => {
              sizeRef.current.width = value
            }}
            onPressEnter={() => {
              screen.setSize(sizeRef.current.width, screen.height)
            }}
          />
          <IconWidget
            size={10}
            infer="Close"
            style={{ padding: '0 3px', color: '#999' }}
          />
          <InputNumber
            value={screen.height}
            size="small"
            style={{
              width: 70,
              textAlign: 'center',
              marginRight: 10,
            }}
            onChange={(value) => {
              sizeRef.current.height = value
            }}
            onPressEnter={() => {
              screen.setSize(screen.width, sizeRef.current.height)
            }}
          />
          {(screen.width !== '100%' || screen.height !== '100%') && (
            <Button
              size="small"
              style={{ marginRight: 20 }}
              onClick={() => {
                screen.resetSize()
              }}
            >
              <IconWidget infer="Recover" />
            </Button>
          )}
        </Fragment>
      )
    }

    const renderScreenTypeController = () => {
      if (!props.use.includes('SCREEN_TYPE')) return null
      return (
        <Button.Group size="small" style={{ marginRight: 20 }}>
          <Button
            size="small"
            disabled={screen.type === ScreenType.PC}
            onClick={() => {
              screen.setType(ScreenType.PC)
            }}
          >
            <IconWidget infer="PC" />
          </Button>
          <Button
            size="small"
            disabled={screen.type === ScreenType.Mobile}
            onClick={() => {
              screen.setType(ScreenType.Mobile)
            }}
          >
            <IconWidget infer="Mobile" />
          </Button>
          <Button
            size="small"
            disabled={screen.type === ScreenType.Responsive}
            onClick={() => {
              screen.setType(ScreenType.Responsive)
            }}
          >
            <IconWidget infer="Responsive" />
          </Button>
        </Button.Group>
      )
    }

    const renderMobileController = () => {
      if (!props.use.includes('SCREEN_TYPE')) return null
      if (screen.type !== ScreenType.Mobile) return
      return (
        <Button
          size="small"
          style={{ marginRight: 20 }}
          onClick={() => {
            screen.setFlip(!screen.flip)
          }}
        >
          <IconWidget
            infer="Flip"
            style={{
              transition: 'all .15s ease-in',
              transform: screen.flip ? 'rotate(-90deg)' : '',
            }}
          />
        </Button>
      )
    }

    return (
      <div style={props.style} className={cls(prefix, props.className)}>
        {renderHistoryController()}
        {renderCursorController()}
        {renderScreenTypeController()}
        {renderMobileController()}
        {renderResponsiveController()}
      </div>
    )
  })

DesignerToolsWidget.defaultProps = {
  use: ['HISTORY', 'CURSOR', 'SCREEN_TYPE'],
}
