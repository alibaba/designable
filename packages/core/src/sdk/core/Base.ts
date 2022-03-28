import type { createForm } from '@formily/core'
import { mitt, Handler } from '../utils'
import { markRaw } from '@formily/reactive'
import initInbiz from '../inbiz'
export type ICode = {
  jsCode?: string
  cssCode?: string
}
export type ICallBackEvents = {
  [key in `on${string}`]: Function
}

export type IUserInfo = {
  id: string
  token: string
  memberId: string
  memberName: string
  memberType: number
  mobile?: string
  guid: string
  deptName: string
  deptId: string
  email?: string
  gender?: number
  loginName?: string
  realName: string
  telephone?: string
  userCode: string
  userRole: number
  userState: number
  userInfoByToken: {
    [key: string]: any
  }
}
export type IAppInfo = {
  appId: string
  lang: string
  version: string
  theme: string
}
export type IRouter = {
  history?: History
  location?: {
    hash: string
    pathname: string
    query: unknown
    search: string
    state?: unknown
  }
  match?: {
    isExact: boolean
    path: string
    url: string
    params?: unknown
  }
}
abstract class Base {
  abstract readonly sdkType: 'page' | 'layout'
  event = createEvent()
  code: ICode = {}
  loaded = false
  form: ReturnType<typeof createForm>
  private $style: HTMLStyleElement
  readonly inbiz: any
  readonly userInfo: IUserInfo
  readonly appInfo: IAppInfo
  readonly router: IRouter
  readonly queryData: { [key: string]: any }
  readonly callBackEvents: ICallBackEvents
  constructor({
    userInfo = {},
    appInfo = {},
    router = {},
    queryData = {},
    callBackEvents = {},
    code = {},
  }: {
    callBackEvents?: ICallBackEvents
    userInfo?: object
    appInfo?: object
    router?: object
    code?: ICode
    queryData?: { [key: string]: any }
  }) {
    this.callBackEvents = callBackEvents
    this.userInfo = userInfo as IUserInfo
    this.appInfo = appInfo as IAppInfo
    this.router = router as IRouter
    this.queryData = queryData
    this.code = code
    this.inbiz = initInbiz.call(this)
  }
  runScriptCode(): boolean {
    if (!this.code.jsCode) {
      return
    }
    try {
      new Function('inbiz', this.code.jsCode)(this.inbiz)
      return true
    } catch (error) {
      console.warn('扩展代码错误', error)
      return false
    }
  }
  runCssCode() {
    const cssCode = this.code.cssCode
      ? this.code.cssCode.replace(/\n/g, '')
      : ''
    if (cssCode) {
      const styleClassName =
        this.sdkType === 'page'
          ? 'code_page_css_' + Date.now()
          : 'code_layout_css'
      let $style: HTMLStyleElement
      $style = document.createElement('style')
      $style.innerText = cssCode
      $style.className = styleClassName
      document.body.append($style)
      this.$style = $style
    }
  }
  destroy() {
    this.$style?.remove()
  }
  getComponents() {
    return this.form.fields
  }
  formilyRef(current?: object) {
    return markRaw({ current })
  }
  createMitt(name: string) {
    return markRaw(createEvent(name, this.event.emit))
  }
  setUserInfo = (obj: object) => {
    Object.assign(this.userInfo, obj)
  }
  setAppInfo = (obj: object) => {
    Object.assign(this.appInfo, obj)
  }
  setRouter = (obj: object) => {
    Object.assign(this.router, obj)
  }
  setQueryData(queryData: object) {
    Object.assign(this.queryData, queryData)
  }
  setForm(form) {
    this.form = form
  }
  setCode(code: ICode) {
    this.code = code
  }
}

export default Base

const createEvent = (name?: string, emit?: Function) => {
  let event: any
  return {
    // 触发事件  emit('onChange', xxxx); type 必定是以on 开头
    emit(type: string, ...arg: any) {
      let typeLower = type.toLowerCase()
      if (typeLower.slice(0, 2) === 'on') {
        typeLower = typeLower.slice(2)
      }
      event?.emit(typeLower, ...arg)
      emit?.(typeLower, name, ...arg)
    },
    // 取消监听 off('change', xxx); off('text.change', xxx);
    off(type: string, callBack?: Handler<unknown>) {
      if (typeof callBack !== 'function') {
        return
      }
      event?.off(type.toLowerCase(), callBack)
    },
    // 绑定监听 on('change', xxx); on('text.change', 'xxxx')
    on(type: string, callBack: Function) {
      if (typeof callBack !== 'function') {
        return
      }
      if (!event) {
        event = mitt()
      }
      event.on(type.toLowerCase(), callBack)
    },
  }
}
