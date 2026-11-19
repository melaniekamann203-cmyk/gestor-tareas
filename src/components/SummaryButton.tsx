import { useState } from "react";
import { sendSummaryEmail } from "../services/summary";
import type { Task } from "../types/task";

interface SummaryButtonProps {
  email: string;
  tasks: Task[];
}

type Status = "idle" | "sending" | "success" | "error";

export function SummaryButton({ email, tasks }: SummaryButtonProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick() {
    setStatus("sending");
    try {
      await sendSummaryEmail(email, tasks);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="summary-action">
      <button
        type="button"
        className="secondary"
        onClick={handleClick}
        disabled={status === "sending"}
      >
        {status === "sending" ? "Enviando..." : "Enviar resumen por email"}
      </button>
      {status === "success" && (
        <p className="status">Listo, te enviamos el resumen a {email}.</p>
      )}
      {status === "error" && (
        <p className="error">No se pudo enviar el resumen. Intentá de nuevo.</p>
      )}
    </div>
  );
}