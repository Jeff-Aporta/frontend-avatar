# 65 — Administración: usuarios, roles y mi cuenta

> Alcance: la vista `admin` (`/admin/`). Fuera: miembros de empresas (spec `60`).

## 1. Propósito (WHAT)

El administrador (acción `avatar.seguridad`) gestiona los usuarios de Avatar y qué puede hacer cada rol. Cualquier usuario cambia su contraseña y revisa o cierra sus sesiones.

## 2. Requisitos WHAT

- [W-ADM-01] Sin `avatar.seguridad` la vista dice que no hay permiso y solo ofrece «Mi cuenta».
- [W-ADM-02] Usuarios: tabla con usuario, nombre, correo, rol y si está activo, con búsqueda. Al elegir una fila: editar, eliminar (con confirmación) y cambiar su rol principal (vacío = rol base).
- [W-ADM-03] Crear usuario exige un id de 2 a 120 caracteres y una contraseña de al menos 8; editar no cambia el id y la contraseña solo cambia si se escribe. El correo, si viene, debe ser válido.
- [W-ADM-04] Nadie elimina su propio usuario desde aquí.
- [W-ADM-05] Roles: cada rol del grupo AVATAR con sus acciones y su valor (permite, niega o por verbo). Se crea un rol con id en mayúsculas sin espacios; se da o niega una acción del catálogo a un rol; se quita una acción.
- [W-ADM-06] Tras cambiar roles o acciones, los permisos de la sesión se refrescan.
- [W-ADM-07] Mi cuenta: cambiar la contraseña (actual + nueva repetida, mínimo 8) cierra las demás sesiones; la lista de sesiones muestra navegador, sistema, IP, último acceso y marca la actual; «Cerrar todas» cierra también esta y lleva al acceso.

## 3. Guía HOW WEAK

- [HW-ADM-01] El shell `<av-admin>` habla con los plugins de identidad y permisos de DER; los hijos pintan y emiten.
- [HW-ADM-02] Validación, normalización del id de rol y lectura de valores en `view/admin/utils/admin.ts`.

## 4. Contratos HOW STRONG

- [HS-ADM-01] Tags: `av-usuario-form`, `av-usuarios`, `av-roles`, `av-admin` (shell).
- [HS-ADM-02] Eventos: `av-usuario-nuevo`, `av-usuario-editar`, `av-usuario-eliminar`, `av-usuario-rol`, `av-usuario-guardar`/`av-usuario-cerrar`, `av-rol-crear`, `av-accion-poner`, `av-accion-quitar`.
- [HS-ADM-03] API: `usuarios` (identidad), `roles`, `rolesUsuario`, `acciones`, `catalog`, `load` (permisos), `changePassword`, `sessions`, `logoutAll`.

## 5. Casos borde y errores

- [W-ADM-08] Cargar a un rol una acción con el mismo valor que el rol base lo rechaza el server y se muestra el mensaje.
- [W-ADM-09] Si «Cerrar todas» falla, igual se cierra la sesión local.

## 6. Pruebas (WHAT / HOW WEAK)

- [W-ADM-10] Validación de usuario, cuerpo de usuario sin contraseña vacía, normalización de id de rol, rol principal, acciones por rol y valor legible (`tests/vistas/admin`).

## 7. Notas

Sin notas.
