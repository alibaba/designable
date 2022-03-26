import type { IBaseInbiz } from './index'
import Page from '../core/Page'
import { message } from 'antd'
// import {saveData} from '@inbiz/components/common/RenderPage/server'
export default function (this: Page, inbiz: IBaseInbiz) {
  const getValue = () => this.form.getValuesIn('*')
  const isValid = () => this.form.validate()
  const reset = () => this.form.reset()
  const getModelValue = (isCheckLength?: boolean) => {
    const value = getValue()
    const postData = {}
    const errorData = []
    Object.keys(value).forEach((key) => {
      const field = this.form.query(key).take()
      const model = field.componentProps?.model
      const name = model?.Name

      if (typeof value[key] === 'object') {
        value[key] = Object.keys(value[key]).length
          ? JSON.stringify(value[key])
          : ''
      }

      if (name && this.initialValues[name] !== value[key]) {
        // 值不存在是，进行转换
        if (value[key] === undefined) {
          value[key] = model?.Type == 'integer' ? null : ''
        }
        postData[name] = value[key]
        if (
          isCheckLength &&
          model?.Length &&
          value[key]?.length &&
          value[key].length > model.Length
        ) {
          errorData.push({
            title: field.title,
            length: model.Length,
            value: value[key],
          })
        }
      }
    })
    if (errorData.length) {
      console.error('控件数据长度，超过数据库限制', errorData)
      return [true, errorData] as const
    }
    return [undefined, postData] as const
  }
  return {
    queryData: Object.assign(
      inbiz?.router?.location?.query || {},
      this.queryData
    ),
    workFlow: this.workFlow,
    getGlobalSDK: () => {
      return this.globalSDK
    },
    isValid,
    getValue,
    getModelValue,
    reset,
    submit: async (batch: boolean) => {
      await isValid()
      const [erorr, values] = getModelValue(true)
      if (erorr) {
        message.error(
          `${values[0].title}控件数据长度，超过数据库限制“${values[0].length}”`
        )
        return Promise.reject({ code: 1 })
      }
      if (!this.model?.ModelKey) {
        message.error(`未配置页面模型，表单提交失效'`)
        return Promise.reject({ code: 2 })
      }
      let postData = {
        webSiteId: this.appInfo.appId,
        modelKey: this.model.ModelKey,
        columns: values,
        id: this.queryData.id,
      }
      const { onBeforeSubmit, onRequest } = this.callBackEvents
      if (onBeforeSubmit) {
        const result = await onBeforeSubmit(postData)
        if (result === false) {
          return
        } else if (typeof result === 'object') {
          postData = result
        }
      }
      let res
      if (onRequest) {
        res = await onRequest(postData)
      } else {
        res = await this.saveRequest(postData)
      }
      inbiz.emit('onSaveData', postData, res)
      const pageValue = getValue()

      if (res && !batch) {
        message.success('提交成功')
        reset()
      }
      return { id: res, pageValue, modelValue: values }
    },
    getSDK: () => {
      return this
    },
  }
}
