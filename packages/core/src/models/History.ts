import { define, observable, action } from '@formily/reactive'

export interface IHistoryProps<T> {
  onPush?: (item: T) => void
  onRedo?: (item: T) => void
  onUndo?: (item: T) => void
  onGoto?: (item: T) => void
}

export interface HistoryItem<T> {
  data: T
  type?: string
  timestamp: number
}

export interface ISerializable {
  from(json: any): void //导入数据
  serialize(): any //序列化模型，用于历史记录保存
}

export class History<T extends ISerializable = any> {
  context: ISerializable
  props: IHistoryProps<HistoryItem<T>>
  current = 0
  history: HistoryItem<T>[] = []
  updateTimer = null
  maxSize = 100
  locking = false
  constructor(context: T, props?: IHistoryProps<HistoryItem<T>>) {
    this.context = context
    this.props = props
    this.push()
    this.makeObservable()
  }

  makeObservable() {
    define(this, {
      current: observable.ref,
      history: observable.shallow,
      push: action,
      undo: action,
      redo: action,
      goTo: action,
      clear: action,
    })
  }

  list() {
    return this.history
  }

  push(type?: string) {
    if (this.locking) return
    if (this.current < this.history.length - 1) {
      this.history = this.history.slice(0, this.current + 1)
    }
    const item = {
      data: this.context.serialize(),
      timestamp: Date.now(),
      type,
    }
    this.current = this.history.length
    this.history.push(item)
    const overSizeCount = this.history.length - this.maxSize
    if (overSizeCount > 0) {
      this.history.splice(0, overSizeCount)
      this.current = this.history.length - 1
    }
    if (this.props?.onPush) {
      this.props.onPush(item)
    }
  }

  get allowUndo() {
    return this.history.length > 0 && this.current - 1 >= 0
  }

  get allowRedo() {
    return this.history.length > this.current + 1
  }

  redo() {
    if (this.allowRedo) {
      const item = this.history[this.current + 1]
      this.locking = true
      this.context.from(item.data)
      this.locking = false
      this.current++
      if (this.props?.onRedo) {
        this.props.onRedo(item)
      }
    }
  }

  undo() {
    if (this.allowUndo) {
      const item = this.history[this.current - 1]
      this.locking = true
      this.context.from(item.data)
      this.locking = false
      this.current--
      if (this.props?.onUndo) {
        this.props.onUndo(item)
      }
    }
  }

  goTo(index: number) {
    const item = this.history[index]
    if (item) {
      this.locking = true
      this.context.from(item.data)
      this.locking = false
      this.current = index
      if (this.props?.onGoto) {
        this.props.onGoto(item)
      }
    }
  }

  clear() {
    this.history = []
    this.current = 0
  }
}
