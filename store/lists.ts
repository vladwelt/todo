import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TaskList } from '../types';

const DEFAULT_LIST: TaskList = {
  id: 'default',
  title: 'My Tasks',
  createdAt: Date.now(),
};

interface ListsState {
  lists: TaskList[];
  activeListId: string;
  addList: (title: string) => void;
  updateList: (id: string, title: string) => void;
  deleteList: (id: string) => void;
  setActiveList: (id: string) => void;
}

export const useListsStore = create<ListsState>()(
  persist(
    (set, get) => ({
      lists: [DEFAULT_LIST],
      activeListId: DEFAULT_LIST.id,
      addList: (title) => {
        const newList: TaskList = {
          id: Date.now().toString(),
          title,
          createdAt: Date.now(),
        };
        set((state) => ({ lists: [...state.lists, newList] }));
      },
      updateList: (id, title) => {
        set((state) => ({
          lists: state.lists.map((l) => (l.id === id ? { ...l, title } : l)),
        }));
      },
      deleteList: (id) => {
        const { lists, activeListId } = get();
        const remaining = lists.filter((l) => l.id !== id);
        set({
          lists: remaining,
          activeListId: activeListId === id ? (remaining[0]?.id ?? '') : activeListId,
        });
      },
      setActiveList: (id) => set({ activeListId: id }),
    }),
    {
      name: 'lists-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
