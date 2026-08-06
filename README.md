# Sistema de Gestión de Encuestas (MVC & React)

Aplicación web desarrollada como parte de la tarea de **Patrones de Diseño**, diseñada para la creación, gestión, respuesta y análisis estadístico de encuestas de forma profesional e intuitiva.

---

## 🛠️ Tecnologías Utilizadas

- **Backend**: 
  - C# (.NET 9 / ASP.NET Core MVC & Web API)
  - Entity Framework Core (ORM con SQL Server / Base de datos relacional)
  - ASP.NET Core Identity (Autenticación y gestión de usuarios y roles)
- **Frontend**:
  - React.js
  - Material-UI (MUI) para componentes visuales modernos
  - Recharts para visualización de estadísticas y gráficos analíticos
  - React Router DOM para navegación SPA

---

## 🏛️ Patrones de Diseño Implementados

1. **MVC (Modelo-Vista-Controlador)**: Separación clara entre la lógica de negocio, datos y la interfaz de usuario en el backend.
2. **Factory Method (Método Fábrica)**: Utilizado en la creación y estructuración de colecciones de opciones predeterminadas o dinámicas según el tipo de pregunta seleccionada (`PreguntasController`).

---

## ✨ Características Principales

- **Autenticación segura**: Registro e inicio de sesión de usuarios con diseño limpio y minimalista.
- **Gestión de Encuestas**: Crear, editar, activar/desactivar y eliminar encuestas.
- **Gestor de Preguntas Avanzado**: 
  - Soporte para múltiples tipos de preguntas: **Texto Libre**, **Selección Única**, **Opción Múltiple** y **Escala Numérica**.
  - **Creación y edición personalizada** de opciones de respuesta para preguntas de selección.
- **Módulo de Respuestas**: Interfaz pública y privada para responder encuestas de forma fluida.
- **Estadísticas y Gráficos**: Visualización de resultados mediante gráficos de barras y pastel, junto con tablas detalladas de respuestas recolectadas.

---

## 🚀 Guía de Ejecución

### 1. Backend (.NET API)
1. Abrir una terminal en la carpeta `backend/`.
2. Restaurar dependencias y compilar:
   ```bash
   dotnet restore
   dotnet build
   ```
3. Ejecutar el servidor:
   ```bash
   dotnet run
   ```

### 2. Frontend (React)
1. Abrir una terminal en la carpeta `front/`.
2. Instalar dependencias (si es necesario):
   ```bash
   npm install
   ```
3. Iniciar la aplicación en modo desarrollo:
   ```bash
   npm start
   ```
