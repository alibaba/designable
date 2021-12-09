import { IDesignerContext } from '../../types'

export class AbstractHistoryEvent {
  data: any
  context: IDesignerContext
  constructor(data: any) {
    this.data = data
  }
}
