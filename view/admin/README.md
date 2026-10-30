# Vista `admin` — Usuarios, roles y mi cuenta

Shell: `<av-admin>`. Ruta: `#/admin`. Página aislada: `/view/admin/`. Demo: `/view/admin/demo/`. Spec: `specs/foundation/65-admin.md`.

## Alcance

- Dentro: usuarios del plugin de identidad (crear, editar, eliminar, rol principal), roles del grupo AVATAR y sus acciones, cambio de contraseña y sesiones propias.
- Fuera: miembros de empresas (vista `organizacion`).

## Contrato

- Usuarios y roles solo con `avatar.seguridad`; «Mi cuenta» para todos.
- Hijos: `av-usuario-form`, `av-usuarios`, `av-roles`; el shell habla con `auth()` y `permisos()` y refresca los permisos tras cada cambio de rol.
- Dominio sin DOM en `utils/admin.ts`.

## Qué no hacer

- Decidir permisos en el front más allá de ocultar botones; HTML suelto; `fetch` directo.
