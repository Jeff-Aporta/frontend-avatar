# 60 — Organización: empresa, miembros y equipos

> Alcance: la vista `organizacion` (`#/organizacion`). Fuera: usuarios y roles (spec `65`), canales y proyectos.

## 1. Propósito (WHAT)

Quien trabaja en Avatar ve la empresa activa, sus miembros y sus equipos. Un gestor (acción `avatar.gestionar`) además crea y edita la empresa, invita y quita miembros, y arma los equipos.

## 2. Requisitos WHAT

- [W-ORG-01] La vista muestra tres pestañas: Empresa, Miembros y Equipos, siempre de la empresa activa.
- [W-ORG-02] Sin empresa, la vista lo dice; un gestor puede crear la suya desde ahí.
- [W-ORG-03] Empresa: nombre, NIT, sector y descripción. Un gestor la edita; el nombre es obligatorio y el NIT solo admite dígitos, letras, puntos y guiones.
- [W-ORG-04] «Nueva empresa» crea la empresa, deja al usuario como propietario y la vuelve la empresa activa.
- [W-ORG-05] Miembros: cada uno con su nombre, rol (propietario, administrador, miembro, invitado) y cargo, en ese orden de rol. El propietario no se puede quitar.
- [W-ORG-06] Invitar: el gestor elige un usuario existente (o escribe su id si no puede listarlos), un rol y un cargo; el invitado recibe una notificación.
- [W-ORG-07] Equipos: cada uno con su color, descripción e integrantes (líder primero). Un gestor crea, edita y elimina equipos y agrega (entre los miembros que faltan) o quita integrantes.
- [W-ORG-08] Sin `avatar.gestionar` no se ve ningún botón de escritura; el server rechaza igual cualquier escritura.

## 3. Guía HOW WEAK

- [HW-ORG-01] El shell `<av-organizacion>` es el único que habla con el API; los hijos pintan y emiten `av-*`.
- [HW-ORG-02] La validación y el orden viven en `view/organizacion/utils/organizacion.ts` (sin DOM).

## 4. Contratos HOW STRONG

- [HS-ORG-01] Tags: `av-empresa-form`, `av-invitar-form`, `av-miembros`, `av-equipos`, `av-organizacion` (shell).
- [HS-ORG-02] Eventos: `av-empresa-guardar`/`av-empresa-cerrar`, `av-invitar-guardar`/`av-invitar-cerrar`, `av-miembros-invitar`, `av-miembro-quitar`, `av-equipo-guardar`, `av-equipo-eliminar`, `av-integrante-agregar`, `av-integrante-quitar`.
- [HS-ORG-03] API: controllers `empresas`, `miembros`, `equipos`, `integrantes` del plugin `avatar`; `invitar` (`POST empresa/{iempresa}/invitar`); `usuarios` del plugin de identidad.

## 5. Casos borde y errores

- [W-ORG-09] Un error del API se muestra en el diálogo abierto (o como aviso) sin perder lo escrito.
- [W-ORG-10] Invitar a alguien que ya es miembro actualiza su rol y cargo.

## 6. Pruebas (WHAT / HOW WEAK)

- [W-ORG-11] Validación de empresa e invitación, orden de miembros por rol, agrupación de integrantes y candidatos a integrante (`tests/vistas/organizacion`).

## 7. Notas

Sin notas.
