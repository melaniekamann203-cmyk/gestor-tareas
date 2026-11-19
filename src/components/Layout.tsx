import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { logout } from "../services/auth";

interface LayoutProps {
  user: User;
  children: ReactNode;
}

export function Layout({ user, children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="header">
        <h1>Gestor de Tareas</h1>
        <div className="user">
          <span>{user.displayName ?? user.email}</span>
          <button type="button" className="secondary" onClick={() => logout()}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}