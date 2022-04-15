export class LayoutObserver {
  private resizeObserver: ResizeObserver

  private performanceObserver: PerformanceObserver

  private mutationObserver: MutationObserver

  private connected = false

  constructor(observer: () => void = () => {}) {
    this.resizeObserver = new ResizeObserver(() => observer())
    this.performanceObserver = new PerformanceObserver(() => {
      observer()
    })
    this.mutationObserver = new MutationObserver(() => observer())
  }

  observe = (target: HTMLElement | Element) => {
    this.resizeObserver.observe(target)
    this.performanceObserver.observe({
      entryTypes: ['paint', 'element', 'layout-shift', 'event'],
    })
    this.mutationObserver.observe(target, {
      attributeFilter: ['style'],
      attributes: true,
    })
    this.connected = true
  }

  disconnect = () => {
    if (this.connected) {
      this.resizeObserver.disconnect()
      this.performanceObserver.disconnect()
      this.mutationObserver.disconnect()
    }
    this.connected = false
  }
}
