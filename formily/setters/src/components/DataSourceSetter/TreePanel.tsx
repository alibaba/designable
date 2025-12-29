import React, { Fragment } from 'react'
import { Tree, Button } from 'antd'
import type { TreeProps } from 'antd'

import { uid } from '@formily/shared'
import { observer } from '@formily/reactive-react'
import { usePrefix, TextWidget, IconWidget } from '@designable/react'
import { Title } from './Title'
import { Header } from './Header'
import { traverseTree } from './shared'
import { ITreeDataSource, INodeItem } from './types'
import './styles.less'
import { GlobalRegistry } from '@designable/core'
import type { DataNode, EventDataNode } from 'antd/es/tree'

const limitTreeDrag = ({ dropPosition }: { dropPosition: number }): boolean => {
  if (dropPosition === 0) {
    return false
  }
  return true
}

export interface ITreePanelProps {
  treeDataSource: ITreeDataSource
  allowTree: boolean
  defaultOptionValue: {
    label: string
    value: any
  }[]
}


type OnDropInfo = {
  node: EventDataNode<DataNode>
  dragNode: EventDataNode<DataNode>
  dragNodesKeys: React.Key[]
  dropPosition: number
  dropToGap: boolean
}

export const TreePanel: React.FC<ITreePanelProps> = observer((props) => {
  const prefix = usePrefix('data-source-setter')
  const dropHandler : TreeProps['onDrop']  = (info: OnDropInfo) => {
      const dropKey = (info.node as any)?.key as string
    const dragKey = (info.dragNode as any)?.key as string
    const dropPos = (info.node as any).pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
    const data = [...props.treeDataSource.dataSource]
    // Find dragObject
    let dragObj: INodeItem | undefined = undefined
    traverseTree(data, (item: INodeItem, index: number, arr: INodeItem[]) => {
      if (arr[index].key === dragKey) {
        arr.splice(index, 1)
        dragObj = item
      }
    })
    if (!dragObj) return
    if (!info.dropToGap) {
      traverseTree(data, (item: INodeItem) => {
        if (item.key === dropKey) {
          item.children = item.children || []
          item.children.unshift(dragObj as INodeItem)
        }
      })
    } else if (
      ((info.node as any).children || []).length > 0 &&
      (info.node as any).expanded &&
      dropPosition === 1
    ) {
      traverseTree(data, (item: INodeItem) => {
        if (item.key === dropKey) {
          item.children = item.children || []
          item.children.unshift(dragObj as INodeItem)
        }
      })
    } else {
      let ar: INodeItem[] = [];
      let i = -1;
      traverseTree(data, (item: INodeItem, index: number, arr: INodeItem[]) => {
        if (item.key === dropKey) {
          ar = arr;
          i = index;
        }
      });
      if (ar.length > 0 && i >= 0) {
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj as INodeItem);
        } else {
          ar.splice(i + 1, 0, dragObj as INodeItem);
        }
      }
    }
    props.treeDataSource.dataSource = data
  }
  return (
    <Fragment>
      <Header
        title={
          <TextWidget token="SettingComponents.DataSourceSetter.dataSourceTree" />
        }
        extra={
          <Button
            type="text"
            onClick={() => {
              const uuid = uid()
              const dataSource = props.treeDataSource.dataSource
              const initialKeyValuePairs = props.defaultOptionValue?.map(
                (item) => ({ ...item })
              ) || [
                {
                  label: 'label',
                  value: `${GlobalRegistry.getDesignerMessage(
                    `SettingComponents.DataSourceSetter.item`
                  )} ${dataSource.length + 1}`,
                },
                { label: 'value', value: uuid },
              ]
              props.treeDataSource.dataSource = dataSource.concat({
                key: uuid,
                duplicateKey: uuid,
                map: initialKeyValuePairs,
                children: [],
              })
            }}
            icon={<IconWidget infer="Add" />}
          >
            <TextWidget token="SettingComponents.DataSourceSetter.addNode" />
          </Button>
        }
      />
      <div className={`${prefix + '-layout-item-content'}`}>
        <Tree
          blockNode
          draggable={true}
          allowDrop={props.allowTree ? () => true : limitTreeDrag}
          defaultExpandAll
          defaultExpandParent
          autoExpandParent
          showLine={{ showLeafIcon: false }}
          treeData={props.treeDataSource.dataSource}
          onDragEnter={() => {}}
          onDrop={dropHandler}
          titleRender={(titleProps: INodeItem) => {
            return (
              <Title
                {...titleProps}
                treeDataSource={props.treeDataSource}
              ></Title>
            )
          }}
          onSelect={(selectedKeys) => {
            if (selectedKeys[0]) {
              props.treeDataSource.selectedKey = selectedKeys[0].toString()
            }
          }}
        ></Tree>
      </div>
    </Fragment>
  )
})
