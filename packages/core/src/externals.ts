import { isFn, isArr } from '@designable/shared'
import { untracked } from '@formily/reactive'
import { DEFAULT_DRIVERS, DEFAULT_EFFECTS, DEFAULT_SHORTCUTS } from './presets'
import { Designer, TreeNode } from './models'
import {
  IDesignerProps,
  IResourceCreator,
  IMetadataCreator,
  IDesignerLocales,
  IResource,
  IMetadata,
  IMetadataHost,
  IResourceHost,
} from './types'
import { mergeLocales } from './internals'

export const isMetadataHost = (val: any): val is IMetadataHost =>
  val?.Metadata && isMetadataList(val.Metadata)

export const isMetadataList = (val: any): val is IMetadata[] =>
  Array.isArray(val) && val.every(isMetadata)

export const isMetadata = (val: any): val is IMetadata =>
  isFn(val?.selector) && (!!val?.behavior || !!val?.locales)

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

export const createMetadata = (
  ...behaviors: Array<IMetadataCreator | IMetadataCreator[]>
): IMetadata[] => {
  return behaviors.reduce((buf: any[], behavior) => {
    if (isArr(behavior)) return buf.concat(createMetadata(...behavior))
    const { selector } = behavior || {}
    if (!selector) return buf
    if (typeof selector === 'string') {
      behavior.selector = (node) => node.componentName === selector
    }
    return buf.concat(behavior)
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
