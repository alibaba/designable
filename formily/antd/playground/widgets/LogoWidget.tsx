import React from 'react'
import { useTheme } from '@sulesky/next-react'

// Simple text-based logo - no external dependencies
const logo = {
  dark:
    'data:image/svg+xml,' +
    encodeURIComponent(
      `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40">
      <text x="10" y="28" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#40a9ff">Designable</text>
    </svg>
  `.trim(),
    ),
  light:
    'data:image/svg+xml,' +
    encodeURIComponent(
      `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40">
      <text x="10" y="28" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#1890ff">Designable</text>
    </svg>
  `.trim(),
    ),
}

export const LogoWidget: React.FC = () => {
  const theme = useTheme() as 'dark' | 'light'
  const url = logo[theme] || logo.light
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
      <img
        src={url}
        style={{ margin: '12px 8px', height: 18, width: 'auto' }}
      />
    </div>
  )
}
