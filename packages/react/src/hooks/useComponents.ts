import { useContext } from 'react'
import { DesignerComponentsContext } from '../context'
export const useComponents = () => useContext(DesignerComponentsContext)
