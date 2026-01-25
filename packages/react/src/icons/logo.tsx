// Simple text-based logo - no external dependencies
export const Logo = {
  light:
    'data:image/svg+xml,' +
    encodeURIComponent(
      `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40">
      <text x="10" y="28" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#1890ff">Designable</text>
    </svg>
  `.trim(),
    ),
  dark:
    'data:image/svg+xml,' +
    encodeURIComponent(
      `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40">
      <text x="10" y="28" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#40a9ff">Designable</text>
    </svg>
  `.trim(),
    ),
}
