
import { isFn } from './types'

const unsubscribeIdMap: WeakMap<() => void, number> = new WeakMap()

export interface ISubscriber<Payload = any> {
  (payload: Payload): void | boolean
}

export class Subscribable<ExtendsType = any> {
  private subscribers: {
    index?: number
    [key: number]: ISubscriber
  } = {
    index: 0,
  }

  dispatch<T extends ExtendsType = any>(event: T, context?: any) {
    let interrupted = false
    for (const key in this.subscribers) {
      if (isFn(this.subscribers[key])) {
        if (event && typeof event === 'object' && !Array.isArray(event)) {
          (event as Record<string, any>)['context'] = context;
        }
        if (this.subscribers[key](event) === false) {
          interrupted = true;
        }
      }
    }
    return interrupted ? false : true
  }

  subscribe(subscriber: ISubscriber) {
    if (!isFn(subscriber)) {
      throw new Error('Subscriber must be a function')
    }
    if (typeof this.subscribers.index !== 'number') {
      this.subscribers.index = 0;
    }
    const id = this.subscribers.index + 1;
    this.subscribers[id] = subscriber;
    this.subscribers.index++;

    const unsubscribe = () => {
      this.unsubscribe(id);
    };
    unsubscribeIdMap.set(unsubscribe, id);
    return unsubscribe;
  }

  unsubscribe = (id?: number | string | (() => void)) => {
    if (id === undefined || id === null) {
      for (const key in this.subscribers) {
        if (key !== 'index') {
          this.unsubscribe(Number(key));
        }
      }
      return;
    }
    if (!isFn(id)) {
      const numId = typeof id === 'number' ? id : Number(id);
      if (!isNaN(numId)) {
        delete this.subscribers[numId];
      }
    } else {
      const mappedId = unsubscribeIdMap.get(id);
      if (mappedId !== undefined) {
        delete this.subscribers[mappedId];
      }
    }
  }
}
