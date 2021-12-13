import { createFeature } from '@designable/core'
import { createFieldSchema, createVoidFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const createArrayFeature = (name: string) => {
  return createFeature(
    {
      name,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === name,
      descriptor: {
        droppable: true,
        propsSchema: createFieldSchema(AllSchemas[name]),
      },
      locales: AllLocales[name],
    },
    {
      name: `${name}.Addition`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.Addition`,
      descriptor: {
        allowDrop(parent) {
          return parent.props['x-component'] === name
        },
        propsSchema: createVoidFieldSchema(AllSchemas[name].Addition),
      },
      locales: AllLocales.ArrayAddition,
    },
    {
      name: `${name}.Remove`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.Remove`,
      descriptor: {
        allowDrop(parent) {
          return parent.props['x-component'] === name
        },
        propsSchema: createVoidFieldSchema(),
      },
      locales: AllLocales.ArrayRemove,
    },
    {
      name: `${name}.Index`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.Index`,
      descriptor: {
        allowDrop(parent) {
          return parent.props['x-component'] === name
        },
        propsSchema: createVoidFieldSchema(),
      },
      locales: AllLocales.ArrayIndex,
    },
    {
      name: `${name}.MoveUp`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.MoveUp`,
      descriptor: {
        allowDrop(parent) {
          return parent.props['x-component'] === name
        },
        propsSchema: createVoidFieldSchema(),
      },
      locales: AllLocales.ArrayMoveUp,
    },
    {
      name: `${name}.MoveDown`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.MoveDown`,
      descriptor: {
        allowDrop(parent) {
          return parent.props['x-component'] === 'ArrayCards'
        },
        propsSchema: createVoidFieldSchema(),
      },
      locales: AllLocales.ArrayMoveDown,
    }
  )
}
