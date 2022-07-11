import { Engine } from '../../models'

export class AbstractEngineEvent {
  data: any
  context: Engine
  constructor(data: any) {
    this.data = data
  }
}
