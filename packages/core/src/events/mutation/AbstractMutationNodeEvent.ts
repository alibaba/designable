import { TreeNode } from '../../models'
import { IEngineContext } from '../../types'

export interface IMutationNodeEventData {
  //事件发生的数据源
  source: TreeNode | TreeNode[]
  //事件发生的目标对象
  target: TreeNode | TreeNode[]
}

export class AbstractMutationNodeEvent {
  data: IMutationNodeEventData
  context: IEngineContext
  constructor(data: IMutationNodeEventData) {
    this.data = data
  }
}
