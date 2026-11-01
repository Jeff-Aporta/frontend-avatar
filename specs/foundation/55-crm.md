# 55 — CRM: clientes y embudo de ventas

> Alcance: la vista `crm` (`/crm/` (id `icliente` en el historial)): embudo por etapa, tabla de clientes y su formulario. Fuera: la
> gráfica del embudo del panel (spec del panel) y los usuarios de la plataforma (admin).

## 1. Propósito (WHAT)

El equipo comercial sigue a sus clientes por etapas (contacto, propuesta, negociación, cerrado, perdido) y ve el valor
del pipeline de la empresa.

## 2. Requisitos WHAT

- [W-CRM-01] La vista lista los clientes de la empresa activa, los más recientes primero, con búsqueda rápida, orden y paginación.
- [W-CRM-02] Arriba, cinco tarjetas (una por etapa, en orden del embudo) con la cantidad de clientes y la suma de su valor en pesos colombianos; las etapas sin clientes muestran 0.
- [W-CRM-03] Clic en una etapa filtra la tabla a esa etapa; otro clic en la misma quita el filtro.
- [W-CRM-04] El subtítulo dice cuántos clientes hay y el valor del pipeline (todo menos lo perdido).
- [W-CRM-05] Clic en una fila abre el cliente; quien gestiona lo edita o lo elimina tras confirmar; quien no, lo ve en solo lectura.
- [W-CRM-06] Quien gestiona crea clientes (nombre obligatorio, correo válido si se da, valor no negativo, responsable entre los miembros).
- [W-CRM-07] Con `/crm/` (id `icliente` en el historial) el cliente se abre al cargar.

## 3. Guía HOW WEAK

- [HW-CRM-01] Solo el shell habla con el API; los hijos pintan y emiten `av-crm-*`/`av-cliente-*`.
- [HW-CRM-02] Totales, filtro, columnas y formato viven en `view/crm/utils/crm.ts`.

## 4. Contratos HOW STRONG

- [HS-CRM-01] Tags: `av-crm` (shell), `av-embudo`, `av-tabla` (transversal, prefijo `av-crm`), `av-cliente-form`.
- [HS-CRM-02] Eventos: `av-crm-filtrar { etapa | null }`, `av-cliente-abrir { icliente }`, `av-cliente-guardar { datos }`, `av-cliente-eliminar { icliente }`, `av-cliente-form-cerrar`, `av-cliente-form-error { mensaje }`.
- [HS-CRM-03] API: controllers DER `clientes` y `miembros`; escritura con `avatar.gestionar`.

## 5. Casos borde y errores

- [W-CRM-08] Sin empresa activa, la vista lo dice y no consulta nada.
- [W-CRM-09] Un filtro sin clientes muestra un estado vacío, no una tabla en blanco.

## 6. Pruebas (WHAT / HOW WEAK)

- [W-CRM-10] `tests/vistas/crm`: totales por etapa [W-CRM-02], filtro [W-CRM-03], pipeline [W-CRM-04], columnas y filas del grid [W-CRM-01], color por etapa.

## 7. Notas

Sin notas.
