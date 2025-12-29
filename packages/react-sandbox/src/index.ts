import React, { useRef, useEffect } from 'react'
import { isFn, globalThisPolyfill } from '@designable/shared'
import {
  useDesigner,
  useWorkspace,
  useLayout,
  usePrefix,
} from '@designable/react'
import { createRoot, Root } from 'react-dom/client'

export interface ISandboxProps {
  style?: React.CSSProperties
  cssAssets?: string[]
  jsAssets?: string[]
  scope?: any
}

export const useSandbox = (props: React.PropsWithChildren<ISandboxProps>) => {
  const ref = useRef<HTMLIFrameElement>(null)
  const appCls = usePrefix('app')
  const designer = useDesigner()
  const workspace = useWorkspace()
  const layout = useLayout()
  const cssAssets = props.cssAssets || []
  const jsAssets = props.jsAssets || []
  const getCSSVar = (name: string) => {
    const element = document.querySelector(`.${appCls}`)
    return element ? getComputedStyle(element).getPropertyValue(name) : ''
  }
  useEffect(() => {
    if (ref.current && workspace) {
      const styles = cssAssets
        ?.map?.((css) => {
          return `<link media="all" rel="stylesheet" href="${css}" />`
        })
        .join('\n')
      const scripts = jsAssets
        ?.map?.((js) => {
          return `<script src="${js}" type="text/javascript" ></script>`
        })
        .join('\n')
      if (ref.current.contentWindow) {
        const contentWindow = ref.current.contentWindow as any
        contentWindow['__DESIGNABLE_SANDBOX_SCOPE__'] = props.scope
        contentWindow['__DESIGNABLE_LAYOUT__'] = layout
        contentWindow['__DESIGNABLE_ENGINE__'] = designer
        contentWindow['__DESIGNABLE_WORKSPACE__'] = workspace
        contentWindow['Formily'] = (globalThisPolyfill as any)['Formily']
        contentWindow['Designable'] = (globalThisPolyfill as any)['Designable']
      }
      ref.current.contentDocument?.open()
      ref.current.contentDocument?.write(`
      <!DOCTYPE html>
        <head>
          ${styles}
        </head>
        <style>
          html{
            overflow: overlay;
          }
          ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
          }
          ::-webkit-scrollbar-thumb {
            background-color:${getCSSVar('--dn-scrollbar-color')};
            border-radius: 0;
            transition: all .25s ease-in-out;
          }
          ::-webkit-scrollbar-thumb:hover {
            background-color: ${getCSSVar('--dn-scrollbar-hover-color')};
          }
          body{
            margin:0;
            padding:0;
            overflow-anchor: none;
            user-select:none;
            background-color:${
              layout.theme === 'light' ? '#fff' : 'transparent'
            } !important;
          }
          html{
            overflow-anchor: none;
          }
          .inherit-cusor * {
            cursor: inherit !important;
          }
        </style>
        <body>
          <div id="__SANDBOX_ROOT__"></div>
          ${scripts}
        </body>
      </html>
      `)
      ref.current.contentDocument?.close()
    }
  }, [workspace])
  return ref
}

if (globalThisPolyfill.frameElement) {
  //解决iframe内嵌如果iframe被移除，内部React无法回收内存的问题
  let sandboxRoot: Root | null = null
  globalThisPolyfill.addEventListener('unload', () => {
    if (sandboxRoot) {
      sandboxRoot.unmount()
      sandboxRoot = null
    }
  })
  // Store root reference for cleanup
  ;(globalThisPolyfill as any)['__SANDBOX_ROOT_INSTANCE__'] = {
    setRoot: (root: Root) => { sandboxRoot = root },
    getRoot: () => sandboxRoot
  }
}

export const useSandboxScope = () => {
  return (globalThisPolyfill as any)['__DESIGNABLE_SANDBOX_SCOPE__']
}

export const renderSandboxContent = (render: (scope?: any) => React.ReactElement) => {
  if (isFn(render)) {
    const rootElement = document.getElementById('__SANDBOX_ROOT__')
    if (rootElement) {
      const rootInstance = (globalThisPolyfill as any)['__SANDBOX_ROOT_INSTANCE__']
      let root: Root
      
      if (rootInstance?.getRoot()) {
        root = rootInstance.getRoot()
      } else {
        root = createRoot(rootElement)
        if (rootInstance) {
          rootInstance.setRoot(root)
        }
      }
      
      root.render(render(useSandboxScope()))
    }
  }
}

export const Sandbox: React.FC<ISandboxProps> = (props) => {
  const { cssAssets, jsAssets, scope, style, ...iframeProps } = props
  return React.createElement('iframe', {
    ...iframeProps,
    ref: useSandbox(props),
    style: {
      height: '100%',
      width: '100%',
      border: 'none',
      display: 'block',
      ...style,
    },
  })
}
