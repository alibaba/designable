# Technical Documentation: react-sandbox/src

## Overview
This folder contains the main source code for the `@designable/react-sandbox` package. It provides utilities and components to render and manage a sandboxed iframe environment for the Designable low-code platform, enabling isolated rendering and interaction for design-time components.

## Key Exports

### 1. `useSandbox`
- **Type:** React hook
- **Purpose:**
  - Sets up and manages an iframe sandbox for rendering designable components in isolation.
  - Injects CSS/JS assets, sets up global scope, and synchronizes engine/workspace/layout context.
- **Usage:**
  - Returns a `ref` to be attached to an `<iframe>` element.

### 2. `useSandboxScope`
- **Type:** React hook
- **Purpose:**
  - Retrieves the current sandbox scope from the global context inside the iframe.

### 3. `renderSandboxContent`
- **Type:** Function
- **Purpose:**
  - Renders React content into the sandbox iframe's root element, using the provided scope.

### 4. `Sandbox`
- **Type:** React Functional Component
- **Purpose:**
  - Renders an `<iframe>` and applies the `useSandbox` hook for setup.
  - Accepts CSS/JS assets, scope, and style props.

## Internal Details
- Handles cleanup of React roots when the iframe is unloaded to prevent memory leaks.
- Exposes a global root instance for React 18+ root management.
- Synchronizes theme and context variables between the main app and the sandbox.

## Example Usage
```tsx
import { Sandbox } from '@designable/react-sandbox'

<Sandbox
  cssAssets={[...]} 
  jsAssets={[...]} 
  scope={{ ... }}
  style={{ height: 400 }}
/>
```

## File List
- `index.ts`: Main entry point, exports all hooks and components for sandbox management.

---
For more details, see the source code and inline comments.
