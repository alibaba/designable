import { isFn, isArr } from '@designable/shared'
import { untracked } from '@formily/reactive'
import { DEFAULT_DRIVERS, DEFAULT_EFFECTS, DEFAULT_SHORTCUTS } from './presets'
import { Designer, TreeNode } from './models'
import {
  IDesignerProps,
  IResourceCreator,
  IFeatureFactory,
  IDesignerLocales,
  IResource,
  IFeature,
  IFeatureHost,
  IResourceHost,
} from './types'
import { mergeLocales } from './internals'

export const isFeatureHost = (val: any): val is IFeatureHost =>
  val?.Feature && isFeatureList(val.Feature)

export const isFeatureList = (val: any): val is IFeature[] =>
  Array.isArray(val) && val.every(isFeature)

export const isFeature = (val: any): val is IFeature =>
  isFn(val?.selector) && (!!val?.descriptor || !!val?.locales)

export const isResourceHost = (val: any): val is IResourceHost =>
  val?.Resource && isResourceList(val.Resource)

export const isResourceList = (val: any): val is IResource[] =>
  Array.isArray(val) && val.every(isResource)

export const isResource = (val: any): val is IResource =>
  val?.node && !!val.node.isSourceNode && val.node instanceof TreeNode

export const createLocales = (...packages: IDesignerLocales[]) => {
  const results = {}
  packages.forEach((locales) => {
    mergeLocales(results, locales)
  })
  return results
}

export const createFeature = (
  ...descriptors: Array<IFeatureFactory | IFeatureFactory[]>
): IFeature[] => {
  return descriptors.reduce((buf: any[], descriptor) => {
    if (isArr(descriptor)) return buf.concat(createFeature(...descriptor))
    const { selector } = descriptor || {}
    if (!selector) return buf
    if (typeof selector === 'string') {
      descriptor.selector = (node) => node.componentName === selector
    }
    return buf.concat(descriptor)
  }, [])
}

export const createResource = (...sources: IResourceCreator[]): IResource[] => {
  return sources.reduce((buf, source) => {
    return buf.concat({
      ...source,
      node: new TreeNode({
        componentName: '$$ResourceNode$$',
        isSourceNode: true,
        children: source.elements || [],
      }),
    })
  }, [])
}

export const createDesigner = (props: IDesignerProps<Designer> = {}) => {
  const drivers = props.drivers || []
  const effects = props.effects || []
  const shortcuts = props.shortcuts || []
  return untracked(
    () =>
      new Designer({
        ...props,
        effects: [...effects, ...DEFAULT_EFFECTS],
        drivers: [...drivers, ...DEFAULT_DRIVERS],
        shortcuts: [...shortcuts, ...DEFAULT_SHORTCUTS],
      })
  )
}
