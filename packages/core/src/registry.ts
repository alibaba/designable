import { each, isFn, isPlainObj } from '@designable/shared'
import { Path } from '@formily/path'
import { define, observable } from '@formily/reactive'
import {
  IDesignerControllerProps,
  IDesignerControllerPropsMap,
  IDesignerLocales,
} from './types'

const getBrowserlanguage = () => {
  /* istanbul ignore next */
  if (!window.navigator) {
    return 'en'
  }
  return (
    window.navigator['browserlanguage'] || window.navigator?.language || 'en'
  )
}

const getISOCode = (language: string) => {
  let isoCode = DESINGER_LOCALES.language
  if (DESINGER_LOCALES.messages[language]) {
    return language
  }
  each(DESINGER_LOCALES.messages, (_, key: string) => {
    if (key.indexOf(language) > -1 || String(language).indexOf(key) > -1) {
      isoCode = key
      return false
    }
  })
  return isoCode
}

const DESINGER_PROPS_MAP: IDesignerControllerPropsMap = {
  Root: {
    droppable: true,
    cloneable: false,
    deletable: false,
  },
}

const DESINGER_ICONS_MAP: Record<string, any> = {}

const DESINGER_LOCALES: IDesignerLocales = define(
  {
    messages: {},
    language: getBrowserlanguage(),
  },
  {
    language: observable.ref,
  }
)

const cleanSpace = (str: string) => {
  return String(str).replace(/\s+/g, '_').toLocaleLowerCase()
}

const mergeLocales = (target: any, source: any) => {
  if (isPlainObj(target) && isPlainObj(source)) {
    each(source, (value, key) => {
      target[cleanSpace(key)] = mergeLocales(target[key], value)
    })
    return target
  }
  return source
}

const DESIGNER_GlobalRegistry = {
  setComponentDesignerProps: (
    componentName: string,
    props: IDesignerControllerProps
  ) => {
    const originProps = GlobalRegistry.getComponentDesignerProps(componentName)
    DESINGER_PROPS_MAP[componentName] = (node) => {
      if (isFn(originProps)) {
        if (isFn(props)) {
          return { ...originProps(node), ...props(node) }
        } else {
          return { ...originProps(node), ...props }
        }
      } else if (isFn(props)) {
        return { ...originProps, ...props(node) }
      } else {
        return { ...originProps, ...props }
      }
    }
  },

  getComponentDesignerProps: (componentName: string) => {
    return DESINGER_PROPS_MAP[componentName] || {}
  },

  registerDesignerProps: (map: IDesignerControllerPropsMap) => {
    each(map, (props, componentName) => {
      GlobalRegistry.setComponentDesignerProps(componentName, props)
    })
  },

  registerDesignerIcons: (map: Record<string, any>) => {
    Object.assign(DESINGER_ICONS_MAP, map)
  },

  getDesignerIcon: (name: string) => {
    return DESINGER_ICONS_MAP[name]
  },

  setDesignerLanguage(lang: string) {
    DESINGER_LOCALES.language = lang
  },

  getDesignerLanguage() {
    return DESINGER_LOCALES.language
  },

  getDesignerMessage(token: string) {
    const lang = getISOCode(DESINGER_LOCALES.language)
    const locale = DESINGER_LOCALES.messages[lang]
    if (!locale) {
      for (let key in DESINGER_LOCALES.messages) {
        const message = Path.getIn(
          DESINGER_LOCALES.messages[key],
          cleanSpace(token)
        )
        if (message) return message
      }
      return
    }
    return Path.getIn(locale, cleanSpace(token))
  },

  registerDesignerLocales(...packages: IDesignerLocales['messages'][]) {
    packages.forEach((locales) => {
      mergeLocales(DESINGER_LOCALES.messages, locales)
    })
  },
}

export type IDesignerRegistry = typeof DESIGNER_GlobalRegistry

export const GlobalRegistry: IDesignerRegistry =
  window['__DESIGNER_GlobalRegistry__'] || DESIGNER_GlobalRegistry
