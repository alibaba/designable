import { Engine } from '../models'
import { ViewportResizeEvent, ViewportScrollEvent } from '../events'

export const useViewportEffect = (engine: Engine) => {
  engine.subscribeTo(ViewportResizeEvent, (event) => {
    const currentWorkspace = event?.context?.workspace
    if (!currentWorkspace) return
    const viewport = currentWorkspace.viewport
    const outline = currentWorkspace.outline
    if (viewport.matchViewport(event.data.target)) {
      viewport.setState()
    }
    if (outline.matchViewport(event.data.target)) {
      outline.setState()
    }
  })
  engine.subscribeTo(ViewportScrollEvent, (event) => {
    const currentWorkspace = event?.context?.workspace
    if (!currentWorkspace) return
    const viewport = currentWorkspace.viewport
    const outline = currentWorkspace.outline
    if (viewport.matchViewport(event.data.target)) {
      viewport.setState()
    }
    if (outline.matchViewport(event.data.target)) {
      outline.setState()
    }
  })
}
