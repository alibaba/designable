#!/usr/bin/env ts-node
/**
 * Script to detect Antd 4 deprecated APIs that should be updated for Antd 5
 * Run with: npx ts-node scripts/check-antd5-deprecations.ts
 */

import { globSync } from 'glob'
import * as fs from 'fs'

interface DeprecationPattern {
  pattern: RegExp
  message: string
  replacement: string
}

const deprecations: DeprecationPattern[] = [
  // Component changes
  {
    pattern: /Button\.Group/g,
    message: 'Button.Group is deprecated',
    replacement: 'Use Space.Compact instead',
  },
  {
    pattern: /Breadcrumb\.Item/g,
    message: 'Breadcrumb.Item is deprecated',
    replacement: 'Use items prop instead',
  },
  {
    pattern: /Breadcrumb\.Separator/g,
    message: 'Breadcrumb.Separator is deprecated',
    replacement: 'Use items prop with separator',
  },

  // Prop changes - visible -> open
  {
    pattern: /<Modal[^>]*\svisible[=\s{]/g,
    message: 'Modal visible prop is deprecated',
    replacement: 'Use open prop instead',
  },
  {
    pattern: /<Tooltip[^>]*\svisible[=\s{]/g,
    message: 'Tooltip visible prop is deprecated',
    replacement: 'Use open prop instead',
  },
  {
    pattern: /<Popover[^>]*\svisible[=\s{]/g,
    message: 'Popover visible prop is deprecated',
    replacement: 'Use open prop instead',
  },
  {
    pattern: /<Dropdown[^>]*\svisible[=\s{]/g,
    message: 'Dropdown visible prop is deprecated',
    replacement: 'Use open prop instead',
  },
  {
    pattern: /<Drawer[^>]*\svisible[=\s{]/g,
    message: 'Drawer visible prop is deprecated',
    replacement: 'Use open prop instead',
  },

  // onVisibleChange -> onOpenChange
  {
    pattern: /onVisibleChange/g,
    message: 'onVisibleChange is deprecated',
    replacement: 'Use onOpenChange instead',
  },

  // Modal/Drawer destroyOnClose -> destroyOnHidden
  {
    pattern: /destroyOnClose/g,
    message: 'destroyOnClose is deprecated',
    replacement: 'Use destroyOnHidden instead',
  },

  // Tooltip/Popover overlayInnerStyle -> styles.body
  {
    pattern: /overlayInnerStyle/g,
    message: 'overlayInnerStyle is deprecated',
    replacement: 'Use styles={{ body: {...} }} instead',
  },

  // overlayClassName -> classNames.root or popupClassName
  {
    pattern: /overlayClassName/g,
    message: 'overlayClassName is deprecated',
    replacement: 'Use classNames or popupClassName instead',
  },

  // dropdownClassName -> popupClassName
  {
    pattern: /dropdownClassName/g,
    message: 'dropdownClassName is deprecated',
    replacement: 'Use popupClassName instead',
  },

  // null values in Select options
  {
    pattern: /enum:\s*\[[^\]]*null[^\]]*\]/g,
    message: 'null in enum array causes Select warning',
    replacement: "Use '' (empty string) instead of null",
  },

  // value: null
  {
    pattern: /value:\s*null/g,
    message: 'value: null in options causes warnings',
    replacement: "Use value: '' or value: undefined",
  },

  // defaultValue: null
  {
    pattern: /defaultValue:\s*null/g,
    message: 'defaultValue: null may cause warnings',
    replacement: "Use defaultValue: '' or defaultValue: undefined",
  },
]

const ignorePaths = [
  'node_modules',
  'lib',
  'esm',
  'dist',
  '.git',
  'coverage',
  'formily/next', // Removed from workspace
  'check-antd5-deprecations.ts', // This script
]

function shouldIgnore(filePath: string): boolean {
  return ignorePaths.some((p) => filePath.includes(p))
}

function checkFile(
  filePath: string,
): { file: string; line: number; message: string; replacement: string }[] {
  const issues: {
    file: string
    line: number
    message: string
    replacement: string
  }[] = []
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    deprecations.forEach((dep) => {
      if (dep.pattern.test(line)) {
        // Reset regex lastIndex
        dep.pattern.lastIndex = 0
        issues.push({
          file: filePath,
          line: index + 1,
          message: dep.message,
          replacement: dep.replacement,
        })
      }
    })
  })

  return issues
}

function main() {
  console.log('🔍 Checking for Antd 5 deprecations...\n')

  const files = globSync('**/*.{ts,tsx}', {
    ignore: ['**/node_modules/**', '**/lib/**', '**/esm/**', '**/dist/**'],
  })

  let totalIssues = 0
  const issuesByFile: Map<
    string,
    { line: number; message: string; replacement: string }[]
  > = new Map()

  files.forEach((file) => {
    if (shouldIgnore(file)) return

    const issues = checkFile(file)
    if (issues.length > 0) {
      totalIssues += issues.length
      issuesByFile.set(
        file,
        issues.map((i) => ({
          line: i.line,
          message: i.message,
          replacement: i.replacement,
        })),
      )
    }
  })

  if (totalIssues === 0) {
    console.log('✅ No Antd 5 deprecations found!\n')
    process.exit(0)
  }

  console.log(`❌ Found ${totalIssues} deprecation(s):\n`)

  issuesByFile.forEach((issues, file) => {
    console.log(`📄 ${file}`)
    issues.forEach((issue) => {
      console.log(`   Line ${issue.line}: ${issue.message}`)
      console.log(`   💡 ${issue.replacement}`)
    })
    console.log('')
  })

  process.exit(1)
}

main()
