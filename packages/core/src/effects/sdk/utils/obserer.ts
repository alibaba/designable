import { GeneralField } from '@formily/core'
import { toJS } from '@formily/reactive'

const parentKey = Symbol('[[parentKey]]')
const _propsKey = [
  'inbiz',
  'ref',
  'emit',
  'callBackEvents',
  'onFocus',
  'onBlur',
]
// field 需要暴露的字段
const field_publicKey = [
  'display',
  'required',
  'hidden',
  'visible',
  'disabled',
  'readOnly',
  'value',
]
const callBackEventReg = /^on\w+/
export type IFieldApi = {
  getConfig: () => object
  setConfig: (props: object) => void
  setDecorator: (props: object) => void
  configEvent: (
    key?: string | { [key: string]: Function },
    value?: Function
  ) => void | Function | Object
  setDecoratorProps: (props: object) => void
  decorator: object
  required: boolean
  visible: boolean
  hidden: boolean
  disabled: boolean
  readOnly: boolean
  value?: unknown
  display: 'none' | 'hidden' | 'visible'
  [key: string]: any
  // [key: `on${string}`]: Function
}

const observer = (field: GeneralField) => {
  const { ref, inbiz, emit, callBackEvents, onFocus, onBlur, ...other } = toJS(
    field.componentProps
  )
  const api = {
    ...field.data.event, // on, off, emit
    setDecoratorProps: field.setDecoratorProps,
    getConfig: () => {
      const { ref, inbiz, emit, callBackEvents, ...other } = toJS(
        field.componentProps
      )
      return other
    },
    setConfig: (props: object) => {
      if (typeof props === 'object' && Object.keys(props).length) {
        Object.assign(field.componentProps, props)
      }
    },
    setDecorator: (props: object) => {
      if (typeof props === 'object' && Object.keys(props).length) {
        Object.assign(field.decoratorProps, props)
      }
    },
    configEvent(key?: string | { [key: string]: Function }, value?: Function) {
      const configEvent = field.componentProps?.ref?.current?.configEvent
      if (configEvent) {
        return configEvent(key, value)
      }
      if (key && typeof key === 'string') {
        if (value) {
          field.componentProps.callBackEvents[key] = value
        } else {
          return field.componentProps.callBackEvents[key]
        }
      } else {
        if (typeof key === 'object') {
          field.componentProps.callBackEvents = key
        } else {
          return field.componentProps.callBackEvents
        }
      }
    },
    ...other,
    ...callBackEvents,
    decorator: field.decoratorProps,
    ...ref?.current,
    ...ref?.current?.observerData?.data,
  }
  field_publicKey.forEach((key) => {
    api[key] = field[key]
  })
  delete api.observerData
  if ('value' in field) {
    Object.assign(api, {
      setRequired: field.setRequired,
      setDisplay: field.setDisplay,
      setValidating: field.setValidating,
      validate: field.validate,
      reset: field.reset,
      setInitialValue: field.setInitialValue,
    })
  }
  return observerProxy(api, [], field) as IFieldApi
}

const observerProxy = (
  target: {
    configEvent: Function
  },
  parent: string[],
  field: GeneralField
) => {
  if (target && typeof target == 'object' && !target[parentKey]) {
    return new Proxy(target, {
      get: (target, key, reactive) => {
        if (key === parentKey) {
          return parent
        }
        const parentValue = reactive[parentKey]
        // parentKey的层级, 已经是子集时，直接返回
        if (parentValue.length) {
          // 对没有代理的数据进行代理
          if (
            parentValue[0] === 'observerData' &&
            typeof target[key] === 'object' &&
            !target[key][parentKey]
          ) {
            target[key] = observerProxy(
              target[key],
              parentValue.concat(key as string),
              field
            )
          }
          return target[key]
        } else {
          // 是方法时直接返回
          if (typeof target[key] === 'function') {
            return target[key]
          }
          if (field_publicKey.includes(key as string)) {
            return field[key]
          }
        }
        // 是否已经被代理过
        let value = undefined
        const isProxy = target[key]?.[parentKey] || false
        // 返回ref中属性和方法
        if (!isProxy) {
          // 获取组件内部暴露的方法和属性
          const ref = field.componentProps?.ref?.current || {}

          // 获取组件对外暴露的方法
          value = ref[key]

          // 获取组件对外部的observerData 中的数据
          if (value === undefined) {
            value = observerProxy(
              ref.observerData.data?.[key],
              parent.concat('observerData', key as string),
              field
            )
          }
        }

        // 返回容器的属性
        if (value === undefined && key === 'decorator') {
          value = field.decoratorProps
        }
        // 从componentProps上面返回属性
        if (value === undefined) {
          value = field.componentProps?.[key as string]
          if (key === 'title') {
            value = observerProxy(value, parent.concat('title'), field)
          }
        }
        return value
      },
      set: (target, key, value, reactive) => {
        if (_propsKey.includes(key as string)) {
          return false
        }
        // 设置 field_publicKey 公共字段
        if (
          !reactive[parentKey]?.length &&
          field_publicKey.includes(key as string)
        ) {
          field[key] = value
          target[key] = value
          return true
        }
        // 设置对外暴露的 observerData.data 中的属性
        const observerData =
          field.componentProps?.ref?.current?.observerData?.data
        if (
          (!reactive[parentKey]?.length &&
            observerData &&
            key in observerData) ||
          reactive[parentKey][0] === 'observerData'
        ) {
          const keys = reactive[parentKey].concat(key)
          if (reactive[parentKey][0] === 'observerData') {
            keys.splice(0, 1)
          }
          const result =
            field.componentProps?.ref?.current?.observerData.update(keys, value)
          if (result) {
            console.log(result)
            return false
          }
          target[key] = value
          return true
        }

        target[key] = value
        // 更新方法属性
        if (
          !reactive[parentKey]?.length &&
          callBackEventReg.test(key as string) &&
          typeof value === 'function'
        ) {
          target?.configEvent(key, value)
          return true
        }
        // 更新decorator
        if (key === 'decorator' && typeof value === 'object') {
          field.decoratorProps = value
          return true
        }

        // 单独处理title
        if (key === 'title' || reactive[parentKey][0] === 'title') {
          if (key === 'title' && typeof value === 'object') {
            field.componentProps.title = value
            field.setTitle(value.status ? value.value : '')
          }
          if (key === 'status' && field.componentProps.title) {
            field.setTitle(value ? field.title : '')
            field.componentProps.title.status = value
          }
          if (key === 'value' && field.componentProps.title) {
            field.setTitle(field.componentProps.title?.status ? value : '')
            field.componentProps.title.value = value
          }
        } else {
          // 更新props属性
          field.componentProps[key as string] = value
        }
        return true
      },
    })
  } else {
    return target
  }
}

export default observer
