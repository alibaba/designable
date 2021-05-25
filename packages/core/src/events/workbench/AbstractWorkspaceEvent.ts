import { Workspace } from '../../models'
import { IEngineContext } from '../../types'

export class AbstractWorkspaceEvent {
  data: Workspace
  context: IEngineContext
  constructor(data: Workspace) {
    this.data = data
  }
}
