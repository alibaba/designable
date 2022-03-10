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
} from '@inbiz/react'
import { BasicWorkplace } from '../BasicWorkplace'
import { observer } from '@formily/reactive-react'
interface TopLeftBottomFixedType {
  components: IDesignerComponents
}
export const TopLeftBottomFixed: FC<TopLeftBottomFixedType> = observer(
  (props) => {
    const { components } = props
    const designer = useDesigner()
    useEffect(() => {
      const workspace1 = designer.workbench.findWorkspaceById('content')
      workspace1.operation.selection.select(workspace1.operation.tree.id)
    }, [])

    return (
      <div className={usePrefix('layout')}>
        <BasicWorkplace id="top" components={components} />
        <div className={usePrefix('contentLayout')}>
          <BasicWorkplace
            id="left"
            style={{ width: 100 }}
            components={components}
          />
          <BasicWorkplace
            id="content"
            flexable={'true'}
            components={components}
          />
        </div>
        <BasicWorkplace id="bottom" components={components} />
      </div>
    )
  }
)
