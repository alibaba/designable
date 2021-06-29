import { createContext } from 'react'
import { ISettingFormProps } from '../types'

export const SettingsFormContext = createContext<ISettingFormProps>(null)
