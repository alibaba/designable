import React, { useState } from 'react'
import { isResource, isResourceHost, IResourceLike } from '@designable/core'
import { isFn, flat } from '@designable/shared'
import { observer } from '@formily/reactive-react'
import { usePrefix } from '../../hooks'
import { IconWidget } from '../IconWidget'
import { TextWidget } from '../TextWidget'
import cls from 'classnames'
import './styles.less'

export type SourceMapper = (resource: IResourceLike) => React.ReactChild

export interface IResourceWidgetProps {
  title: React.ReactNode
  sources?: Array<IResourceLike | IResourceLike[]>
  className?: string
  defaultExpand?: boolean
  children?: SourceMapper | React.ReactElement
}

export const ResourceWidget: React.FC<IResourceWidgetProps> = observer(
  (props) => {
    const prefix = usePrefix('resource')
    const [expand, setExpand] = useState(props.defaultExpand)
    const renderNode = (source: IResourceLike) => {
      const { node, icon, title, thumb, span } = isResourceHost(source)
        ? source.Resource
        : source
      return (
        <div
          className={prefix + '-item'}
          style={{ gridColumnStart: `span ${span || 1}` }}
          key={node.id}
          data-designer-source-id={node.id}
        >
          {thumb && <img className={prefix + '-item-thumb'} src={thumb} />}
          {icon && (
            <IconWidget
              className={prefix + '-item-icon'}
              infer={icon}
              style={{ width: 150, height: 40 }}
            />
          )}
          <span className={prefix + '-item-text'}>
            {
              <TextWidget sourceName={node.sourceName} token="title">
                {title}
              </TextWidget>
            }
          </span>
        </div>
      )
    }

    const sources = flat(props.sources)
    const remainItems =
      sources.reduce((length, source) => {
        if (isResourceHost(source)) return length + (source.Resource.span ?? 1)
        if (isResource(source)) return length + (source.span ?? 1)
        return length
      }, 0) % 3
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
            <IconWidget infer="Expand" size={10} />
          </div>
          <div className={prefix + '-header-content'}>
            <TextWidget>{props.title}</TextWidget>
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

ResourceWidget.defaultProps = {
  defaultExpand: true,
}
