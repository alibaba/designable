import React, { useState, useEffect, useRef } from 'react'
import Editor, { EditorProps } from '@monaco-editor/react'
import { usePrefix, useTheme } from '@designable/react'
import { registerExpression } from './expression'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
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
  const [value, setValue] = useState(props.value || props.defaultValue)
  const theme = useTheme()
  const valueRef = useRef('')
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
  const prefix = usePrefix('monaco-input')
  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value)
    }
  }, [props.value])
  valueRef.current = value

  const getValue = (value: any) => {
    const lang = language || defaultLanguage
    if (lang === 'json' || lang === 'JSON') {
      try {
        return JSON.stringify(JSON.parse(value), null, 2)
      } catch (e) {
        setErrors(e?.message)
      }
    } else {
      return value
    }
  }

  return (
    <div className={cls(prefix, className)} style={{ width, height }}>
      <Editor
        {...props}
        defaultLanguage={defaultLanguage}
        language={language}
        theme={theme === 'dark' ? 'vs-dark' : 'vs'}
        value={getValue(value)}
        width="100%"
        height="100%"
        onMount={(editor, monaco) => {
          editorRef.current = editor
          onMount?.(editor, monaco)
          if (
            language === 'javascript.expression' ||
            language === 'typescript.expression'
          ) {
            registerExpression(language, editor, monaco)
          }
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
