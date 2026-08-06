# Sistema de Gestión de Encuestas (EncuestasApp)

**Universidad Nacional Autónoma de Nicaragua, León (UNAN-León)**  
**Área de Conocimiento de Ciencias y Tecnología**  
**Carrera:** Ing. en Sistemas de Información  
**Componente:** Programación Orientada a la Web II / Patrones de Diseño  

**Elaborado por:** Kevin Alejandro Sánchez Machado  
**Carné:** 22-01062-0  
**Docente / Tutor:**  WILLIAM NOEL MARTINEZ OROZCO
**Fecha:** 05/08/2026  

---

## 1. Introducción

El presente documento describe el funcionamiento, alcance y desarrollo del proyecto **Gestor de Encuestas (EncuestasApp)**. El objetivo central del sistema es permitir a los usuarios crear, administrar y responder encuestas mediante una plataforma web moderna, integrada y segura.

La aplicación se compone de un backend en **.NET 9 / ASP.NET MVC & Web API** y un frontend en **React**, comunicados mediante una API REST. El sistema incluye autenticación mediante Identity, manejo de roles (Admin y User), administración de encuestas, preguntas personalizadas con múltiples tipos, respuestas de usuarios, gráficos analíticos y exportación de datos.

---

## 2. Desarrollo

### 2.1 Arquitectura General
El sistema está dividido en dos capas principales:
- **Backend (.NET Core / MVC / Web API)**: Encargado de la lógica del servidor, seguridad, sesiones, autenticación con ASP.NET Identity, roles y gestión de la base de datos relacional mediante Entity Framework Core.
- **Frontend (React)**: Interfaz de usuario construida con componentes reutilizables (Material-UI), navegación SPA (React Router) y consumo de API mediante Fetch/Axios.

### 2.2 Funcionalidades Implementadas
1. **Autenticación y Sesiones**: Inicio y cierre de sesión seguro mediante ASP.NET Identity y persistencia de usuario.
2. **Gestión de Roles**: Diferenciación entre Administrador y Usuario, con control de acceso a módulos según el perfil.
3. **Gestión de Encuestas (CRUD)**: Creación, edición, actualización, listado general y eliminación de encuestas.
4. **Administración de Preguntas y Opciones**: 
   - Tipos de preguntas: Texto Libre, Selección Única, Opción Múltiple y Escala Numérica.
   - Creación y personalización dinámica de opciones de respuesta.
5. **Base de Datos Relacional**: Tablas estructuradas para usuarios, roles, encuestas, preguntas, opciones, respuestas y tablas de Identity.
6. **Estadísticas y Exportación**: Visualización de gráficos analíticos (Recharts) por pregunta y exportación de datos.

### 2.3 Tecnologías Utilizadas
- **Backend**:
  - ASP.NET Core MVC & Web API (.NET 9)
  - ASP.NET Core Identity
  - C#
  - Entity Framework Core
  - MySQL / SQL Server
- **Frontend**:
  - React 18+
  - React Router DOM
  - Material-UI (MUI)
  - Recharts (Gráficos analíticos)
- **Patrones de Diseño**:
  - **MVC (Modelo-Vista-Controlador)**: Arquitectura base del servidor.
  - **Factory Method (Método Fábrica)**: Utilizado para la creación y estructuración de opciones de preguntas según su tipo (`PreguntasController`).

### 2.4 Estructura del Proyecto
- **Backend (`backend/`)**:
  - `Controllers/`: Controladores MVC y controladores RESTful API (`Api/`).
  - `Models/`: Entidades del negocio (Usuario, Encuesta, Pregunta, PreguntaOpcion, Respuesta) y ViewModels.
  - `Data/`: Contexto de Entity Framework (`ApplicationDbContext`) y migraciones.
  - `Services/`: Servicios auxiliares como el servicio de exportación a Excel.
- **Frontend (`front/`)**:
  - `src/components/auth/`: Componentes de Login y Registro.
  - `src/components/encuestas/`: Gestión de encuestas, listados, creación, edición, preguntas y estadísticas.
  - `src/components/respuestas/`: Formulario para responder encuestas e historial "Mis Respuestas".
  - `src/services/`: Comunicación centralizada con la API (`api.js`).

---

## 3. Guía de Interfaz y Módulos

1. **Inicio de Sesión**: Interfaz limpia y centrada para ingresar con nombre de usuario y contraseña, con opción de registro.
2. **Dashboard de Encuestas**: Panel central de administración para listar, filtrar y crear nuevas encuestas.
3. **Creador de Encuestas y Preguntas**: Formulario paso a paso para definir el título, descripción, fecha de cierre, estado y añadir preguntas con opciones personalizadas.
4. **Módulo de Respuestas**: Interfaz interactiva donde los usuarios responden encuestas activas y consultan su historial en "Mis Respuestas".
5. **Estadísticas y Reportes**: Visualización de datos mediante gráficos de barras/pastel y tablas detalladas de respuestas.

---

## 4. Estructura de Base de Datos

El script SQL completo inicializa la base de datos `Encuestas`, configurando las tablas relacionales:
- `roles` y `usuarios`
- Tablas de Identity (`user_roles`, `user_claims`, `user_logins`, `user_tokens`, `role_claims`)
- `encuestas`, `preguntas`, `preguntas_opciones`, `respuestas`, `respuestas_opciones`

---

## 🔗 Enlaces del Proyecto

- **Repositorio GitHub**: [https://github.com/kaneki-04/encuestasapp](https://github.com/kaneki-04/encuestasapp)
- **OneDrive (Proyecto comprimido + Base de datos)**: [Enlace de OneDrive](https://estunanleonedu-my.sharepoint.com/:f:/g/personal/kevin_sanchez22_est_unanleon_edu_ni/EvENWnC1UF1OjvR2SIjbQMQB7I7xqZ7famY-duN4YLDuUw?e=fT1ZFj)

---

## 5. Conclusión
El proyecto **EncuestasApp** satisface los requerimientos establecidos para la asignatura Programación Orientada a la Web II, integrando un backend robusto en .NET con un frontend dinámico en React, aplicando principios sólidos de arquitectura por capas, control de identidad, API REST y patrones de diseño.
