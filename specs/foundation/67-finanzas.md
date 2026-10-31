# 67 — Finanzas y contabilidad

> Alcance: la vista `finanzas` (`/finanzas/`, id opcional = pestaña: general, transacciones o facturas): KPIs del mes,
> gráficas, conversor de monedas con las tasas de la empresa, transacciones (registrar, editar, eliminar) y facturas
> (borrador, emitir, registrar pago). Fuera: clientes (CRM) y nómina (RRHH).

## 1. Propósito (WHAT)

Quien lleva las cuentas ve de un vistazo cómo va el mes frente al anterior, registra ingresos y gastos, factura a los
clientes del CRM y convierte montos entre COP, USD, MXN y EUR con las tasas de la empresa.

## 2. Requisitos WHAT

- [W-FIN-01] Cuatro indicadores del mes en COP: ingresos, gastos, beneficio neto (ingresos − gastos) y facturas pendientes (monto y cantidad), cada uno con su variación contra el mes anterior (con signo; sin variación si el anterior era 0).
- [W-FIN-02] Pestaña General: barras «mes anterior vs. este mes» de ingresos, gastos y beneficio, y dona de gastos del mes por categoría (de mayor a menor; sin gastos, un estado vacío).
- [W-FIN-03] Conversor: monto, moneda origen, intercambio y moneda destino; muestra el resultado y la tasa aplicada según el API, y abajo la equivalencia «1 XXX = $ …» de cada moneda con tasa.
- [W-FIN-04] Pestaña Transacciones: tabla con fecha, tipo, categoría, descripción, monto con su moneda (gastos en rojo con «−», ingresos en verde con «+») y estado, recientes primero, con búsqueda y paginación.
- [W-FIN-05] Registrar o editar una transacción exige categoría, monto mayor que 0 y fecha; tipo, moneda y estado se eligen de sus listas. Una transacción creada por el pago de una factura se ve pero no se edita.
- [W-FIN-06] Pestaña Facturas: número, cliente, total con moneda, estado, emisión y vencimiento; una factura emitida con vencimiento pasado se muestra «Vencida».
- [W-FIN-07] Una factura en borrador se edita (cliente, moneda, IVA, ítems con descripción, cantidad > 0 y precio ≥ 0) con subtotal, IVA y total en vivo; se emite (pasa a emitida con fechas) o se elimina. Una emitida o vencida se cobra («Registrar pago»), lo que la marca pagada y suma un ingreso. Emitir y Pagar también están como acciones en la fila.
- [W-FIN-08] Las búsquedas de transacciones y facturas encuentran por cualquier palabra de sus datos (categoría, descripción, número, cliente, ítems, estado), sin tildes ni mayúsculas.
- [W-FIN-09] Sin el permiso `avatar.finanzas` la vista lo explica, se puede consultar todo y no se puede registrar, editar, emitir ni cobrar.

## 3. Guía HOW WEAK

- [HW-FIN-01] Solo el shell habla con el API; los hijos pintan y emiten. Las tablas reasignan filas sin repintar.
- [HW-FIN-02] Indicadores, series, columnas, filas, estado efectivo, totales y equivalencias viven en `view/finanzas/utils/finanzas.ts`.
- [HW-FIN-03] La búsqueda de cada tabla pasa por una función del shell (`buscarCatalogo`) para enchufar luego la búsqueda semántica.
- [HW-FIN-04] El conversor no calcula: pide la conversión al API (con espera breve mientras se escribe).

## 4. Contratos HOW STRONG

- [HS-FIN-01] Tags: `av-finanzas` (shell), `av-finanzas-grafica`, `av-conversor`, `av-finanzas-tabla`, `av-transaccion-form`, `av-factura-form`; usa `av-indicadores`.
- [HS-FIN-02] Eventos: `av-finanzas-buscar { entidad, texto }`, `av-finanzas-abrir { entidad, id }`, `av-finanzas-accion { entidad, accion: 'emitir' | 'pagar', id }`, `av-conversor-convertir { monto, de, a }`, `av-transaccion-guardar|eliminar`, `av-factura-guardar|eliminar`, `*-form-cerrar`, `*-form-error { mensaje }`.
- [HS-FIN-03] API: ops `resumenFinanzas(iempresa)`, `convertir({ iempresa, monto, de, a })`, `emitir(ifactura, {})`, `pagar(ifactura, {})`; controllers `transacciones`, `facturas`, `tasas`, `clientes`. Escritura con `avatar.finanzas`.

## 5. Casos borde y errores

- [W-FIN-10] Sin empresa activa la vista lo dice y no consulta nada.
- [W-FIN-11] Si falta la tasa de una moneda, el conversor muestra el mensaje del API en lugar del resultado.

## 6. Pruebas (WHAT / HOW WEAK)

- [W-FIN-12] `tests/vistas/finanzas`: indicadores y tendencias [W-FIN-01], series [W-FIN-02], equivalencias [W-FIN-03], filas de transacciones [W-FIN-04], validación de transacción [W-FIN-05], estado efectivo y filas de facturas [W-FIN-06], totales y validación de factura [W-FIN-07], búsqueda [W-FIN-08].

## 7. Notas

[W-FIN-09], [W-FIN-10] y [W-FIN-11] son de pantalla: se verifican en el navegador. El API resume solo el mes actual y el
anterior; por eso la gráfica compara dos meses.
