import {
  calcBoundaryRect,
  calcElementLayout,
  isHTMLElement,
  isPointInRect,
  IPoint,
  requestIdle,
  cancelIdle,
  globalThisPolyfill,
  Rect,
  IRect,
  isRectInRect,
  isRectIntersectionRect,
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

  dragStartSnapshot: IViewportData

  scrollX = 0

  scrollY = 0

  width = 0

  height = 0

  mounted = false

  attachRequest: number

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
    this.setState()
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
    if (this.viewportElement) {
      const rect = this.viewportElement.getBoundingClientRect()
      return new Rect(rect.x, rect.y, rect.width, rect.height)
    }
  }

  get innerRect() {
    const rect = this.rect
    return new Rect(0, 0, rect?.width, rect?.height)
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
    return this.scrollX - this.dragStartSnapshot.scrollX
  }

  get dragScrollYDelta() {
    return this.scrollY - this.dragStartSnapshot.scrollY
  }

  cacheElements() {
    this.nodeElementsStore = {}
    this.viewportRoot
      ?.querySelectorAll(`*[${this.nodeIdAttrName}]`)
      .forEach((element: HTMLElement) => {
        const id = element.getAttribute(this.nodeIdAttrName)
        this.nodeElementsStore[id] = this.nodeElementsStore[id] || []
        this.nodeElementsStore[id].push(element)
      })
  }

  clearCache() {
    this.nodeElementsStore = {}
  }

  getState() {
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

  setState() {
    Object.assign(this, this.getState())
  }

  takeDragStartSnapshot() {
    this.dragStartSnapshot = this.getState()
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
      if (!engine) return
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
    this.setState()
  }

  onUnmount() {
    this.mounted = false
    this.detachEvents()
  }

  isPointInViewport(point: IPoint, sensitive?: boolean) {
    if (!this.rect) return false
    if (!this.containsElement(document.elementFromPoint(point.x, point.y))) {
      return false
    }
    return isPointInRect(point, this.rect, sensitive)
  }

  isRectInViewport(rect: IRect) {
    if (!this.rect) return false
    if (!this.containsElement(document.elementFromPoint(rect.x, rect.y))) {
      return false
    }
    return isRectInRect(rect, this.rect)
  }

  isRectIntersectionInViewport(rect: IRect) {
    if (!this.rect) return false
    if (!this.containsElement(document.elementFromPoint(rect.x, rect.y))) {
      return false
    }
    return isRectIntersectionRect(rect, this.rect)
  }

  isPointInViewportArea(point: IPoint, sensitive?: boolean) {
    if (!this.rect) return false
    return isPointInRect(point, this.rect, sensitive)
  }

  isOffsetPointInViewport(point: IPoint, sensitive?: boolean) {
    if (!this.innerRect) return false
    if (!this.containsElement(document.elementFromPoint(point.x, point.y)))
      return false
    return isPointInRect(point, this.innerRect, sensitive)
  }

  isOffsetRectInViewport(rect: IRect) {
    if (!this.innerRect) return false
    if (!this.containsElement(document.elementFromPoint(rect.x, rect.y))) {
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
      setState: action,
      viewportElement: observable.ref,
      contentWindow: observable.ref,
    })
  }

  findElementById(id: string): HTMLElement {
    if (!id) return
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

  getOffsetPoint(clientPoint: IPoint) {
    const data = this.getState()
    return {
      x: clientPoint.x - this.offsetX + data.scrollX,
      y: clientPoint.y - this.offsetY + data.scrollY,
    }
  }

  getOffsetRect(clientRect: Rect) {
    const data = this.getState()
    return new Rect(
      clientRect.x - this.offsetX + data.scrollX,
      clientRect.y - this.offsetY + data.scrollY,
      clientRect.width,
      clientRect.height
    )
  }

  //相对于页面
  getElementClientRect(element: HTMLElement | Element) {
    const rect = element.getBoundingClientRect()
    const offsetWidth = element['offsetWidth']
      ? element['offsetWidth']
      : rect.width
    const offsetHeight = element['offsetHeight']
      ? element['offsetHeight']
      : rect.height
    return new Rect(
      rect.x,
      rect.y,
      this.scale !== 1 ? offsetWidth : rect.width,
      this.scale !== 1 ? offsetHeight : rect.height
    )
  }

  //相对于页面
  getElementClientRectById(id: string) {
    const elements = this.findElementsById(id)
    const rect = calcBoundaryRect(
      elements.map((element) => this.getElementClientRect(element))
    )
    if (rect) {
      if (this.isIframe) {
        return new Rect(
          rect.x + this.offsetX,
          rect.y + this.offsetY,
          rect.width,
          rect.height
        )
      } else {
        return new Rect(rect.x, rect.y, rect.width, rect.height)
      }
    }
  }

  //相对于视口
  getElementOffsetRect(element: HTMLElement | Element) {
    const elementRect = element.getBoundingClientRect()
    if (elementRect) {
      if (this.isIframe) {
        return new Rect(
          elementRect.x + this.contentWindow.scrollX,
          elementRect.y + this.contentWindow.scrollY,
          elementRect.width,
          elementRect.height
        )
      } else {
        return new Rect(
          (elementRect.x - this.offsetX + this.viewportElement.scrollLeft) /
            this.scale,
          (elementRect.y - this.offsetY + this.viewportElement.scrollTop) /
            this.scale,
          elementRect.width,
          elementRect.height
        )
      }
    }
  }

  //相对于视口
  getElementOffsetRectById(id: string) {
    const elements = this.findElementsById(id)
    if (!elements.length) return
    const elementRect = calcBoundaryRect(
      elements.map((element) => this.getElementClientRect(element))
    )
    if (elementRect) {
      if (this.isIframe) {
        return new Rect(
          elementRect.x + this.contentWindow.scrollX,
          elementRect.y + this.contentWindow.scrollY,
          elementRect.width,
          elementRect.height
        )
      } else {
        return new Rect(
          (elementRect.x - this.offsetX + this.viewportElement.scrollLeft) /
            this.scale,
          (elementRect.y - this.offsetY + this.viewportElement.scrollTop) /
            this.scale,
          elementRect.width,
          elementRect.height
        )
      }
    }
  }

  getValidNodeElement(node: TreeNode): Element {
    const getNodeElement = (node: TreeNode) => {
      if (!node) return
      const ele = this.findElementById(node.id)
      if (ele) {
        return ele
      } else {
        return getNodeElement(node.parent)
      }
    }
    return getNodeElement(node)
  }

  getChildrenClientRect(node: TreeNode): Rect {
    if (!node?.children?.length) return
    return calcBoundaryRect(
      node.children.reduce((buf, child) => {
        const rect = this.getValidNodeClientRect(child)
        if (rect) {
          return buf.concat(rect)
        }
        return buf
      }, [])
    )
  }

  getChildrenOffsetRect(node: TreeNode): Rect {
    if (!node?.children?.length) return

    return calcBoundaryRect(
      node.children.reduce((buf, child) => {
        const rect = this.getValidNodeOffsetRect(child)
        if (rect) {
          return buf.concat(rect)
        }
        return buf
      }, [])
    )
  }

  getValidNodeClientRect(node: TreeNode): Rect {
    if (!node) return
    const rect = this.getElementClientRectById(node.id)
    if (node && node === node.root && node.isInOperation) {
      if (!rect) return this.rect
      return calcBoundaryRect([this.rect, rect])
    }

    if (rect) {
      return rect
    } else {
      return this.getChildrenClientRect(node)
    }
  }

  getValidNodeOffsetRect(node: TreeNode): Rect {
    if (!node) return
    const rect = this.getElementOffsetRectById(node.id)
    if (node && node === node.root && node.isInOperation) {
      if (!rect) return this.innerRect
      return calcBoundaryRect([this.innerRect, rect])
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
    return calcElementLayout(this.findElementById(node.id))
  }
}
