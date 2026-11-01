/**
 * <av-organizacion> — shell de Organización: pestañas Empresa | Miembros | Equipos de la empresa activa. Es quien habla
 * con el API (controllers `empresas`, `miembros`, `equipos`, `integrantes` del plugin `avatar`, `invitar`, usuarios del
 * plugin de identidad) y reparte `props` a sus hijos; ellos solo pintan y emiten eventos `av-*`.
 * Las escrituras exigen `avatar.gestionar` (el server manda; aquí solo se ocultan los botones).
 */
import { soloPestana } from '../../../src/js/components/av/av-pestanas.js';
import { crearComponente, define, html, avisar } from '../../../src/js/base/componente.js';
import { z } from '../../../src/js/base/zod.js';
import type { AvOrganizacionProps, Empresa, EmpresaForm, Equipo, InvitarForm, Miembro, UsuarioMin } from '../../../src/js/consts/schemas/organizacion.schemas.js';
import { EmpresaSchema, EquipoSchema, IntegranteSchema, MiembroSchema, UsuarioMinSchema } from '../../../src/js/consts/schemas/organizacion.schemas.js';
import { sinMembresia } from '../../../src/js/consts/estados.js';
import { auth, cargarPerfil, controller, dominio, mensajeDe } from '../../../src/js/core/api.js';
import { empresaActiva, estado, fijar } from '../../../src/js/core/estado.js';
import { ACCION, puede } from '../../../src/js/core/permisos.js';
import { tomarIntencion } from '../../../src/js/core/router.js';
import { cuerpoEmpresa } from '../utils/organizacion.js';
import './av-empresa-form.js';
import './av-invitar-form.js';
import './av-miembros.js';
import './av-equipos.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type Host = HTMLElement & { props: Partial<AvOrganizacionProps> };

/** POJO de DER → objeto plano. */
const plano = (p: unknown): unknown => (p && typeof p === 'object' && 'toJSON' in p && typeof (p as { toJSON: unknown }).toJSON === 'function' ? (p as { toJSON(): unknown }).toJSON() : p);
const planos = (lista: unknown): unknown[] => (Array.isArray(lista) ? lista.map(plano) : []);

