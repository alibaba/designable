import { Designer } from './Designer'
import { Workspace, IWorkspaceProps } from './Workspace'
import { observable, define, action } from '@formily/reactive'
import {
  AddWorkspaceEvent,
  RemoveWorkspaceEvent,
  SwitchWorkspaceEvent,
} from '../events'
import { IDesignerContext, WorkbenchTypes } from '../types'
export class Workbench {
  workspaces: Workspace[]

  currentWorkspace: Workspace

  activeWorkspace: Workspace

  designer: Designer

  type: WorkbenchTypes = 'DESIGNABLE'

  constructor(designer: Designer) {
    this.designer = designer
    this.workspaces = []
    this.currentWorkspace = null
    this.activeWorkspace = null
    this.makeObservable()
  }

  makeObservable() {
    define(this, {
      currentWorkspace: observable.ref,
      workspaces: observable.shallow,
      activeWorkspace: observable.ref,
      type: observable.ref,
      switchWorkspace: action,
      addWorkspace: action,
      removeWorkspace: action,
      setActiveWorkspace: action,
      setWorkbenchType: action,
    })
  }

  getEventContext(): IDesignerContext {
    return {
      designer: this.designer,
      workbench: this.designer.workbench,
      workspace: null,
      viewport: null,
    }
  }

  switchWorkspace(id: string) {
    const finded = this.findWorkspaceById(id)
    if (finded) {
      this.currentWorkspace = finded
      this.designer.dispatch(new SwitchWorkspaceEvent(finded))
    }
    return this.currentWorkspace
  }

  setActiveWorkspace(workspace: Workspace) {
    this.activeWorkspace = workspace
    return workspace
  }

  setWorkbenchType(type: WorkbenchTypes) {
    this.type = type
  }

  addWorkspace(props: IWorkspaceProps) {
    const finded = this.findWorkspaceById(props.id)
    if (!finded) {
      this.currentWorkspace = new Workspace(this.designer, props)
      this.workspaces.push(this.currentWorkspace)
      this.designer.dispatch(new AddWorkspaceEvent(this.currentWorkspace))
      return this.currentWorkspace
    }
    return finded
  }

  removeWorkspace(id: string) {
    const findIndex = this.findWorkspaceIndexById(id)
    if (findIndex > -1 && findIndex < this.workspaces.length) {
      const findedWorkspace = this.workspaces[findIndex]
      findedWorkspace.viewport.detachEvents()
      this.workspaces.splice(findIndex, 1)
      if (findedWorkspace === this.currentWorkspace) {
        if (this.workspaces.length && this.workspaces[findIndex]) {
          this.currentWorkspace = this.workspaces[findIndex]
        } else {
          this.currentWorkspace = this.workspaces[this.workspaces.length - 1]
        }
      }
      this.designer.dispatch(new RemoveWorkspaceEvent(findedWorkspace))
    }
  }

  ensureWorkspace(props: IWorkspaceProps = {}) {
    const workspace = this.findWorkspaceById(props.id)
    if (workspace) return workspace
    this.addWorkspace(props)
    return this.currentWorkspace
  }

  findWorkspaceById(id: string) {
    return this.workspaces.find((item) => item.id === id)
  }

  findWorkspaceIndexById(id: string) {
    return this.workspaces.findIndex((item) => item.id === id)
  }

  mapWorkspace<T>(callbackFn: (value: Workspace, index: number) => T): T[] {
    return this.workspaces.map(callbackFn)
  }

  eachWorkspace<T>(callbackFn: (value: Workspace, index: number) => T) {
    this.workspaces.forEach(callbackFn)
  }
}
