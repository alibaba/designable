export interface ILoadScriptProps {
  package: string
  entry: string
  root: string
  base?: string
}

export const loadScript = async (props: ILoadScriptProps) => {
  const options: ILoadScriptProps = {
    base: '//cdn.jsdelivr.net/npm',
    ...props,
  }
  if (window[props.root]) return window[options.root]
  const path = `${options.base}/${options.package}/${options.entry}`
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = false
    script.src = path
    script.onload = () => {
      const module = window[options.root]
      window['define'] = define
      resolve(module)
      script.remove()
    }
    script.onerror = (err) => {
      reject(err)
    }
    const define = window['define']
    window['define'] = undefined
    document.body.appendChild(script)
  })
}
