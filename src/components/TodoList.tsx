import { useState } from "react";
import type { Task, TaskFormValues } from "../types/task";
import { TodoForm } from "./TodoForm";

interface TodoListProps {
  tasks: Task[];
  onToggle: (task: Task) => Promise<void>;
  onEdit: (id: string, values: TaskFormValues) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoList({ tasks, onToggle, onEdit, onDelete }: TodoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function run(action: () => Promise<void>) {
    setActionError(null);
    try {
      await action();
    } catch {
      setActionError("No se pudo completar la acción. Intentá de nuevo.");
    }
  }

  if (tasks.length === 0) {
    return <p className="status">Todavía no tenés tareas. ¡Creá la primera!</p>;
  }

  return (
    <>
      {actionError && <p className="error">{actionError}</p>}
      <ul className="todo-list">
        {tasks.map((task) =>
          editingId === task.id ? (
            <li key={task.id}>
              <TodoForm
                initialValues={{ title: task.title, description: task.description }}
                submitLabel="Guardar"
                onCancel={() => setEditingId(null)}
                onSubmit={async (values) => {
                  await onEdit(task.id, values);
                  setEditingId(null);
                }}
              />
            </li>
          ) : (
            <li
              key={task.id}
              className={`card todo-item ${task.completed ? "done" : ""}`}
            >
              <label className="todo-check">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => run(() => onToggle(task))}
                />
                <span>
                  <strong>{task.title}</strong>
                  {task.description && <small>{task.description}</small>}
                </span>
              </label>
              <div className="actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setEditingId(task.id)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => run(() => onDelete(task.id))}
                >
                  Eliminar
                </button>
              </div>
            </li>
          )
        )}
      </ul>
    </>
  );
}