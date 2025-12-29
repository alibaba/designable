import { Workspace } from '../../models/Workspace'
import { IEngineContext } from '../../types'

export class AbstractWorkspaceEvent {
  data: Workspace
  context!: IEngineContext
  constructor(data: Workspace) {
    this.data = data
  }
}
