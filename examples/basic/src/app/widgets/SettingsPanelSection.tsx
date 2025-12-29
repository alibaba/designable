import React from 'react'
import { SettingsPanel } from '@designable/react'
import { SettingsForm } from '@designable/react-settings-form'

export const SettingsPanelSection: React.FC = () => (
  <SettingsPanel title="panels.PropertySettings">
    <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
  </SettingsPanel>
)
