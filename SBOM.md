# Software Bill of Materials (SBOM)

**Project:** Designable - A Universal Visual Design Framework  
**Repository:** alibaba/designable  
**Generated:** December 26, 2025  
**Node Version:** >=20 (Root), >=24 (Packages)

---

## Dependency Tree

### Root Workspace

```
root
├── Production Dependencies
│   ├── @ant-design/icons@^5.3.7
│   ├── log-symbols@^6
│   ├── moment@^2.30.1
│   └── nx@^22.3.0
│
└── Development Dependencies
    ├── @rollup/plugin-commonjs@^25.0.7
    ├── @rollup/plugin-node-resolve@^15.3.0
    ├── @rollup/plugin-terser@^0.4.4
    ├── @rollup/plugin-typescript@^12.3.0
    ├── @types/dateformat@^5.0.3
    ├── @types/fs-extra@^11.0.4
    ├── @types/glob@^9.0.0
    ├── @types/node@^20.14.9
    ├── chalk@4
    ├── eslint@^8.57.0
    ├── eslint-plugin-react@^7.34.3
    ├── fs-extra@^11.3.2
    ├── glob@^13.0.0
    ├── jest@^29.7.0
    ├── lerna@^9.0.3
    ├── less@^4.2.0
    ├── less-loader@^12.2.0
    ├── less-plugin-npm-import@^2.1.0
    ├── postcss@^8.4.38
    ├── react@^19.0.0
    ├── react-dom@^19.0.0
    ├── rimraf@^6.1.2
    ├── rollup@^4.18.0
    ├── rollup-plugin-node-resolve@^5.2.0
    ├── rollup-plugin-postcss@^4.0.2
    ├── rollup-plugin-typescript2@^0.36.0
    ├── ts-jest@^29.1.2
    ├── ts-node@^10.9.2
    ├── typescript@^5.9.3
    ├── webpack@^5.91.0
    ├── webpack-cli@^5.1.4
    └── webpack-dev-server@^5.0.4
```

---

## Core Packages

### @designable/shared

**Purpose:** Shared utilities and helpers  
**Type:** Base package (no dependencies on other designable packages)

```
@designable/shared@2.0.0
└── requestidlecallback@^0.3.0
```

---

### @designable/core

**Purpose:** Core design framework logic and models  
**Dependencies:** @designable/shared

```
@designable/core@2.0.0
├── @designable/shared (workspace:*)
├── @formily/json-schema@^2.3.0
├── @formily/path@^2.3.0
├── @formily/reactive@^2.3.0
└── @juggle/resize-observer@^3.4.0
```

---

### @designable/react

**Purpose:** React integration layer for the design framework  
**Dependencies:** @designable/core, @designable/shared

```
@designable/react@2.0.0
├── @designable/core (workspace:*)
├── @designable/shared (workspace:*)
├── dateformat@^5.0.0
│
├── Peer Dependencies
│   ├── @formily/reactive@^2.0.2
│   ├── @formily/reactive-react@^2.0.2
│   ├── antd@^5.0.0
│   ├── react@19.x
│   └── react-dom@19.x
│
└── Development Dependencies
    ├── @types/node@^20.14.9
    ├── react-is@^18.2.0
    ├── rimraf@^6.0.1
    ├── rollup@^3.0.0
    ├── ts-node@^10.9.1
    └── typescript@^6.0.0-dev.20251217
```

---

### @designable/react-sandbox

**Purpose:** Sandbox environment for testing designs  
**Dependencies:** @designable/react, @designable/shared

```
@designable/react-sandbox@2.0.0
├── @designable/react (workspace:*)
├── @designable/shared (workspace:*)
│
├── Peer Dependencies
│   ├── react@^19.0.0
│   └── react-dom@^19.0.0
│
└── Development Dependencies
    ├── @types/react@^18.2.0
    ├── @types/react-dom@^18.2.0
    ├── rimraf@^6.0.1
    └── typescript@^5.5.4
```

---

### @designable/react-settings-form

**Purpose:** Settings form components for property editors  
**Dependencies:** @designable/core, @designable/react, @designable/shared

```
@designable/react-settings-form@2.0.0
├── @designable/core (workspace:*)
├── @designable/react (workspace:*)
├── @designable/shared (workspace:*)
├── @babel/parser@^7.25.0
├── @monaco-editor/react@^4.6.0
├── monaco-editor@^0.49.0
├── prettier@^3.2.5
├── react-color@^2.19.3
├── react-tiny-popover@^8.0.0
│
├── Peer Dependencies
│   ├── @formily/antd-v5@^1.0.0
│   ├── @formily/core@^2.3.0
│   ├── @formily/react@^2.3.0
│   ├── @formily/reactive@^2.3.0
│   ├── @formily/reactive-react@^2.3.0
│   ├── @formily/shared@^2.3.0
│   ├── antd@^5.0.0
│   ├── react@^19.0.0
│   └── react-dom@^19.0.0
│
└── Development Dependencies
    ├── @ant-design/icons@^4.8.0
    ├── @formily/antd-v5@^1.0.0
    ├── @formily/core@^2.3.0
    ├── @formily/react@^2.3.0
    ├── @formily/reactive@^2.3.0
    ├── @formily/reactive-react@^2.3.0
    ├── @formily/shared@^2.3.0
    ├── react-is@^18.2.0
    ├── rimraf@^6.0.1
    └── typescript@^5.5.4
```

