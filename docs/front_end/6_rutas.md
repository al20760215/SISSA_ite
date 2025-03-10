---
sidebar_position: 6
---

# Rutas del Proyecto

Este documento describe las rutas del frontend y los componentes que renderizan en la aplicación.

## Rutas Públicas
Rutas accesibles para cualquier usuario, sin necesidad de autenticación.

| Ruta          | Componente        | Descripción |
|--------------|-----------------|-------------|
| \`/\`        | \`HomeAbout\`     | Página principal de la aplicación. |
| \`/login\`   | \`Login\`        | Página de inicio de sesión. |
| \`/register\` | \`Register\`    | Página de registro de usuarios. |
| \`/dataUpdate\` | \`DataUpdate\` | Página para actualizar datos del usuario. |

## Rutas Protegidas
Rutas restringidas según el rol del usuario.

###  Alumno
| Ruta                  | Componente           | Descripción |
|----------------------|-------------------|-------------|
| \`/alumno/dashboard\` | \`DashboardAlumno\` | Panel principal del alumno. |

### Responsable de Proyecto
| Ruta                      | Componente                 | Descripción |
|--------------------------|-------------------------|-------------|
| \`/responsable/dashboard\` | \`DashboardResponsable\` | Panel principal del responsable de proyecto. |

### Administrador
| Ruta                      | Componente      | Descripción |
|--------------------------|--------------|-------------|
| \`/admin/dashboard\`       | \`Dashboard\` | Panel principal del administrador. |
| \`/admin/manage/users/:userId\` | \`Test\` | Gestión de usuarios por ID. |

## Rutas No Encontradas
| Ruta   | Componente  | Descripción |
|--------|------------|-------------|
| \`*\`  | \`Page404\` | Página de error para rutas inexistentes. |

## Configuración de Rutas en React
Las rutas están configuradas en el archivo \`App.jsx\` usando **React Router**.

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomeAbout />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dataUpdate" element={<DataUpdate />} />

    <Route path="/alumno">
      <Route path="dashboard" element={<DashboardAlumno />} />
    </Route>

    <Route path="/responsable">
      <Route path="dashboard" element={<DashboardResponsable />} />
    </Route>

    <Route path="/admin">
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="manage">
        <Route path="users/:userId" element={<Test />} />
      </Route>
    </Route>

    <Route path="*" element={<Page404 />} />
  </Routes>
</BrowserRouter>
