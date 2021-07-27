import React from 'react'
import { usePrefix, IconWidget } from '@designable/react'
import { useField, Field, observer } from '@formily/react'
import { Select, Radio, NumberPicker } from '@formily/antd'
import { FoldItem } from '../FoldItem'
import { InputItems } from '../InputItems'
import { SizeInput } from '../SizeInput'
import { ColorInput } from '../ColorInput'
import cls from 'classnames'
export interface IFontStyleSetterProps {
  className?: string
  style?: React.CSSProperties
}

const createFontFamilyOptions = (fonts: string[]) => {
  return fonts.map((font) => {
    const splited = font.split('=')
    const label = splited?.[0]
    const value = splited?.[1]
    return {
      label: <span style={{ fontFamily: value }}>{label}</span>,
      value,
    }
  })
}

const FontFamilyOptions = createFontFamilyOptions([
  '宋体=SimSun',
  '微软雅黑=Microsoft Yahei',
  '苹方=PingFang SC',
  'Andale Mono=andale mono,monospace',
  'Arial=arial,helvetica,sans-serif',
  'Arial Black=arial black,sans-serif',
  'Book Antiqua=book antiqua,palatino,serif',
  'Comic Sans MS=comic sans ms,sans-serif',
  'Courier New=courier new,courier,monospace',
  'Georgia=georgia,palatino,serif',
  'Helvetica Neue=Helvetica Neue',
  'Helvetica=helvetica,arial,sans-serif',
  'Impact=impact,sans-serif',
  'Symbol=symbol',
  'Tahoma=tahoma,arial,helvetica,sans-serif',
  'Terminal=terminal,monaco,monospace',
  'Times New Roman=times new roman,times,serif',
  'Trebuchet MS=trebuchet ms,geneva,sans-serif',
  'Verdana=verdana,geneva,sans-serif',
])

export const FontStyleSetter: React.FC<IFontStyleSetterProps> = observer(
  (props) => {
    const field = useField()
    const prefix = usePrefix('font-style-setter')
    return (
      <FoldItem
        label={field.title}
        className={cls(prefix, props.className)}
        style={props.style}
      >
        <FoldItem.Base>
          <Field
            name="fontFamily"
            basePath={field.address.parent()}
            component={[
              Select,
              { style: { width: '100%' }, placeholder: 'Helvetica Neue' },
            ]}
            dataSource={FontFamilyOptions}
          />
        </FoldItem.Base>
        <FoldItem.Extra>
          <InputItems>
            <InputItems.Item icon="FontWeight" width="50%">
              <Field
                name="fontWeight"
                basePath={field.address.parent()}
                component={[NumberPicker, { placeholder: '400' }]}
              />
            </InputItems.Item>
            <InputItems.Item icon="FontStyle" width="50%">
              <Field
                name="fontStyle"
                basePath={field.address.parent()}
                dataSource={[
                  {
                    label: <IconWidget infer="NormalFontStyle" />,
                    value: 'normal',
                  },
                  {
                    label: <IconWidget infer="ItalicFontStyle" />,
                    value: 'italic',
                  },
                ]}
                component={[Radio.Group, { optionType: 'button' }]}
              />
            </InputItems.Item>
            <InputItems.Item icon="FontColor" width="100%">
              <Field
                name="color"
                basePath={field.address.parent()}
                component={[ColorInput]}
              />
            </InputItems.Item>
            <InputItems.Item icon="FontSize" width="50%">
              <Field
                name="fontSize"
                basePath={field.address.parent()}
                component={[SizeInput, { exclude: ['auto'] }]}
              />
            </InputItems.Item>
            <InputItems.Item icon="LineHeight" width="50%">
              <Field
                name="lineHeight"
                basePath={field.address.parent()}
                component={[SizeInput, { exclude: ['auto'] }]}
              />
            </InputItems.Item>
            <InputItems.Item icon="TextAlign">
              <Field
                name="textAlign"
                basePath={field.address.parent()}
                dataSource={[
                  {
                    label: <IconWidget infer="TextAlignLeft" />,
                    value: 'left',
                  },
                  {
                    label: <IconWidget infer="TextAlignCenter" />,
                    value: 'center',
                  },
                  {
                    label: <IconWidget infer="TextAlignRight" />,
                    value: 'right',
                  },
                  {
                    label: <IconWidget infer="TextAlignJustify" />,
                    value: 'justify',
                  },
                ]}
                component={[Radio.Group, { optionType: 'button' }]}
              />
            </InputItems.Item>
            <InputItems.Item icon="TextDecoration">
              <Field
                name="textDecoration"
                basePath={field.address.parent()}
                dataSource={[
                  {
                    label: '--',
                    value: 'none',
                  },
                  {
                    label: <IconWidget infer="TextUnderline" />,
                    value: 'underline',
                  },
                  {
                    label: <IconWidget infer="TextLineThrough" />,
                    value: 'line-through',
                  },
                ]}
                component={[Radio.Group, { optionType: 'button' }]}
              />
            </InputItems.Item>
          </InputItems>
        </FoldItem.Extra>
      </FoldItem>
    )
  }
)
