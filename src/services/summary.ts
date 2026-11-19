import type { Task } from "../types/task";

export interface Summary {
  subject: string;
  text: string;
}

// Arma el texto del email a partir de las tareas.
// Es una función "pura": misma entrada, misma salida. Por eso es fácil de testear.
export function buildSummary(tasks: Task[]): Summary {
  const completed = tasks.filter((t) => t.completed);
  const pending = tasks.filter((t) => !t.completed);

  const list = (items: Task[]) =>
    items.length ? items.map((t) => `- ${t.title}`) : ["(ninguna)"];

  const text = [
    `Total de tareas: ${tasks.length}`,
    `Completadas: ${completed.length}`,
    `Pendientes: ${pending.length}`,
    "",
    "Pendientes:",
    ...list(pending),
    "",
    "Completadas:",
    ...list(completed),
  ].join("\n");

  return {
    subject: `Resumen de tus tareas: ${pending.length} pendientes`,
    text,
  };
}

// El frontend NO habla con AWS: llama a nuestra función de Vercel.
export async function sendSummaryEmail(to: string, tasks: Task[]): Promise<void> {
  const { subject, text } = buildSummary(tasks);
  const response = await fetch("/api/send-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, text }),
  });
  if (!response.ok) {
    throw new Error("No se pudo enviar el resumen");
  }
}