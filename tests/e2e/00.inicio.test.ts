// 00.inicio.test.ts — e2e determinista (Stagehand, sin LLM): la app arranca sin sesión en la landing, muestra el hero,
// las características y los planes, y una vista privada sin sesión cae en el acceso con el login del kit.
// Caja negra: solo lo que se ve. No inicia sesión (no envía credenciales a la API publicada).
//
//   W-PLAT-12  la app arranca lista, con el shell del kit y sin errores de consola
//   W-PUB-02   la landing presenta el lema, 4 características y 3 planes
//   W-PLAT-10  una vista privada sin sesión muestra el acceso con el login del kit
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';
import { abrir, esperar } from '../../scripts/gate/e2e/harness.ts';

let s: Awaited<ReturnType<typeof abrir>>;

export default definirPruebas([
  {
    nombre: 'inicio W-PLAT-12 la app arranca lista con el shell del kit y sin errores de consola',
    categoria: 'what',
    async correr({ expect }) {
      await esperar(s.page, () => !!document.querySelector('av-app')?.shadowRoot?.querySelector('iswc-app-shell'), 30_000).catch(() => undefined);
      expect('marcada como lista', await s.page.evaluate(() => document.documentElement.hasAttribute('data-app-ready'), undefined));
      expect('shell montado', await s.page.evaluate(() => !!document.querySelector('av-app')?.shadowRoot?.querySelector('iswc-app-shell'), undefined));
      // Que el tag exista no basta: el kit debe haberlo DEFINIDO (si el loader falla, todo se ve sin estilos).
      await esperar(s.page, () => ['iswc-app-shell', 'iswc-session-menu', 'iswc-button', 'iswc-card', 'iswc-icon'].every((t) => !!customElements.get(t)), 20_000).catch(() => undefined);
      const sinDefinir = await s.page.evaluate(() => ['iswc-app-shell', 'iswc-session-menu', 'iswc-button', 'iswc-card', 'iswc-icon'].filter((t) => !customElements.get(t)), undefined);
      expect('kit definido', sinDefinir.length === 0, sinDefinir.join(', '));
      expect('sin errores de consola', s.errores().length === 0, s.errores().join(' | '));
    },
  },
  {
    nombre: 'inicio W-PUB-02 lema, cuatro características y tres planes',
    categoria: 'what',
    async correr({ eq }) {
      await esperar(s.page, () => {
        const v = document.querySelector('av-app')?.shadowRoot?.querySelector('.vista')?.firstElementChild;
        return v?.localName === 'av-inicio' && !!v.shadowRoot?.querySelector('av-hero')?.shadowRoot?.querySelector('iswc-heading');
      }, 20_000);
      const datos = await s.page.evaluate(() => {
        const v = document.querySelector('av-app')!.shadowRoot!.querySelector('.vista')!.firstElementChild!.shadowRoot!;
        return {
          titulo: v.querySelector('av-hero')!.shadowRoot!.querySelector('iswc-heading')!.textContent!.trim(),
          caracteristicas: v.querySelector('#caracteristicas')!.shadowRoot!.querySelectorAll('.item').length,
          planes: v.querySelector('av-precios')!.shadowRoot!.querySelectorAll('iswc-card').length,
        };
      }, undefined);
      eq('lema', datos.titulo, 'Todo tu negocio en una sola plataforma');
      eq('características', datos.caracteristicas, 4);
      eq('planes', datos.planes, 3);
    },
  },
  {
    nombre: 'inicio W-PLAT-10 una vista privada sin sesión muestra el acceso',
    categoria: 'what',
    async correr({ eq, expect }) {
      const raiz = await s.page.evaluate(() => document.baseURI, undefined);
      await s.page.goto(new URL('panel/', raiz).href, { waitUntil: 'load' });
      // Rutas reales: la página privada sin sesión pasa a la de acceso, y ahí se espera el login del kit ya pintado.
      await esperar(s.page, () => !!document.querySelector('av-app')?.shadowRoot?.querySelector('.vista')?.firstElementChild?.shadowRoot?.querySelector('iswc-login'), 20_000);
      eq('ruta corregida', await s.page.evaluate(() => new URL(location.href).pathname.endsWith('/acceso/'), undefined), true);
      expect('login del kit', await s.page.evaluate(() => !!document.querySelector('av-app')?.shadowRoot?.querySelector('.vista')?.firstElementChild?.shadowRoot?.querySelector('iswc-login'), undefined));
    },
  },
], {
  antes: async () => {
    s = await abrir('index.html');
  },
  despues: async () => {
    await s?.cerrar();
  },
});
