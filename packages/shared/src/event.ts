import { isArr, isWindow } from './types'
import { Subscrible, ISubscriber } from './subscrible'

const ATTACHED_SYMBOL = Symbol('ATTACHED_SYMBOL')

const EVENTS_SYMBOL = Symbol('__EVENTS_SYMBOL__')

const EVENTS_ONCE_SYMBOL = Symbol('EVENTS_ONCE_SYMBOL')
const EVENTS_BATCH_SYMBOL = Symbol('EVENTS_BATCH_SYMBOL')

type GlobalEnv = {
  ALL_EVENT_DRIVERS: EventDriver[]
}

const env: GlobalEnv = {
  ALL_EVENT_DRIVERS: [],
}

export type EventOptions =
  | boolean
  | (AddEventListenerOptions & EventListenerOptions & { once?: boolean })

export type EventContainer = Window | HTMLElement | HTMLDocument

export type EventDriverContainer = HTMLElement | HTMLDocument

export interface IEventEffect<T> {
  (engine: T): void
}

export interface IEventDriver {
  container: EventDriverContainer
  contentWindow: Window
  attach(container: EventDriverContainer): void
  detach(container: EventDriverContainer): void
  dispatch<T extends ICustomEvent<any> = any>(event: T): void
  subscribe<T extends ICustomEvent<any> = any>(subscriber: ISubscriber<T>): void
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  addEventListener(type: any, listener: any, options: any): void
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions
  ): void
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  removeEventListener(type: any, listener: any, options?: any): void
  batchAddEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions
  ): void
  batchAddEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  batchAddEventListener(type: any, listener: any, options?: any): void
  batchRemoveEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions
  ): void
  batchRemoveEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  batchRemoveEventListener(type: any, listener: any, options: any): void
}

export interface IEventDriverClass<T> {
  new (engine: T, context?: any): IEventDriver
}

export interface ICustomEvent<EventData = any, EventContext = any> {
  type: string
  data?: EventData
  context?: EventContext
}

export interface CustomEventClass {
  new (...args: any[]): any
}

export interface IEventProps<T = Event> {
  drivers?: IEventDriverClass<T>[]
  effects?: IEventEffect<T>[]
}

/**
 * 事件驱动器基类
 */
export class EventDriver<Engine extends Event = Event, Context = any>
  implements IEventDriver
{
  engine: Engine

  container: EventDriverContainer = document

  contentWindow: Window = window

  context: Context

  constructor(engine: Engine, context?: Context) {
    this.engine = engine
    this.context = context
  }

  dispatch<T extends ICustomEvent<any> = any>(event: T) {
    this.engine.dispatch(event, this.context)
  }

  subscribe<T extends ICustomEvent<any> = any>(subscriber: ISubscriber<T>) {
    return this.engine.subscribe(subscriber)
  }

  subscribeTo<T extends CustomEventClass>(
    type: T,
    subscriber: ISubscriber<InstanceType<T>>
  ) {
    return this.engine.subscribeTo(type, subscriber)
  }

  subscribeWith<T extends ICustomEvent = ICustomEvent>(
    type: string | string[],
    subscriber: ISubscriber<T>
  ) {
    return this.subscribeWith(type, subscriber)
  }

  attach(container: EventDriverContainer) {
    console.error('attach must implement.')
  }

  detach(container: EventDriverContainer) {
    console.error('attach must implement.')
  }

  eventTarget(type: string) {
    if (type === 'resize' || type === 'scroll') {
      if (this.container === this.contentWindow?.document) {
        return this.contentWindow
      }
    }
    return this.container
  }

  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  addEventListener(type: any, listener: any, options: any) {
    const target = this.eventTarget(type)
    if (options?.once) {
      target[EVENTS_ONCE_SYMBOL] = target[EVENTS_ONCE_SYMBOL] || {}
      delete options.once
      if (!target[EVENTS_ONCE_SYMBOL][type]) {
        target.addEventListener(type, listener, options)
        target[EVENTS_ONCE_SYMBOL][type] = listener
      }
    } else {
      target[EVENTS_SYMBOL] = target[EVENTS_SYMBOL] || {}
      target[EVENTS_SYMBOL][type] = target[EVENTS_SYMBOL][type] || new Map()
      if (!target[EVENTS_SYMBOL][type]?.get?.(listener)) {
        target.addEventListener(type, listener, options)
        target[EVENTS_SYMBOL][type]?.set?.(listener, true)
      }
    }
  }

  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions
  ): void
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  removeEventListener(type: any, listener: any, options?: any) {
    const target = this.eventTarget(type)
    if (options?.once) {
      target[EVENTS_ONCE_SYMBOL] = target[EVENTS_ONCE_SYMBOL] || {}
      delete options.once
      delete target[EVENTS_ONCE_SYMBOL][type]
      target.removeEventListener(type, listener, options)
    } else {
      target[EVENTS_SYMBOL] = target[EVENTS_SYMBOL] || {}
      target[EVENTS_SYMBOL][type] = target[EVENTS_SYMBOL][type] || new Map()
      target[EVENTS_SYMBOL][type]?.delete?.(listener)
      target.removeEventListener(type, listener, options)
    }
  }

  batchAddEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions
  ): void
  batchAddEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  batchAddEventListener(type: any, listener: any, options?: any) {
    if (!env.ALL_EVENT_DRIVERS.includes(this)) {
      env.ALL_EVENT_DRIVERS.push(this)
    }
    env.ALL_EVENT_DRIVERS.forEach((driver) => {
      const target = driver.eventTarget(type)
      target[EVENTS_BATCH_SYMBOL] = target[EVENTS_BATCH_SYMBOL] || {}
      if (!target[EVENTS_BATCH_SYMBOL][type]) {
        target.addEventListener(type, listener, options)
        target[EVENTS_BATCH_SYMBOL][type] = listener
      }
    })
  }

  batchRemoveEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventOptions
  ): void
  batchRemoveEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  batchRemoveEventListener(type: any, listener: any, options: any) {
    env.ALL_EVENT_DRIVERS.forEach((driver) => {
      const target = driver.eventTarget(type)
      target[EVENTS_BATCH_SYMBOL] = target[EVENTS_BATCH_SYMBOL] || {}
      target.removeEventListener(type, listener, options)
      delete target[EVENTS_BATCH_SYMBOL][type]
    })
  }
}
/**
 * 事件引擎
 */
