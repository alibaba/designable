import { each } from '@designable/shared'
import { Path } from '@formily/path'
import { observable } from '@formily/reactive'
import {
  IDesignerMetadataStore,
  IDesignerIconsStore,
  IDesignerLocaleStore,
  IDesignerLanguageStore,
  IDesignerMetadatas,
  IDesignerLocales,
  IDesignerIcons,
  IMetadataLike,
  IMetadata,
} from './types'
import { mergeLocales, lowerSnake, getBrowserLanguage } from './internals'
import { isMetadataHost } from './externals'
import { TreeNode } from './models'
import { isMetadataList } from './externals'

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

const reSortMetadatas = (target: IMetadata[], sources: IDesignerMetadatas) => {
  const findTargetMetadata = (behavior: IMetadata) => target.includes(behavior)
  const findSourceMetadata = (name: string) => {
    for (let key in sources) {
      const { Metadata } = sources[key]
      for (let i = 0; i < Metadata.length; i++) {
        if (Metadata[i].name === name) return Metadata[i]
      }
    }
  }
  each(sources, (item) => {
    if (!item) return
    if (!isMetadataHost(item)) return
    const { Metadata } = item
    each(Metadata, (behavior) => {
      if (findTargetMetadata(behavior)) return
      const name = behavior.name
      each(behavior.extends, (dep) => {
        const behavior = findSourceMetadata(dep)
        if (!behavior)
          throw new Error(`No ${dep} behavior that ${name} depends on`)
        if (!findTargetMetadata(behavior)) {
          target.unshift(behavior)
        }
      })
      target.push(behavior)
    })
  })
}

const DESIGNER_BEHAVIORS_STORE: IDesignerMetadataStore = observable.ref([])

const DESIGNER_ICONS_STORE: IDesignerIconsStore = observable.ref({})

const DESIGNER_LOCALES_STORE: IDesignerLocaleStore = observable.ref({})

const DESIGNER_LANGUAGE_STORE: IDesignerLanguageStore = observable.ref(
  getBrowserLanguage()
)

const DESIGNER_GlobalRegistry = {
  setDesignerLanguage: (lang: string) => {
    DESIGNER_LANGUAGE_STORE.value = lang
  },

  setDesignerMetadatas: (behaviors: IMetadataLike[]) => {
    DESIGNER_BEHAVIORS_STORE.value = behaviors.reduce<IMetadata[]>(
      (buf, behavior) => {
        if (isMetadataHost(behavior)) {
          return buf.concat(behavior.Metadata)
        } else if (isMetadataList(behavior)) {
          return buf.concat(behavior)
        }
        return buf
      },
      []
    )
  },

  getDesignerMetadatas: (node: TreeNode) => {
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

  registerDesignerMetadatas: (...packages: IDesignerMetadatas[]) => {
    const results: IMetadata[] = []
    packages.forEach((sources) => {
      reSortMetadatas(results, sources)
    })
    if (results.length) {
      DESIGNER_BEHAVIORS_STORE.value = results
    }
  },
}

export type IDesignerRegistry = typeof DESIGNER_GlobalRegistry

export const GlobalRegistry: IDesignerRegistry = DESIGNER_GlobalRegistry
