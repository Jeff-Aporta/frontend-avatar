/**
 * paralaje.ts — parallax sutil con el cursor para toda la página (el mismo de la hoja de vida).
 *
 * Un solo oyente de `pointermove` publica la posición del ratón respecto al centro de la ventana
 * (-1..1), suavizada cuadro a cuadro, en dos propiedades CSS de `<html>`: `--px` y `--py`. Como las
 * propiedades personalizadas se heredan a través del shadow DOM, cada capa de `<av-escena>` decide cuánto se mueve
 * con su propia profundidad, sin JS por elemento:
 *
 *   translate: calc(var(--px, 0) * var(--prof) * 1.4em) calc(var(--py, 0) * var(--prof) * 0.9em);
 *
 * Solo con ratón (en táctil no hay cursor que seguir). No depende de `prefers-reduced-motion`: es un
 * desplazamiento corto que el propio visitante provoca con el cursor, no una animación que corra sola
 * (Windows con las animaciones apagadas activa esa preferencia y el efecto desaparecía). El bucle se
 * detiene cuando el valor llega a su destino.
 */
// Constante de tiempo del seguimiento, en ms: en ese tiempo recorre ~63 % del camino (≈ 3 s en
// asentarse). Va por tiempo real, no por cuadro: igual de lento en pantallas de 60 Hz y de 144 Hz.
const TAU = 1000;

let iniciado = false;

export function iniciarParalaje(): void {
  if (iniciado || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  iniciado = true;
  const raiz = document.documentElement.style;
  let destino = { x: 0, y: 0 };
  const actual = { x: 0, y: 0 };
  let corriendo = false;
  let antes = 0;

  const cuadro = (t: number) => {
    const k = 1 - Math.exp(-Math.min(100, t - antes) / TAU);
    antes = t;
    actual.x += (destino.x - actual.x) * k;
    actual.y += (destino.y - actual.y) * k;
    const llego = Math.abs(destino.x - actual.x) < 0.001 && Math.abs(destino.y - actual.y) < 0.001;
    if (llego) Object.assign(actual, destino);
    raiz.setProperty('--px', actual.x.toFixed(4));
    raiz.setProperty('--py', actual.y.toFixed(4));
    corriendo = !llego;
    if (corriendo) requestAnimationFrame(cuadro);
  };
  const mover = (x: number, y: number) => {
    destino = { x, y };
    if (!corriendo) {
      corriendo = true;
      antes = performance.now();
      requestAnimationFrame(cuadro);
    }
  };
  addEventListener('pointermove', (ev) => {
    if (ev.pointerType === 'mouse') mover((ev.clientX / innerWidth) * 2 - 1, (ev.clientY / innerHeight) * 2 - 1);
  }, { passive: true });
  // Al salir el cursor de la ventana todo vuelve despacio a su sitio.
  document.addEventListener('pointerleave', () => mover(0, 0));
}
