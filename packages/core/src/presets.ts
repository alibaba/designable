import {
  DragDropDriver,
  MouseClickDriver,
  MouseMoveDriver,
  ViewportResizeDriver,
  ViewportScrollDriver,
  KeyboardDriver,
} from './drivers'
import {
  useCursorEffect,
  useViewportEffect,
  useDragDropEffect,
  useSelectionEffect,
  useKeyboardEffect,
  useAutoScrollEffect,
  useWorkspaceEffect,
  useFreeSelectionEffect,
} from './effects'
import {
  SelectNodes,
  SelectAllNodes,
  SelectSameTypeNodes,
  DeleteNodes,
  CopyNodes,
  PasteNodes,
  UndoMutation,
  RedoMutation,
  CursorSwitchSelection,
} from './shortcuts'

export const DEFAULT_EFFECTS = [
  useCursorEffect,
  useViewportEffect,
  useDragDropEffect,
  useSelectionEffect,
  useKeyboardEffect,
  useAutoScrollEffect,
  useWorkspaceEffect,
  useFreeSelectionEffect,
]

export const DEFAULT_DRIVERS = [
  DragDropDriver,
  MouseClickDriver,
  MouseMoveDriver,
  ViewportResizeDriver,
  ViewportScrollDriver,
  KeyboardDriver,
]

export const DEFAULT_SHORTCUTS = [
  SelectNodes,
  SelectAllNodes,
  SelectSameTypeNodes,
  DeleteNodes,
  CopyNodes,
  PasteNodes,
  UndoMutation,
  RedoMutation,
  CursorSwitchSelection,
]
