import React from 'react'
import { useMoveHelper, usePrefix } from '../../hooks'
import { ClosestPosition } from '@designable/core'
import { observer } from '@formily/reactive-react'

export interface IInsertionProps {
  workspaceId?: string
}

export const Insertion: React.FC<IInsertionProps> = observer(
  ({ workspaceId }) => {
    const moveHelper = useMoveHelper(workspaceId)
    const prefix = usePrefix('outline-tree-insertion')
    const createInsertionStyle = (): React.CSSProperties => {
      const closestDirection = moveHelper.outlineClosestDirection
      const closestRect = moveHelper.outlineClosestOffsetRect
      const baseStyle: React.CSSProperties = {
        position: 'absolute',
        transform: 'perspective(1px) translate3d(0,0,0)',
        top: 0,
        left: 0,
      }
      if (!closestRect) return baseStyle
      if (
        closestDirection === ClosestPosition.After ||
        closestDirection === ClosestPosition.InnerAfter ||
        closestDirection === ClosestPosition.Under ||
        closestDirection === ClosestPosition.ForbidAfter ||
        closestDirection === ClosestPosition.ForbidInnerAfter ||
        closestDirection === ClosestPosition.ForbidUnder
      ) {
        baseStyle.width = closestRect.width
        baseStyle.height = 2
        baseStyle.transform = `perspective(1px) translate3d(${
          closestRect.x
        }px,${closestRect.y + closestRect.height - 2}px,0)`
      } else if (
        closestDirection === ClosestPosition.Before ||
        closestDirection === ClosestPosition.InnerBefore ||
        closestDirection === ClosestPosition.Upper ||
        closestDirection === ClosestPosition.ForbidBefore ||
        closestDirection === ClosestPosition.ForbidInnerBefore ||
        closestDirection === ClosestPosition.ForbidUpper
      ) {
        baseStyle.width = closestRect.width
        baseStyle.height = 2
        baseStyle.transform = `perspective(1px) translate3d(${closestRect.x}px,${closestRect.y}px,0)`
      }
      if (closestDirection.includes('FORBID')) {
        baseStyle.backgroundColor = 'red'
      } else {
        baseStyle.backgroundColor = ''
      }
      return baseStyle
    }

    if (!moveHelper?.closestNode) return null

    return <div className={prefix} style={createInsertionStyle()}></div>
  }
)

Insertion.displayName = 'Insertion'
