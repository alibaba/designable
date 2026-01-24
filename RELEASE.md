# Release Process

This document describes how to release new versions of `@sulesky/*` packages to npm.

## Overview

```
Development → PR → Merge to master → (accumulate changes) → Version bump → Tag → Auto-publish
```

## Workflows

| Workflow      | Trigger            | Purpose           |
| ------------- | ------------------ | ----------------- |
| `ci.yml`      | PR, push to master | Build, test, lint |
| `publish.yml` | Git tag `v*`       | Publish to npm    |

## How to Release

### 1. Ensure master is up to date

```bash
git checkout master
git pull origin master
```

### 2. Choose version bump type

| Command              | When to use                        | Example       |
| -------------------- | ---------------------------------- | ------------- |
| `yarn version:patch` | Bug fixes, small changes           | 1.0.0 → 1.0.1 |
| `yarn version:minor` | New features (backward compatible) | 1.0.0 → 1.1.0 |
| `yarn version:major` | Breaking changes                   | 1.0.0 → 2.0.0 |

### 3. Run version command

```bash
yarn version:patch
```

This will:

- Bump version in all `package.json` files
- Bump version in `lerna.json`
- Create a commit: `chore(versions): publish 1.0.1`
- Create a git tag: `v1.0.1`

### 4. Push with tags

```bash
git push origin master --tags
```

### 5. Automatic publishing

GitHub Actions will automatically:

1. Detect the new tag
2. Install dependencies
3. Build all packages
4. Run tests
5. Publish to npm
6. Create GitHub Release with auto-generated notes

## Pre-release Versions

For testing before stable release:

```bash
yarn version:alpha    # 1.0.0 → 1.0.1-alpha.0
yarn version:beta     # 1.0.0 → 1.0.1-beta.0
yarn version:rc       # 1.0.0 → 1.0.1-rc.0
```

## Manual Publishing (if needed)

If you need to publish manually:

```bash
npm login
npx lerna publish from-package --yes
```

## Packages Published

| Package                        | npm                                                               |
| ------------------------------ | ----------------------------------------------------------------- |
| `@sulesky/core`                | [npm](https://www.npmjs.com/package/@sulesky/core)                |
| `@sulesky/shared`              | [npm](https://www.npmjs.com/package/@sulesky/shared)              |
| `@sulesky/react`               | [npm](https://www.npmjs.com/package/@sulesky/react)               |
| `@sulesky/react-sandbox`       | [npm](https://www.npmjs.com/package/@sulesky/react-sandbox)       |
| `@sulesky/react-settings-form` | [npm](https://www.npmjs.com/package/@sulesky/react-settings-form) |
| `@sulesky/formily-antd`        | [npm](https://www.npmjs.com/package/@sulesky/formily-antd)        |
| `@sulesky/formily-setters`     | [npm](https://www.npmjs.com/package/@sulesky/formily-setters)     |
| `@sulesky/formily-transformer` | [npm](https://www.npmjs.com/package/@sulesky/formily-transformer) |

## Troubleshooting

### "npm ERR! 403 Forbidden"

- Check that `NPM_TOKEN` secret is set in GitHub
- Verify token has publish permissions
- Ensure `@sulesky` org exists on npm

### "lerna ERR! Version already exists"

- Package version already published to npm
- Bump version again: `yarn version:patch`

### Failed GitHub Action

- Check Actions tab for error logs
- Common issues: missing NPM_TOKEN, test failures, build errors

## Setup (one-time)

1. Create npm organization: https://www.npmjs.com/org/create → `sulesky`
2. Generate npm token: https://www.npmjs.com/settings/YOUR_USERNAME/tokens → Automation
3. Add GitHub secret: Repo → Settings → Secrets → `NPM_TOKEN`
