// check.mjs — `deno task check`. El tipado del API llega por `@avatar/vendor` y alcanza el código de DER, que importa `@Jeff-Aporta/wc-*`
// fijados al SHA del kit que DER usa (no el de la app: la versión nueva de esos archivos no resuelve en Deno remoto). No pueden ir en
// deno.json porque `deno task pin` exige un solo SHA del kit allí, así que solo este paso los agrega, en una config temporal.
import { readFileSync, rmSync, writeFileSync } from 'node:fs';

const SHA_DER = 'de72fa6916b42d91ee3e8bfecfbcbeb67c97114d';
const KIT = `https://raw.githubusercontent.com/Jeff-Aporta/is-webcomponents/${SHA_DER}`;
const TEMPORAL = 'deno.check.json';
const REMOTOS = 'api-avatar.jeffaporta.workers.dev:443,cdn.jsdelivr.net:443,raw.githubusercontent.com:443,jsr.io:443,deno.land:443,esm.sh:443';

const config = JSON.parse(readFileSync('deno.json', 'utf8'));
config.imports['@Jeff-Aporta/wc-base/'] = `${KIT}/src/vendor-distributions/shared/`;
config.imports['@Jeff-Aporta/wc-diagrams/'] = `${KIT}/src/components/diagrams/schemas/`;
delete config.tasks;
writeFileSync(TEMPORAL, JSON.stringify(config, null, 2));
try {
  const { code } = await new Deno.Command(Deno.execPath(), { args: ['check', `--config=${TEMPORAL}`, '--lock=deno.lock', `--allow-import=${REMOTOS}`, 'src/js/', 'view/', 'tests/vistas/'], stdout: 'inherit', stderr: 'inherit' }).output();
  Deno.exitCode = code;
} finally {
  rmSync(TEMPORAL, { force: true });
}
