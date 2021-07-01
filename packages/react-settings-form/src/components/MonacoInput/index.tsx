import React, { useState, useEffect, useRef } from 'react'
import Editor, { EditorProps } from '@monaco-editor/react'
import { usePrefix, useTheme } from '@designable/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { registerExpression } from './expression'
import { format } from './format'
import chromeTheme from './themes/chrome'
import monokaiTheme from './themes/monokai'
import cls from 'classnames'
import './styles.less'

export interface MonacoInputProps extends EditorProps {
  onChange?: (value: string) => void
}

export const MonacoInput: React.FC<MonacoInputProps> = ({
  className,
  language,
  defaultLanguage,
  width,
  height,
  onMount,
  onChange,
  ...props
}) => {
  const [errors, setErrors] = useState('')
  const [mounted, setMounted] = useState(false)
  const input = props.value || props.defaultValue
  const [value, setValue] = useState(input)
  const theme = useTheme()
  const valueRef = useRef('')
  const monacoRef = useRef<typeof monaco>()
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
  const prefix = usePrefix('monaco-input')
  useEffect(() => {
    if (input !== undefined) {
      format(input, language || defaultLanguage).then(
        (prettyCode) => {
          setValue(prettyCode)
        },
        (e) => {
          console.error(e)
        }
      )
    }
  }, [input])

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(
        theme === 'dark' ? 'monokai' : 'chrome-devtools'
      )
    }
  }, [theme, mounted])

  valueRef.current = value

  return (
    <div className={cls(prefix, className)} style={{ width, height }}>
      <Editor
        {...props}
        defaultLanguage={defaultLanguage}
        language={language}
        value={value}
        width="100%"
        height="100%"
        onMount={(editor, monaco) => {
          monacoRef.current = monaco
          editorRef.current = editor
          onMount?.(editor, monaco)
          registerExpression(language, editor, monaco)
          monaco.editor.defineTheme('monokai', monokaiTheme as any)
          monaco.editor.defineTheme('chrome-devtools', chromeTheme as any)
          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.Latest,
            allowNonTsExtensions: true,
            moduleResolution:
              monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monaco.languages.typescript.ModuleKind.CommonJS,
            noEmit: true,
            esModuleInterop: true,
            jsx: monaco.languages.typescript.JsxEmit.React,
            reactNamespace: 'React',
            allowJs: true,
          })

          monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
          })
          setMounted(true)
        }}
        onValidate={(markers) => {
          if (markers.length) {
            const marker = markers[0]
            setErrors(
              `[${marker.code}]: ${marker.message}  ${marker.startLineNumber}:${marker.startColumn}`
            )
          } else {
            setErrors('')
            onChange?.(value)
          }
        }}
        onChange={(value) => {
          valueRef.current = value
        }}
      />
      {errors && <div className={prefix + '-errors'}>{errors}</div>}
    </div>
  )
}
