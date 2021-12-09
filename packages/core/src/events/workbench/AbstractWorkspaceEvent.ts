import { Workspace } from '../../models'
import { IDesignerContext } from '../../types'

export class AbstractWorkspaceEvent {
  data: Workspace
  context: IDesignerContext
  constructor(data: Workspace) {
    this.data = data
  }
}
