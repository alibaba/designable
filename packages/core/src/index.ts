import * as Core from './exports'
export * from './exports'

// Explicit re-exports for ESM/Vite compatibility
export { createBehavior, createResource, createDesigner, createLocales } from './externals'
export { GlobalRegistry } from './registry'
export { Engine, TreeNode, Workspace, Workbench } from './models/index'

// Skip globalThisPolyfill import to avoid CommonJS/ESM issues
const g: any = typeof globalThis !== 'undefined' ? globalThis : window || {};

if (g?.Designable?.Core) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      __esModule: true,
      ...g.Designable.Core,
    }
  }
} else {
  g.Designable = g.Designable || {}
  g.Designable.Core = Core
}
