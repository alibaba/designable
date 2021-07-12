import React, { useState, useRef, useEffect, useMemo } from 'react'
import Editor, { EditorProps } from '@monaco-editor/react'
import { TextWidget, IconWidget, usePrefix, useTheme } from '@designable/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { observable } from '@formily/reactive'
import { Observer } from '@formily/reactive-react'
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
  const [loaded, setLoaded] = useState(false)
  const theme = useTheme()
  const valueRef = useRef('')
  const validateRef = useRef(null)
  const submitRef = useRef(null)
  const extraLibRef = useRef<monaco.IDisposable>(null)
  const monacoRef = useRef<Monaco>()
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
  const computedLanguage = useRef<string>(language || defaultLanguage)
  const realLanguage = useRef<string>('')
  const unmountedRef = useRef(false)
  const changedRef = useRef(false)
  const uidRef = useRef(uid())
  const prefix = usePrefix('monaco-input')
  const input = props.value || props.defaultValue

  const errors = useMemo(() => observable.ref(''), [])

  useEffect(() => {
    unmountedRef.current = false
    return () => {
      if (extraLibRef.current) {
        extraLibRef.current.dispose()
      }
      unmountedRef.current = true
    }
  }, [])

  useEffect(() => {
    if (monacoRef.current && props.extraLib) {
      updateExtraLib()
    }
  }, [props.extraLib])

  const updateExtraLib = () => {
    if (extraLibRef.current) {
      extraLibRef.current.dispose()
    }
    extraLibRef.current =
      monacoRef.current.languages.typescript.typescriptDefaults.addExtraLib(
        props.extraLib,
        `${uidRef.current}.d.ts`
      )
  }

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
      format(computedLanguage.current, currentValue)
        .then((content) => {
          editor.setValue(content)
          setLoaded(true)
        })
        .catch(() => {
          setLoaded(true)
        })
    } else {
      setLoaded(true)
    }
    if (props.extraLib) {
      updateExtraLib()
    }
  }

  const submit = () => {
    clearTimeout(submitRef.current)
    submitRef.current = setTimeout(() => {
      onChange?.(valueRef.current)
    }, 1000)
  }

  const validate = () => {
    if (realLanguage.current === 'typescript') {
      clearTimeout(validateRef.current)
      validateRef.current = setTimeout(() => {
        try {
          if (valueRef.current) {
            if (isFileLanguage()) {
              parse(valueRef.current, {
                sourceType: 'module',
                plugins: ['typescript', 'jsx'],
              })
            } else if (isExpLanguage()) {
              parseExpression(valueRef.current, {
                plugins: ['typescript', 'jsx'],
              })
            }
          }
          monacoRef.current.editor.setModelMarkers(
            editorRef.current.getModel(),
            computedLanguage.current,
            []
          )
          errors.value = ''
          submit()
        } catch (e) {
          errors.value = e.message
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
      }, 240)
    } else {
      submit()
      errors.value = ''
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
    <div
      className={cls(prefix, className, {
        loaded,
      })}
      style={{ width, height }}
    >
      {renderHelper()}
      <Editor
        {...props}
        theme={theme === 'dark' ? 'monokai' : 'chrome-devtools'}
        defaultLanguage={realLanguage.current}
        language={realLanguage.current}
        options={{
          ...props.options,
          tabSize: 2,
          smoothScrolling: true,
          scrollbar: {
            verticalScrollbarSize: 5,
            horizontalScrollbarSize: 5,
            alwaysConsumeMouseWheel: false,
          },
        }}
        value={input}
        width="100%"
        height="100%"
        onMount={onMountHandler}
        onChange={onChangeHandler}
      />
      <Observer>
        {() =>
          errors.value && (
            <div className={prefix + '-errors'}>
              <code>
                <pre>{errors.value}</pre>
              </code>
            </div>
          )
        }
      </Observer>
    </div>
  )
}
