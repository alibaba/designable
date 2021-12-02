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
  useResizeEffect,
  useKeyboardEffect,
  useAutoScrollEffect,
  useWorkspaceEffect,
  useFreeSelectionEffect,
  useContentEditableEffect,
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
  PreventCommandX,
  SelectPrevNode,
  SelectNextNode,
} from './shortcuts'

export const DEFAULT_EFFECTS = [
  useCursorEffect,
  useViewportEffect,
  useDragDropEffect,
  useResizeEffect,
  useSelectionEffect,
  useKeyboardEffect,
  useAutoScrollEffect,
  useWorkspaceEffect,
  useFreeSelectionEffect,
  useContentEditableEffect,
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
  PreventCommandX,
  SelectNodes,
  SelectAllNodes,
  SelectSameTypeNodes,
  DeleteNodes,
  CopyNodes,
  PasteNodes,
  SelectPrevNode,
  SelectNextNode,
  UndoMutation,
  RedoMutation,
  CursorSwitchSelection,
]
