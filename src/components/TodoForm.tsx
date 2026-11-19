import { useState, type FormEvent } from "react";
import type { TaskFormValues } from "../types/task";

interface TodoFormProps {
  onSubmit: (values: TaskFormValues) => Promise<void>;
  initialValues?: TaskFormValues;
  submitLabel?: string;
  onCancel?: () => void;
}

const emptyValues: TaskFormValues = { title: "", description: "" };

export function TodoForm({
  onSubmit,
  initialValues = emptyValues,
  submitLabel = "Agregar tarea",
  onCancel,
}: TodoFormProps) {
  const [values, setValues] = useState<TaskFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = values.title.trim();
    if (!title) {
      setError("El título es obligatorio.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSubmit({ title, description: values.description.trim() });
      if (!onCancel) setValues(emptyValues);
    } catch {
      setError("No se pudo guardar la tarea.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card todo-form">
      <input
        placeholder="Título"
        value={values.title}
        onChange={(e) => setValues({ ...values, title: e.target.value })}
      />
      <textarea
        placeholder="Descripción (opcional)"
        value={values.description}
        onChange={(e) => setValues({ ...values, description: e.target.value })}
      />
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button type="submit" disabled={saving}>
          {saving ? "Guardando..." : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}