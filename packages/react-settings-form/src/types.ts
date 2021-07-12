import React from 'react'

export interface ISettingFormProps {
  className?: string
  style?: React.CSSProperties
  uploadAction?: string
  components?: Record<string, React.FC<any>>
  scope?: any
}
