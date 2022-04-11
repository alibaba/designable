import React, { useEffect, useRef } from 'react'
import { useViewport, useDesigner, usePrefix } from '../../hooks'
import { Insertion } from './Insertion'
import { Selection } from './Selection'
import { FreeSelection } from './FreeSelection'
import { Cover } from './Cover'
import { DashedBox } from './DashedBox'
import { SpaceBlock } from './SpaceBlock'
import { SnapLine } from './SnapLine'
import './styles.less'

export const AuxToolWidget = () => {
  const engine = useDesigner()
  const viewport = useViewport()
  const prefix = usePrefix('auxtool')
  const ref = useRef<HTMLDivElement>()
  useEffect(() => {
    return engine.subscribeWith('viewport:scroll', () => {
      if (viewport.isIframe && ref.current) {
        ref.current.style.transform = `perspective(1px) translate3d(${-viewport.scrollX}px,${-viewport.scrollY}px,0)`
      }
    })
  }, [engine, viewport])

  if (!viewport) return null

  return (
    <div ref={ref} className={prefix}>
      <Insertion />
      <SpaceBlock />
      <SnapLine />
      <DashedBox />
      <Selection />
      <Cover />
      <FreeSelection />
    </div>
  )
}

AuxToolWidget.displayName = 'AuxToolWidget'
