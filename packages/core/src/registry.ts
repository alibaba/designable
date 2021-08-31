import { each, isFn, isPlainObj } from '@designable/shared'
import { Path } from '@formily/path'
import { define, observable } from '@formily/reactive'
import { LocaleMessages } from './types'
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

const getISOCode = (language: string, type = 'global') => {
  let isoCode = DESIGNER_LOCALES.language
  let lang = normalize(language)
  if (DESIGNER_LOCALES[type][lang]) {
    return lang
  }
  each(DESIGNER_LOCALES[type], (_, key: string) => {
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
    global: {},
    components: {},
    sources: {},
    language: getBrowserLanguage(),
  },
  {
    language: observable.ref,
  }
)

const normalize = (str: string) => {
  return String(str).replace(/\s+/g, '_').toLocaleLowerCase()
}

const mergeLocales = (target: any, source: any) => {
  if (isPlainObj(target) && isPlainObj(source)) {
    each(source, function (value, key) {
      const token = normalize(key)
      const messages = mergeLocales(target[key] || target[token], value)
      target[token] = messages
      target[key] = messages
    })
    return target
  } else if (isPlainObj(source)) {
    const result = Array.isArray(source) ? [] : {}
    each(source, function (value, key) {
      const messages = mergeLocales(undefined, value)
      result[normalize(key)] = messages
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

  setSourceDesignerProps: (
    sourceName: string,
    props: IDesignerControllerProps
  ) => {
    const originProps = GlobalRegistry.getSourceDesignerProps(sourceName)
    NODE_DESIGNER_PROPS_MAP[sourceName] = (node) => {
      return {
        ...resolveDesignerProps(node, originProps),
        ...resolveDesignerProps(node, props),
      }
    }
  },

  setComponentDesignerLocales: (
    componentName: string,
    locales: LocaleMessages
  ) => {
    const isoCodes = Object.keys(locales || {})
    isoCodes.forEach((key) => {
      const isoCode = normalize(key)
      const name = normalize(componentName)
      DESIGNER_LOCALES.components[isoCode] =
        DESIGNER_LOCALES.components[isoCode] || {}
      DESIGNER_LOCALES.components[isoCode][name] = mergeLocales(
        {},
        locales[key]
      )
    })
  },

  setSourceDesignerLocales: (sourceName: string, locales: LocaleMessages) => {
    const isoCodes = Object.keys(locales || {})
    isoCodes.forEach((key) => {
      const isoCode = normalize(key)
      const name = normalize(sourceName)
      DESIGNER_LOCALES.sources[isoCode] =
        DESIGNER_LOCALES.sources[isoCode] || {}
      DESIGNER_LOCALES.sources[isoCode][name] = mergeLocales({}, locales[key])
    })
  },

  getComponentDesignerProps: (componentName: string) => {
    return COMPONENT_DESIGNER_PROPS_MAP[componentName] || {}
  },

  getComponentDesignerMessage: (componentName: string, token: string) => {
    const lang = getISOCode(DESIGNER_LOCALES.language)
    const locale =
      DESIGNER_LOCALES.components?.[lang]?.[normalize(componentName)]
    if (!locale) {
      for (let key in DESIGNER_LOCALES.components) {
        const message = Path.getIn(
          DESIGNER_LOCALES.components[key],
          normalize(token)
        )
        if (message) return message
      }
      return
    }
    return Path.getIn(locale, normalize(token))
  },

  getSourceDesignerMessage: (sourceName: string, token: string) => {
    const lang = getISOCode(DESIGNER_LOCALES.language)
    const locale = DESIGNER_LOCALES.sources?.[lang]?.[normalize(sourceName)]
    if (!locale) {
      for (let key in DESIGNER_LOCALES.sources) {
        const message = Path.getIn(
          DESIGNER_LOCALES.sources[key],
          normalize(token)
        )
        if (message) return message
      }
      return
    }
    return Path.getIn(locale, normalize(token))
  },

  getSourceDesignerProps: (nodeName: string) => {
    return NODE_DESIGNER_PROPS_MAP[nodeName] || {}
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
    const locale = DESIGNER_LOCALES.global[lang]
    if (!locale) {
      for (let key in DESIGNER_LOCALES.global) {
        const message = Path.getIn(
          DESIGNER_LOCALES.global[key],
          normalize(token)
        )
        if (message) return message
      }
      return
    }
    return Path.getIn(locale, normalize(token))
  },

  registerDesignerProps: (map: IDesignerControllerPropsMap) => {
    each(map, (props, name) => {
      GlobalRegistry.setComponentDesignerProps(name, props)
    })
  },

  registerDesignerIcons: (map: Record<string, any>) => {
    Object.assign(DESIGNER_ICONS_MAP, map)
  },

  registerDesignerLocales(...packages: LocaleMessages[]) {
    packages.forEach((locales) => {
      mergeLocales(DESIGNER_LOCALES.global, locales)
    })
  },
}

export const createLocales = (...packages: LocaleMessages[]) => {
  const results = {}
  packages.forEach((locales) => {
    mergeLocales(results, locales)
  })
  return results
}

export type IDesignerRegistry = typeof DESIGNER_GlobalRegistry

export const GlobalRegistry: IDesignerRegistry =
  window['__DESIGNER_GlobalRegistry__'] || DESIGNER_GlobalRegistry
