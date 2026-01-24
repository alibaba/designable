import React, { useState } from 'react'
import {
  isResourceHost,
  isResourceList,
  IResourceLike,
  IResource,
} from '@sulesky/core'
import { isFn } from '@sulesky/shared'
import { observer } from '@formily/reactive-react'
import { usePrefix } from '../../hooks'
import { IconWidget } from '../IconWidget'
import { TextWidget } from '../TextWidget'
import cls from 'classnames'
import './styles.less'

export type SourceMapper = (resource: IResource) => React.ReactNode

export interface IResourceWidgetProps {
  title: React.ReactNode
  sources?: IResourceLike[]
  className?: string
  defaultExpand?: boolean
  children?: SourceMapper | React.ReactElement
}

export const ResourceWidget: React.FC<IResourceWidgetProps> = observer(
  ({
    defaultExpand = true,
    title,
    sources: sourcesProp = [],
    className,
    children,
  }) => {
    const prefix = usePrefix('resource')
    const [expand, setExpand] = useState(defaultExpand)
    const renderNode = (source: IResource) => {
      const { node, icon, title: sourceTitle, thumb, span } = source
      return (
        <div
          className={prefix + '-item'}
          style={{ gridColumnStart: `span ${span || 1}` }}
          key={node.id}
          data-designer-source-id={node.id}
        >
          {thumb && <img className={prefix + '-item-thumb'} src={thumb} />}
          {icon && React.isValidElement(icon) ? (
            <>{icon}</>
          ) : (
            <IconWidget
              className={prefix + '-item-icon'}
              infer={icon}
              style={{ width: 150, height: 40 }}
            />
          )}
          <span className={prefix + '-item-text'}>
            {
              <TextWidget>
                {sourceTitle || node.children[0]?.getMessage('title')}
              </TextWidget>
            }
          </span>
        </div>
      )
    }
    const sources = sourcesProp.reduce<IResource[]>((buf, source) => {
      if (isResourceList(source)) {
        return buf.concat(source)
      } else if (isResourceHost(source)) {
        return buf.concat(source.Resource)
      }
      return buf
    }, [])
    const remainItems =
      sources.reduce((length, source) => {
        return length + (source.span ?? 1)
      }, 0) % 3
    return (
      <div
        className={cls(prefix, className, {
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
            <TextWidget>{title}</TextWidget>
          </div>
        </div>
        <div className={prefix + '-content-wrapper'}>
          <div className={prefix + '-content'}>
            {sources.map(isFn(children) ? children : renderNode)}
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
  },
)
