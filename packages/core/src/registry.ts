import { each, isFn } from '@designable/shared'
import { ITreeNode, GlobalDragSource } from './models'
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

const DESINGER_LOCALES: IDesignerLocales = {
  messages: {},
  language: getBrowserlanguage(),
}

const DESIGNER_REGISTRY = {
  setComponentDesignerProps: (
    componentName: string,
    props: IDesignerControllerProps
  ) => {
    const originProps = registry.getComponentDesignerProps(componentName)
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
      registry.setComponentDesignerProps(componentName, props)
    })
  },

  registerDesignerIcons: (map: Record<string, any>) => {
    Object.assign(DESINGER_ICONS_MAP, map)
  },

  getDesignerIcon: (name: string) => {
    return DESINGER_ICONS_MAP[name]
  },

  registerSourcesByGroup(group: string, sources: ITreeNode[]) {
    GlobalDragSource.setSourcesByGroup(group, sources)
  },

  setDesignerLanguage(lang: string) {
    DESINGER_LOCALES.language = lang
  },

  getDesignerLanguage() {
    return DESINGER_LOCALES.language
  },

  getDesignerMessage(token: string) {
    const locale =
      DESINGER_LOCALES.messages[getISOCode(DESINGER_LOCALES.language)]
    return locale?.[token]
  },

  registerDesignerLocales(locales: IDesignerLocales['messages']) {
    each(locales, (locale, isoCode) => {
      DESINGER_LOCALES.messages[isoCode] = {
        ...DESINGER_LOCALES.messages[isoCode],
        ...locale,
      }
    })
  },
}

export const registry: typeof DESIGNER_REGISTRY =
  window['__DESIGNER_REGISTRY__'] || DESIGNER_REGISTRY