---

## Formily Integration Packages

### @designable/formily-transformer

**Purpose:** Transform Designable schemas to Formily schemas  
**Dependencies:** @designable/core, @designable/shared

```
@designable/formily-transformer@2.0.0
├── @designable/core (workspace:*)
├── @designable/shared (workspace:*)
│
├── Peer Dependencies
│   ├── @formily/core@^2.0.2
│   └── @formily/json-schema@^2.0.2
│
└── Development Dependencies
    ├── @formily/core@^2.0.2
    ├── @formily/json-schema@^2.0.2
    ├── rimraf@^6.0.1
    └── typescript@^5.4.5
```

---

### @designable/formily-setters

**Purpose:** Property setters for Formily components  
**Dependencies:** @designable/core, @designable/react, @designable/react-settings-form, @designable/formily-transformer

```
@designable/formily-setters@2.0.0
├── @designable/core (workspace:*)
├── @designable/formily-transformer (workspace:*)
├── @designable/react (workspace:*)
├── @designable/react-settings-form (workspace:*)
│
├── Peer Dependencies
│   ├── @formily/antd-v5@^1.0.0
│   ├── @formily/core@^2.0.2
│   ├── @formily/react@^2.0.2
│   ├── @formily/shared@^2.0.2
│   ├── antd@^5.0.0
│   ├── react@^19.0.0
│   ├── react-dom@^19.0.0
│   └── react-is@>=16.8.0
│
└── Development Dependencies
    ├── @formily/core@^2.0.2
    ├── @formily/react@^2.0.2
    ├── @formily/shared@^2.0.2
    ├── @types/react@^18.2.0
    ├── @types/react-dom@^18.2.0
    ├── antd@^5.0.0
    ├── rimraf@^6.0.1
    └── typescript@^5.4.5
```

---

### @designable/formily-antd

**Purpose:** Ant Design component adapters for Formily  
**Dependencies:** @designable/core, @designable/react, @designable/formily-setters, @designable/formily-transformer

```
@designable/formily-antd@2.0.0
├── @designable/core (workspace:*)
├── @designable/formily-setters (workspace:*)
├── @designable/formily-transformer (workspace:*)
├── @designable/react (workspace:*)
│
├── Peer Dependencies
│   ├── @formily/antd-v5@^1.0.0
│   ├── @formily/core@^2.0.2
│   ├── @formily/react@^2.0.2
│   ├── @formily/reactive@^2.0.2
│   ├── @formily/shared@^2.0.2
│   ├── antd@^5.0.0
│   ├── react@^19.0.0
│   └── react-dom@^19.0.0
│
└── Development Dependencies
    ├── @designable/react-settings-form (workspace:*)
    ├── @formily/antd-v5@^1.0.0
    ├── @formily/core@^2.0.2
    ├── @formily/react@^2.0.2
    ├── @formily/reactive@^2.0.2
    ├── @formily/shared@^2.0.2
    ├── @types/react@^18.2.0
    ├── @types/react-dom@^18.2.0
    ├── rimraf@^6.0.1
    └── typescript@^5.4.5
```

---

### @designable/formily-next

**Purpose:** Fusion Next component adapters for Formily  
**Dependencies:** @designable/core, @designable/react, @designable/formily-setters, @designable/formily-transformer

```
@designable/formily-next@2.0.0
├── @designable/core (workspace:*)
├── @designable/formily-setters (workspace:*)
├── @designable/formily-transformer (workspace:*)
├── @designable/react (workspace:*)
│
├── Peer Dependencies
│   ├── @alifd/next@^1.23.0
│   ├── @formily/core@^2.0.2
│   ├── @formily/next@^2.0.2
│   ├── @formily/react@^2.0.2
│   ├── @formily/reactive@^2.0.2
│   ├── @formily/shared@^2.0.2
│   ├── antd@^5.0.0
│   ├── react@^19.0.0
│   ├── react-dom@^19.0.0
│   └── react-is@>=16.8.0
│
└── Development Dependencies
    ├── @alifd/next@^1.23.0
    ├── @designable/react-settings-form (workspace:*)
    ├── @formily/core@^2.0.2
    ├── @formily/next@^2.0.2
    ├── @formily/react@^2.0.2
    ├── @formily/reactive@^2.0.2
    ├── @formily/shared@^2.0.2
    ├── antd@^5.0.0
    ├── react@^19.0.0
    ├── react-dom@^19.0.0
    ├── rimraf@^6.0.1
    └── typescript@^5.9.3
```

---

## Example Applications

### examples/basic (modern-design-editor)

**Purpose:** Basic design editor example using Webpack

