import React from 'react'
import { useTreeNode } from '@designable/react'
import { observer } from '@formily/reactive-react'
// import 'antd/dist/antd.css'

export const Field =  observer((props) => {
  const node = useTreeNode()
  console.log("node props", node.props)
  return (
    <span
      {...props}
      style={{
        background: '#eee',
        display: 'inline-block',
        ...props.style,
        padding: '10px 20px',
        border: '1px solid #ddd',
      }}
    >
      <span data-content-editable="title">{node.props.title}</span>
      {props.children}
    </span>
  )
})
