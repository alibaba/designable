import React, { useState } from 'react'
import { TreeNode } from '@designable/core'
import { isFn } from '@designable/shared'
import { observer } from '@formily/reactive-react'
import cls from 'classnames'
import { useDesigner, usePrefix, useWorkspace } from '../../hooks'
import { IconWidget } from '../IconWidget'
import { TextWidget } from '../TextWidget'
import './styles.less'

export type SourceMapper = (node: TreeNode) => React.ReactChild

export interface IDragSourceWidgetProps {
  name: string
  title: React.ReactNode
  className?: string
  defaultExpand?: boolean
  children?: SourceMapper | React.ReactElement
}

export const DragSourceWidget: React.FC<IDragSourceWidgetProps> = observer(
  (props) => {
    const prefix = usePrefix('drag-source')
    const designer = useDesigner()
    const workspace = useWorkspace()
    const [expand, setExpand] = useState(props.defaultExpand)
    const renderNode = (node: TreeNode) => {
      return (
        <div
          className={prefix + '-item'}
          key={node.id}
          data-designer-source-id={node.id}
        >
          {node?.designerProps?.sourceIcon && (
            <IconWidget
              infer={node.designerProps.sourceIcon}
              style={{ margin: '10px 0', width: 150, height: 40 }}
            />
          )}
          <span className={prefix + '-item-text'}>
            <TextWidget>{node?.designerProps?.title}</TextWidget>
          </span>
        </div>
      )
    }

    const source =
      workspace?.source?.size > 0 ? workspace.source : designer.source
    const sources = source.getSourcesByGroup(props.name)
    const remainItems = sources.length % 3
    return (
      <div
        className={cls(prefix, props.className, {
          expand,
        })}
      >
        <div
          className={prefix + '-header'}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setExpand(!expand)
          }}
        >
          <div className={prefix + '-header-expand'}>
            <IconWidget infer="Expand" />
          </div>
          <div className={prefix + '-header-content'}>
            <TextWidget>{props.title || `sources.${props.name}`}</TextWidget>
          </div>
        </div>
        <div className={prefix + '-content-wrapper'}>
          <div className={prefix + '-content'}>
            {sources.map(isFn(props.children) ? props.children : renderNode)}
            {remainItems ? (
              <div
                className={prefix + '-item-remain'}
                style={{ gridColumnStart: `span ${3 - remainItems}` }}
              ></div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
)

DragSourceWidget.defaultProps = {
  defaultExpand: true,
}
