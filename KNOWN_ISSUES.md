# Known Issues

## External Package Warnings

These warnings come from external packages and cannot be fixed directly in this codebase.

### 1. Collapse children deprecated (rc-collapse)

```
Warning: [rc-collapse] `children` will be removed in next major version. Please use `items` instead.
```

**Source:** `@formily/antd-v5` -> `rc-collapse`

**Cause:** FormCollapse component in @formily/antd-v5 uses the old `children` API (CollapsePanel) instead of the new `items` prop.

**Impact:** None - just a deprecation warning, functionality works correctly.

**Tracking:** https://github.com/alibaba/formily/issues

---

### 2. Invalid DOM nesting - div in tbody (@dnd-kit)

```
Warning: validateDOMNesting(...): <div> cannot appear as a child of <tbody>.
    at div
    at HiddenText
    at Accessibility
    at DndContext
```

**Source:** `@formily/antd-v5` -> `@dnd-kit/core`

**Cause:** @dnd-kit adds accessibility elements (screen reader text in divs) for drag-and-drop functionality. When used inside ArrayTable, these divs end up inside `<tbody>`, which is invalid HTML.

**Impact:** None - just a React warning, drag-and-drop works correctly.

**Tracking:**

- https://github.com/alibaba/formily/issues
- https://github.com/clauderic/dnd-kit/issues

---

## How to Check for Issues in Our Code

Run the Antd 5 deprecation checker:

```bash
yarn check:antd5
```

This script detects deprecated Antd 4 APIs that should be updated for Antd 5:

- Button.Group -> Space.Compact
- Breadcrumb.Item -> items prop
- Collapse.Panel -> items prop
- visible -> open (Modal, Tooltip, Popover, etc.)
- onVisibleChange -> onOpenChange
- destroyOnClose -> destroyOnHidden
- overlayInnerStyle -> styles={{ body: {} }}
- null values in Select options

---

## Migration Completed

This project has been migrated to:

- React 18.3.1
- Ant Design 5.24.0
- @formily/antd-v5 ^1.2.0
- TypeScript 5.8.0
- Webpack 5.99.0

All internal code is clean - warnings only come from external dependencies.
