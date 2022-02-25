import React, { useContext } from 'react'
import { InputProps } from 'antd/lib/input'
import { Input, Upload } from 'antd'
import { usePrefix, IconWidget } from '@designable/react'
import { SettingsFormContext } from '../../shared/context'
import cls from 'classnames'
import './styles.less'
export interface ImageInputProps extends Omit<InputProps, 'onChange'> {
  value?: string
  onChange?: (value: string) => void
}

export const ImageInput: React.FC<ImageInputProps> = ({
  className,
  style,
  ...props
}) => {
  const prefix = usePrefix('image-input')
  const context = useContext(SettingsFormContext)
  return (
    <div className={cls(prefix, className)} style={style}>
      <Input
        {...props}
        onChange={(e) => {
          props.onChange?.(e?.target?.['value'])
        }}
        prefix={
          <Upload
            action={context.uploadAction}
            itemRender={() => null}
            maxCount={1}
            onChange={(params: any) => {
              const response = params.file?.response
              const url =
                response?.url ||
                response?.downloadURL ||
                response?.imageURL ||
                response?.thumbUrl
              if (!url) return
              props.onChange?.(url)
            }}
          >
            <IconWidget infer="CloudUpload" style={{ cursor: 'pointer' }} />
          </Upload>
        }
      />
    </div>
  )
}

export const BackgroundImageInput: React.FC<ImageInputProps> = (props) => {
  const addBgValue = (value: any) => {
    if (/url\([^)]+\)/.test(value)) {
      return value
    }
    return `url(${value})`
  }
  const removeBgValue = (value: any) => {
    const matched = String(value).match(/url\(\s*([^)]+)\s*\)/)
    if (matched?.[1]) {
      return matched?.[1]
    }
    return value
  }
  return (
    <ImageInput
      value={removeBgValue(props.value)}
      onChange={(url) => {
        props.onChange?.(addBgValue(url))
      }}
    />
  )
}
