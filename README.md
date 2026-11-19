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

El botón **"Enviar resumen por email"** manda al usuario un resumen del estado de sus tareas (total, pendientes y completadas).

**Flujo:**

1. `SummaryButton` llama al service `sendSummaryEmail` (`src/services/summary.ts`). El frontend **nunca** habla con AWS directamente.
2. El service arma el resumen con `buildSummary` y hace un `POST` a `/api/send-summary`.
3. La Vercel Function (`api/send-summary.ts`) **valida el payload** (`to`, `subject`, `text`) y responde `400` si falta algo o es inválido.
4. La función envía el email con **AWS SES** (SDK v3, `@aws-sdk/client-ses`) y responde `200`. Si SES falla, responde `502`.
5. El botón muestra el estado: **enviando** (deshabilitado), **éxito** o **error**.

**Variables de entorno (solo en el servidor, configuradas en Vercel):**

| Variable | Descripción |
|---|---|
| `SES_REGION` | Región de SES, por ejemplo `us-east-1` |
| `SES_ACCESS_KEY_ID` | Access key de un usuario IAM con permiso solo para enviar emails |
| `SES_SECRET_ACCESS_KEY` | Secret key de ese usuario |
| `SES_FROM_EMAIL` | Email verificado en SES que envía el resumen |

Estas variables **no llevan el prefijo `VITE_`**, así nunca llegan al navegador. Se usa el prefijo `SES_` porque Vercel reserva los nombres `AWS_*`.

**SES en sandbox:** la cuenta de SES funciona en modo sandbox, así que solo puede enviar emails a direcciones verificadas en SES. Para este proyecto alcanza con verificar el propio email del usuario.

**Estado actual:** el código del envío está completo (botón, service, Vercel Function y validación). La activación de la cuenta de AWS quedó pendiente por un problema con la verificación telefónica del registro. Una vez activada, solo resta verificar el email en SES, crear el usuario IAM y cargar las 4 variables en Vercel. No hace falta cambiar código.

*(En desarrollo: se documenta acá el flujo con Vercel Functions + AWS SES.)*

## Cómo usé la IA

Usé la IA (Claude) como **tutor personal**: una guía para no equivocarme y, sobre todo, para ir aprendiendo mientras construía el proyecto. Le pedía avanzar **paso a paso, de a un archivo**, y que me explicara qué hacía cada parte antes de seguir. Así entendía el código en vez de solo copiarlo.

**Errores que encontré y resolví:**
- Un archivo mal nombrado (`TasksPge.tsx` en lugar de `TasksPage.tsx`), que rompía las rutas. Lo renombré.
- Una llave `}` que faltaba al final de un componente. La detecté por el error del editor y la agregué.
- El nombre del archivo de configuración de los tests no coincidía con el de `vite.config.ts`. Los igualé.
- El traductor de Chrome alteraba los textos de la app en producción. Lo resolví declarando el idioma en `index.html` (`lang="es"`).

**Cómo validé lo que generaba la IA:** corriendo la app en local, ejecutando `npm test` (los tests tienen que pasar en verde) y `npm run build` antes de cada deploy. También probé la versión publicada en Vercel.

**Qué aprendí:** aprendí todo lo que vi en este módulo y, lo más importante, pude **aplicarlo en la práctica**. Sé que me falta practicar mucho, porque es mucho contenido, pero ahora entiendo cómo se conectan las piezas de una app real.

**Por qué este método me sirve:** las clases en vivo son grabadas y muchas veces mis compañeros están en otro punto del proceso, así que prefiero no interrumpir con mis dudas. Henry me da las herramientas fundamentales y resume en meses una carrera que llevaría un año o más. La IA complementa eso como un tutor con la paciencia para explicarme cada paso a mi ritmo.