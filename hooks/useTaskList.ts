import { useMemo } from 'react';
import { useListsStore } from '../store/lists';
import { useTasksStore } from '../store/tasks';

export function useTaskList() {
  const { lists, activeListId } = useListsStore();
  const { tasks } = useTasksStore();

  const activeList = useMemo(
    () => lists.find((l) => l.id === activeListId),
    [lists, activeListId]
  );

  const activeTasks = useMemo(
    () => tasks.filter((t) => t.listId === activeListId && !t.completed),
    [tasks, activeListId]
  );

  const completedTasks = useMemo(
    () => tasks.filter((t) => t.listId === activeListId && t.completed),
    [tasks, activeListId]
  );

  return { activeList, activeTasks, completedTasks, activeListId };
}