```
modern-design-editor
├── @ant-design/colors@^7.2.0
├── @ant-design/fast-color@^3.0.0
├── antd@^5.0.0
│
├── Peer Dependencies
│   ├── react@^19.0.0
│   └── react-dom@^19.0.0
│
└── Development Dependencies
    ├── @types/fs-extra@^11
    ├── css-loader@^7.1.2
    ├── file-loader@^6.2.0
    ├── fs-extra@^11.3.3
    ├── html-webpack-plugin@^5.6.0
    ├── mini-css-extract-plugin@^2.9.0
    ├── style-loader@^4.0.0
    ├── ts-loader@^9.5.1
    ├── typescript@^5.5.4
    ├── webpack@^5.94.0
    ├── webpack-cli@^5.1.4
    └── webpack-dev-server@^4.15.2
```

---

### examples/sandbox (sandbox-modern)

**Purpose:** Sandbox example using Vite

```
sandbox-modern
├── antd@^5.0.0
│
├── Peer Dependencies
│   ├── react@^19.0.0
│   └── react-dom@^19.0.0
│
└── Development Dependencies
    ├── @vitejs/plugin-react@^4.3.1
    ├── less@^4.5.1
    ├── typescript@^5.5.4
    └── vite@^5.4.0
```

---

### examples/multi-workspace (multi-workspace-modern)

**Purpose:** Multi-workspace example using Vite

```
multi-workspace-modern
├── @ant-design/colors@^7.2.0
├── antd@^5.0.0
│
├── Peer Dependencies
│   ├── react@^19.0.0
│   └── react-dom@^19.0.0
│
└── Development Dependencies
    ├── @vitejs/plugin-react@^4.3.1
    ├── typescript@^5.5.4
    └── vite@^5.4.0
```

---

### examples/sandbox-multi-workspace (sandbox-multi-workspace-modern)

**Purpose:** Sandbox with multi-workspace support using Vite

```
sandbox-multi-workspace-modern
├── @ant-design/colors@^7.2.0
├── antd@^5.0.0
│
├── Peer Dependencies
│   ├── react@^19.0.0
│   └── react-dom@^19.0.0
│
└── Development Dependencies
    ├── @vitejs/plugin-react@^4.3.1
    ├── typescript@^5.5.4
    └── vite@^5.4.0
```

---

## Dependency Graph

### Internal Package Dependencies (Workspace)

```
@designable/shared (base)
    ↓
@designable/core
    ↓
@designable/react
    ↓
    ├── @designable/react-sandbox
    ├── @designable/react-settings-form
    └── @designable/formily-transformer
            ↓
        @designable/formily-setters
            ↓
            ├── @designable/formily-antd
            └── @designable/formily-next
```

### External Dependencies Summary

#### UI Frameworks
- **React:** ^19.0.0 (primary UI framework)
- **Ant Design:** ^5.0.0 (UI component library)
- **Fusion Next:** ^1.23.0 (alternative UI library)

#### Form Management
- **Formily Core:** ^2.0.2 - ^2.3.0
- **Formily React:** ^2.0.2 - ^2.3.0
- **Formily Reactive:** ^2.0.2 - ^2.3.0
- **Formily Ant Design:** ^1.0.0
- **Formily Next:** ^2.0.2
- **Formily JSON Schema:** ^2.0.2 - ^2.3.0
- **Formily Path:** ^2.3.0
- **Formily Shared:** ^2.0.2 - ^2.3.0

#### Code Editing & Formatting
- **Monaco Editor:** ^0.49.0
- **@monaco-editor/react:** ^4.6.0
- **Prettier:** ^3.2.5
- **Babel Parser:** ^7.25.0

#### Build Tools
- **TypeScript:** ^5.4.5 - ^6.0.0-dev.20251217
- **Rollup:** ^3.0.0 - ^4.18.0
- **Webpack:** ^5.91.0 - ^5.94.0
- **Vite:** ^5.4.0
- **Lerna:** ^9.0.3

#### Utilities
- **date-format:** ^5.0.0
- **moment:** ^2.30.1
- **react-color:** ^2.19.3
- **react-tiny-popover:** ^8.0.0
- **requestidlecallback:** ^0.3.0
- **@juggle/resize-observer:** ^3.4.0

---

## Security & License Information

### Licenses
- **Designable Packages:** MIT License
- **External Dependencies:** Various (see individual package licenses)

### Security Considerations
- All packages use workspace protocol for internal dependencies
- Peer dependencies ensure version consistency across the monorepo
- TypeScript strict mode enabled for type safety
- Node.js engine requirement: >=20 (root), >=24 (packages)

---

## Version Resolution Strategy

The workspace uses Yarn's resolution field to enforce consistent versions:

```json
"resolutions": {
  "@types/react": "^19.0.0",
  "@types/react-dom": "^19.0.0",
  "chalk": "^4.1.2",
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

---

## Package Statistics

- **Total Packages:** 14
- **Core Packages:** 5
- **Formily Packages:** 4
- **Example Applications:** 4
- **Monorepo Structure:** Lerna + Yarn Workspaces

---

*This SBOM was automatically generated from package.json files in the repository.*
