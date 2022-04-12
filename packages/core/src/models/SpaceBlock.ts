import { isEqualRect, calcSpaceBlockOfRect, IRect } from '@designable/shared'
import { TranslateHelper } from './TranslateHelper'
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

export type AroundSpaceBlock = Record<ISpaceBlockType, SpaceBlock>

export const calcAroundSpaceBlocks = (
  tree: TreeNode,
  dragNodesRect: IRect
): AroundSpaceBlock => {
  const closestSpaces = {}
  tree.eachTree((refer) => {
    const referRect = refer.getValidElementOffsetRect()

    if (isEqualRect(dragNodesRect, referRect)) return

    const origin = calcSpaceBlockOfRect(dragNodesRect, referRect)

    if (origin) {
      const spaceBlock = new SpaceBlock(this, {
        refer,
        ...origin,
      })
      if (!closestSpaces[origin.type]) {
        closestSpaces[origin.type] = spaceBlock
      } else if (spaceBlock.distance < closestSpaces[origin.type].distance) {
        closestSpaces[origin.type] = spaceBlock
      }
    }
  })
  return closestSpaces as any
}
export class SpaceBlock {
  _id: string
  distance: number
  target: TreeNode
  refer: TreeNode
  ctx: TranslateHelper
  rect: DOMRect
  type: ISpaceBlockType
  constructor(ctx: TranslateHelper, box: ISpaceBlock) {
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
    const spaceBlock = calcAroundSpaceBlocks(
      this.refer.root,
      this.refer.getValidElementOffsetRect()
    )
    return spaceBlock[this.type as any]
  }

  get isometrics() {
    const results: SpaceBlock[] = []
    let spaceBlock: SpaceBlock = this as any
    while ((spaceBlock = spaceBlock.next)) {
      if (
        Math.abs(spaceBlock.distance - this.distance) <
        TranslateHelper.threshold
      ) {
        if (results.some((box) => box.distance !== spaceBlock.distance))
          continue
        results.push(spaceBlock)
      }
    }
    return results
  }
}
