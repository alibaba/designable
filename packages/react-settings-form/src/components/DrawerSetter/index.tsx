import React, { Fragment, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { observer, useField } from '@formily/react'
import { FormLayout } from '@formily/antd'
import { IconWidget, usePrefix, useTreeNode } from '@designable/react'
import { Button, ButtonProps } from 'antd'
import cls from 'classnames'
import './styles.less'

export interface IDrawerSetterProps {
  text: React.ReactNode
  triggerProps: ButtonProps
}

export const DrawerSetter: React.FC<IDrawerSetterProps> = observer((props) => {
  const node = useTreeNode()
  const field = useField()
  const [visible, setVisible] = useState(false)
  const [remove, setRemove] = useState(false)
  const [root, setRoot] = useState<Element>()
  const prefix = usePrefix('drawer-setter')
  const formWrapperCls = usePrefix('settings-form-wrapper')
  useLayoutEffect(() => {
    const wrapper = document.querySelector('.' + formWrapperCls)
    if (wrapper) {
      setRoot(wrapper)
    }
  }, [node])

  const renderDrawer = () => {
    if (root && visible) {
      return createPortal(
        <div
          className={cls(prefix, 'animate__animated animate__slideInRight', {
            animate__slideOutRight: remove,
          })}
        >
          <div className={prefix + '-header'} onClick={handleClose}>
            <IconWidget infer="Return" size={18} />
            <span className={prefix + '-header-text'}>
              {props.text || field.title}
            </span>
          </div>
          <div className={prefix + '-body'}>
            <FormLayout
              colon={false}
              labelWidth={120}
              labelAlign="left"
              wrapperAlign="right"
              feedbackLayout="none"
              tooltipLayout="text"
            >
              {props.children}
            </FormLayout>
          </div>
        </div>,
        root
      )
    }
    return null
  }

  const handleOpen = () => {
    setVisible(true)
  }

  const handleClose = () => {
    setRemove(true)
    setTimeout(() => {
      setVisible(false)
      setRemove(false)
    }, 150)
  }

  return (
    <Fragment>
      <Button block onClick={handleOpen} {...props.triggerProps}>
        {props.text || field.title}
      </Button>
      {renderDrawer()}
    </Fragment>
  )
})
