export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  listId: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: number;
  subtasks: Subtask[];
  createdAt: number;
  completedAt?: number;
}

export interface TaskList {
  id: string;
  title: string;
  createdAt: number;
}
