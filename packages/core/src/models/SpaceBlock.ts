import {
  isEqualRect,
  calcSpaceBlockOfRect,
  IRect,
  calcExtendsLineSegmentOfRect,
} from '@designable/shared'
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
  refer?: TreeNode
  rect?: DOMRect
  distance?: number
  type?: ISpaceBlockType
}

export type AroundSpaceBlock = Record<ISpaceBlockType, SpaceBlock>

export class SpaceBlock {
  _id: string
  distance: number
  refer: TreeNode
  ctx: TranslateHelper
  rect: DOMRect
  type: ISpaceBlockType
  constructor(ctx: TranslateHelper, box: ISpaceBlock) {
    this.ctx = ctx
    this.distance = box.distance
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

  get extendsLine() {
    if (!this.needExtendsLine) return
    const dragNodesRect = this.ctx.dragNodesRect
    const referRect = this.refer.getValidElementOffsetRect()
    return calcExtendsLineSegmentOfRect(dragNodesRect, referRect)
  }

  get needExtendsLine() {
    const targetRect = this.crossDragNodesRect
    const referRect = this.crossReferRect
    if (this.type === 'top' || this.type === 'bottom') {
      const rightDelta = referRect.right - targetRect.left
      const leftDelta = targetRect.right - referRect.left
      return (
        rightDelta < targetRect.width / 2 || leftDelta < targetRect.width / 2
      )
    } else {
      const topDelta = targetRect.bottom - referRect.top
      const bottomDelta = referRect.bottom - targetRect.top
      return (
        topDelta < targetRect.height / 2 || bottomDelta < targetRect.height / 2
      )
    }
    return true
  }

  get crossReferRect() {
    const referRect = this.refer.getValidElementOffsetRect()
    if (this.type === 'top' || this.type === 'bottom') {
      return new DOMRect(
        referRect.x,
        this.rect.y,
        referRect.width,
        this.rect.height
      )
    } else {
      return new DOMRect(
        this.rect.x,
        referRect.y,
        this.rect.width,
        referRect.height
      )
    }
  }

  get crossDragNodesRect() {
    const dragNodesRect = this.ctx.dragNodesRect
    if (this.type === 'top' || this.type === 'bottom') {
      return new DOMRect(
        dragNodesRect.x,
        this.rect.y,
        dragNodesRect.width,
        this.rect.height
      )
    } else {
      return new DOMRect(
        this.rect.x,
        dragNodesRect.y,
        this.rect.width,
        dragNodesRect.height
      )
    }
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
