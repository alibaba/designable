import { Designer } from './Designer'
import { Viewport } from './Viewport'
import { Operation, IOperation } from './Operation'
import { History } from './History'
import { uid, ICustomEvent, EventContainer } from '@designable/shared'
import {
  HistoryGotoEvent,
  HistoryRedoEvent,
  HistoryUndoEvent,
  HistoryPushEvent,
} from '../events'
import { IDesignerContext } from '../types'
export interface IViewportMatcher {
  contentWindow?: Window
  viewportElement?: HTMLElement
}

export interface IWorkspace {
  id?: string
  title?: string
  description?: string
  operation: IOperation
}

export interface IWorkspaceProps {
  id?: string
  title?: string
  description?: string
  contentWindow?: Window
  viewportElement?: HTMLElement
}

//工作区模型
export class Workspace {
  id: string

  title: string

  description: string

  designer: Designer

  viewport: Viewport

  outline: Viewport

  operation: Operation

  history: History<Workspace>

  props: IWorkspaceProps

  constructor(designer: Designer, props: IWorkspaceProps) {
    this.designer = designer
    this.props = props
    this.id = props.id || uid()
    this.title = props.title
    this.description = props.description
    this.viewport = new Viewport({
      designer: this.designer,
      workspace: this,
      viewportElement: props.viewportElement,
      contentWindow: props.contentWindow,
      nodeIdAttrName: this.designer.props.nodeIdAttrName,
    })
    this.outline = new Viewport({
      designer: this.designer,
      workspace: this,
      viewportElement: props.viewportElement,
      contentWindow: props.contentWindow,
      nodeIdAttrName: this.designer.props.outlineNodeIdAttrName,
    })
    this.operation = new Operation(this)
    this.history = new History(this, {
      onPush: (item) => {
        this.operation.dispatch(new HistoryPushEvent(item))
      },
      onRedo: (item) => {
        this.operation.hover.clear()
        this.operation.dispatch(new HistoryRedoEvent(item))
      },
      onUndo: (item) => {
        this.operation.hover.clear()
        this.operation.dispatch(new HistoryUndoEvent(item))
      },
      onGoto: (item) => {
        this.operation.hover.clear()
        this.operation.dispatch(new HistoryGotoEvent(item))
      },
    })
  }

  getEventContext(): IDesignerContext {
    return {
      workbench: this.designer.workbench,
      workspace: this,
      designer: this.designer,
      viewport: this.viewport,
    }
  }

  attachEvents(container: EventContainer, contentWindow: Window) {
    this.designer.attachEvents(container, contentWindow, this.getEventContext())
  }

  detachEvents(container: EventContainer) {
    this.designer.detachEvents(container)
  }

  dispatch(event: ICustomEvent) {
    return this.designer.dispatch(event, this.getEventContext())
  }

  serialize(): IWorkspace {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      operation: this.operation.serialize(),
    }
  }

  from(workspace?: IWorkspace) {
    if (!workspace) return
    if (workspace.operation) {
      this.operation.from(workspace.operation)
    }
    if (workspace.id) {
      this.id = workspace.id
    }
    if (workspace.title) {
      this.title = workspace.title
    }
    if (workspace.description) {
      this.description = workspace.description
    }
  }
}
