import { debounceMicro } from './debounce'

type IdleObserverStatus = 'BUSY' | 'IDLE' | 'BUSY_IDLE'

type IdleObserverHandler = (
  status: IdleObserverStatus,
  remainTime: number
) => void

const FRAME_TIME_DURATION = 16

const IdleManager = {
  status: 'IDLE',
  observers: new Set<IdleObserverHandler>(),
  handler: (deadline: IdleDeadline) => {
    const prevStatus = IdleManager.status
    const remainTime = deadline.timeRemaining()
    const dispatch = () => {
      IdleManager.observers.forEach((fn) =>
        fn(IdleManager.status as IdleObserverStatus, remainTime)
      )
    }
    if (remainTime > 0 && remainTime < FRAME_TIME_DURATION) {
      IdleManager.status = 'BUSY_IDLE'
      dispatch()
    } else if (remainTime >= FRAME_TIME_DURATION) {
      IdleManager.status = 'IDLE'
    } else {
      if (prevStatus !== 'BUSY') dispatch()
      IdleManager.status = 'BUSY'
    }
    IdleManager.start()
  },
  start: () => {
    requestIdleCallback(IdleManager.handler)
  },
  add(handler: IdleObserverHandler) {
    if (typeof handler === 'function') {
      IdleManager.observers.add(handler)
    }
  },
  remove(handler: IdleObserverHandler) {
    IdleManager.observers.delete(handler)
  },
}

IdleManager.start()
export class IdleObserver {
  status: IdleObserverStatus

  private observer: IdleObserverHandler

  constructor(observer: IdleObserverHandler) {
    this.observer = observer
  }

  observe = () => {
    IdleManager.observers.add(this.observer)
  }

  disconnect = () => {
    IdleManager.observers.delete(this.observer)
  }
}

export class PaintObserver {
  private resizeObserver: ResizeObserver

  private mutationObserver: MutationObserver

  private idleObserver: IdleObserver

  private connected = false

  constructor(observer: () => void = () => {}) {
    const handler = debounceMicro(observer)
    this.resizeObserver = new ResizeObserver(handler)
    this.mutationObserver = new MutationObserver(handler)
    this.idleObserver = new IdleObserver(handler)
  }

  observe = (target: HTMLElement | Element) => {
    if (!target) return
    this.resizeObserver.observe(target)
    this.mutationObserver.observe(target, {
      attributeFilter: ['style'],
      attributes: true,
    })
    this.idleObserver.observe()
    this.connected = true
  }

  disconnect = () => {
    if (this.connected) {
      this.resizeObserver.disconnect()
      this.mutationObserver.disconnect()
      this.idleObserver.disconnect()
    }
    this.connected = false
  }
}
