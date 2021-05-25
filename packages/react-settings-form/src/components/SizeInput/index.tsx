import { InputNumber } from 'antd'
import { createPolyInput } from '../PolyInput'

const takeNumber = (value: any) => {
  const num = String(value)
    .trim()
    .replace(/[^\d\.]+/, '')
  if (num === '') return
  return Number(num)
}

const createUnitType = (type: string) => {
  return {
    type,
    component: InputNumber,
    checker(value: any) {
      return String(value).includes(type)
    },
    toInputValue(value: any) {
      return takeNumber(value)
    },
    toChangeValue(value: any) {
      return `${value || 0}${type}`
    },
  }
}

export const SizeInput = createPolyInput([
  {
    type: 'auto',
    checker(value) {
      if (!value) return true
      if (value === 'auto') return true
      return false
    },
    toChangeValue() {
      return 'auto'
    },
  },
  createUnitType('px'),
  createUnitType('%'),
  createUnitType('vh'),
  createUnitType('em'),
])
