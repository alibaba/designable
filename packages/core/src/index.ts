import * as Core from './exports'
export * from './exports'

if (window?.['Designable']?.['Core']) {
  if (module.exports) {
    module.exports = {
      __esModule: true,
      ...window['Designable']['Core'],
    }
  }
} else {
  window['Designable'] = window['Designable'] || {}
  window['Designable'].Core = Core
}
