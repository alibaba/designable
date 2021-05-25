import { IEngineContext } from '../../types'

export class AbstractHistoryEvent {
  data: any
  context: IEngineContext
  constructor(data: any) {
    this.data = data
  }
}
