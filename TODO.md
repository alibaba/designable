# TODO

## Publishing to npm

### Pre-requisites

1. **Create npm organization `sulesky`**
   - Go to https://www.npmjs.com/org/create
   - Name: `sulesky`
   - This reserves the `@sulesky` scope

2. **Login to npm**
   ```bash
   npm login
   ```

3. **Verify org access**
   ```bash
   npm org ls sulesky
   ```

### Publish

```bash
# Publish all 8 packages to npm
lerna publish from-package --yes
```

### Packages to be published

| Package | Version |
|---------|---------|
| `@sulesky/shared` | 1.0.0 |
| `@sulesky/core` | 1.0.0 |
| `@sulesky/react` | 1.0.0 |
| `@sulesky/react-sandbox` | 1.0.0 |
| `@sulesky/react-settings-form` | 1.0.0 |
| `@sulesky/formily-transformer` | 1.0.0 |
| `@sulesky/formily-setters` | 1.0.0 |
| `@sulesky/formily-antd` | 1.0.0 |

### After publishing

1. Push to git:
   ```bash
   git push origin upgarde
   ```

2. Create a release tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. (Optional) Merge to main:
   ```bash
   git checkout main
   git merge upgarde
   git push origin main
   ```
