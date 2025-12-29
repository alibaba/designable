import { createContext } from 'react'
import { ISettingFormProps } from '../types.js'

export const SettingsFormContext = createContext<ISettingFormProps>(null as any)