const AvOrganizacion = crearComponente<AvOrganizacionProps>(import.meta.url, 'av-organizacion', { id: null, pestana: 'empresa', version: 0 }, (root, props, host) => {
  const h = host as Host;
  const iempresa = empresaActiva();
  const gestiona = puede(estado.perfil, ACCION.gestionar);
  const iusuario = estado.yo?.iusuario ?? '';
  const q = <T extends HTMLElement>(sel: string) => root.querySelector(sel) as T | null;
  const recargar = () => (h.props = { version: (props.version ?? 0) + 1 });
  const fallo = (err: unknown) => avisar(mensajeDe(err), 'danger');

  // ---- empresa
  let empresa: Empresa | null = null;
  const pintarEmpresa = () => {
    const ficha = q<ConProps>('#ficha-vacia');
    const cont = q<HTMLElement>('#ficha');
    if (!cont) return;
    cont.hidden = !empresa;
    if (ficha) ficha.hidden = !!empresa;
    if (!empresa) return;
    (q<HTMLElement>('#e-nombre'))!.textContent = empresa.nombre;
    (q<HTMLElement>('#e-nit'))!.textContent = empresa.nit ?? '—';
    (q<HTMLElement>('#e-sector'))!.textContent = empresa.sector ?? '—';
    (q<HTMLElement>('#e-descripcion'))!.textContent = empresa.descripcion ?? 'Sin descripción.';
  };
  const cargarEmpresa = async () => {
    if (!iempresa) return;
    try {
      const r = EmpresaSchema.safeParse(plano(await controller('empresas').get({ iempresa }, { include: {} })));
      empresa = r.success ? r.data : null;
    } catch (err) {
      fallo(err);
    }
    pintarEmpresa();
  };
  const abrirEmpresa = (datos: EmpresaForm) => (q<ConProps>('#empresa-form')!.props = { abierto: true, datos, error: '', ocupado: false });
  const guardarEmpresa = async (e: Event) => {
    const { datos } = (e as CustomEvent<{ datos: EmpresaForm }>).detail;
    const form = q<ConProps>('#empresa-form')!;
    form.props = { ocupado: true, error: '' };
    try {
      const empresas = controller('empresas');
      if (datos.iempresa === null) {
        const creada = EmpresaSchema.safeParse(plano(await empresas.post(empresas.pojo(cuerpoEmpresa(datos)))));
        if (!creada.success) throw new Error('La empresa creada tiene una forma inesperada');
        const miembros = controller('miembros');
        await miembros.post(miembros.pojo({ iempresa: creada.data.iempresa, iusuario, rol: 'propietario' }));
        await cargarPerfil();
        fijar({ empresa: creada.data.iempresa });
        avisar(`Empresa ${creada.data.nombre} creada`, 'success');
      } else {
        await empresas.put(empresas.pojo({ iempresa: datos.iempresa, ...cuerpoEmpresa(datos) }));
        await cargarPerfil();
        avisar('Empresa actualizada', 'success');
      }
      form.props = { abierto: false, ocupado: false };
      recargar();
    } catch (err) {
      form.props = { ocupado: false, error: mensajeDe(err) };
    }
  };

  // ---- miembros
  let miembros: Miembro[] = [];
  const cargarMiembros = async () => {
    const lista = q<ConProps>('#miembros');
    if (!lista || !iempresa) return;
    lista.props = { cargando: true, puedeGestionar: gestiona };
    try {
      const r = z.array(MiembroSchema).safeParse(planos(await controller('miembros').query({ where: { iempresa }, include: { usuario: true } })));
      miembros = r.success ? r.data : [];
    } catch (err) {
      fallo(err);
      miembros = [];
    }
    lista.props = { items: miembros, cargando: false, puedeGestionar: gestiona };
    const equipos = q<ConProps>('#equipos');
    if (equipos) equipos.props = { miembros };
  };
  const abrirInvitar = async () => {
    const form = q<ConProps>('#invitar-form')!;
    let usuarios: UsuarioMin[] = [];
    try {
      const r = z.array(UsuarioMinSchema).safeParse(planos(await auth().controllers['usuarios']!.list()));
      if (r.success) usuarios = r.data.filter((u) => u.bactivo !== false && !miembros.some((m) => m.iusuario === u.iusuario));
    } catch {
      usuarios = [];
    }
    form.props = { abierto: true, usuarios, error: '', ocupado: false };
  };
  const invitar = async (e: Event) => {
    const { datos } = (e as CustomEvent<{ datos: InvitarForm }>).detail;
    const form = q<ConProps>('#invitar-form')!;
    form.props = { ocupado: true, error: '' };
    try {
      await dominio()['invitar'](iempresa, { iusuario: datos.iusuario.trim(), rol: datos.rol, cargo: datos.cargo.trim() || undefined });
      form.props = { abierto: false, ocupado: false };
      avisar(`${datos.iusuario} ahora es ${datos.rol}`, 'success');
      await cargarMiembros();
    } catch (err) {
      form.props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  const quitarMiembro = async (e: Event) => {
    const { iusuario: quien } = (e as CustomEvent<{ iusuario: string }>).detail;
    try {
      const c = controller('miembros');
      await c.delete(c.pojo({ iempresa, iusuario: quien }));
      avisar(`${quien} ya no es miembro`, 'neutral');
      await cargarMiembros();
    } catch (err) {
      fallo(err);
    }
  };

  // ---- equipos
  const cargarEquipos = async () => {
    const eq = q<ConProps>('#equipos');
    if (!eq || !iempresa) return;
    eq.props = { cargando: true, puedeGestionar: gestiona, miembros };
    try {
      const base = z.array(EquipoSchema).safeParse(planos(await controller('equipos').query({ where: { iempresa } })));
      const lista: Equipo[] = base.success ? base.data : [];
      const ids = lista.map((x) => x.iequipo);
      const integrantes = ids.length ? z.array(IntegranteSchema).safeParse(planos(await controller('integrantes').query({ where: { iequipo: { in: ids } }, include: { usuario: true } }))) : null;
      for (const equipo of lista) equipo.integrantes = integrantes?.success ? integrantes.data.filter((i) => i.iequipo === equipo.iequipo) : [];
      eq.props = { items: lista, cargando: false, error: '' };
    } catch (err) {
      eq.props = { items: [], cargando: false, error: mensajeDe(err) };
    }
  };
  const guardarEquipo = async (e: Event) => {
    const d = (e as CustomEvent<{ iequipo: number | null; nombre: string; descripcion: string | null; color: string | null }>).detail;
    const eq = q<ConProps>('#equipos')!;
    eq.props = { ocupado: true };
    try {
      const c = controller('equipos');
      if (d.iequipo === null) await c.post(c.pojo({ iempresa, nombre: d.nombre, descripcion: d.descripcion, color: d.color }));
      else await c.put(c.pojo({ iequipo: d.iequipo, nombre: d.nombre, descripcion: d.descripcion, color: d.color }));
      (eq.shadowRoot?.querySelector('#form') as (HTMLElement & { hide(): void }) | null)?.hide();
      avisar('Equipo guardado', 'success');
      await cargarEquipos();
    } catch (err) {
      eq.props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  const eliminarEquipo = async (e: Event) => {
    const { iequipo } = (e as CustomEvent<{ iequipo: number }>).detail;
    try {
      const c = controller('equipos');
      await c.delete(c.pojo({ iequipo }));
      avisar('Equipo eliminado', 'neutral');
      await cargarEquipos();
    } catch (err) {
      fallo(err);
    }
  };
  const agregarIntegrante = async (e: Event) => {
    const d = (e as CustomEvent<{ iequipo: number; iusuario: string; rol: string }>).detail;
    try {
      const c = controller('integrantes');
      await c.post(c.pojo({ iequipo: d.iequipo, iusuario: d.iusuario, rol: d.rol }));
      await cargarEquipos();
    } catch (err) {
      fallo(err);
    }
  };
  const quitarIntegrante = async (e: Event) => {
    const d = (e as CustomEvent<{ iequipo: number; iusuario: string }>).detail;
    try {
      const c = controller('integrantes');
      await c.delete(c.pojo({ iequipo: d.iequipo, iusuario: d.iusuario }));
      await cargarEquipos();
    } catch (err) {
      fallo(err);
    }
  };

  const cambiarPestana = (e: Event) => {
    const { name } = (e as CustomEvent<{ name: string }>).detail;
    if (name === 'empresa' || name === 'miembros' || name === 'equipos') h.props.pestana = name;
  };

  root.append(html`
    <div class="pagina" part="pagina"
      onav-empresa-guardar=${guardarEmpresa} onav-empresa-cerrar=${() => (q<ConProps>('#empresa-form')!.props = { abierto: false })}
      onav-miembros-invitar=${abrirInvitar} onav-invitar-guardar=${invitar} onav-invitar-cerrar=${() => (q<ConProps>('#invitar-form')!.props = { abierto: false })} onav-miembro-quitar=${quitarMiembro}
      onav-equipo-guardar=${guardarEquipo} onav-equipo-eliminar=${eliminarEquipo} onav-integrante-agregar=${agregarIntegrante} onav-integrante-quitar=${quitarIntegrante}>
      <iswc-page-header id="cabecera">
        ${gestiona ? html`<iswc-button slot="acciones" variant="outlined compact" color="neutral" id="nueva-empresa" oniswc-click=${() => abrirEmpresa({ iempresa: null, nombre: '', nit: '', sector: '', descripcion: '' })}><iswc-icon slot="start" icon="mdi:plus"></iswc-icon>Nueva empresa</iswc-button>` : null}
        <iswc-button slot="acciones" variant="outlined compact" color="neutral" oniswc-click=${recargar}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
      </iswc-page-header>
      ${!iempresa
        ? html`<iswc-empty-state id="sin-empresa">${gestiona ? html`<iswc-button variant="compact" color="brand" oniswc-click=${() => abrirEmpresa({ iempresa: null, nombre: '', nit: '', sector: '', descripcion: '' })}>Crear mi empresa</iswc-button>` : null}</iswc-empty-state>`
        : html`
          <av-pestanas vista="organizacion"><iswc-tab-group active=${props.id ?? props.pestana} oniswc-tab-show=${cambiarPestana}>
            <iswc-tab slot="nav" panel="empresa"><iswc-icon slot="start" icon="mdi:domain"></iswc-icon>Empresa</iswc-tab>
            <iswc-tab slot="nav" panel="miembros"><iswc-icon slot="start" icon="mdi:account-group-outline"></iswc-icon>Miembros</iswc-tab>
            <iswc-tab slot="nav" panel="equipos"><iswc-icon slot="start" icon="mdi:account-multiple-outline"></iswc-icon>Equipos</iswc-tab>
            <iswc-tab-panel name="empresa">
              <iswc-card variant="outlined" id="ficha" hidden>
                <strong slot="header"><iswc-icon icon="mdi:domain"></iswc-icon> <span id="e-nombre"></span></strong>
                ${gestiona ? html`<iswc-button slot="header-actions" variant="outlined compact" color="neutral" id="editar-empresa" oniswc-click=${() => empresa && abrirEmpresa({ iempresa: empresa.iempresa, nombre: empresa.nombre, nit: empresa.nit ?? '', sector: empresa.sector ?? '', descripcion: empresa.descripcion ?? '' })}><iswc-icon slot="start" icon="mdi:pencil-outline"></iswc-icon>Editar</iswc-button>` : null}
                <dl class="datos">
                  <dt>NIT</dt><dd id="e-nit"></dd>
                  <dt>Sector</dt><dd id="e-sector"></dd>
                  <dt>Descripción</dt><dd id="e-descripcion"></dd>
                </dl>
              </iswc-card>
              <iswc-empty-state id="ficha-vacia"></iswc-empty-state>
            </iswc-tab-panel>
            <iswc-tab-panel name="miembros"><av-miembros id="miembros"></av-miembros></iswc-tab-panel>
            <iswc-tab-panel name="equipos"><av-equipos id="equipos"></av-equipos></iswc-tab-panel>
          </iswc-tab-group></av-pestanas>
        `}
      <av-empresa-form id="empresa-form"></av-empresa-form>
      <av-invitar-form id="invitar-form"></av-invitar-form>
    </div>
  `);
  const nombreEmpresa = estado.yo?.empresas.find((e) => e.iempresa === iempresa)?.nombre ?? 'Sin empresa';
  q<ConProps>('#cabecera')!.props = { titulo: 'Organización', subtitulo: `${nombreEmpresa} · empresa, miembros y equipos`, icono: 'mdi:domain' };
  const sinEmpresa = q<ConProps>('#sin-empresa');
  if (sinEmpresa) sinEmpresa.props = sinMembresia(gestiona ? 'Crea la tuya o pide que te inviten.' : 'Pide a un gestor que te invite.');
  const fichaVacia = q<ConProps>('#ficha-vacia');
  if (fichaVacia) fichaVacia.props = { estado: 'cargando' };
  if (!iempresa) return;
  void (async () => {
    await cargarEmpresa();
    await cargarMiembros();
    await cargarEquipos();
    // Paleta global (Ctrl+K) → «Invitar a alguien a la empresa».
    if (tomarIntencion('organizacion') === 'invitar' && gestiona) await abrirInvitar();
  })();
}, soloPestana);

define('av-organizacion', AvOrganizacion);
