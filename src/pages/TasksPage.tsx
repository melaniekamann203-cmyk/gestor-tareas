import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { Layout } from "../components/Layout";
import { TodoForm } from "../components/TodoForm";
import { TodoList } from "../components/TodoList";
import { SummaryButton } from "../components/SummaryButton";
import { createTask, deleteTask, updateTask } from "../services/tasks";
import type { Task, TaskFormValues } from "../types/task";

export function TasksPage() {
  const { user } = useAuth();
  const { tasks, loading, error } = useTasks(user?.uid);

  if (!user) return null;
  const userId = user.uid;

  async function handleCreate(values: TaskFormValues) {
    await createTask(userId, values);
  }

  async function handleToggle(task: Task) {
    await updateTask(task.id, { completed: !task.completed });
  }

  async function handleEdit(id: string, values: TaskFormValues) {
    await updateTask(id, values);
  }

  async function handleDelete(id: string) {
    await deleteTask(id);
  }

  const pending = tasks.filter((t) => !t.completed).length;

  return (
    <Layout user={user}>
      <TodoForm onSubmit={handleCreate} />
      <p className="summary">
        {pending} pendientes de {tasks.length}
      </p>
      {user.email && <SummaryButton email={user.email} tasks={tasks} />}
      {loading && <p className="status">Cargando tareas...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <TodoList
          tasks={tasks}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </Layout>
  );
}