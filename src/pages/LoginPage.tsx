import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  getAuthErrorMessage,
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
} from "../services/auth";

export function LoginPage() {
  const { user, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="status">Cargando...</p>;
  if (user) return <Navigate to="/tasks" replace />;

  return (
    <main className="auth">
      <h1>Gestor de Tareas</h1>
      <h2>{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h2>

      <form onSubmit={handleSubmit} className="card">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Procesando..." : isRegister ? "Registrarme" : "Entrar"}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={handleGoogle}
          disabled={submitting}
        >
          Continuar con Google
        </button>
      </form>

      <button
        type="button"
        className="link"
        onClick={() => {
          setIsRegister(!isRegister);
          setError(null);
        }}
      >
        {isRegister
          ? "¿Ya tenés cuenta? Iniciá sesión"
          : "¿No tenés cuenta? Registrate"}
      </button>
    </main>
  );
}