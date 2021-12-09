import { IEventProps, Event } from '@designable/shared'
import { ISchema } from '@formily/json-schema'
import {
  Designer,
  ITreeNode,
  ScreenType,
  Shortcut,
  Viewport,
  Workbench,
  Workspace,
  TreeNode,
} from './models'

export type IDesignerProps<T = Event> = IEventProps<T> & {
  shortcuts?: Shortcut[]
  sourceIdAttrName?: string //拖拽源Id的dom属性名
  nodeIdAttrName?: string //节点Id的dom属性名
  contentEditableAttrName?: string //原地编辑属性名
  contentEditableNodeIdAttrName?: string //原地编辑指定Node Id属性名
  clickStopPropagationAttrName?: string //点击阻止冒泡属性
  outlineNodeIdAttrName?: string //大纲树节点ID的dom属性名
  nodeSelectionIdAttrName?: string //节点工具栏属性名
  nodeDragHandlerAttrName?: string //节点拖拽手柄属性名
  nodeResizeHandlerAttrName?: string //节点尺寸拖拽手柄属性名
  defaultComponentTree?: ITreeNode //默认组件树
  defaultScreenType?: ScreenType
  rootComponentName?: string
}

export type IDesignerContext = {
  workspace: Workspace
  workbench: Workbench
  designer: Designer
  viewport: Viewport
}

export type IResizable = {
  width?: (
    node: TreeNode,
    element: Element
  ) => {
    plus: () => void
    minus: () => void
  }
  height?: (
    node: TreeNode,
    element: Element
  ) => {
    plus: () => void
    minus: () => void
  }
}

export interface IDesignerNodeProps {
  package?: string //npm包名
  registry?: string //web npm注册平台地址
  version?: string //semver版本号
  path?: string //组件模块路径
  title?: string //标题
  description?: string //描述
  icon?: string //icon
  droppable?: boolean //是否可作为拖拽容器，默认为true
  draggable?: boolean //是否可拖拽，默认为true
  deletable?: boolean //是否可删除，默认为true
  cloneable?: boolean //是否可拷贝，默认为true
  resizable?: IResizable
  inlineChildrenLayout?: boolean //子节点内联，用于指定复杂布局容器，强制内联
  selfRenderChildren?: boolean //是否自己渲染子节点
  propsSchema?: ISchema //Formily JSON Schema
  defaultProps?: any //默认属性
  getDragNodes?: (node: TreeNode) => TreeNode | TreeNode[] //拦截转换Drag节点
  getDropNodes?: (node: TreeNode, parent: TreeNode) => TreeNode | TreeNode[] //拦截转换Drop节点
  getComponentProps?: (node: TreeNode) => any //拦截属性
  allowAppend?: (target: TreeNode, sources?: TreeNode[]) => boolean
  allowSiblings?: (target: TreeNode, sources?: TreeNode[]) => boolean
  allowDrop?: (target: TreeNode) => boolean
  [key: string]: any
}

export type IDesignerBehavior =
  | IDesignerNodeProps
  | ((node: TreeNode) => IDesignerNodeProps)

export interface IDesignerLocales {
  [ISOCode: string]: {
    [key: string]: any
  }
}

export interface IDesignerMiniLocales {
  [ISOCode: string]: string
}

export interface IDesignerMetadatas {
  [key: string]: IMetadataHost
}

export interface IDesignerStore<P> {
  value: P
}

export type IDesignerIcons = Record<string, any>

export type IDesignerIconsStore = IDesignerStore<IDesignerIcons>
export type IDesignerLocaleStore = IDesignerStore<IDesignerLocales>
export type IDesignerMetadataStore = IDesignerStore<IMetadata[]>
export type IDesignerLanguageStore = IDesignerStore<string>

export type WorkbenchTypes =
  | 'DESIGNABLE'
  | 'PREVIEW'
  | 'JSONTREE'
  | 'MARKUP'
  | (string & {})

export interface IMetadata {
  name: string
  extends?: string[]
  selector: (node: TreeNode) => boolean
  behavior?: IDesignerBehavior
  locales?: IDesignerLocales
}

export interface IMetadataCreator {
  name: string
  extends?: string[]
  selector: string | ((node: TreeNode) => boolean)
  behavior?: IDesignerBehavior
  locales?: IDesignerLocales
}

export interface IMetadataHost {
  Metadata?: IMetadata[]
}

export type IMetadataLike = IMetadata[] | IMetadataHost

export interface IResource {
  title?: string | IDesignerMiniLocales
  description?: string | IDesignerMiniLocales
  icon?: any
  thumb?: string
  span?: number
  node?: TreeNode
}

export interface IResourceHost {
  Resource?: IResource[]
}

export type IResourceLike = IResource[] | IResourceHost
export interface IResourceCreator {
  title?: string | IDesignerMiniLocales
  description?: string | IDesignerMiniLocales
  icon?: any
  thumb?: string
  span?: number
  elements?: ITreeNode[]
}
