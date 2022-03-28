import { browser } from '../utils'
import Page from '../core/Page'
import Layout from '../core/Layout'
import pageInbiz from './page'
import layoutInbiz from './layout'
import obserer, { IFieldApi } from '../utils/obserer'

type commonApi = {
  on: (type: string, callBack: Function) => void
  off: (type: string, callBack?: Function) => void
  emit: (type: string, ...arg: unknown[]) => void
}

type configEvent = {
  (): Object //获取所有事件
  (key: string): Function // 获取单个事件
  (key: string, value: Function): void // 设置单个事件
  (key: { [key: string]: Function }): void //设置所有事件
}
export interface IBaseInbiz extends commonApi {
  (id: string): IFieldApi
  browser: typeof browser
  userInfo: Page['userInfo']
  appInfo: Page['appInfo']
  router: Page['router']
  queryData: Page['queryData']
  configEvent: configEvent
}

export type IPageInbiz = IBaseInbiz & ReturnType<typeof pageInbiz>
export type ILayoutInbiz = IBaseInbiz & ReturnType<typeof layoutInbiz>

function initInbiz(this: Page): IPageInbiz
function initInbiz(this: Layout): ILayoutInbiz
function initInbiz<T extends Page | Layout>(this: T) {
  const inbiz = (id: string) => {
    const field = this.form.query(id).take()
    if (!field) {
      return
    }
    return obserer(field)
  }
  inbiz.configEvent = (
    key?: string | { [key: string]: Function },
    value?: Function
  ) => {
    if (key && typeof key === 'string') {
      if (value) {
        this.callBackEvents[key] = value
      } else {
        return this.callBackEvents[key]
      }
    } else {
      if (typeof key === 'object') {
        Object.assign(this.callBackEvents, key)
      } else {
        return this.callBackEvents
      }
    }
  }
  inbiz.queryData = this.queryData
  inbiz.on = this.event.on
  inbiz.off = this.event.off
  inbiz.emit = this.event.emit
  inbiz.browser = browser
  inbiz.userInfo = this.userInfo
  inbiz.appInfo = this.appInfo
  if (this instanceof Page) {
    Object.assign(inbiz, pageInbiz.call(this, inbiz))
  } else {
    Object.assign(inbiz, layoutInbiz.call(this, inbiz))
  }
  Object.freeze(inbiz)
  return inbiz
}

export default initInbiz
