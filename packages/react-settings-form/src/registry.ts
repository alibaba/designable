/**
 * Allowed CDN hosts for loading external dependencies.
 * Only URLs matching these hosts will be permitted for dynamic imports.
 */
const ALLOWED_CDN_HOSTS = [
  'cdn.jsdelivr.net',
  'unpkg.com',
  'cdnjs.cloudflare.com',
  'esm.sh',
  'esm.run',
]

const Registry = {
  cdn: '//cdn.jsdelivr.net/npm',
}

/**
 * Validates that a URL is from an allowed CDN host.
 * @param url - The URL to validate
 * @returns true if the URL is from an allowed CDN, false otherwise
 */
export const validateCDNUrl = (url: string): boolean => {
  try {
    // Handle protocol-relative URLs
    const normalizedUrl = url.startsWith('//') ? `https:${url}` : url
    const parsed = new URL(normalizedUrl)
    return ALLOWED_CDN_HOSTS.includes(parsed.hostname)
  } catch {
    // Invalid URL format
    return false
  }
}

/**
 * Sets the CDN registry URL for loading external dependencies.
 * Only allowed CDN hosts are permitted for security.
 * @param registry - The CDN base URL (e.g., '//cdn.jsdelivr.net/npm')
 * @throws Error if the registry URL is not from an allowed CDN host
 */
export const setNpmCDNRegistry = (registry: string) => {
  // Validate the registry before setting
  const testUrl = `${registry}/test-package`
  if (!validateCDNUrl(testUrl)) {
    throw new Error(
      `Security error: CDN registry "${registry}" is not allowed. ` +
        `Allowed hosts: ${ALLOWED_CDN_HOSTS.join(', ')}`,
    )
  }

  Registry.cdn = registry
  // Note: Monaco loader is configured in MonacoInput/config.ts to use
  // webpack-bundled Monaco. This function only sets CDN for Prettier loading.
}

export const getNpmCDNRegistry = () => String(Registry.cdn).replace(/\/$/, '')

/**
 * Returns the list of allowed CDN hosts.
 * Useful for error messages and documentation.
 */
export const getAllowedCDNHosts = (): readonly string[] => ALLOWED_CDN_HOSTS
