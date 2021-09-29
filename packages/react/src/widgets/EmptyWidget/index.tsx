import React from 'react'
import { useTree, usePrefix } from '../../hooks'
import { observer } from '@formily/reactive-react'
import { IconWidget } from '../IconWidget'
import './styles.less'

const Empty = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="animations">
        <IconWidget infer="ResourceAnimation" size={240} />
        <IconWidget infer="BatchDragAnimation" size={240} />
      </div>
      <div className="hotkeys-list">
        <div>
          Selection <IconWidget infer="Command" /> + Click /{' '}
          <IconWidget infer="Shift" /> + Click / <IconWidget infer="Command" />{' '}
          + A
        </div>
        <div>
          Copy <IconWidget infer="Command" /> + C / Paste{' '}
          <IconWidget infer="Command" /> + V
        </div>
        <div>
          Delete <IconWidget infer="Delete" />
        </div>
      </div>
    </div>
  )
}

export const EmptyWidget: React.FC = observer((props) => {
  const tree = useTree()
  const prefix = usePrefix('empty')
  if (!tree?.children?.length) {
    return (
      <div className={prefix}>
        {props.children ? props.children : <Empty />}
      </div>
    )
  }
  return null
})
