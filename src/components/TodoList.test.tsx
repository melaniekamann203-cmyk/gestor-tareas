import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList } from "./TodoList";
import type { Task } from "../types/task";

const tasks: Task[] = [
  {
    id: "1",
    title: "Comprar mate",
    description: "Yerba y bombilla",
    completed: false,
    userId: "user-1",
    createdAt: 1,
  },
];

function renderList() {
  const props = {
    tasks,
    onToggle: vi.fn().mockResolvedValue(undefined),
    onEdit: vi.fn().mockResolvedValue(undefined),
    onDelete: vi.fn().mockResolvedValue(undefined),
  };
  render(<TodoList {...props} />);
  return props;
}

describe("TodoList", () => {
  it("muestra un mensaje cuando no hay tareas", () => {
    render(
      <TodoList tasks={[]} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText(/todavía no tenés tareas/i)).toBeInTheDocument();
  });

  it("muestra el título y la descripción de cada tarea", () => {
    renderList();
    expect(screen.getByText("Comprar mate")).toBeInTheDocument();
    expect(screen.getByText("Yerba y bombilla")).toBeInTheDocument();
  });

  it("marca la tarea como completada al tocar el checkbox", async () => {
    const { onToggle } = renderList();
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith(tasks[0]);
  });

  it("elimina la tarea al tocar Eliminar", async () => {
    const { onDelete } = renderList();
    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});