import React from 'react'
import { TreeNode } from '@designable/core'
import { useSelectedNode } from '@designable/react'
import { TreeSelectProps, TreeSelect } from 'antd'

export interface IPathSelectorProps
  extends Omit<TreeSelectProps<any>, 'onChange'> {
  value?: string
  onChange?: (value: string, node: TreeNode) => void
  style?: React.CSSProperties
  className?: string
}

const transformDataSource = (node: TreeNode) => {
  const currentNode = node
  const dots = (count: number): string => {
    let dots = ''
    for (let i = 0; i < count; i++) {
      dots += '.'
    }
    return dots
  }
  const targetPath = (parentNode: TreeNode, targetNode: TreeNode): string => {
    const path: string[] = []
    const transform = (node: TreeNode | undefined): void => {
      if (node && node !== parentNode) {
        path.push(node.props?.name || node.id)
        transform(node.parent)
      }
    }
    transform(targetNode)
    return path.reverse().join('.')
  }
  const hasNoVoidChildren = (node: TreeNode): boolean => {
    return !!node.children?.some((child: TreeNode) => {
      if (child.props?.type !== 'void' && child !== currentNode) return true
      return hasNoVoidChildren(child)
    })
  }
  const findRoot = (node: TreeNode): TreeNode => {
    if (!node?.parent) return node
    if (node?.parent?.componentName !== node.componentName) return node.parent
    return findRoot(node.parent)
  }
  const findArrayParent = (node: TreeNode): TreeNode | undefined => {
    if (!node?.parent) return undefined
    if (node.parent.props?.type === 'array') return node.parent
    // root is not defined in this scope, so skip that check
    return findArrayParent(node.parent)
  }
  const transformRelativePath = (arrayNode: TreeNode, targetNode: TreeNode): string => {
    if (targetNode.depth === currentNode.depth)
      return `.${targetNode.props?.name || targetNode.id}`
    return `${dots(currentNode.depth - arrayNode.depth)}[].${targetPath(
      arrayNode,
      targetNode
    )}`
  }
  const transformChildren = (children: TreeNode[], path: (string | undefined)[] = []): any[] => {
    return children.reduce<any[]>((buf, node) => {
      if (node === currentNode) return buf
      if (node.props?.type === 'array' && !node.contains(currentNode)) return buf
      if (node.props?.type === 'void' && !hasNoVoidChildren(node)) return buf
      const currentPath = path.concat(node.props?.name || node.id)
      const arrayNode = findArrayParent(node)
      const label =
        node.props?.title ||
        node.props?.['x-component-props']?.title ||
        node.props?.name ||
        node.designerProps?.title
      const value = arrayNode
        ? transformRelativePath(arrayNode, node)
        : currentPath.join('.')
      return buf.concat({
        label,
        value,
        node,
        children: transformChildren(node.children ?? [], currentPath),
      })
    }, [])
  }
  const root = findRoot(node)
  if (root) {
    return transformChildren(root.children)
  }
  return []
}

export const PathSelector: React.FC<IPathSelectorProps> = (props) => {
  const baseNode = useSelectedNode();
  if (!baseNode) return null;
  const dataSource = transformDataSource(baseNode);
  const findNode = (dataSource: any[], value: string): any => {
    for (let i = 0; i < dataSource.length; i++) {
      const item = dataSource[i];
      if (item.value === value) return item.node;
      if (item.children?.length) {
        const fondedChild: any = findNode(item.children, value);
        if (fondedChild) return fondedChild;
      }
    }
    return undefined;
  };
  return (
    <TreeSelect
      {...props}
      onChange={(value) => {
        props.onChange?.(value, findNode(dataSource, value));
      }}
      treeDefaultExpandAll
      treeData={dataSource}
    />
  );
}
