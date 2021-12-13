import { each } from '@designable/shared'
import { Path } from '@formily/path'
import { observable } from '@formily/reactive'
import {
  IDesignerFeatureStore,
  IDesignerIconsStore,
  IDesignerLocaleStore,
  IDesignerLanguageStore,
  IDesignerFeatures,
  IDesignerLocales,
  IDesignerIcons,
  IFeatureLike,
  IFeature,
} from './types'
import { mergeLocales, lowerSnake, getBrowserLanguage } from './internals'
import { isFeatureHost } from './externals'
import { TreeNode } from './models'
import { isFeatureList } from './externals'

const getISOCode = (language: string) => {
  let isoCode = DESIGNER_LANGUAGE_STORE.value
  let lang = lowerSnake(language)
  if (DESIGNER_LOCALES_STORE.value[lang]) {
    return lang
  }
  each(DESIGNER_LOCALES_STORE.value, (_, key: string) => {
    if (key.indexOf(lang) > -1 || String(lang).indexOf(key) > -1) {
      isoCode = key
      return false
    }
  })
  return isoCode
}

const reSortFeatures = (target: IFeature[], sources: IDesignerFeatures) => {
  const findTargetFeature = (descriptor: IFeature) =>
    target.includes(descriptor)
  const findSourceFeature = (name: string) => {
    for (let key in sources) {
      const { Feature } = sources[key]
      for (let i = 0; i < Feature.length; i++) {
        if (Feature[i].name === name) return Feature[i]
      }
    }
  }
  each(sources, (item) => {
    if (!item) return
    if (!isFeatureHost(item)) return
    const { Feature } = item
    each(Feature, (descriptor) => {
      if (findTargetFeature(descriptor)) return
      const name = descriptor.name
      each(descriptor.extends, (dep) => {
        const descriptor = findSourceFeature(dep)
        if (!descriptor)
          throw new Error(`No ${dep} descriptor that ${name} depends on`)
        if (!findTargetFeature(descriptor)) {
          target.unshift(descriptor)
        }
      })
      target.push(descriptor)
    })
  })
}

const DESIGNER_BEHAVIORS_STORE: IDesignerFeatureStore = observable.ref([])

const DESIGNER_ICONS_STORE: IDesignerIconsStore = observable.ref({})

const DESIGNER_LOCALES_STORE: IDesignerLocaleStore = observable.ref({})

const DESIGNER_LANGUAGE_STORE: IDesignerLanguageStore = observable.ref(
  getBrowserLanguage()
)

const DESIGNER_GlobalRegistry = {
  setDesignerLanguage: (lang: string) => {
    DESIGNER_LANGUAGE_STORE.value = lang
  },

  setDesignerFeatures: (descriptors: IFeatureLike[]) => {
    DESIGNER_BEHAVIORS_STORE.value = descriptors.reduce<IFeature[]>(
      (buf, descriptor) => {
        if (isFeatureHost(descriptor)) {
          return buf.concat(descriptor.Feature)
        } else if (isFeatureList(descriptor)) {
          return buf.concat(descriptor)
        }
        return buf
      },
      []
    )
  },

  getDesignerFeatures: (node: TreeNode) => {
    return DESIGNER_BEHAVIORS_STORE.value.filter((pattern) =>
      pattern.selector(node)
    )
  },

  getDesignerIcon: (name: string) => {
    return DESIGNER_ICONS_STORE[name]
  },

  getDesignerLanguage: () => {
    return getISOCode(DESIGNER_LANGUAGE_STORE.value)
  },

  getDesignerMessage: (token: string, locales?: IDesignerLocales) => {
    const lang = getISOCode(DESIGNER_LANGUAGE_STORE.value)
    const locale = locales ? locales[lang] : DESIGNER_LOCALES_STORE.value[lang]
    if (!locale) {
      for (let key in DESIGNER_LOCALES_STORE.value) {
        const message = Path.getIn(
          DESIGNER_LOCALES_STORE.value[key],
          lowerSnake(token)
        )
        if (message) return message
      }
      return
    }
    return Path.getIn(locale, lowerSnake(token))
  },

  registerDesignerIcons: (map: IDesignerIcons) => {
    Object.assign(DESIGNER_ICONS_STORE, map)
  },

  registerDesignerLocales: (...packages: IDesignerLocales[]) => {
    packages.forEach((locales) => {
      mergeLocales(DESIGNER_LOCALES_STORE.value, locales)
    })
  },

  registerDesignerFeatures: (...packages: IDesignerFeatures[]) => {
    const results: IFeature[] = []
    packages.forEach((sources) => {
      reSortFeatures(results, sources)
    })
    if (results.length) {
      DESIGNER_BEHAVIORS_STORE.value = results
    }
  },
}

export type IDesignerRegistry = typeof DESIGNER_GlobalRegistry

export const GlobalRegistry: IDesignerRegistry = DESIGNER_GlobalRegistry
