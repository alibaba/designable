import { each } from '@designable/shared'
import { Path } from '@formily/path'
import { observable } from '@formily/reactive'
import {
  IDesignerBehaviorStore,
  IDesignerIconsStore,
  IDesignerLocaleStore,
  IDesignerLanguageStore,
  IDesignerBehaviors,
  IDesignerLocales,
  IDesignerIcons,
  IBehaviorLike,
  IBehavior,
} from './types'
import { mergeLocales, lowerSnake, getBrowserLanguage } from './internals'
import { isBehaviorHost } from './externals'
import { TreeNode } from './models'
import { isBehaviorList } from './externals'

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

const reSortBehaviors = (target: IBehavior[], sources: IDesignerBehaviors) => {
  const findTargetBehavior = (behavior: IBehavior) => target.includes(behavior)
  const findSourceBehavior = (name: string) => {
    for (let key in sources) {
      const { Behavior } = sources[key]
      for (let i = 0; i < Behavior.length; i++) {
        if (Behavior[i].name === name) return Behavior[i]
      }
    }
  }
  each(sources, (item) => {
    if (!item) return
    if (!isBehaviorHost(item)) return
    const { Behavior } = item
    each(Behavior, (behavior) => {
      if (findTargetBehavior(behavior)) return
      const name = behavior.name
      each(behavior.extends, (dep) => {
        const behavior = findSourceBehavior(dep)
        if (!behavior)
          throw new Error(`No ${dep} behavior that ${name} depends on`)
        if (!findTargetBehavior(behavior)) {
          target.unshift(behavior)
        }
      })
      target.push(behavior)
    })
  })
}

const DESIGNER_BEHAVIORS_STORE: IDesignerBehaviorStore = observable.ref([])

const DESIGNER_ICONS_STORE: IDesignerIconsStore = observable.ref({})

const DESIGNER_LOCALES_STORE: IDesignerLocaleStore = observable.ref({})

const DESIGNER_LANGUAGE_STORE: IDesignerLanguageStore = observable.ref(
  getBrowserLanguage()
)

const DESIGNER_GlobalRegistry = {
  setDesignerLanguage: (lang: string) => {
    DESIGNER_LANGUAGE_STORE.value = lang
  },

  setDesignerBehaviors: (behaviors: IBehaviorLike[]) => {
    DESIGNER_BEHAVIORS_STORE.value = behaviors.reduce<IBehavior[]>(
      (buf, behavior) => {
        if (isBehaviorHost(behavior)) {
          return buf.concat(behavior.Behavior)
        } else if (isBehaviorList(behavior)) {
          return buf.concat(behavior)
        }
        return buf
      },
      []
    )
  },

  getDesignerBehaviors: (node: TreeNode) => {
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

  registerDesignerBehaviors: (...packages: IDesignerBehaviors[]) => {
    const results: IBehavior[] = []
    packages.forEach((sources) => {
      reSortBehaviors(results, sources)
    })
    if (results.length) {
      DESIGNER_BEHAVIORS_STORE.value = results
    }
  },
}

export type IDesignerRegistry = typeof DESIGNER_GlobalRegistry

export const GlobalRegistry: IDesignerRegistry = DESIGNER_GlobalRegistry
