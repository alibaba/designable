import React from 'react'
import { MonacoInput } from '@designable/react-settings-form'

export const JsonTree: React.FC = () => {
  // You can replace this with actual schema data if needed
  const defaultValue = `{
  "type": "object",
  "properties": {
    "field1": { "type": "string" },
    "field2": { "type": "number" }
  }
}`
  return (
    <div style={{ overflow: 'hidden', height: '100%' }}>
      <MonacoInput
        language="json"
        helpCode="// JSON Schema"
        defaultValue={defaultValue}
      />
    </div>
  )
}
