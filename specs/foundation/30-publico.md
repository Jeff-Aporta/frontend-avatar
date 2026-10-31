# 30 — Público: landing y acceso

## 1. Propósito (WHAT)

Quien no tiene sesión ve qué es Avatar y puede entrar.

## 2. Requisitos WHAT

- [W-PUB-01] `/` muestra la landing: lema «Todo tu negocio en una sola plataforma», texto, «Empieza ahora» (con sesión «Ir al panel») y «Conoce a AVO».
- [W-PUB-02] Cuatro características (canales, proyectos, CRM, AVO) con ícono, título y texto, y tres planes (mensual, anual destacado, 3 años); «Suscribirse» lleva al acceso.
- [W-PUB-03] `/acceso/` muestra el login del kit (`iswc-login`); envía usuario y contraseña al plugin de identidad de DER (`POST usuarios/login`) y con éxito navega al panel.
- [W-PUB-04] Un error de login se muestra en el formulario sin borrar lo escrito: credenciales inválidas, bloqueo por intentos o API inalcanzable, cada uno con su mensaje.
- [W-PUB-05] Las cuentas de prueba (ana, beto, carla) se listan con su rol; «Usar» rellena el formulario.
- [W-PUB-06] También se entra desde la barra (`iswc-session-menu`), sin salir de la vista actual.

## 3. Guía HOW WEAK

- [HW-PUB-01] La landing no consulta la API: todo su contenido sale de `view/inicio/utils/landing.ts`.

## 4. Contratos HOW STRONG

- [HS-PUB-01] El token JWT se guarda en `localStorage` (`avatar:token`) y viaja como `Authorization: Bearer` en todas las peticiones.

## 5. Casos borde y errores

- [W-PUB-07] Un token vencido o revocado al arrancar limpia la sesión y deja al usuario en la landing.

## 6. Pruebas (WHAT / HOW WEAK)

- `tests/vistas/inicio`: [W-PUB-02], [W-PUB-05] y los mensajes de [W-PUB-04].
- `tests/e2e/00.inicio`: [W-PUB-01], [W-PUB-02] y la redirección de una vista privada al acceso.

## 7. Notas

El administrador entra con la contraseña del secreto del despliegue; nunca se muestra en la app.
