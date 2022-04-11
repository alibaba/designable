import { DragLine } from './DragLine'
import { TreeNode } from './TreeNode'

export type ISpaceBoxType = 'top' | 'right' | 'bottom' | 'left' | (string & {})

export interface ISpaceBox {
  id?: string
  target?: TreeNode
  refer?: TreeNode
  rect?: DOMRect
  distance?: number
  type?: ISpaceBoxType
}

export class SpaceBox {
  _id: string
  distance: number
  target: TreeNode
  refer: TreeNode
  ctx: DragLine
  rect: DOMRect
  type: ISpaceBoxType
  constructor(ctx: DragLine, box: ISpaceBox) {
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
    const spaceBox = this.ctx.getAroundSpaceBoxes(this.refer)
    return spaceBox[this.type as any]
  }

  get closest() {
    const results: SpaceBox[] = []
    let spaceBox: SpaceBox = this as any
    while ((spaceBox = spaceBox.next)) {
      if (Math.abs(spaceBox.distance - this.distance) < DragLine.threshold) {
        if (results.some((box) => box.distance !== spaceBox.distance)) continue
        results.push(spaceBox)
      }
    }
    return results
  }
}
