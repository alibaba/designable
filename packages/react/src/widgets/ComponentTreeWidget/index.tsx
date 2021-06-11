import React, { Fragment, useEffect, useContext, createContext } from 'react'
import { useTree, useDesigner, useRegistry } from '../../hooks'
import { TreeNodeContext } from '../../context'
import { TreeNode } from '@designable/core'
import { observer } from '@formily/reactive-react'

const ComponentsContext = createContext<IComponents>({})
export interface IComponents {
  [key: string]: React.JSXElementConstructor<any>
}

export interface IComponentTreeWidgetProps {
  style?: React.CSSProperties
  className?: string
  components: IComponents
}

export interface ITreeNodeWidgetProps {
  node: TreeNode
  children?: React.ReactChild
}

export const TreeNodeWidget: React.FC<ITreeNodeWidgetProps> = observer(
  (props: ITreeNodeWidgetProps) => {
    const designer = useDesigner(props.node?.designerProps?.effects)
    const components = useContext(ComponentsContext)
    const node = props.node
    const renderChildren = () => {
      if (node?.designerProps?.selfRenderChildren) return []
      return node?.children?.map((child) => {
        return <TreeNodeWidget key={child.id} node={child} />
      })
    }
    const renderProps = (extendsProps: any = {}) => {
      if (node?.designerProps?.getComponentProps) {
        return {
          ...extendsProps,
          ...node.designerProps.getComponentProps(node),
        }
      }
      return { ...extendsProps, ...node.props }
    }
    const renderComponent = () => {
      const componentName = node.componentName
      const Component = components[componentName]
      const dataId = {}
      if (Component) {
        if (designer) {
          dataId[designer?.props?.nodeIdAttrName] = node.id
        }
        return React.createElement(
          Component,
          renderProps(dataId),
          ...renderChildren()
        )
      } else {
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
    const designer = useDesigner()
    const registry = useRegistry()
    const dataId = {}
    useEffect(() => {
      if (designer) {
        Object.entries(props.components).forEach(
          ([componentName, component]) => {
            if (component['designerProps']) {
              registry.setComponentDesignerProps(
                componentName,
                component['designerProps']
              )
            }
          }
        )
      }
    }, [])
    if (designer) {
      dataId[designer?.props?.nodeIdAttrName] = tree.id
    }
    return (
      <div style={props.style} className={props.className} {...dataId}>
        <ComponentsContext.Provider value={props.components}>
          <TreeNodeWidget node={tree} />
        </ComponentsContext.Provider>
      </div>
    )
  })

ComponentTreeWidget.displayName = 'ComponentTreeWidget'
