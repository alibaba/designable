import React from 'react'
import { useOutlineDragon, usePrefix } from '../../hooks'
import { ClosestDirection } from '@designable/core'
import { observer } from '@formily/reactive-react'

export interface IInsertionProps {
  workspaceId?: string
}

export const Insertion: React.FC<IInsertionProps> = observer(
  ({ workspaceId }) => {
    const outlineDragon = useOutlineDragon(workspaceId)
    const prefix = usePrefix('outline-tree-insertion')
    const createInsertionStyle = (): React.CSSProperties => {
      const closestDirection = outlineDragon.closestDirection
      const closestRect = outlineDragon.closestOffsetRect
      const baseStyle: React.CSSProperties = {
        position: 'absolute',
        transform: 'perspective(1px) translate3d(0,0,0)',
        top: 0,
        left: 0,
      }
      if (!closestRect) return baseStyle
      if (
        closestDirection === ClosestDirection.After ||
        closestDirection === ClosestDirection.InnerAfter ||
        closestDirection === ClosestDirection.Under ||
        closestDirection === ClosestDirection.ForbidAfter ||
        closestDirection === ClosestDirection.ForbidInnerAfter ||
        closestDirection === ClosestDirection.ForbidUnder
      ) {
        baseStyle.width = closestRect.width
        baseStyle.height = 2
        baseStyle.transform = `perspective(1px) translate3d(${
          closestRect.x
        }px,${closestRect.y + closestRect.height - 2}px,0)`
      } else if (
        closestDirection === ClosestDirection.Before ||
        closestDirection === ClosestDirection.InnerBefore ||
        closestDirection === ClosestDirection.Upper ||
        closestDirection === ClosestDirection.ForbidBefore ||
        closestDirection === ClosestDirection.ForbidInnerBefore ||
        closestDirection === ClosestDirection.ForbidUpper
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

    if (!outlineDragon?.closestNode) return null

    return <div className={prefix} style={createInsertionStyle()}></div>
  }
)

Insertion.displayName = 'Insertion'
