# Space Booking App

El frontend de mi sistema de reserva de espacios. Lo armé con Angular 21 usando componentes standalone y PrimeNG para la UI.

## ¿Qué hace?

Es la interfaz para el sistema de reservas. Tiene dos perfiles:

**Si eres usuario normal:**
- Ves todos los espacios disponibles (salas, oficinas, auditorios, etc.)
- Los puedes filtrar por tipo, capacidad, precio
- Haces reservas de los espacios que te interesan
- Ves tu historial de reservas
- Cancelas reservas si cambias de planes

**Si eres admin:**
- Todo lo anterior +
- Panel de administración para crear/editar/eliminar espacios
- Tabla chida con paginación, búsqueda y ordenamiento (usando MC-Table)

## Lo que necesitas

- Node.js 18 o más nuevo
- npm 11.6.0+
- Angular CLI 21.0.4
- El backend corriendo en `http://localhost:8000` (mi otro repo: space-booking-server)

## Cómo lo instalas

Clona el repo:
```bash
git clone https://github.com/OscarMG4/space-booking-app.git
cd space-booking-app
```

Instala todo:
```bash
npm install
```

Verifica que apunte al backend correcto (ya debería estar bien):
```typescript
// src/app/core/services/api.ts
private readonly apiUrl = 'http://localhost:8000/api';
```

Levanta el servidor:
```bash
npm start
```

Y abre `http://localhost:4200` en tu navegador.

## Comandos útiles

```bash
npm start          # Corre el proyecto
npm run build      # Lo compila para producción
npm run watch      # Compila con auto-reload
npm test           # Corre los tests (si los hubiera 😅)
```

## Stack técnico

- **Angular 21**: Con componentes standalone (sin NgModules)
- **PrimeNG**: Para todos los componentes de UI (botones, tablas, inputs, etc.)
- **Signals**: Para manejar el estado de forma reactiva
- **RxJS**: Para las peticiones HTTP
- **MC-Table**: Tabla pro con paginación, búsqueda y filtros
- **SCSS**: Para los estilos con variables y mixins

Los componentes tienen bordes redondeados (20px en cards) y sombras suaves.

## Autenticación

El flow es simple:
1. Te registras o haces login
2. El backend te da un token JWT
3. Lo guardo en localStorage
4. Un interceptor lo añade automáticamente a todas tus peticiones
5. Los guards protegen las rutas privadas
6. Cuando haces logout, limpio todo y te mando al login

## Rutas

```
/auth/login              → Login (público)
/auth/register           → Registro (público)
/spaces                  → Lista de espacios (requiere login)
/spaces/:id              → Detalle de un espacio
/bookings/new            → Crear reserva
/bookings/my-bookings    → Mis reservas
/admin/spaces            → Panel admin (solo admins)
```

## El backend

Este frontend consume mi API de Laravel que está en otro repo. Los endpoints principales:

```
POST   /auth/login              - Loguearte
POST   /auth/register           - Registrarte
GET    /spaces                  - Ver espacios
POST   /bookings                - Crear reserva
GET    /bookings/my-bookings    - Tus reservas
POST   /bookings/:id/cancel     - Cancelar reserva
DELETE /spaces/:id              - Borrar espacio (admin)
```

## Decisiones que tomé

**Standalone Components:** Angular 21 ya no necesita NgModules, así que aproveché para hacer todo con componentes standalone. El código queda más limpio.

**Signals en vez de observables:** Para el estado local uso signals porque son más simples que estar manejando subscripciones everywhere.

**PrimeNG:** Podría haber usado Material o Bootstrap, pero PrimeNG tiene componentes más completos out-of-the-box. La tabla en el admin es un lujo.

**MC-Table:** Para el panel de admin quería algo más pro que una tabla normal. MC-Table trae paginación, búsqueda, ordenamiento y filtros ya hechos.

**localStorage para el token:** Sí, sé que sessionStorage es más seguro, pero quería que la sesión persista aunque cierres el navegador.

**Arquitectura de carpetas:** Separé todo en `core` (lo que usa todo el proyecto), `features` (cada funcionalidad) y `shared` (componentes reutilizables).

## Estilos

Los estilos están en:
- **_variables.scss**: Todos los colores, espaciados, fuentes
- **_mixins.scss**: Funciones que uso mucho (flex-center, gradientes, etc.)
- **Cada componente**: Su propio .scss

Traté de mantenerlo DRY (Don't Repeat Yourself), por eso uso variables y mixins para casi todo.

## Problemas comunes

**Error de CORS:** Asegúrate de que el backend tenga configurado CORS para `localhost:4200`. Ya debería estar si usas mi backend.

**Token expirado:** El sistema te manda automáticamente al login cuando expira. Si pasa mucho, revisa el TTL en el backend.

**Estilos raros:** A veces npm hace cosas extrañas. Borra `node_modules` y corre `npm install` de nuevo.

**No carga nada:** ¿El backend está corriendo? Revisa en la consola del navegador si hay errores 404 o 500.

Hecho con Angular 21
