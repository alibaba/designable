# Development Setup

## Architecture

This monorepo uses **source file exports** for development and **compiled builds** for production publishing.

### Development Mode

- All packages export their `src/index.ts` files directly via `package.json` exports
- Vite handles TypeScript/JSX compilation on-the-fly
- No build step required to start developing
- Fast HMR (Hot Module Replacement)

### Production Mode

- Packages build to `lib/` (CommonJS) and `esm/` (ES Modules)
- LESS files are copied to build outputs
- Type declarations included
- Ready for npm publishing

## Package Configuration

### TypeScript Configuration

All packages require these settings in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM"],
    "moduleResolution": "Bundler",
    "isolatedModules": true,
    "target": "ES2022",
    "module": "ESNext"
  }
}
```

### Package.json Exports

Packages export source files for development:

```json
{
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts"
    }
  }
}
```

### Workspace Resolution

- Uses Yarn workspaces with `workspace:` protocol
- No Vite aliases needed
- Native module resolution via `moduleResolution: "Bundler"`

## Running Development Server

```bash
# Start sandbox example
cd examples/sandbox
yarn vite

# Or multi-workspace example
cd examples/sandbox-multi-workspace
yarn vite
```

Server will start on <http://localhost:3000> (or next available port)

## Building for Production

```bash
# Build all packages
yarn build

# Or build specific package
cd packages/react
yarn build
```

## Key Benefits

✅ No build step for development - immediate changes
✅ Fast HMR with Vite
✅ Type-safe imports with TypeScript
✅ Proper production builds for npm publishing
✅ LESS files preserved and copied to outputs
✅ Workspace dependencies resolved natively

## Troubleshooting

### JSX Not Set Error

If you see `'--jsx' is not set` errors, ensure `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

### Module Resolution Issues

- Verify `package.json` exports point to `src/index.ts`
- Check `tsconfig.json` has `moduleResolution: "Bundler"`
- Ensure Vite config doesn't have conflicting aliases

### Icon Not Rendering

Icons are registered via GlobalRegistry. Check that components are properly imported and registered in the sandbox initialization code.
