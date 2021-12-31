import { Engine } from './Engine'
import { action, define, observable } from '@formily/reactive'
import { globalThisPolyfill } from '@designable/shared'

export enum CursorStatus {
  Normal = 'NORMAL',
  DragStart = 'DRAG_START',
  Dragging = 'DRAGGING',
  DragStop = 'DRAG_STOP',
}

export enum CursorType {
  Move = 'MOVE',
  Selection = 'SELECTION',
}

export interface ICursorPosition {
  pageX?: number

  pageY?: number

  clientX?: number

  clientY?: number

  topPageX?: number

  topPageY?: number

  topClientX?: number

  topClientY?: number
}

export interface IScrollOffset {
  scrollX?: number
  scrollY?: number
}

export interface ICursor {
  status?: CursorStatus

  position?: ICursorPosition

  dragStartPosition?: ICursorPosition

  dragEndPosition?: ICursorPosition

  view?: Window
}

const DEFAULT_POSITION = {
  pageX: 0,
  pageY: 0,
  clientX: 0,
  clientY: 0,
  topPageX: 0,
  topPageY: 0,
  topClientX: 0,
  topClientY: 0,
}

const DEFAULT_SCROLL_OFFSET = {
  scrollX: 0,
  scrollY: 0,
}

const setCursorStyle = (contentWindow: Window, style: string) => {
  const currentRoot = document?.getElementsByTagName?.('html')?.[0]
  const root = contentWindow?.document?.getElementsByTagName('html')?.[0]
  if (root && root.style.cursor !== style) {
    root.style.cursor = style
  }
  if (currentRoot && currentRoot.style.cursor !== style) {
    currentRoot.style.cursor = style
  }
}

export class Cursor {
  engine: Engine

  type: CursorType | string = CursorType.Move

  status: CursorStatus = CursorStatus.Normal

  position: ICursorPosition = DEFAULT_POSITION

  dragStartPosition: ICursorPosition = DEFAULT_POSITION

  dragStartScrollOffset: IScrollOffset = DEFAULT_SCROLL_OFFSET

  dragEndPosition: ICursorPosition = DEFAULT_POSITION

  dragEndScrollOffset: IScrollOffset = DEFAULT_SCROLL_OFFSET

  view: Window = globalThisPolyfill

  constructor(engine: Engine) {
    this.engine = engine
    this.makeObservable()
  }

  makeObservable() {
    define(this, {
      type: observable.ref,
      status: observable.ref,
      position: observable.ref,
      dragStartPosition: observable.ref,
      dragStartScrollOffset: observable.ref,
      dragEndPosition: observable.ref,
      dragEndScrollOffset: observable.ref,
      view: observable.ref,
      setStyle: action,
      setPosition: action,
      setStatus: action,
      setType: action,
    })
  }

  setStatus(status: CursorStatus) {
    this.status = status
  }

  setType(type: CursorType | string) {
    this.type = type
  }

  setStyle(style: string) {
    this.engine.workbench.eachWorkspace((workspace) => {
      setCursorStyle(workspace.viewport.contentWindow, style)
    })
  }

  setPosition(position?: ICursorPosition) {
    this.position = {
      ...this.position,
      ...position,
    }
  }
  setDragStartPosition(position?: ICursorPosition) {
    this.dragStartPosition = {
      ...this.dragStartPosition,
      ...position,
    }
  }
  setDragEndPosition(position?: ICursorPosition) {
    this.dragEndPosition = {
      ...this.dragEndPosition,
      ...position,
    }
  }
  setDragStartScrollOffset(offset?: IScrollOffset) {
    this.dragStartScrollOffset = {
      ...this.dragStartScrollOffset,
      ...offset,
    }
  }
  setDragEndScrollOffset(offset?: IScrollOffset) {
    this.dragEndScrollOffset = {
      ...this.dragEndScrollOffset,
      ...offset,
    }
  }
}
