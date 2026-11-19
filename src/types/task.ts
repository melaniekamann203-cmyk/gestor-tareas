export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: number;
}

export type TaskFormValues = Pick<Task, "title" | "description">;