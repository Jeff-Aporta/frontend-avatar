# 68 — Inventario

> Alcance: la vista `inventario` (`/inventario/`, id opcional = pestaña: productos, movimientos, pedidos o proveedores):
> KPIs, alertas de stock, catálogo de productos, movimientos de stock (kardex), pedidos con ítems y proveedores. Fuera:
> facturación (finanzas) y clientes (CRM).

## 1. Propósito (WHAT)

El almacén sabe qué hay, qué falta y qué viene en camino: el stock solo cambia con movimientos que dejan rastro, las
alertas avisan lo que está en o bajo su mínimo y los pedidos ordenan compras y despachos.

## 2. Requisitos WHAT

- [W-INV-01] Cuatro indicadores: productos activos, valor del inventario (stock × costo), stock crítico (con cuántos agotados) y pedidos pendientes (con despachos de hoy).
- [W-INV-02] Alertas de stock: cada producto en o bajo su mínimo, agotados primero, con stock, mínimo y ubicación; «Reponer» abre una entrada para ese producto. Sin alertas, una confirmación de que el stock está en orden.
- [W-INV-03] Productos: SKU, nombre, categoría, marca, precio, stock, nivel (Agotado si ≤ 0, Stock bajo si ≤ mínimo, Disponible si no) con su mínimo, ubicación y proveedor; acciones Entrada y Salida por fila (Salida solo con stock).
- [W-INV-04] Un movimiento es entrada (suma), salida (resta) o ajuste (fija el conteo físico); la cantidad es entera y mayor que 0 salvo en el ajuste; se ve «stock actual → resultante» antes de registrar y no se permite dejar el stock negativo.
- [W-INV-05] Movimientos (kardex): fecha y hora, producto, tipo, cantidad con signo («=» en ajuste), stock antes → después, motivo y quién, recientes primero.
- [W-INV-06] Ficha de producto: datos de catálogo editables (nombre obligatorio, precios y mínimo no negativos), activo/inactivo, stock con su nivel y atajos Entrada/Salida/Ajuste, margen por unidad, y «Productos relacionados» (misma categoría o proveedor) que se oculta si no hay.
- [W-INV-07] Pedidos: a proveedor o de cliente, con su contraparte obligatoria, estado (pendiente, procesando, enviado, entregado, cancelado), fechas, ítems (producto sin repetir, cantidad entera > 0, precio) y total calculado; se crean, editan y eliminan.
- [W-INV-08] Proveedores: nombre obligatorio, contacto, correo válido si se da, teléfono y cuántos productos surte; uno que surte productos no se elimina.
- [W-INV-09] Cada tabla tiene búsqueda por cualquier palabra de sus datos, sin tildes ni mayúsculas.
- [W-INV-10] Sin el permiso `avatar.inventario` la vista lo explica: se consulta todo, pero no se mueve stock ni se edita catálogo, pedidos ni proveedores.

## 3. Guía HOW WEAK

- [HW-INV-01] Solo el shell habla con el API; los hijos pintan y emiten. Las tablas reasignan filas sin repintar.
- [HW-INV-02] Nivel de stock, indicadores, columnas, filas, campos de búsqueda, stock resultante, total de pedido y relacionados viven en `view/inventario/utils/inventario.ts`.
- [HW-INV-03] La búsqueda (`buscarCatalogo`) y los relacionados (`relacionadosProducto`) pasan por funciones del shell para enchufar luego la búsqueda semántica.

## 4. Contratos HOW STRONG

- [HS-INV-01] Tags: `av-inventario` (shell), `av-stock-alertas`, `av-inventario-tabla`, `av-producto-form`, `av-movimiento-form`, `av-pedido-form`, `av-proveedor-form`; usa `av-indicadores`.
- [HS-INV-02] Eventos: `av-inventario-buscar|abrir|accion`, `av-producto-mover { iproducto, tipo }`, `av-producto-guardar`, `av-movimiento-guardar`, `av-pedido-guardar|eliminar`, `av-proveedor-guardar|eliminar`, `*-form-cerrar`, `*-form-error { mensaje }`.
- [HS-INV-03] API: ops `resumenInventario(iempresa)`, `alertas(iempresa)`, `movimiento(iproducto, { tipo, cantidad, motivo? })`; controllers `productos`, `movimientos`, `pedidos`, `itemspedido`, `proveedores`, `clientes`. Escritura con `avatar.inventario`.

## 5. Casos borde y errores

- [W-INV-11] Sin empresa activa la vista lo dice y no consulta nada.
- [W-INV-12] Un producto nuevo nace con stock 0: su stock entra con una entrada.

## 6. Pruebas (WHAT / HOW WEAK)

- [W-INV-13] `tests/vistas/inventario`: nivel de stock [W-INV-03], indicadores [W-INV-01], stock resultante [W-INV-04], filas del kardex [W-INV-05], relacionados [W-INV-06], total y validación de pedido [W-INV-07], validación de proveedor [W-INV-08], búsqueda [W-INV-09], validación de movimiento [W-INV-04].

## 7. Notas

[W-INV-02], [W-INV-10], [W-INV-11] y [W-INV-12] son de pantalla: se verifican en el navegador. El API no guarda moneda en
productos ni pedidos: los montos se muestran como cifras con «$» sin código de moneda.
