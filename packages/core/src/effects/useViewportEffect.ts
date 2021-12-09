import { Designer } from '../models'
import { ViewportResizeEvent, ViewportScrollEvent } from '../events'

export const useViewportEffect = (designer: Designer) => {
  designer.subscribeTo(ViewportResizeEvent, (event) => {
    const currentWorkspace = event?.context?.workspace
    if (!currentWorkspace) return
    const viewport = currentWorkspace.viewport
    const outline = currentWorkspace.outline
    if (viewport.matchViewport(event.data.target)) {
      viewport.digestViewport()
    }
    if (outline.matchViewport(event.data.target)) {
      outline.digestViewport()
    }
  })
  designer.subscribeTo(ViewportScrollEvent, (event) => {
    const currentWorkspace = event?.context?.workspace
    if (!currentWorkspace) return
    const viewport = currentWorkspace.viewport
    const outline = currentWorkspace.outline
    if (viewport.matchViewport(event.data.target)) {
      viewport.digestViewport()
    }
    if (outline.matchViewport(event.data.target)) {
      outline.digestViewport()
    }
  })
}
