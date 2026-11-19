import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoForm } from "./TodoForm";

describe("TodoForm", () => {
  it("no envía una tarea con el título vacío y muestra un error", async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole("button", { name: "Agregar tarea" }));

    expect(screen.getByText("El título es obligatorio.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("envía la tarea con el título y la descripción sin espacios de más", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TodoForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByPlaceholderText("Título"), "  Estudiar React  ");
    await userEvent.type(screen.getByPlaceholderText("Descripción (opcional)"), "Hooks");
    await userEvent.click(screen.getByRole("button", { name: "Agregar tarea" }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Estudiar React",
      description: "Hooks",
    });
  });

  it("muestra un error si falla el guardado", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("falló Firestore"));
    render(<TodoForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByPlaceholderText("Título"), "Tarea");
    await userEvent.click(screen.getByRole("button", { name: "Agregar tarea" }));

    expect(await screen.findByText("No se pudo guardar la tarea.")).toBeInTheDocument();
  });
});