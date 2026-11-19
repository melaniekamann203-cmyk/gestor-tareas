import { describe, expect, it, vi } from "vitest";
import { FirebaseError } from "firebase/app";
import { getAuthErrorMessage } from "./auth";

// Mock: reemplazamos la conexión real con Firebase,
// así el test no depende de internet ni de credenciales.
vi.mock("./firebase", () => ({ auth: {}, googleProvider: {} }));

describe("getAuthErrorMessage", () => {
  it("traduce el error de email ya registrado", () => {
    const error = new FirebaseError("auth/email-already-in-use", "error");
    expect(getAuthErrorMessage(error)).toBe("Ese email ya está registrado.");
  });

  it("traduce el error de contraseña débil", () => {
    const error = new FirebaseError("auth/weak-password", "error");
    expect(getAuthErrorMessage(error)).toBe(
      "La contraseña debe tener al menos 6 caracteres."
    );
  });

  it("devuelve un mensaje genérico para errores desconocidos", () => {
    expect(getAuthErrorMessage(new Error("algo raro"))).toBe(
      "Ocurrió un error. Intentá de nuevo."
    );
  });
});