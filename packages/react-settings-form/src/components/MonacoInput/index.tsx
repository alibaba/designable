import React, { useState, useRef, useEffect } from 'react'
import Editor, { EditorProps } from '@monaco-editor/react'
import { TextWidget, IconWidget, usePrefix, useTheme } from '@designable/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { Tooltip } from 'antd'
import { parseExpression, parse } from '@babel/parser'
import { uid } from '@designable/shared'
import { format } from './format'
import cls from 'classnames'
import './styles.less'
import './config'

type Monaco = typeof monaco
export interface MonacoInputProps extends EditorProps {
  extraLib?: string
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
  const theme = useTheme()
  const valueRef = useRef('')
  const validateRef = useRef(null)
  const monacoRef = useRef<Monaco>()
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
  const computedLanguage = useRef<string>(language || defaultLanguage)
  const realLanguage = useRef<string>('')
  const unmountedRef = useRef(false)
  const changedRef = useRef(false)
  const uidRef = useRef(uid())
  const prefix = usePrefix('monaco-input')
  const input = props.value || props.defaultValue

  useEffect(() => {
    unmountedRef.current = false
    return () => {
      unmountedRef.current = true
    }
  }, [])

  const isFileLanguage = () => {
    const lang = computedLanguage.current
    return lang === 'javascript' || lang === 'typescript'
  }

  const isExpLanguage = () => {
    const lang = computedLanguage.current
    return lang === 'javascript.expression' || lang === 'typescript.expression'
  }

  const renderHelper = () => {
    const getHref = () => {
      if (isFileLanguage()) {
        return 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript'
      }
      if (isExpLanguage()) {
        return 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators'
      }
    }
    const href = getHref()
    return (
      href && (
        <Tooltip
          title={
            <TextWidget token="SettingComponents.MonacoInput.helpDocument" />
          }
        >
          <div className={prefix + '-helper'}>
            <a target="_blank" href={href} rel="noreferrer">
              <IconWidget infer="Help" />
            </a>
          </div>
        </Tooltip>
      )
    )
  }

  const onMountHandler = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor
    monacoRef.current = monaco
    onMount?.(editor, monaco)
    const model = editor.getModel()
    const currentValue = editor.getValue()
    model['getLanguage'] = () => computedLanguage.current
    if (currentValue) {
      format(computedLanguage.current, currentValue).then((content) => {
        editor.setValue(content)
      })
    }
    if (props.extraLib) {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        props.extraLib,
        `${uidRef.current}.d.ts`
      )
    }
  }

  const validate = () => {
    if (realLanguage.current === 'typescript') {
      clearTimeout(validateRef.current)
      validateRef.current = setTimeout(() => {
        try {
          if (isFileLanguage()) {
            parse(valueRef.current, {
              plugins: ['typescript', 'jsx'],
            })
          } else if (isExpLanguage()) {
            parseExpression(valueRef.current, {
              plugins: ['typescript', 'jsx'],
            })
          }
          monacoRef.current.editor.setModelMarkers(
            editorRef.current.getModel(),
            computedLanguage.current,
            []
          )
          setErrors('')
          try {
            onChange?.(valueRef.current)
          } catch {}
        } catch (e) {
          monacoRef.current.editor.setModelMarkers(
            editorRef.current.getModel(),
            computedLanguage.current,
            [
              {
                code: '1003',
                severity: 8,
                startLineNumber: e.loc.line,
                startColumn: e.loc.column,
                endLineNumber: e.loc.line,
                endColumn: e.loc.column,
                message: e.message,
              },
            ]
          )
        }
      }, 200)
    } else {
      onChange?.(valueRef.current)
      setErrors('')
    }
  }

  const onValidateHandler = (markers: monaco.editor.IMarker[]) => {
    if (markers.length) {
      const marker = markers[0]
      setErrors(`[${marker.code}]: ${marker.message}`)
    }
  }

  const onChangeHandler = (value: string) => {
    changedRef.current = true
    valueRef.current = value
    validate()
  }
  computedLanguage.current = language || defaultLanguage
  realLanguage.current = /(?:javascript|typescript)/gi.test(
    computedLanguage.current
  )
    ? 'typescript'
    : computedLanguage.current

  return (
    <div className={cls(prefix, className)} style={{ width, height }}>
      {renderHelper()}
      <Editor
        {...props}
        theme={theme === 'dark' ? 'monokai' : 'chrome-devtools'}
        defaultLanguage={realLanguage.current}
        language={realLanguage.current}
        options={{
          ...props.options,
          tabSize: 2,
          scrollbar: {
            verticalScrollbarSize: 5,
            horizontalScrollbarSize: 5,
          },
          formatOnType: true,
        }}
        value={input}
        width="100%"
        height="100%"
        onMount={onMountHandler}
        onValidate={onValidateHandler}
        onChange={onChangeHandler}
      />
      {errors && (
        <div className={prefix + '-errors'}>
          <code>
            <pre>{errors}</pre>
          </code>
        </div>
      )}
    </div>
  )
}
