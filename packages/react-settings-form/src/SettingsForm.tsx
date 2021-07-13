import React, { useMemo } from 'react'
import { createForm } from '@formily/core'
import { Form } from '@formily/antd'
import { observer } from '@formily/react'
import { requestIdle, cancelIdle } from '@designable/shared'
import {
  usePrefix,
  useSelected,
  useOperation,
  useCurrentNode,
  IconWidget,
} from '@designable/react'
import { SchemaField } from './SchemaField'
import { ISettingFormProps } from './types'
import { SettingsFormContext } from './shared/context'
import { useLocales, useSnapshot } from './effects'
import { NodePath } from './components/NodePath'
import { Empty } from 'antd'
import cls from 'classnames'
import './styles.less'

const GlobalState = {
  idleRequest: null,
}

export const SettingsForm: React.FC<ISettingFormProps> = observer(
  (props) => {
    const operation = useOperation()
    const node = useCurrentNode()
    const selected = useSelected()
    const prefix = usePrefix('settings-form')
    const form = useMemo(() => {
      return createForm({
        values: node?.props,
        effects() {
          useLocales()
          useSnapshot(operation)
        },
      })
    }, [node, node?.designerProps?.propsSchema, operation])

    const isEmpty = !(
      node &&
      node.designerProps?.propsSchema &&
      selected.length === 1
    )

    const render = () => {
      if (!isEmpty) {
        return (
          <div
            className={cls(prefix, props.className)}
            style={props.style}
            key={node.id}
          >
            <SettingsFormContext.Provider value={props}>
              <Form
                form={form}
                colon={false}
                labelWidth={120}
                labelAlign="left"
                wrapperAlign="right"
                feedbackLayout="none"
                tooltipLayout="text"
              >
                <SchemaField
                  schema={node.designerProps.propsSchema as any}
                  components={props.components}
                  scope={props.scope}
                />
              </Form>
            </SettingsFormContext.Provider>
          </div>
        )
      }
      return (
        <div className={prefix + '-empty'}>
          <Empty />
        </div>
      )
    }

    return (
      <IconWidget.Provider tooltip>
        <div className={prefix + '-wrapper'}>
          {!isEmpty && <NodePath />}
          <div className={prefix + '-content'}>{render()}</div>
        </div>
      </IconWidget.Provider>
    )
  },
  {
    scheduler: (update) => {
      cancelIdle(GlobalState.idleRequest)
      GlobalState.idleRequest = requestIdle(update)
    },
  }
)
