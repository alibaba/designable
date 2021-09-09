import React, { useEffect, useRef } from 'react'
import { CursorStatus, CursorType, ClosestPosition } from '@designable/core'
import {
  useViewport,
  useCursor,
  useDragon,
  useDesigner,
  usePrefix,
  useOperation,
} from '../../hooks'
import { Insertion } from './Insertion'
import { Selection } from './Selection'
import { FreeSelection } from './FreeSelection'
import { Cover } from './Cover'
import { DashedBox } from './DashedBox'
import './styles.less'

const setCursorState = (contentWindow: Window, state: string) => {
  const currentRoot = document?.getElementsByTagName?.('html')?.[0]
  const root = contentWindow?.document?.getElementsByTagName('html')?.[0]
  if (root) {
    root.style.cursor = state
  }
  if (currentRoot) {
    currentRoot.style.cursor = state
  }
}

export const AuxToolWidget = () => {
  const engine = useDesigner()
  const viewport = useViewport()
  const operation = useOperation()
  const cursor = useCursor()
  const prefix = usePrefix('auxtool')
  const viewportDragon = useDragon()
  const ref = useRef<HTMLDivElement>()
  useEffect(() => {
    return engine.subscribeWith('viewport:scroll', () => {
      if (viewport.isIframe && ref.current) {
        ref.current.style.transform = `perspective(1px) translate3d(${-viewport.scrollX}px,${-viewport.scrollY}px,0)`
      }
    })
  }, [engine, viewport])

  useEffect(() => {
    return engine.subscribeWith(['drag:move', 'drag:stop'], () => {
      if (cursor.status !== CursorStatus.Dragging) {
        setCursorState(viewport.contentWindow, 'default')
      } else {
        if (cursor.type === CursorType.Move) {
          if (operation.getDragNodes().length) {
            // todo: update cusor will trigger document layout rerender https://bugs.chromium.org/p/chromium/issues/detail?id=664066
            // if (viewportDragon.closestDirection === ClosestPosition.Inner) {
            //   setCursorState(viewport.contentWindow, 'copy')
            // } else {
            setCursorState(viewport.contentWindow, 'move')
            //}
          }
        } else {
          if (cursor.type === CursorType.ResizeWidth) {
            setCursorState(viewport.contentWindow, 'ew-resize')
          } else if (cursor.type === CursorType.ResizeHeight) {
            setCursorState(viewport.contentWindow, 'ns-resize')
          } else if (cursor.type === CursorType.Resize) {
            setCursorState(viewport.contentWindow, 'nwse-resize')
          } else {
            setCursorState(viewport.contentWindow, 'default')
          }
        }
      }
    })
  }, [engine, cursor, viewportDragon, viewport, operation])

  if (!viewport) return null

  return (
    <div ref={ref} className={prefix}>
      <Insertion />
      <DashedBox />
      <Selection />
      <Cover />
      <FreeSelection />
    </div>
  )
}

AuxToolWidget.displayName = 'AuxToolWidget'
