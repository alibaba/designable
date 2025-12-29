import {
  calcBoundingRect,
  calcElementLayout,
  isHTMLElement,
  isPointInRect,
  IPoint,
  requestIdle,
  cancelIdle,
  globalThisPolyfill,
  IRect,
  isRectInRect,
} from '@designable/shared'
import { action, define, observable } from '@formily/reactive'
import { Workspace } from './Workspace'
import { Engine } from './Engine'
import { TreeNode } from './TreeNode'

export interface IViewportProps {
  engine: Engine
  workspace: Workspace
  viewportElement: HTMLElement
  contentWindow: Window
  nodeIdAttrName: string
  moveSensitive?: boolean
  moveInsertionType?: IViewportMoveInsertionType
}

export interface IViewportData {
  scrollX?: number
  scrollY?: number
  width?: number
  height?: number
}

export type IViewportMoveInsertionType = 'all' | 'inline' | 'block'

/**
 * 视口模型
 */
export class Viewport {
  workspace: Workspace

  engine: Engine

  contentWindow: Window

  viewportElement: HTMLElement

  dragStartSnapshot!: IViewportData

  scrollX = 0

  scrollY = 0

  width = 0

  height = 0

  mounted = false

  attachRequest!: number

  nodeIdAttrName: string

  moveSensitive: boolean

  moveInsertionType: IViewportMoveInsertionType

  nodeElementsStore: Record<string, HTMLElement[]> = {}

  constructor(props: IViewportProps) {
    this.workspace = props.workspace
    this.engine = props.engine
    this.moveSensitive = props.moveSensitive ?? false
    this.moveInsertionType = props.moveInsertionType ?? 'all'
    this.viewportElement = props.viewportElement
    this.contentWindow = props.contentWindow
    this.nodeIdAttrName = props.nodeIdAttrName
    this.digestViewport()
    this.makeObservable()
    this.attachEvents()
  }

  get isScrollLeft() {
    return this.scrollX === 0
  }

  get isScrollTop() {
    return this.scrollY === 0
  }

  get isScrollRight() {
    if (this.isIframe) {
      return (
        this.width + this.contentWindow.scrollX >=
        this.contentWindow?.document?.body?.scrollWidth
      )
    } else if (this.viewportElement) {
      return (
        this.viewportElement.offsetWidth + this.scrollX >=
        this.viewportElement.scrollWidth
      )
    }
  }

  get isScrollBottom() {
    if (this.isIframe) {
      if (!this.contentWindow?.document?.body) return false
      return (
        this.height + this.contentWindow.scrollY >=
        this.contentWindow.document.body.scrollHeight
      )
    } else if (this.viewportElement) {
      if (!this.viewportElement) return false
      return (
        this.viewportElement.offsetHeight + this.viewportElement.scrollTop >=
        this.viewportElement.scrollHeight
      )
    }
  }

  get viewportRoot() {
    return this.isIframe
      ? this.contentWindow?.document?.body
      : this.viewportElement
  }

  get isMaster() {
    return this.contentWindow === globalThisPolyfill
  }

  get isIframe() {
    return !!this.contentWindow?.frameElement && !this.isMaster
  }

  get scrollContainer() {
    return this.isIframe ? this.contentWindow : this.viewportElement
  }

  get rect() {
    const viewportElement = this.viewportElement
    if (viewportElement) return viewportElement.getBoundingClientRect()
  }

  get innerRect() {
    const rect = this.rect
    return { x: 0, y: 0, width: rect?.width || 0, height: rect?.height || 0 }
  }

  get offsetX() {
    const rect = this.rect
    if (!rect) return 0
    return rect.x
  }

  get offsetY() {
    const rect = this.rect
    if (!rect) return 0
    return rect.y
  }

  get scale() {
    if (!this.viewportElement) return 1
    const clientRect = this.viewportElement.getBoundingClientRect()
    const offsetWidth = this.viewportElement.offsetWidth
    if (!clientRect.width || !offsetWidth) return 1
    return Math.round(clientRect.width / offsetWidth)
  }

  get dragScrollXDelta() {
    return this.scrollX - (this.dragStartSnapshot?.scrollX ?? 0)
  }

  get dragScrollYDelta() {
    return this.scrollY - (this.dragStartSnapshot?.scrollY ?? 0)
  }

  cacheElements() {
    this.nodeElementsStore = {}
    this.viewportRoot
      ?.querySelectorAll(`*[${this.nodeIdAttrName}]`)
      .forEach((element: Element) => {
        const id = element.getAttribute(this.nodeIdAttrName)
        if (id) {
          this.nodeElementsStore[id] = this.nodeElementsStore[id] || []
          this.nodeElementsStore[id].push(element as HTMLElement)
        }
      })
  }

  clearCache() {
    this.nodeElementsStore = {}
  }

