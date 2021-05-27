import React, { Fragment, useMemo } from 'react'
import { usePrefix } from '@designable/react'
import { camelCase } from '@formily/shared'
import { Select } from '@formily/antd'
import { observable } from '@formily/reactive'
import { useField, Field, observer } from '@formily/react'
import { FoldItem } from '../FoldItem'
import { ColorInput } from '../ColorInput'
import { SizeInput } from '../SizeInput'
import { PositionInput } from '../PositionInput'
import cls from 'classnames'
import './styles.less'

const Positions = ['center', 'top', 'right', 'bottom', 'left']

const BorderStyleOptions = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: <span className="border-style-solid-line" />,
    value: 'solid',
  },
  {
    label: <span className="border-style-dashed-line" />,
    value: 'dashed',
  },
  {
    label: <span className="border-style-dotted-line" />,
    value: 'dotted',
  },
]

export interface IBorderStyleSetterProps {
  className?: string
  style?: React.CSSProperties
}

export const BorderStyleSetter: React.FC<IBorderStyleSetterProps> = observer(
  ({ className, style }) => {
    const currentPosition = useMemo(
      () =>
        observable({
          value: 'center',
        }),
      []
    )
    const field = useField()
    const prefix = usePrefix('border-style-setter')

    const createReaction =
      (position: string) => (field: Formily.Core.Models.Field) => {
        field.display =
          currentPosition.value === position ? 'visible' : 'hidden'
        if (position !== 'center') {
          const borderStyle = field.query('.borderStyle').value()
          const borderWidth = field.query('.borderWidth').value()
          const borderColor = field.query('.borderColor').value()
          if (borderStyle || borderWidth || borderColor) {
            field.value = undefined
          }
        }
      }

    return (
      <FoldItem label={field.title}>
        <FoldItem.Extra>
          <div className={cls(prefix, className)} style={style}>
            <div className={prefix + '-position'}>
              <PositionInput
                value={currentPosition.value}
                onChange={(value) => {
                  currentPosition.value = value
                }}
              />
            </div>
            <div className={prefix + '-input'}>
              {Positions.map((position, key) => {
                return (
                  <Fragment key={key}>
                    <Field
                      name={camelCase(
                        `border${
                          position === 'center' ? '' : `-${position}`
                        }Style`
                      )}
                      basePath={field.address.parent()}
                      dataSource={BorderStyleOptions}
                      reactions={createReaction(position)}
                      component={[Select, { placeholder: 'Please Select' }]}
                    />
                    <Field
                      name={camelCase(
                        `border${
                          position === 'center' ? '' : `-${position}`
                        }Width`
                      )}
                      basePath={field.address.parent()}
                      reactions={createReaction(position)}
                      component={[SizeInput, { exclude: ['auto'] }]}
                    />
                    <Field
                      name={camelCase(
                        `border${
                          position === 'center' ? '' : `-${position}`
                        }Color`
                      )}
                      basePath={field.address.parent()}
                      reactions={createReaction(position)}
                      component={[ColorInput]}
                    />
                  </Fragment>
                )
              })}
            </div>
          </div>
        </FoldItem.Extra>
      </FoldItem>
    )
  }
)
