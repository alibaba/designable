import { createMetadata } from '@designable/core'
import { createFieldSchema, createVoidFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const createArrayMetadata = (name: string) => {
  return createMetadata(
    {
      name,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === name,
      behavior: {
        droppable: true,
        propsSchema: createFieldSchema(AllSchemas[name]),
      },
      locales: AllLocales[name],
    },
    {
      name: `${name}.Addition`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.Addition`,
      behavior: {
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
      behavior: {
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
      behavior: {
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
      behavior: {
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
      behavior: {
        allowDrop(parent) {
          return parent.props['x-component'] === 'ArrayCards'
        },
        propsSchema: createVoidFieldSchema(),
      },
      locales: AllLocales.ArrayMoveDown,
    }
  )
}