export class Event extends Subscrible<ICustomEvent<any>> {
  private drivers: IEventDriverClass<any>[] = []
  private containers: EventContainer[] = []
  constructor(props?: IEventProps) {
    super()
    if (isArr(props?.effects)) {
      props.effects.forEach((plugin) => {
        plugin(this)
      })
    }
    if (isArr(props?.drivers)) {
      this.drivers = props.drivers
    }
  }

  subscribeTo<T extends CustomEventClass>(
    type: T,
    subscriber: ISubscriber<InstanceType<T>>
  ) {
    return this.subscribe((event) => {
      if (type && event instanceof type) {
        subscriber(event)
      }
    })
  }

  subscribeWith<T extends ICustomEvent = ICustomEvent>(
    type: string | string[],
    subscriber: ISubscriber<T>
  ) {
    return this.subscribe((event) => {
      if (isArr(type)) {
        if (type.includes(event?.type)) {
          subscriber(event)
        }
      } else {
        if (type && event?.type === type) {
          subscriber(event)
        }
      }
    })
  }

  attachEvents(
    container: EventContainer,
    contentWindow: Window = window,
    context?: any
  ) {
    if (!container) return
    if (isWindow(container)) {
      return this.attachEvents(container.document, container, context)
    }
    if (container[ATTACHED_SYMBOL]) return
    this.drivers.map((EventDriver) => {
      const driver = new EventDriver(this, context)
      driver.contentWindow = contentWindow
      driver.container = container
      driver.attach(container)
      return driver
    })
    container[ATTACHED_SYMBOL] = true
    if (!this.containers.includes(container)) {
      this.containers.push(container)
    }
  }

  detachEvents(container?: EventContainer) {
    if (!container) {
      this.containers.forEach((container) => {
        this.detachEvents(container)
      })
      return
    }
    if (container instanceof Window) {
      return this.detachEvents(container.document)
    }
    if (!container[ATTACHED_SYMBOL]) return
    env.ALL_EVENT_DRIVERS = env.ALL_EVENT_DRIVERS.reduce((drivers, driver) => {
      if (driver.container === container) {
        driver.detach(container)
        return drivers
      }
      return drivers.concat(driver)
    }, [])
    this.containers = this.containers.filter((item) => item !== container)
    delete container[ATTACHED_SYMBOL]
    delete container[EVENTS_SYMBOL]
    delete container[EVENTS_ONCE_SYMBOL]
    delete container[EVENTS_BATCH_SYMBOL]
  }

  destroy() {
    this.detachEvents()
    this.unsubscribe()
  }
}
