import React from 'react'
import cls from 'classnames'
import { useDesigner, usePrefix, useSelection } from '../../hooks'
import { observer } from '@formily/reactive-react'

export const ResizeHandler: React.FC = observer(() => {
  const designer = useDesigner()
  const selection = useSelection()
  const prefix = usePrefix('aux-node-resize-handler')
  const createHandler = (value: string) => {
    return {
      [designer.props.nodeResizeHandlerAttrName]: value,
      className: cls(prefix, value),
    }
  }
  const allowResize = selection.selectedNodes.every((node) =>
    node.allowResize()
  )
  if (!allowResize) return null
  return (
    <>
      <div {...createHandler('left-center')}></div>
      <div {...createHandler('right-center')}></div>
      <div {...createHandler('center-top')}></div>
      <div {...createHandler('center-bottom')}></div>
      <div {...createHandler('left-top')}></div>
      <div {...createHandler('right-top')}></div>
      <div {...createHandler('left-bottom')}></div>
      <div {...createHandler('right-bottom')}></div>
    </>
  )
})
