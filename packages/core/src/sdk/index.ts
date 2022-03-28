export { default as mitt, Handler } from './utils/mitt'
import { useMemo } from 'react'
import PageSDK from './core/Page'
import LayoutSDK from './core/Layout'
import {
  createForm,
  onFieldInit,
  onFieldValueChange,
  onFormMount,
  onFormInit,
  onFormUnmount,
  onFieldInputValueChange,
  onFieldValidateStart,
  onFieldValidateFailed,
  onFieldValidateEnd,
  onFieldValidateSuccess,
} from '@formily/core'
import { markRaw } from '@formily/reactive'
import { IPageInbiz } from './inbiz'

import { ICallBackEvents, ICode } from './core/Base'

type IPageProps = Omit<ConstructorParameters<typeof PageSDK>[0], 'form'> & {
  defaultValueFormates?: {
    [key: string]: (props: object, inbiz: PageSDK['inbiz']) => unknown
  }
  code?: ICode
  callBackEvents?: ICallBackEvents
  saveRequest?: (param: object) => Promise<string>
}
export const usePage = (props: IPageProps, initial: boolean) => {
  const sdk = useMemo(() => new PageSDK({ ...props }), [])
  const form = useMemo(() => {
    if (initial) {
      const form = createForm({
        effects() {
          onFormInit(() => {
            sdk.runCssCode()
          })
          onFieldInit('*', (field) => {
            //props 数据处理
            field.componentProps.title = field.title
            if (typeof field.title === 'object') {
              field.title = field.title.status ? field.title.value : undefined
            }

            field.componentProps.inbiz = markRaw(sdk.inbiz)
            field.componentProps.ref = sdk.formilyRef()
            field.componentProps.callBackEvents = markRaw({})
            field.data = {
              event: sdk.createMitt(field.path.entire as string),
            }

            field.componentProps.emit = field.data.event.emit

            // 默认值需要转换的处理
            if ('initialValue' in field && field.componentType) {
              field.initialValue =
                sdk.initialValues?.[field.componentProps?.model?.Name]
              if (
                field.initialValue === undefined &&
                props.defaultValueFormates?.[field.componentType]
              ) {
                field.initialValue = props.defaultValueFormates[
                  field.componentType
                ](field.componentProps, sdk.inbiz)
              }
            }
            if ('value' in field) {
              field.componentProps.onFocus = (...arg: any) => {
                field.onFocus()
                field.data?.event?.emit('onFocus', ...arg)
              }
              field.componentProps.onBlur = (...arg: any) => {
                field.onBlur()
                field.data?.event?.emit('onBlur', ...arg)
              }
            }
          }),
            onFieldValueChange('*', (field) => {
              field.data?.event?.emit('onchange', field.value)
            })
          onFieldInputValueChange('*', (field) => {
            field.data?.event?.emit('onInput', field.value)
          })
          onFieldValidateStart('*', (field) => {
            field.data?.event?.emit('onValidateStart')
          })
          onFieldValidateFailed('*', (field) => {
            field.data?.event?.emit('onValidateFailed')
          })
          onFieldValidateEnd('*', (field) => {
            field.data?.event?.emit('onValidateEnd')
          })
          onFieldValidateSuccess('*', (field) => {
            field.data?.event?.emit('onValidateSuccess')
          })
          onFormMount(() => {
            sdk.runScriptCode()
          })
          onFormUnmount(() => {
            sdk.destroy()
          })
        },
      })
      sdk.setForm(form)
      return form
    } else {
      return createForm({})
    }
  }, [initial])

  return [sdk, form] as const
}

export const useLayout = (props: ConstructorParameters<typeof PageSDK>[0]) => {
  const sdk = useMemo(() => {
    return new LayoutSDK(props)
  }, [])
  return [sdk] as const
}

export type inbiz = IPageInbiz
export { ICallBackEvents }
