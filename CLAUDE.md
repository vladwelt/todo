# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Google Tasks-style to-do app built with **React Native** and **Expo**. The goal is to replicate the core UX of Google Tasks: task lists, subtasks, due dates, and a clean bottom-sheet/modal-driven UI.

## Getting Started

The project has not been scaffolded yet. When initializing:

```bash
npx create-expo-app@latest . --template blank-typescript
```

## Commands

Once the project is initialized:

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

## Intended Architecture

```
app/               # Expo Router file-based routes (screens)
  (tabs)/          # Bottom tab navigator
    index.tsx      # "My Tasks" default list
    lists.tsx      # All task lists view
  task/[id].tsx    # Task detail / edit screen
components/        # Shared UI components (TaskItem, ListCard, FAB, etc.)
store/             # Global state (Zustand or Context + useReducer)
  tasks.ts         # Task CRUD actions and selectors
  lists.ts         # List management
hooks/             # Custom hooks (useTaskList, useDueDatePicker, etc.)
lib/               # Pure utilities (date formatting, sorting helpers)
constants/         # Theme colors, spacing, typography
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

## UI Conventions

- Follow Google Tasks visual language: white background, blue accent (`#1a73e8`), Roboto-style text hierarchy.
- Completed tasks collapse below active tasks within the same list, separated by a "Completed" section header.
- Swipe-to-complete and swipe-to-delete on task rows (use `react-native-gesture-handler`).
- The FAB (`+`) opens a quick-add bottom sheet; tapping a task row opens the full detail modal.
- Dark mode is supported via `useColorScheme` from `react-native`.

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
