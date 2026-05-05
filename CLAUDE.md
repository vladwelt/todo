# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Google Tasks-style to-do app built with **React Native** and **Expo**. The goal is to replicate the core UX of Google Tasks: task lists, subtasks, due dates, and a clean bottom-sheet/modal-driven UI.

## Setup

After cloning, install dependencies:

```bash
npm install
```

## Commands

```bash
# Start the dev server (opens Expo Go on device or simulator)
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Type-check
npx tsc --noEmit

# Lint
npx eslint . --ext .ts,.tsx

# Run tests
npx jest

# Run a single test file
npx jest path/to/file.test.ts
```

## Architecture

```
app/
  _layout.tsx          # Root layout — wraps tree in GestureHandlerRootView
  (tabs)/
    _layout.tsx        # Tab bar (Tasks / Lists)
    index.tsx          # Active-list task screen
    lists.tsx          # All task lists
components/
  TaskItem.tsx         # Single task row with checkbox, metadata, delete
  AddTaskSheet.tsx     # @gorhom/bottom-sheet quick-add (forwardRef)
  FAB.tsx              # Floating action button
  EmptyState.tsx       # Zero-task placeholder
store/
  tasks.ts             # Zustand slice — CRUD + subtask actions
  lists.ts             # Zustand slice — list management, activeListId
hooks/
  useTaskList.ts       # Derives activeTasks / completedTasks for active list
lib/
  utils.ts             # formatDueDate, isDueOrOverdue
constants/
  theme.ts             # Colors, Spacing, FontSize tokens
types/
  index.ts             # Task, Subtask, TaskList interfaces
```

## State Management

Use **Zustand** for global state (tasks and lists). Each slice lives in `store/`. Persist state to device storage via `zustand/middleware`'s `persist` with `@react-native-async-storage/async-storage` as the storage adapter.

## Navigation

Use **Expo Router** (file-based routing on top of React Navigation). Modals and bottom sheets are rendered as Expo Router `(modal)` routes or with `@gorhom/bottom-sheet`.

## Key Data Model

```ts
interface TaskList {
  id: string;
  title: string;
  createdAt: number;
}

interface Task {
  id: string;
  listId: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: number;       // Unix ms
  subtasks: Subtask[];
  createdAt: number;
  completedAt?: number;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}
```

## Key Patterns

### State flow
`useListsStore` owns `lists[]` and `activeListId`. `useTasksStore` owns `tasks[]`. The `useTaskList` hook derives `activeTasks` / `completedTasks` for the current list — always use this hook in screens rather than filtering inline. Both stores persist to `AsyncStorage` via Zustand's `persist` middleware.

### AddTaskSheet
Uses `forwardRef<BottomSheet, Props>` so the parent can call `bottomSheetRef.current?.expand()` from the FAB press handler. Opened with `index={-1}` (closed) and expands to `40%`.

### Completed tasks
Active tasks render first. A collapsible "Completed (N)" toggle button is shown in `ListFooterComponent`. When expanded, completed tasks append to the same `FlatList` data array — no separate list or section.

## UI Conventions

- Color tokens are in `constants/theme.ts`. Primary blue is `#1a73e8`.
- All icons are `MaterialIcons` from `@expo/vector-icons`.
- `GestureHandlerRootView` is at the root (`app/_layout.tsx`). Do not add it again in child components.
- The default list (`id: 'default'`, title `'My Tasks'`) is pre-seeded and cannot be deleted.

## Dependencies to Use

| Purpose | Package |
|---|---|
| Navigation | `expo-router` |
| State | `zustand` |
| Persistence | `@react-native-async-storage/async-storage` |
| Gestures | `react-native-gesture-handler` |
| Bottom sheet | `@gorhom/bottom-sheet` |
| Date picker | `@react-native-community/datetimepicker` |
| Icons | `@expo/vector-icons` (MaterialIcons) |
| Animations | `react-native-reanimated` |
