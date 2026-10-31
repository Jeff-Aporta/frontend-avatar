# 35 — Panel

## 1. Propósito (WHAT)

El tablero de la empresa activa: cómo va el equipo de un vistazo.

## 2. Requisitos WHAT

- [W-PAN-01] `/panel/` carga el resumen de la empresa activa (`GET empresa/{id}/resumen`) y las notificaciones del usuario.
- [W-PAN-02] Seis KPIs en orden: miembros, mensajes de hoy, proyectos, tareas pendientes, vencidas (rojo si hay) y pipeline CRM en pesos.
- [W-PAN-03] Una dona de tareas por estado y barras de clientes por etapa del CRM (con ceros donde no hay).
- [W-PAN-04] Las notificaciones muestran título, cuerpo y hace cuánto; «Marcar leídas» las marca todas.
- [W-PAN-05] Sin empresa, el panel invita a ir a Organización; cambiar de empresa en la barra recarga el panel.

## 3. Guía HOW WEAK

- [HW-PAN-01] Mientras carga, los KPIs muestran esqueletos y las gráficas el estado de carga.

## 4. Contratos HOW STRONG

- [HS-PAN-01] KPIs con `iswc-stat`; gráficas con `iswc-doughnut-chart` e `iswc-bar-chart` (configuración JSON hija).

## 5. Casos borde y errores

- [W-PAN-06] Un error del API se muestra como aviso arriba del panel y «Actualizar» reintenta.

## 6. Pruebas (WHAT / HOW WEAK)

- `tests/vistas/panel`: [W-PAN-02] y [W-PAN-03] sobre el dominio publicado.

## 7. Notas

Sin notas.