  getCurrentData() {
    const data: IViewportData = {}
    if (this.isIframe) {
      data.scrollX = this.contentWindow?.scrollX || 0
      data.scrollY = this.contentWindow?.scrollY || 0
      data.width = this.contentWindow?.innerWidth || 0
      data.height = this.contentWindow?.innerHeight || 0
    } else if (this.viewportElement) {
      data.scrollX = this.viewportElement?.scrollLeft || 0
      data.scrollY = this.viewportElement?.scrollTop || 0
      data.width = this.viewportElement?.clientWidth || 0
      data.height = this.viewportElement?.clientHeight || 0
    }
    return data
  }

  takeDragStartSnapshot() {
    this.dragStartSnapshot = this.getCurrentData()
  }

  digestViewport() {
    Object.assign(this, this.getCurrentData())
  }

  elementFromPoint(point: IPoint) {
    if (this.contentWindow?.document) {
      return this.contentWindow.document.elementFromPoint(point.x, point.y)
    }
  }

  matchViewport(
    target: HTMLElement | Element | Window | Document | EventTarget
  ) {
    if (this.isIframe) {
      return (
        target === this.viewportElement ||
        target === this.contentWindow ||
        target === this.contentWindow?.document
      )
    } else {
      return target === this.viewportElement
    }
  }

  attachEvents() {
    const engine = this.engine
    cancelIdle(this.attachRequest)
    this.attachRequest = requestIdle(() => {
      if (!engine) return undefined
      if (this.isIframe) {
        this.workspace.attachEvents(this.contentWindow, this.contentWindow)
      } else if (isHTMLElement(this.viewportElement)) {
        this.workspace.attachEvents(this.viewportElement, this.contentWindow)
      }
    })
  }

  detachEvents() {
    if (this.isIframe) {
      this.workspace.detachEvents(this.contentWindow)
      this.workspace.detachEvents(this.viewportElement)
    } else if (this.viewportElement) {
      this.workspace.detachEvents(this.viewportElement)
    }
  }

  onMount(element: HTMLElement, contentWindow: Window) {
    this.mounted = true
    this.viewportElement = element
    this.contentWindow = contentWindow
    this.attachEvents()
    this.digestViewport()
  }

  onUnmount() {
    this.mounted = false
    this.detachEvents()
  }

  isPointInViewport(point: IPoint, sensitive?: boolean) {
    if (!this.rect) return false
    const element = document.elementFromPoint(point.x, point.y)
    if (!element || !this.containsElement(element)) {
      return false
    }
    return isPointInRect(point, this.rect, sensitive)
  }

  isRectInViewport(rect: IRect) {
    if (!this.rect) return false
    const element2 = document.elementFromPoint(rect.x, rect.y)
    if (!element2 || !this.containsElement(element2)) {
      return false
    }
    return isRectInRect(rect, this.rect)
  }

  isPointInViewportArea(point: IPoint, sensitive?: boolean) {
    if (!this.rect) return false
    return isPointInRect(point, this.rect, sensitive)
  }

  isOffsetPointInViewport(point: IPoint, sensitive?: boolean) {
    if (!this.innerRect) return false
    const element = document.elementFromPoint(point.x, point.y)
    if (!element || !this.containsElement(element))
      return false
    return isPointInRect(point, this.innerRect, sensitive)
  }

  isOffsetRectInViewport(rect: IRect) {
    if (!this.innerRect) return false
    const element = document.elementFromPoint(rect.x, rect.y)
    if (!element || !this.containsElement(element)) {
      return false
    }
    return isRectInRect(rect, this.innerRect)
  }

  makeObservable() {
    define(this, {
      scrollX: observable.ref,
      scrollY: observable.ref,
      width: observable.ref,
      height: observable.ref,
      digestViewport: action,
      viewportElement: observable.ref,
      contentWindow: observable.ref,
    })
  }

  findElementById(id: string): HTMLElement | undefined {
    if (!id) return undefined
    if (this.nodeElementsStore[id]) return this.nodeElementsStore[id][0]
    return this.viewportRoot?.querySelector(
      `*[${this.nodeIdAttrName}='${id}']`
    ) as HTMLElement
  }

  findElementsById(id: string): HTMLElement[] {
    if (!id) return []
    if (this.nodeElementsStore[id]) return this.nodeElementsStore[id]
    return Array.from(
      this.viewportRoot?.querySelectorAll(
        `*[${this.nodeIdAttrName}='${id}']`
      ) ?? []
    )
  }

  containsElement(element: HTMLElement | Element | EventTarget) {
    let root: Element | HTMLDocument = this.viewportElement
    if (root === element) return true
    return root?.contains(element as any)
  }

  getOffsetPoint(topPoint: IPoint) {
    const data = this.getCurrentData()
    return {
      x: topPoint.x - this.offsetX + (data?.scrollX ?? 0),
      y: topPoint.y - this.offsetY + (data?.scrollY ?? 0),
    }
  }

