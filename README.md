# Gestor de Tareas · PI M4 Henry

SPA para que los empleados de un cliente de MateCode gestionen sus tareas desde cualquier dispositivo. Cada usuario se registra, inicia sesión y administra **solo sus propias tareas**, que se guardan en la nube y se actualizan en tiempo real.

🔗 **Producción:** https://gestor-tareas-liart-mu.vercel.app

## Funcionalidades

- Registro y login con email y contraseña, y login con Google.
- Rutas privadas: sin sesión no se puede entrar a `/tasks`.
- Sesión persistente: al recargar, seguís adentro.
- CRUD de tareas: crear (título y descripción), listar, editar, eliminar y marcar como completada.
- Sincronización en tiempo real con `onSnapshot`, sin recargar la página.
- Errores de autenticación traducidos al español.
- Diseño responsive, mobile first.

## Stack

- **Frontend:** React + TypeScript, Vite, React Router.
- **Backend as a Service:** Firebase Authentication y Cloud Firestore.
- **Deploy:** Vercel.

## Arquitectura

```
src/
├── components/   # UI reutilizable: Layout, TodoForm, TodoList, PrivateRoute
├── pages/        # Pantallas: LoginPage, TasksPage
├── services/     # Única capa que habla con Firebase: firebase, auth, tasks
├── hooks/        # Conectan los services con React: useAuth, useTasks
└── types/        # Tipos compartidos: Task, TaskFormValues
api/              # Funciones serverless de Vercel
```

**Decisiones principales:**

- **Separación por capas.** Los componentes no llaman a Firebase directamente: usan hooks, y los hooks usan services. Así la UI queda separada de la lógica y es más fácil de testear.
- **Tiempo real con `onSnapshot`.** `useTasks` se suscribe a una query de Firestore filtrada por `userId` (patrón Observer). Cada alta, edición o baja actualiza la lista automáticamente. La suscripción se cancela cuando el componente se desmonta.
- **Un solo formulario para crear y editar.** `TodoForm` se reutiliza en los dos casos.
- **Seguridad en el servidor.** Además del filtro en el frontend, las reglas de Firestore (`firestore.rules`) solo permiten leer, editar o borrar una tarea a su dueño. Firestore está en modo producción, no en modo prueba.

## Instalación

```bash
git clone https://github.com/melaniekamann203-cmyk/gestor-tareas.git
cd gestor-tareas
npm install
cp .env.example .env   # y completar con los datos de tu proyecto de Firebase
npm run dev
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_FIREBASE_API_KEY` | API key de la app web de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio de autenticación |
| `VITE_FIREBASE_PROJECT_ID` | ID del proyecto |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de Storage |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `VITE_FIREBASE_APP_ID` | ID de la app |

El `.env` está en el `.gitignore` y nunca se sube al repo. En producción, las variables están configuradas en Vercel. El dominio de Vercel está autorizado en Firebase Authentication.

## Email con el resumen

*(En desarrollo: se documenta acá el flujo con Vercel Functions + AWS SES.)*

## Cómo usé la IA

*(Completar con mi reflexión.)*