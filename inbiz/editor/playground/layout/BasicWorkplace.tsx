import React, { FC, useEffect } from 'react'
import {
    Workspace,
    Workbench,
    WorkspacePanel,
    ViewportPanel,
    ViewPanel,
    ComponentTreeWidget,
    ToolbarPanel,
    ViewToolsWidget,
    DesignerToolsWidget,

    // 类型
    IDesignerComponents,
    //hooks

} from '@inbiz/react'
import {
    PreviewWidget,
    SchemaEditorWidget,
    MarkupSchemaWidget,
} from '../widgets'
import { observer } from '@formily/reactive-react'
interface BasicWorkplace {
    id: string,
    style?: React.CSSProperties,
    flexable?: boolean | string,
    components: IDesignerComponents
}
export const BasicWorkplace: FC<BasicWorkplace> = observer((props) => {
    const { id, components,style, flexable } = props

    return (
        <Workspace id={id}>
            <WorkspacePanel flexable={flexable} style={style} >
                <ViewportPanel flexable={flexable} >
                    <ViewPanel type="DESIGNABLE" flexable={flexable}>
                        {() => (
                            <ComponentTreeWidget
                                flexable={flexable}
                                components={components}
                            />
                        )}
                    </ViewPanel>
                </ViewportPanel>
            </WorkspacePanel>
        </Workspace>
    )
})