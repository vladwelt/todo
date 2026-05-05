import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task, Subtask } from '../types';

interface AddTaskParams {
  listId: string;
  title: string;
  notes?: string;
  dueDate?: number;
}

interface TasksState {
  tasks: Task[];
  addTask: (params: AddTaskParams) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'listId' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  deleteTasksByList: (listId: string) => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: ({ listId, title, notes, dueDate }) => {
        const task: Task = {
          id: Date.now().toString(),
          listId,
          title,
          notes,
          dueDate,
          completed: false,
          subtasks: [],
          createdAt: Date.now(),
        };
        set((state) => ({ tasks: [...state.tasks, task] }));
      },
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },
      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      },
      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed ? Date.now() : undefined,
                }
              : t
          ),
        }));
      },
      addSubtask: (taskId, title) => {
        const subtask: Subtask = {
          id: Date.now().toString(),
          title,
          completed: false,
        };
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, subtasks: [...t.subtasks, subtask] } : t
          ),
        }));
      },
      toggleSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((s) =>
                    s.id === subtaskId ? { ...s, completed: !s.completed } : s
                  ),
                }
              : t
          ),
        }));
      },
      deleteSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) }
              : t
          ),
        }));
      },
      deleteTasksByList: (listId) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.listId !== listId) }));
      },
    }),
    {
      name: 'tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
