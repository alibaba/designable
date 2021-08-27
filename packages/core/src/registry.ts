import { each, isFn, isPlainObj } from '@designable/shared'
import { Path } from '@formily/path'
import { define, observable } from '@formily/reactive'
import { TreeNode } from './models'
import {
  IDesignerControllerProps,
  IDesignerControllerPropsMap,
  IDesignerLocales,
} from './types'

const getBrowserLanguage = () => {
  /* istanbul ignore next */
  if (!window.navigator) {
    return 'en'
  }
  return (
    window.navigator['browserlanguage'] || window.navigator?.language || 'en'
  )
}

const getISOCode = (language: string) => {
  let isoCode = DESIGNER_LOCALES.language
  let lang = cleanSpace(language)
  if (DESIGNER_LOCALES.messages[lang]) {
    return lang
  }
  each(DESIGNER_LOCALES.messages, (_, key: string) => {
    if (key.indexOf(lang) > -1 || String(lang).indexOf(key) > -1) {
      isoCode = key
      return false
    }
  })
  return isoCode
}

const COMPONENT_DESIGNER_PROPS_MAP: IDesignerControllerPropsMap = {
  Root: {
    droppable: true,
    cloneable: false,
    deletable: false,
  },
}

const NODE_DESIGNER_PROPS_MAP: IDesignerControllerPropsMap = {}

const DESIGNER_ICONS_MAP: Record<string, any> = {}

const DESIGNER_LOCALES: IDesignerLocales = define(
  {
    messages: {},
    language: getBrowserLanguage(),
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
    each(source, function (value, key) {
      const token = cleanSpace(key)
      const messages = mergeLocales(target[key] || target[token], value)
      target[token] = messages
      target[key] = messages
    })
    return target
  } else if (isPlainObj(source)) {
    const result = Array.isArray(source) ? [] : {}
    each(source, function (value, key) {
      const messages = mergeLocales(undefined, value)
      result[cleanSpace(key)] = messages
      result[key] = messages
    })
    return result
  }
  return source
}

const resolveDesignerProps = (
  node: TreeNode,
  props: IDesignerControllerProps
) => {
  return isFn(props) ? props(node) : props
}

const DESIGNER_GlobalRegistry = {
  setComponentDesignerProps: (
    componentName: string,
    props: IDesignerControllerProps
  ) => {
    const originProps = GlobalRegistry.getComponentDesignerProps(componentName)
    COMPONENT_DESIGNER_PROPS_MAP[componentName] = (node) => {
      return {
        ...resolveDesignerProps(node, originProps),
        ...resolveDesignerProps(node, props),
      }
    }
  },

  setNodeDesignerProps: (nodeName: string, props: IDesignerControllerProps) => {
    const originProps = GlobalRegistry.getNodeDesignerProps(nodeName)
    NODE_DESIGNER_PROPS_MAP[nodeName] = (node) => {
      return {
        ...resolveDesignerProps(node, originProps),
        ...resolveDesignerProps(node, props),
      }
    }
  },

  getComponentDesignerProps: (componentName: string) => {
    return COMPONENT_DESIGNER_PROPS_MAP[componentName] || {}
  },

  getNodeDesignerProps: (nodeName: string) => {
    return NODE_DESIGNER_PROPS_MAP[nodeName] || {}
  },

  registerDesignerProps: (
    map: IDesignerControllerPropsMap,
    type: 'component' | 'node' = 'component'
  ) => {
    each(map, (props, name) => {
      if (type === 'component') {
        GlobalRegistry.setComponentDesignerProps(name, props)
      } else {
        GlobalRegistry.setNodeDesignerProps(name, props)
      }
    })
  },

  registerDesignerIcons: (map: Record<string, any>) => {
    Object.assign(DESIGNER_ICONS_MAP, map)
  },

  getDesignerIcon: (name: string) => {
    return DESIGNER_ICONS_MAP[name]
  },

  setDesignerLanguage(lang: string) {
    DESIGNER_LOCALES.language = lang
  },

  getDesignerLanguage() {
    return getISOCode(DESIGNER_LOCALES.language)
  },

  getDesignerMessage(token: string) {
    const lang = getISOCode(DESIGNER_LOCALES.language)
    const locale = DESIGNER_LOCALES.messages[lang]
    if (!locale) {
      for (let key in DESIGNER_LOCALES.messages) {
        const message = Path.getIn(
          DESIGNER_LOCALES.messages[key],
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
      mergeLocales(DESIGNER_LOCALES.messages, locales)
    })
  },
}

export type IDesignerRegistry = typeof DESIGNER_GlobalRegistry

export const GlobalRegistry: IDesignerRegistry =
  window['__DESIGNER_GlobalRegistry__'] || DESIGNER_GlobalRegistry
