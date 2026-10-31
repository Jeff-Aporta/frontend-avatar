# Avatar — front

Plataforma de comunicación y gestión para equipos empresariales (tipo Teams / Odoo): empresas, equipos, canales de chat,
proyectos kanban con tickets, CRM, notificaciones y el asistente AVO. **Sin React**: web components vanilla sobre el kit
[iswc](https://github.com/Jeff-Aporta/is-webcomponents) (estándar `iswc-foundation`, prefijo `av-`), en Deno.

Los datos vienen de **[api-avatar](https://api-avatar.jeffaporta.workers.dev/api/doc?v=1)** (Deno + DER en Cloudflare
Workers + D1). El front no hace `fetch` a mano: importa por CDN el vendor de la API (`@avatar/vendor`: DER cliente + zod +
el dominio) y usa sus controllers y plugins (`createClient(avatar)`, `identity`, `permissions`).

```bash
deno install
deno task build
deno task serve        # http://127.0.0.1:4300/
deno task test:all     # build + check + pin + pruebas de dominio + e2e
```

- Rutas reales, una página por vista (generadas desde `src/js/consts/paginas.ts`): `/`, `/acceso/`, `/panel/`, `/canales/`, `/correos/`, `/proyectos/`, `/crm/`, `/finanzas/`, `/inventario/`, `/rrhh/`, `/organizacion/`, `/asistente/`, `/admin/`. Sin `#` ni `?s=`.
- Búsqueda global Ctrl+K con embeddings bge-m3 horneados (`deno task embeddings`).
- Cuentas de prueba: `ana` (gestora), `beto`, `carla`, con la contraseña `avatar-demo-2026`.
- API local: `?api=http://localhost:8788/api` (queda en localStorage; `?api=` vuelve a la publicada).
- Galería de componentes: `/view/demo/`. Cada vista aislada: `/view/<vista>/`.
- Agentes: [`AGENTS.md`](AGENTS.md). Specs: [`specs/`](specs/README.md).
