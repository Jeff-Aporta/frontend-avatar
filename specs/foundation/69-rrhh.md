# 69 — Recursos humanos

> Alcance: la vista `rrhh` (`/rrhh/`, id opcional = pestaña: general, empleados, asistencia o solicitudes): KPIs,
> gráficas, empleados, control de asistencia por día con historial y solicitudes (vacaciones, permisos, certificados)
> con aprobación. Fuera: usuarios y roles de la plataforma (administración) y pagos de nómina (finanzas).

## 1. Propósito (WHAT)

Recursos humanos sabe quién trabaja en la empresa, quién vino hoy y qué solicitudes esperan respuesta, y lo resuelve
desde un solo lugar.

## 2. Requisitos WHAT

- [W-RRHH-01] Cuatro indicadores: empleados vigentes (con el desglose por estado), asistencia de hoy en porcentaje (presentes + retardos sobre vigentes, con cuántos faltan por marcar), solicitudes pendientes y nómina mensual en COP.
- [W-RRHH-02] Pestaña General: dona de la asistencia de hoy por estado (solo estados con valor) y barras de la plantilla vigente por departamento; debajo, las solicitudes pendientes con Aprobar y Rechazar.
- [W-RRHH-03] Empleados: nombre, correo, departamento, cargo, estado, salario e ingreso, con búsqueda; la ficha edita esos datos (nombre obligatorio, correo válido si se da, salario no negativo) y vincula un usuario de la empresa para que reciba avisos.
- [W-RRHH-04] Control de asistencia de una fecha (hoy por defecto, se puede cambiar): contadores Presente, Retardo, Ausente, Vacaciones y Sin marcar, y una fila por empleado vigente (los retirados no aparecen) con su marca y horas; botones rápidos para cada estado y «Salida» para quien entró y no ha salido (solo hoy). Al marcar presente o retardo hoy se toma la hora actual como entrada.
- [W-RRHH-05] Historial de asistencias: fecha, empleado, estado, entrada y salida, recientes primero, con búsqueda.
- [W-RRHH-06] Solicitudes en tarjetas: empleado, tipo, fechas y días calendario (los certificados no cuentan días), motivo, estado y quién la resolvió; filtro Pendientes, Aprobadas, Rechazadas y Todas con conteos; las pendientes van primero.
- [W-RRHH-07] Aprobar una solicitud pendiente la aprueba; rechazarla pide confirmación. Una nueva solicitud exige empleado y que la fecha final no sea anterior a la inicial.
- [W-RRHH-08] Sin el permiso `avatar.rrhh` la vista lo explica: se consulta todo, pero no se marca asistencia, no se registran ni resuelven solicitudes y no se editan empleados.

## 3. Guía HOW WEAK

- [HW-RRHH-01] Solo el shell habla con el API; los hijos pintan y emiten. Marcar asistencia deja la fila «ocupada» hasta que el API responde y luego actualiza solo esa fila.
- [HW-RRHH-02] Indicadores, series, filas del día, conteos, columnas, filas, solicitudes con nombre y días viven en `view/rrhh/utils/rrhh.ts`.
- [HW-RRHH-03] La búsqueda de cada tabla pasa por una función del shell (`buscarCatalogo`) para enchufar luego la búsqueda semántica.

## 4. Contratos HOW STRONG

- [HS-RRHH-01] Tags: `av-rrhh` (shell), `av-rrhh-grafica`, `av-asistencia-dia`, `av-rrhh-tabla`, `av-solicitudes`, `av-empleado-form`, `av-solicitud-form`; usa `av-indicadores`.
- [HS-RRHH-02] Eventos: `av-rrhh-buscar|abrir`, `av-asistencia-fecha { fecha }`, `av-asistencia-marcar { iempleado, estado, fecha, entrada, salida }`, `av-solicitudes-filtro { filtro }`, `av-solicitud-resolver { isolicitud, accion }`, `av-solicitud-nueva { iempleado }`, `av-solicitud-guardar`, `av-empleado-guardar|eliminar`, `*-form-cerrar`, `*-form-error { mensaje }`.
- [HS-RRHH-03] API: ops `resumenRrhh(iempresa)`, `marcarAsistencia(iempleado, { estado, fecha?, entrada?, salida? })`, `aprobar(isolicitud, {})`, `rechazar(isolicitud, {})`; controllers `empleados`, `asistencias`, `solicitudes`, `miembros`. Escritura con `avatar.rrhh`.

## 5. Casos borde y errores

- [W-RRHH-09] Sin empresa activa la vista lo dice y no consulta nada.
- [W-RRHH-10] Una solicitud ya resuelta no se vuelve a resolver: el mensaje del API se avisa y la lista se recarga.

## 6. Pruebas (WHAT / HOW WEAK)

- [W-RRHH-11] `tests/vistas/rrhh`: indicadores [W-RRHH-01], series [W-RRHH-02], filas y conteo del día [W-RRHH-04], filas de empleados y asistencias [W-RRHH-03] [W-RRHH-05], solicitudes ordenadas, filtradas, contadas y sus días [W-RRHH-06], validación de solicitud [W-RRHH-07].

## 7. Notas

[W-RRHH-08], [W-RRHH-09] y [W-RRHH-10] son de pantalla: se verifican en el navegador.
