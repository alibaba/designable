import React, { FC, useEffect } from 'react'
import {
  // 类型
  IDesignerComponents,
  ToolbarPanel,
  DesignerToolsWidget,
  ViewToolsWidget,
  // hooks
  useDesigner,
  usePrefix,
  useHover,
} from '@inbiz/react'
import { BasicWorkplace } from '../BasicWorkplace'
import { observer } from '@formily/reactive-react'
interface TopBottomFixedType {
  components: IDesignerComponents
}
export const TopBottomFixed: FC<TopBottomFixedType> = observer((props) => {
  const { components } = props
  const designer = useDesigner()
  const hover = useHover()
  useEffect(() => {
    const workspace1 = designer.workbench.findWorkspaceById('content')
    designer.workbench.switchWorkspace('content')
    workspace1.operation.selection.select(workspace1.operation.tree.id)
  }, [])

  return (
    <div className={usePrefix('layout')}>
      <BasicWorkplace id="top" components={components} />
      <BasicWorkplace id="content" flexable={'true'} components={components} />
      <BasicWorkplace id="bottom" components={components} />
    </div>
  )
})