  //相对于页面
  getElementRect(element: HTMLElement | Element) {
    const rect = element.getBoundingClientRect()
    const offsetWidth = (element as any).offsetWidth
      ? (element as any).offsetWidth
      : rect.width
    const offsetHeight = (element as any).offsetHeight
      ? (element as any).offsetHeight
      : rect.height
    return {
      x: rect.x,
      y: rect.y,
      width: this.scale !== 1 ? offsetWidth : rect.width,
      height: this.scale !== 1 ? offsetHeight : rect.height,
    }
  }

  //相对于页面
  getElementRectById(id: string) {
    const elements = this.findElementsById(id)
    const rect = calcBoundingRect(
      elements.map((element) => this.getElementRect(element))
    )
    if (rect) {
      if (this.isIframe) {
        return {
          x: rect.x + this.offsetX,
          y: rect.y + this.offsetY,
          width: rect.width,
          height: rect.height,
        }
      } else {
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
      }
    }
  }

  //相对于视口
  getElementOffsetRect(element: HTMLElement | Element) {
    const elementRect = element.getBoundingClientRect()
    if (elementRect) {
      if (this.isIframe) {
        return {
          x: elementRect.x + this.contentWindow.scrollX,
          y: elementRect.y + this.contentWindow.scrollY,
          width: elementRect.width,
          height: elementRect.height
        }
      } else {
        return {
          x: (elementRect.x - this.offsetX + this.viewportElement.scrollLeft) /
            this.scale,
          y: (elementRect.y - this.offsetY + this.viewportElement.scrollTop) /
            this.scale,
          width: elementRect.width,
          height: elementRect.height
        }
      }
    }
  }

  //相对于视口
  getElementOffsetRectById(id: string) {
    const elements = this.findElementsById(id)
    if (!elements.length) return
    const elementRect = calcBoundingRect(
      elements.map((element) => this.getElementRect(element))
    )
    if (elementRect) {
      if (this.isIframe) {
        return { x: elementRect.x + this.contentWindow.scrollX, y: elementRect.y + this.contentWindow.scrollY, width: elementRect.width, height: elementRect.height }
      } else {
        return {
          x: (elementRect.x - this.offsetX + this.viewportElement.scrollLeft) /
            this.scale,
          y: (elementRect.y - this.offsetY + this.viewportElement.scrollTop) /
            this.scale,
          width: elementRect.width,
          height: elementRect.height
        }
      }
    }
  }

  getValidNodeElement(node: TreeNode): Element | undefined {
    const getNodeElement = (node: TreeNode) => {
      if (!node) return
      const ele = this.findElementById(node.id)
      if (ele) {
        return ele
      } else {
        return getNodeElement(node.parent)
      }
    }
    const nodeElement = getNodeElement(node)
    if (!nodeElement) return undefined
    return nodeElement
  }

  getChildrenRect(node: TreeNode): IRect | undefined {
    if (!node?.children?.length) return undefined
    return calcBoundingRect(
      node.children.reduce((buf: IRect[], child: TreeNode) => {
        const rect = this.getValidNodeRect(child)
        if (rect) {
          return buf.concat(rect)
        }
        return buf
      }, [])
    )
  }

  getChildrenOffsetRect(node: TreeNode): IRect | undefined {
    if (!node?.children?.length) return undefined

    return calcBoundingRect(
      node.children.reduce((buf: IRect[], child: TreeNode) => {
        const rect = this.getValidNodeOffsetRect(child)
        if (rect) {
          return buf.concat(rect)
        }
        return buf
      }, [])
    )
  }

  getValidNodeRect(node: TreeNode): IRect | undefined {
    if (!node) return undefined
    const rect = this.getElementRectById(node.id)
    if (node && node === node.root && node.isInOperation) {
      if (!rect) return this.rect
      // Filter out undefined and ensure type is IRect[]
      const rects: IRect[] = [this.rect, rect].filter((r): r is IRect => !!r)
      return calcBoundingRect(rects)
    }

    if (rect) {
      return rect
    } else {
      return this.getChildrenRect(node)
    }
  }

  getValidNodeOffsetRect(node: TreeNode): IRect | undefined {
    if (!node) return undefined
    const rect = this.getElementOffsetRectById(node.id)
    if (node && node === node.root && node.isInOperation) {
      if (!rect) return this.innerRect
      return calcBoundingRect([this.innerRect, rect])
    }
    if (rect) {
      return rect
    } else {
      return this.getChildrenOffsetRect(node)
    }
  }

  getValidNodeLayout(node: TreeNode) {
    if (!node) return 'vertical'
    if (node.parent?.designerProps?.inlineChildrenLayout) return 'horizontal'
    const element = this.findElementById(node.id)
    return element ? calcElementLayout(element) : undefined
  }
}
