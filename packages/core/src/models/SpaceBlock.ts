import { DragLine } from './DragLine'
import { TreeNode } from './TreeNode'

export type ISpaceBlockType =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | (string & {})

export interface ISpaceBlock {
  id?: string
  target?: TreeNode
  refer?: TreeNode
  rect?: DOMRect
  distance?: number
  type?: ISpaceBlockType
}

export class SpaceBlock {
  _id: string
  distance: number
  target: TreeNode
  refer: TreeNode
  ctx: DragLine
  rect: DOMRect
  type: ISpaceBlockType
  constructor(ctx: DragLine, box: ISpaceBlock) {
    this.ctx = ctx
    this.distance = box.distance
    this.target = box.target
    this.refer = box.refer
    this.rect = box.rect
    this.type = box.type
  }

  get id() {
    return (
      this._id ??
      `${this.rect.x}-${this.rect.y}-${this.rect.width}-${this.rect.height}`
    )
  }

  get next() {
    const spaceBlock = this.ctx.calcAroundSpaceBlocks(
      this.refer.getValidElementOffsetRect()
    )
    return spaceBlock[this.type as any]
  }

  get isometrics() {
    const results: SpaceBlock[] = []
    let spaceBlock: SpaceBlock = this as any
    while ((spaceBlock = spaceBlock.next)) {
      if (Math.abs(spaceBlock.distance - this.distance) < DragLine.threshold) {
        if (results.some((box) => box.distance !== spaceBlock.distance))
          continue
        results.push(spaceBlock)
      }
    }
    return results
  }
}
