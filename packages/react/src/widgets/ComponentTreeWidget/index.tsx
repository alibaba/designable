import React, { Fragment, useEffect } from 'react'
import { useTree, usePrefix, useDesigner, useComponents } from '../../hooks'
import { TreeNodeContext, DesignerComponentsContext } from '../../context'
import { IDesignerComponents } from '../../types'
import { TreeNode, GlobalRegistry } from '@designable/core'
import { observer } from '@formily/reactive-react'
import cls from 'classnames'
import './styles.less'

export interface IComponentTreeWidgetProps {
  style?: React.CSSProperties
  className?: string
  components: IDesignerComponents
}

export interface ITreeNodeWidgetProps {
  node: TreeNode
  children?: React.ReactNode
}

export const TreeNodeWidget: React.FC<ITreeNodeWidgetProps> = observer(
  (props: ITreeNodeWidgetProps) => {
    const designer = useDesigner(props.node?.designerProps?.effects)
    const components = useComponents()
    const node = props.node

    const renderChildren = () => {
      console.log('TreeNodeWidget.renderChildren', node?.id, node?.children?.length)
      if (node?.designerProps?.selfRenderChildren) return []
      return node?.children?.map((child) => {
        return <TreeNodeWidget key={child.id} node={child} />
      })
    }
    const renderProps = (extendsProps: any = {}) => {
      console.log('TreeNodeWidget.renderProps', extendsProps)

      const props = {
        ...node.designerProps?.defaultProps,
        ...extendsProps,
        ...node.props,
        ...node.designerProps?.getComponentProps?.(node),
      }
      if (node.depth === 0) {
        delete props.style
      }
      return props
    }
    const renderComponent = () => {
      const componentName = node.componentName
      console.log('TreeNodeWidget.renderComponent', componentName)
      const Component = components[componentName]
      const dataId: Record<string, any> = {}
      if (Component) {
        if (designer) {
          dataId[designer?.props?.nodeIdAttrName as string] = node.id
        }
        console.log('TreeNodeWidget.renderComponent', node?.id, 'rendering')
        return React.createElement(
          Component,
          renderProps(dataId),
          ...renderChildren()
        )
      } else {
        console.log('TreeNodeWidget.renderComponent: no component => Call renderChildren()', componentName)
        if (node?.children?.length) {
          return <Fragment>{renderChildren()}</Fragment>
        }
      }
    }

    if (!node) return null
    if (node.hidden) return null
    return React.createElement(
      TreeNodeContext.Provider,
      { value: node },
      renderComponent()
    )
  }
)

export const ComponentTreeWidget: React.FC<IComponentTreeWidgetProps> =
  observer((props: IComponentTreeWidgetProps) => {
    const tree = useTree()
    const prefix = usePrefix('component-tree')
    const designer = useDesigner()
    const dataId: Record<string, any> = {}
    if (designer && tree) {
      console.log('ComponentTreeWidget tree', tree)
      dataId[designer?.props?.nodeIdAttrName as string] = tree.id
    }
    useEffect(() => {
      GlobalRegistry.registerDesignerBehaviors(props.components)
    }, [])
    return (
      <div
        style={{ ...props.style, ...tree?.props?.style }}
        className={cls(prefix, props.className)}
        {...dataId}
      >
        <DesignerComponentsContext.Provider value={props.components}>
          <TreeNodeWidget node={tree} />
        </DesignerComponentsContext.Provider>
      </div>
    )
  })

ComponentTreeWidget.displayName = 'ComponentTreeWidget'
