import { getNpmCDNRegistry } from '../registry'
import { globalThisPolyfill } from '@designable/shared'
export interface ILoadScriptProps {
  package: string
  entry: string
  root: string
  base?: string
}

export const loadScript = async (props: ILoadScriptProps) => {
  const options: ILoadScriptProps = {
    base: getNpmCDNRegistry(),
    ...props,
  }
  if (globalThisPolyfill[props.root]) return globalThisPolyfill[options.root]
  const path = `${options.base}/${options.package}/${options.entry}`
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = false
    script.src = path
    script.onload = () => {
      const module = globalThisPolyfill[options.root]
      globalThisPolyfill['define'] = define
      resolve(module)
      script.remove()
    }
    script.onerror = (err) => {
      reject(err)
    }
    const define = globalThisPolyfill['define']
    globalThisPolyfill['define'] = undefined
    document.body.appendChild(script)
  })
}
