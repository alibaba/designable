import React, { useEffect } from 'react'
import { Space, Button } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import { useDesigner, TextWidget } from '@sulesky/next-react'
import { GlobalRegistry } from '@sulesky/next-core'
import { observer } from '@formily/react'
import { loadInitialSchema, saveSchema } from '../service'

export const ActionsWidget = observer(() => {
  const designer = useDesigner()
  useEffect(() => {
    loadInitialSchema(designer)
  }, [])
  useEffect(() => {
    GlobalRegistry.setDesignerLanguage('en-us')
  }, [])
  return (
    <Space style={{ marginRight: 10 }}>
      <Button href="https://github.com/kapelan/designable" target="_blank">
        <GithubOutlined />
        Github
      </Button>
      <Button
        onClick={() => {
          saveSchema(designer)
        }}
      >
        <TextWidget>Save</TextWidget>
      </Button>
      <Button
        type="primary"
        onClick={() => {
          saveSchema(designer)
        }}
      >
        <TextWidget>Publish</TextWidget>
      </Button>
    </Space>
  )
})
