import React, { useRef, useEffect } from 'react'
import { isFn, globalThisPolyfill } from '@designable/shared'
import {
  useDesigner,
  useWorkspace,
  useLayout,
  usePrefix,
} from '@designable/react'
import ReactDOM from 'react-dom'

export interface ISandboxProps {
  style?: React.CSSProperties
  cssAssets?: string[]
  jsAssets?: string[]
  scope?: any
}

export const useSandbox = (props: React.PropsWithChildren<ISandboxProps>) => {
  const ref = useRef<HTMLIFrameElement>()
  const appCls = usePrefix('app')
  const designer = useDesigner()
  const workspace = useWorkspace()
  const layout = useLayout()
  const cssAssets = props.cssAssets || []
  const jsAssets = props.jsAssets || []
  const getCSSVar = (name: string) => {
    return getComputedStyle(
      document.querySelector(`.${appCls}`)
    ).getPropertyValue(name)
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
      ref.current.contentWindow['__DESIGNABLE_SANDBOX_SCOPE__'] = props.scope
      ref.current.contentWindow['__DESIGNABLE_LAYOUT__'] = layout
      ref.current.contentWindow['__DESIGNABLE_ENGINE__'] = designer
      ref.current.contentWindow['__DESIGNABLE_WORKSPACE__'] = workspace
      ref.current.contentWindow['Formily'] = globalThisPolyfill['Formily']
      ref.current.contentWindow['Designable'] = globalThisPolyfill['Designable']
      ref.current.contentDocument.open()
      ref.current.contentDocument.write(`
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
      ref.current.contentDocument.close()
    }
  }, [workspace])
  return ref
}

if (globalThisPolyfill.frameElement) {
  //解决iframe内嵌如果iframe被移除，内部React无法回收内存的问题
  globalThisPolyfill.addEventListener('unload', () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('__SANDBOX_ROOT__'))
  })
}

export const useSandboxScope = () => {
  return globalThisPolyfill['__DESIGNABLE_SANDBOX_SCOPE__']
}

export const renderSandboxContent = (render: (scope?: any) => JSX.Element) => {
  if (isFn(render)) {
    ReactDOM.render(
      render(useSandboxScope()),
      document.getElementById('__SANDBOX_ROOT__')
    )
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
