
import { uid, clone, toArr } from '@formily/shared'
import { IDataSourceItem, INodeItem } from './types'

export interface INode {
  key?: string;
  map?: { label: string; value: any }[];
  children?: INode[];
}

export const traverseTree = (
  data: INodeItem[],
  callback: (dataItem: INodeItem, i: number, data: INodeItem[]) => any
) => {
  for (let i = 0; i < data.length; i++) {
    callback(data[i], i, data)
    if (data[i]?.children) {
      traverseTree(data[i]?.children ?? [], callback)
    }
  }
}

export const transformValueToData = (value: IDataSourceItem[]): INodeItem[] => {
  const data = clone(value)
  traverseTree(data as INodeItem[], (item, i, dataSource) => {
    const dataItem: INodeItem = {
      key: '',
      duplicateKey: '',
      map: [],
      children: [],
    }
    for (const [key, value] of Object.entries(dataSource[i] || {})) {
      if (key !== 'children') (dataItem.map as { label: string; value: any }[]).push({ label: key, value })
    }
    const uuid = uid()
    dataItem.key = uuid
    dataItem.duplicateKey = uuid
    dataItem.children = (dataSource[i] as any)?.children as INodeItem[] ?? []
    dataSource[i] = dataItem
  })
  return data as INodeItem[]
}

export const transformDataToValue = (data: INodeItem[]): IDataSourceItem[] => {
  const value = clone(data)
  traverseTree(value as INodeItem[], (item, i, dataSource) => {
    const valueItem: IDataSourceItem & { [key: string]: any } = {
      children: [],
    }
    toArr((dataSource[i] as INodeItem).map).forEach((item: { label: string; value: any }) => {
      if (item.label) (valueItem as any)[item.label] = item.value
    })
    valueItem.children = (dataSource[i] as INodeItem)?.children ?? [];
    // Ensure key property for INodeItem
    (valueItem as INodeItem).key = (dataSource[i] as INodeItem).key;
    dataSource[i] = valueItem as INodeItem;
  })
  return value as IDataSourceItem[]
}
