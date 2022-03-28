import Base from './Base'
import { IPageInbiz } from '../inbiz'

class Page extends Base {
  sdkType: 'page'
  inbiz: IPageInbiz
  workFlow: { [key: string]: any } = {} // 流程数据
  initialValues: { [key: string]: any } = {}
  model: { ModelKey: string }
  globalSDK: any
  saveRequest: (param: object) => Promise<string>
  callBackEvents: {
    onBeforeSubmit?: <T extends Object>(
      data: T
    ) => boolean | Promise<boolean> | T
    onRequest?: (data: Object) => Promise<string>
  } = {}
  constructor({ saveRequest, ...other }: any) {
    super(other)
    this.saveRequest = saveRequest
  }
  setWorkFlow(workFlow: object) {
    Object.assign(this.workFlow, workFlow)
  }
  setInitialValues(initialValues) {
    this.initialValues = initialValues
  }
  setModel(model) {
    this.model = model
  }
}

export default Page
