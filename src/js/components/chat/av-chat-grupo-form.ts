/**
 * <av-chat-grupo-form> — crear grupo, editarlo o agregar integrantes (W-CHAT-06/35), en un diálogo:
 *   - `crear`: 1) integrantes (varios, con buscador y fichas) → 2) nombre obligatorio, descripción y foto opcionales.
 *   - `editar`: solo nombre, descripción y foto.   - `agregar`: solo integrantes (sin los que ya están).
 * La foto se reduce en el navegador antes de enviarla. Emite `av-chat-grupo-crear { nombre, descripcion, miembros,
 * foto }`, `av-chat-grupo-editar { nombre, descripcion, foto }`, `av-chat-miembros { accion: 'agregar', usuarios }` y
 * `av-chat-panel-cerrar { panel: 'grupo' }`.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatGrupoFormProps } from '../../consts/schemas/chat.schemas.js';
import { iniciales, normalizar } from '../../chat/formato.js';
import { textos } from '../../chat/textos.js';
import { filaPersona } from './av-chat-nuevo.js';

type Dialogo = HTMLElement & { open: boolean };
type Campo = HTMLElement & { value: string; focus(): void };

/** Reduce una imagen a `lado` px máximo y la devuelve como data URL (JPEG). */
async function reducir(archivo: File, lado = 256): Promise<string> {
  const url = URL.createObjectURL(archivo);
  try {
    const img = await new Promise<HTMLImageElement>((ok, mal) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = mal;
      i.src = url;
    });
    const k = Math.min(1, lado / Math.max(img.naturalWidth, img.naturalHeight));
    const lienzo = document.createElement('canvas');
    lienzo.width = Math.round(img.naturalWidth * k);
    lienzo.height = Math.round(img.naturalHeight * k);
    lienzo.getContext('2d')?.drawImage(img, 0, 0, lienzo.width, lienzo.height);
    return lienzo.toDataURL('image/jpeg', 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function montar(root: ShadowRoot, inicial: AvChatGrupoFormProps, host: HTMLElement) {
  const t = textos();
  let p = inicial;
  let paso: 1 | 2 = 1;
  let elegidos = new Set<string>();
  let foto: string | null = null;
  root.append(html`
    <iswc-dialog class="dialogo" backdrop-variant="basic">
      <div class="paso uno">
        <div class="fichas"></div>
        <iswc-input class="q" type="search" clearable placeholder=${t.buscarPersonas} aria-label=${t.buscarPersonas}><iswc-icon slot="start" icon="mdi:magnify"></iswc-icon></iswc-input>
        <div class="personas" role="group" aria-label=${t.eligeIntegrantes}></div>
      </div>
      <div class="paso dos">
        <label class="foto-campo">
          <span class="foto-vista"><iswc-avatar class="foto-avatar" initials="" label=${t.fotoGrupo}><iswc-icon slot="icon" icon="mdi:camera-plus-outline"></iswc-icon></iswc-avatar></span>
          <span class="foto-rotulo">${t.fotoGrupo}</span>
          <input class="foto-archivo" type="file" accept="image/*" hidden>
        </label>
        <iswc-input class="nombre" label=${t.nombreGrupo} required maxlength="80"></iswc-input>
        <iswc-textarea class="descripcion" label=${t.descripcion} rows="2" maxlength="500"></iswc-textarea>
      </div>
      <p class="error" role="alert" hidden></p>
      <iswc-button slot="footer" class="cancelar" variant="outlined" color="neutral">${t.cancelar}</iswc-button>
      <iswc-button slot="footer" class="seguir" color="brand"></iswc-button>
    </iswc-dialog>
  `);
  const dialogo = root.querySelector('.dialogo') as Dialogo;
  const q = root.querySelector('.q') as Campo;
  const lista = root.querySelector('.personas') as HTMLElement;
  const fichas = root.querySelector('.fichas') as HTMLElement;
  const nombre = root.querySelector('.nombre') as Campo;
  const descripcion = root.querySelector('.descripcion') as Campo;
  const error = root.querySelector('.error') as HTMLElement;
  const seguir = root.querySelector('.seguir') as HTMLElement;
  const avatar = root.querySelector('.foto-avatar') as HTMLElement;

  const mostrarError = (m: string) => {
    error.textContent = m;
    error.hidden = !m;
  };
  const pintarFoto = () => {
    if (foto) avatar.setAttribute('image', foto);
    else avatar.removeAttribute('image');
    avatar.setAttribute('initials', foto ? '' : iniciales(nombre.value || '') === '?' ? '' : iniciales(nombre.value || ''));
  };
  const pintarPersonas = () => {
    const f = normalizar((q.value ?? '').trim());
    const excluir = new Set(p.excluir);
    const visibles = p.personas.filter((x) => !excluir.has(x.id) && (!f || normalizar(x.nombre).includes(f)));
    lista.replaceChildren(...visibles.map((pe) => {
      const fila = document.createElement('label');
      fila.className = 'fila';
      const marca = document.createElement('iswc-checkbox');
      marca.toggleAttribute('checked', elegidos.has(pe.id));
      marca.setAttribute('aria-label', pe.nombre);
      marca.addEventListener('iswc-change', (e) => {
        const on = (e as CustomEvent<{ checked: boolean }>).detail?.checked ?? !elegidos.has(pe.id);
        if (on) elegidos.add(pe.id);
        else elegidos.delete(pe.id);
        pintarFichas();
      });
      fila.append(filaPersona(pe, marca));
      return fila;
    }));
  };
  const pintarFichas = () => {
    fichas.replaceChildren(...[...elegidos].map((id) => {
      const pe = p.personas.find((x) => x.id === id);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ficha';
      b.dataset['color'] = String(pe?.color ?? 0);
      b.textContent = pe?.nombre ?? id;
      b.title = t.quitar;
      b.append(Object.assign(document.createElement('iswc-icon'), {}));
      b.lastElementChild?.setAttribute('icon', 'mdi:close');
      b.addEventListener('click', () => {
        elegidos.delete(id);
        pintarFichas();
        pintarPersonas();
      });
      return b;
    }));
    fichas.hidden = elegidos.size === 0;
  };
  const pintarPaso = () => {
    const soloDatos = p.modo === 'editar';
    const soloGente = p.modo === 'agregar';
    const verUno = soloGente || (!soloDatos && paso === 1);
    (root.querySelector('.uno') as HTMLElement).hidden = !verUno;
    (root.querySelector('.dos') as HTMLElement).hidden = verUno;
    dialogo.setAttribute('label', p.modo === 'editar' ? t.editarGrupo : p.modo === 'agregar' ? t.agregarIntegrantes : paso === 1 ? `${t.nuevoGrupo} · ${t.eligeIntegrantes}` : t.nuevoGrupo);
    seguir.textContent = p.modo === 'crear' && paso === 1 ? t.siguientePaso : p.modo === 'crear' ? t.crearGrupo : t.guardar;
    seguir.toggleAttribute('loading', p.guardando);
  };
  q.addEventListener('iswc-input', pintarPersonas);
  nombre.addEventListener('iswc-input', () => {
    nombre.removeAttribute('error-text');
    nombre.removeAttribute('error');
    pintarFoto();
  });
  root.querySelector('.foto-archivo')?.addEventListener('change', async (e) => {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f || !f.type.startsWith('image/')) return;
    try {
      foto = await reducir(f);
      pintarFoto();
    } catch {
      /* imagen ilegible */
    }
  });
  root.querySelector('.cancelar')?.addEventListener('iswc-click', () => {
    dialogo.open = false;
  });
  seguir.addEventListener('iswc-click', () => {
    mostrarError('');
    if (p.modo === 'agregar') {
      if (!elegidos.size) return mostrarError(t.minimoUno);
      emitir(host, 'av-chat-miembros', { accion: 'agregar', usuarios: [...elegidos] });
      return;
    }
    if (p.modo === 'crear' && paso === 1) {
      if (!elegidos.size) return mostrarError(t.minimoUno);
      paso = 2;
      pintarPaso();
      requestAnimationFrame(() => nombre.focus());
      return;
    }
    const n = (nombre.value ?? '').trim();
    if (!n) {
      nombre.setAttribute('error-text', t.nombreObligatorio);
      nombre.setAttribute('error', '');
      nombre.focus();
      return;
    }
    const d = (descripcion.value ?? '').trim();
    if (p.modo === 'editar') emitir(host, 'av-chat-grupo-editar', { nombre: n, descripcion: d, foto });
    else emitir(host, 'av-chat-grupo-crear', { nombre: n, descripcion: d, miembros: [...elegidos], foto });
  });
  dialogo.addEventListener('iswc-hide', () => emitir(host, 'av-chat-panel-cerrar', { panel: 'grupo' }));

  const aplicar = (sig: AvChatGrupoFormProps, previo: AvChatGrupoFormProps | null) => {
    p = sig;
    if (sig.abierto && (!previo?.abierto || previo.modo !== sig.modo)) {
      paso = 1;
      elegidos = new Set();
      foto = sig.foto;
      q.value = '';
      nombre.value = sig.nombre;
      descripcion.value = sig.descripcion;
      nombre.removeAttribute('error-text');
      mostrarError('');
      pintarFichas();
      pintarPersonas();
      pintarFoto();
    } else if (!previo || JSON.stringify(previo.personas) !== JSON.stringify(sig.personas) || JSON.stringify(previo.excluir) !== JSON.stringify(sig.excluir)) pintarPersonas();
    if (sig.error) mostrarError(sig.error);
    pintarPaso();
    if (sig.abierto !== dialogo.open) dialogo.open = sig.abierto;
  };
  aplicar(inicial, null);
  return aplicar;
}

const AvChatGrupoForm = crearComponente<AvChatGrupoFormProps>(
  import.meta.url,
  'av-chat-grupo-form',
  { abierto: false, modo: 'crear', personas: [], excluir: [], nombre: '', descripcion: '', foto: null, guardando: false, error: '' },
  (root, props, host) => {
    (host as HTMLElement & { __aplicar?: unknown }).__aplicar = montar(root, props, host);
  },
  (_root, props, previos, host) => {
    const fn = (host as HTMLElement & { __aplicar?: (p: AvChatGrupoFormProps, q: AvChatGrupoFormProps) => void }).__aplicar;
    if (!fn) return false;
    fn(props, previos);
    return true;
  },
);

define('av-chat-grupo-form', AvChatGrupoForm);
