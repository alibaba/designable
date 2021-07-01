import React, { useState, useEffect, useRef } from 'react'
import Editor, { EditorProps } from '@monaco-editor/react'
import { usePrefix, useTheme } from '@designable/react'
import { registerExpression } from './expression'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import cls from 'classnames'
import { format } from './format'
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
  const input = props.value || props.defaultValue
  const [value, setValue] = useState(input)
  const theme = useTheme()
  const valueRef = useRef('')
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
  const prefix = usePrefix('monaco-input')
  useEffect(() => {
    if (input !== undefined) {
      format(input, language || defaultLanguage).then(
        (prettyCode) => {
          setValue(prettyCode)
        },
        (e) => {
          setErrors(e?.message)
        }
      )
    }
  }, [input])
  valueRef.current = value

  return (
    <div className={cls(prefix, className)} style={{ width, height }}>
      <Editor
        {...props}
        defaultLanguage={defaultLanguage}
        language={language}
        theme={theme === 'dark' ? 'vs-dark' : 'vs'}
        value={value}
        width="100%"
        height="100%"
        onMount={(editor, monaco) => {
          editorRef.current = editor
          onMount?.(editor, monaco)
          registerExpression(language, editor, monaco)
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
