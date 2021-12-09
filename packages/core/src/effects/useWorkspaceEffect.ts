import { Designer } from '../models'
import { ICustomEvent } from '@designable/shared'
import { IDesignerContext } from '../types'
import { SelectNodeEvent } from '../events'

export const useWorkspaceEffect = (designer: Designer) => {
  designer.subscribeWith<ICustomEvent<any, IDesignerContext>>(
    [
      'append:node',
      'insert:after',
      'insert:before',
      'insert:children',
      'drag:node',
      'drop:node',
      'prepend:node',
      'remove:node',
      'select:node',
      'update:children',
      'wrap:node',
      'update:node:props',
    ],
    (event) => {
      if (event.context?.workbench) {
        designer.workbench.setActiveWorkspace(event.context.workspace)
      }
    }
  )
  designer.subscribeTo(SelectNodeEvent, (event) => {
    designer.workbench.eachWorkspace((workspace) => {
      if (workspace !== event.context.workspace) {
        workspace.operation.selection.clear()
      }
    })
  })
}
