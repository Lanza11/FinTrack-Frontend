# FinTrack Frontend

Frontend MVP de la aplicación web **FinTrack**, diseñada para la gestión de finanzas personales: ingresos, egresos, historial y presupuestos.


## Características (MVP)

* **Atomic Design Pattern**
  Arquitectura basada en átomos, moléculas, organismos, plantillas y páginas para maximizar la reutilización de componentes.

* **Validación estricta de formularios**
  Implementada con React Hook Form + Zod para garantizar datos consistentes y seguros.


## Tecnologías

### Core

* React 19
* TypeScript
* Vite

### Estilos

* Tailwind CSS v4

### Routing

* React Router v7

### Utilidades

* Lucide React (iconos)
* Sonner (notificaciones toast)

### Formularios

* React Hook Form
* @hookform/resolvers
* Zod


## Estructura del Proyecto

```bash
src/
├── components/
│   ├── atoms/         # Componentes básicos reutilizables (botones, inputs)
│   ├── molecules/     # Combinaciones de átomos
│   ├── organisms/     # Componentes complejos (tablas, formularios)
│   ├── templates/     # Layouts generales
│   └── pages/         # Vistas principales
├── config/            # Configuración global (API, endpoints)
├── services/          # Lógica HTTP y DTOs
├── store/             # Estado global (Context API)
├── styles/            # Estilos globales (Tailwind config)
└── App.tsx            # Configuración de rutas
```


## Variables de Entorno

Crea un archivo `.env.local` o `.env` en la raíz:

```env
VITE_API_URL=http://localhost:8080/api
```


## Instalación y Ejecución

### Instalar dependencias

```bash
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

### Build de producción

```bash
npm run build
```


## Despliegue

El proyecto incluye configuración para SPA en plataformas como Vercel:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Esto permite que React Router funcione correctamente en rutas internas.