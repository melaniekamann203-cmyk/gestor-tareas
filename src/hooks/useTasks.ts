import { useEffect, useState } from "react";
import { subscribeToTasks } from "../services/tasks";
import type { Task } from "../types/task";

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = subscribeToTasks(
      userId,
      (data) => {
        setTasks(data);
        setError(null);
        setLoading(false);
      },
      () => {
        setError("No se pudieron cargar las tareas.");
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [userId]);

  return { tasks, loading, error };
}