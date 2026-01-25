import { createLocales } from '@sulesky/next-core'
import { Card } from './Card'

export const ArrayCards = createLocales(Card, {
  
  'en-US': {
    title: 'Array Cards',
    addIndex: 'Add Index',
    addOperation: 'Add Operations'
}
})
