# newtwenity
A modern social networking platform that connects users through profiles, posts, messaging, and communities.

## Estructura del proyecto

El repositorio está dividido en dos carpetas independientes:

* **`backend/`**: API REST en Node/Express. Es la única parte que habla con Supabase (Auth, Postgres y Storage), usando la clave anónima del proyecto. El SQL del esquema y las políticas RLS vive en `backend/sql/`.
* **`frontend/`**: aplicación Vite/React. Solo consume la API del backend (no importa `@supabase/supabase-js`).

### Puesta en marcha en local

En dos terminales:

```bash
cd backend
npm install
cp .env.example .env   # rellena SUPABASE_URL y SUPABASE_ANON_KEY
npm run dev             # http://localhost:4000
```

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL apuntando al backend
npm run dev             # http://localhost:5173
```

# Creación de ramas de trabajo

Imagina que estás desarrollando una aplicación inspirada en la red social **Tuenti**.

En este proyecto utilizaremos tres tipos de ramas:

* **`main`**: contiene la versión estable del proyecto.
* **`develop`**: reúne las nuevas funcionalidades antes de pasar a `main`.
* **`feature/*`**: se crea una para cada nueva funcionalidad.

## 1. Actualiza la rama `develop`

Antes de comenzar una nueva tarea, asegúrate de que `develop` está actualizada.

```bash
git checkout develop
git pull origin develop
```

## 2. Crea una rama para tu tarea

Crea la rama a partir de `develop` utilizando un nombre descriptivo.

```bash
git checkout -b feature/inicio-sesion
```

Otros ejemplos:

* `feature/perfil-usuario`
* `feature/publicaciones`
* `feature/lista-amigos`

## 3. Desarrolla la funcionalidad

Realiza todos los cambios en tu rama sin modificar directamente `develop` ni `main`.

## 4. Guarda los cambios

Añade los archivos modificados y crea un *commit*.

```bash
git add .
git commit -m "Añade formulario de inicio de sesión"
```

## 5. Actualiza tu rama antes de subirla

Antes de subir tu trabajo, incorpora los últimos cambios de `develop`.

```bash
git checkout develop
git pull origin develop
git checkout feature/inicio-sesion
git merge develop
```

Si aparecen conflictos, resuélvelos antes de continuar.

## 6. Sube la rama al repositorio remoto

```bash
git push -u origin feature/inicio-sesion
```

## 7. Crea un Pull Request

Desde GitHub, crea un **Pull Request** para fusionar tu rama **`feature/inicio-sesion`** con **`develop`**.

## 8. Integración y publicación

Cuando todas las funcionalidades estén revisadas y probadas, la rama **`develop`** se fusionará con **`main`**, que contendrá la versión estable de la aplicación.

