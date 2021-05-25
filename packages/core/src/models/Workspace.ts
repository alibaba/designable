import { Engine } from './Engine'
import { Viewport } from './Viewport'
import { Operation, IOperation } from './Operation'
import { History } from './History'
import { uid, ICustomEvent, EventContainer } from '@designable/shared'
import { HistoryRedoEvent, HistoryUndoEvent } from '../events'
import { IEngineContext } from '../types'
export interface IViewportMatcher {
  contentWindow?: Window
  viewportElement?: HTMLElement
}

export interface IWorkspace {
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

  engine: Engine

  viewport: Viewport

  outline: Viewport

  operation: Operation

  history: History<Workspace>

  props: IWorkspaceProps

  constructor(engine: Engine, props: IWorkspaceProps) {
    this.engine = engine
    this.props = props
    this.id = props.id || uid()
    this.title = props.title
    this.description = props.description
    this.viewport = new Viewport({
      engine: this.engine,
      workspace: this,
      viewportElement: props.viewportElement,
      contentWindow: props.contentWindow,
      nodeIdAttrName: this.engine.props.nodeIdAttrName,
    })
    this.outline = new Viewport({
      engine: this.engine,
      workspace: this,
      viewportElement: props.viewportElement,
      contentWindow: props.contentWindow,
      nodeIdAttrName: this.engine.props.outlineNodeIdAttrName,
    })
    this.operation = new Operation(this)
    this.history = new History(this, {
      onRedo: (item) => {
        this.operation.hover.clear()
        this.operation.dispatch(new HistoryRedoEvent(item))
      },
      onUndo: (item) => {
        this.operation.hover.clear()
        this.operation.dispatch(new HistoryUndoEvent(item))
      },
    })
  }

  getEventContext(): IEngineContext {
    return {
      workbench: this.engine.workbench,
      workspace: this,
      engine: this.engine,
      viewport: this.viewport,
    }
  }

  attachEvents(container: EventContainer, contentWindow: Window) {
    this.engine.attachEvents(container, contentWindow, this.getEventContext())
  }

  detachEvents(container: EventContainer) {
    this.engine.detachEvents(container)
  }

  dispatch(event: ICustomEvent) {
    this.engine.dispatch(event, this.getEventContext())
  }

  serialize(): IWorkspace {
    return {
      operation: this.operation.serialize(),
    }
  }

  from(workspace?: IWorkspace) {
    if (workspace?.operation) {
      this.operation.from(workspace.operation)
    }
  }
}
