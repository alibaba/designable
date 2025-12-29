import { isArr, isWindow } from './types'
import { Subscribable, ISubscriber } from './subscribable'
import { globalThisPolyfill } from './globalThisPolyfill'

const ATTACHED_SYMBOL = Symbol('ATTACHED_SYMBOL')
const EVENTS_SYMBOL = Symbol('__EVENTS_SYMBOL__')
const EVENTS_ONCE_SYMBOL = Symbol('EVENTS_ONCE_SYMBOL')
const EVENTS_BATCH_SYMBOL = Symbol('EVENTS_BATCH_SYMBOL')
const DRIVER_INSTANCES_SYMBOL = Symbol('DRIVER_INSTANCES_SYMBOL')

export type EventOptions =
  | boolean
  | (AddEventListenerOptions &
      EventListenerOptions & {
        mode?: 'onlyOne' | 'onlyParent' | 'onlyChild'
      })

export type EventContainer = Window | HTMLElement | HTMLDocument

export type EventDriverContainer = HTMLElement | HTMLDocument

export interface IEventEffect<T> {
  (engine: T): void
}

export interface IEventDriver {
  container: EventDriverContainer | null
  contentWindow: Window
  attach(container: EventDriverContainer): void
  detach(container: EventDriverContainer): void
  dispatch<T extends ICustomEvent<any> = any>(event: T): void | boolean
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

const isOnlyMode = (mode: string) =>
  mode === 'onlyOne' || mode === 'onlyChild' || mode === 'onlyParent'
/**
 * 事件驱动器基类
 */
export class EventDriver<Engine extends Event = Event, Context = any>
  implements IEventDriver
{
  container: EventDriverContainer | null = null

  contentWindow: Window = globalThisPolyfill

  context?: Context

  constructor(public engine: Engine, context?: Context) {
    this.container = globalThisPolyfill.document || globalThisPolyfill
    this.contentWindow = window
    this.context = context
  }

  dispatch<T extends ICustomEvent<any> = any>(event: T) {
    return this.engine.dispatch(event, this.context)
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
    return this.engine.subscribeWith(type, subscriber)
  }

  attach(container: EventDriverContainer) {
    this.container = container
    console.error('attach must implement.')
  }

  detach(container: EventDriverContainer) {
    this.container = null
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
    if (isOnlyMode(options?.mode)) {
      ;(target as any)[EVENTS_ONCE_SYMBOL] = (target as any)[EVENTS_ONCE_SYMBOL] || {}
      const constructor = this['constructor']
      ;(constructor as any)[EVENTS_ONCE_SYMBOL] = (constructor as any)[EVENTS_ONCE_SYMBOL] || {}
      const handler = (target as any)[EVENTS_ONCE_SYMBOL][type]
      const container = (constructor as any)[EVENTS_ONCE_SYMBOL][type]
      if (!handler) {
        if (container) {
          if (options.mode === 'onlyChild') {
            if (container.contains(target)) {
              container.removeEventListener(
                type,
                (container as any)[EVENTS_ONCE_SYMBOL][type],
                options
              )
              delete (container as any)[EVENTS_ONCE_SYMBOL][type]
            }
          } else if (options.mode === 'onlyParent') {
            if (container.contains(target)) return
          }
        }
        if (target) {
          target.addEventListener(type, listener, options)
        }
        ;(target as any)[EVENTS_ONCE_SYMBOL][type] = listener
        ;(constructor as any)[EVENTS_ONCE_SYMBOL][type] = target
      }
    } else {
      ;(target as any)[EVENTS_SYMBOL] = (target as any)[EVENTS_SYMBOL] || {}
      ;(target as any)[EVENTS_SYMBOL][type] = (target as any)[EVENTS_SYMBOL][type] || new Map()
      if (!(target as any)[EVENTS_SYMBOL][type]?.get?.(listener)) {
        if (target) {
          target.addEventListener(type, listener, options)
        }
        ;(target as any)[EVENTS_SYMBOL][type]?.set?.(listener, true)
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
    if (isOnlyMode(options?.mode)) {
      const constructor = this['constructor']
      ;(constructor as any)[EVENTS_ONCE_SYMBOL] = (constructor as any)[EVENTS_ONCE_SYMBOL] || {}
      ;(target as any)[EVENTS_ONCE_SYMBOL] = (target as any)[EVENTS_ONCE_SYMBOL] || {}
      delete (constructor as any)[EVENTS_ONCE_SYMBOL][type]
      delete (target as any)[EVENTS_ONCE_SYMBOL][type]
      if (target) {
        target.removeEventListener(type, listener, options)
      }
    } else {
      ;(target as any)[EVENTS_SYMBOL] = (target as any)[EVENTS_SYMBOL] || {}
      ;(target as any)[EVENTS_SYMBOL][type] = (target as any)[EVENTS_SYMBOL][type] || new Map()
      ;(target as any)[EVENTS_SYMBOL][type]?.delete?.(listener)
      if (target) {
        target.removeEventListener(type, listener, options)
      }
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
    ;(this.engine as any)[DRIVER_INSTANCES_SYMBOL] =
      (this.engine as any)[DRIVER_INSTANCES_SYMBOL] || []
    if (!(this.engine as any)[DRIVER_INSTANCES_SYMBOL].includes(this)) {
      (this.engine as any)[DRIVER_INSTANCES_SYMBOL].push(this)
    }
    ;(this.engine as any)[DRIVER_INSTANCES_SYMBOL].forEach((driver: any) => {
      const target = driver.eventTarget(type)
      ;(target as any)[EVENTS_BATCH_SYMBOL] = (target as any)[EVENTS_BATCH_SYMBOL] || {}
      if (!(target as any)[EVENTS_BATCH_SYMBOL][type]) {
        target.addEventListener(type, listener, options)
        ;(target as any)[EVENTS_BATCH_SYMBOL][type] = listener
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
    ;(this.engine as any)[DRIVER_INSTANCES_SYMBOL] =
      (this.engine as any)[DRIVER_INSTANCES_SYMBOL] || []
    ;(this.engine as any)[DRIVER_INSTANCES_SYMBOL].forEach((driver: any) => {
      const target = driver.eventTarget(type)
      ;(target as any)[EVENTS_BATCH_SYMBOL] = (target as any)[EVENTS_BATCH_SYMBOL] || {}
      target.removeEventListener(type, listener, options)
      delete (target as any)[EVENTS_BATCH_SYMBOL][type]
    })
  }
}
/**
 * 事件引擎
 */
export class Event extends Subscribable<ICustomEvent<any>> {
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
        return subscriber(event)
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
          return subscriber(event)
        }
      } else {
        if (type && event?.type === type) {
          return subscriber(event)
        }
      }
    })
  }

  attachEvents(
    container?: EventContainer,
    contentWindow: Window = globalThisPolyfill,
    context?: any
  ): any {
    if (!container) return
    if (isWindow(container)) {
      return this.attachEvents(container.document, container, context)
    }
    if ((container as any)[ATTACHED_SYMBOL]) return
    ;(container as any)[ATTACHED_SYMBOL] = this.drivers.map((EventDriver) => {
      const driver = new EventDriver(this, context)
      driver.contentWindow = contentWindow
      driver.container = container
      driver.attach(container)
      return driver
    })
    if (!this.containers.includes(container)) {
      this.containers.push(container)
    }
  }

  detachEvents(container?: EventContainer): any {
    if (!container) {
      this.containers.forEach((container) => {
        this.detachEvents(container)
      })
      return
    }
    if (isWindow(container)) {
      return this.detachEvents(container.document)
    }
    if (!(container as any)[ATTACHED_SYMBOL]) return
    ;(container as any)[ATTACHED_SYMBOL].forEach((driver: any) => {
      driver.detach(container)
    })

    ;(this as any)[DRIVER_INSTANCES_SYMBOL] = (this as any)[DRIVER_INSTANCES_SYMBOL] || []
    ;(this as any)[DRIVER_INSTANCES_SYMBOL] = (this as any)[DRIVER_INSTANCES_SYMBOL].reduce(
      (drivers: any, driver: any) => {
        if (driver.container === container) {
          driver.detach(container)
          return drivers
        }
        return drivers.concat(driver)
      },
      []
    )
    this.containers = this.containers.filter((item) => item !== container)
    delete (container as any)[ATTACHED_SYMBOL]
    delete (container as any)[EVENTS_SYMBOL]
    delete (container as any)[EVENTS_ONCE_SYMBOL]
    delete (container as any)[ATTACHED_SYMBOL]
  }
}
