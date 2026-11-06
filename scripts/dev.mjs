import { execFile } from 'node:child_process';
import { watch } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, promisify } from 'node:util';
import { pages, pageFile } from './pages.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const { values } = parseArgs({ options: { port: { type: 'string', default: process.env.PORT || '5173' } } });
const port = Number(values.port);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Choose a port between 1 and 65535: npm run dev -- --port 5173');
  process.exit(1);
}

const run = promisify(execFile);
async function build() {
  const { stdout } = await run(process.execPath, [resolve(root, 'scripts/build.mjs')]);
  process.stdout.write(stdout);
}
await build();

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.ico': 'image/x-icon',
};
const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = pathname === '/' ? 'index.html' : pathname.slice(1);
    const path = resolve(root, file);
    const publicFile = [...pages.flatMap(page => ['en', 'ja'].map(lang => pageFile(page, lang))), 'style.css'].includes(file)
      || (file.startsWith('Images/') && Object.hasOwn(types, extname(file)));
    if (!publicFile || !path.startsWith(root + (root.endsWith(sep) ? '' : sep))) {
      response.writeHead(404).end('Not found');
      return;
    }
    const body = await readFile(path);
    response.writeHead(200, { 'Content-Type': types[extname(path)], 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    response.writeHead(error instanceof URIError ? 400 : 404).end('Not found');
  }
});

// Watch directories so saving a file by replacing it also triggers a rebuild.
let timer;
let rebuilding = false;
let pending = false;
async function rebuild() {
  if (rebuilding) { pending = true; return; }
  rebuilding = true;
  do {
    pending = false;
    try { await build(); }
    catch (error) { console.error(error.stderr || error.message); }
  } while (pending);
  rebuilding = false;
}
const watchers = [
  watch(root, (_, name) => {
    if (String(name) !== 'content.json') return;
    clearTimeout(timer);
    timer = setTimeout(rebuild, 100);
  }),
  watch(resolve(root, 'scripts'), (_, name) => {
    if (!['build.mjs', 'pages.mjs'].includes(String(name))) return;
    clearTimeout(timer);
    timer = setTimeout(rebuild, 100);
  }),
];

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is busy. Try npm run dev -- --port ${port + 1}` : error.message);
  watchers.forEach(watcher => watcher.close());
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`\n  Local: http://localhost:${port}\n`);
  console.log('Content rebuilds automatically. Refresh your browser after edits.');
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    clearTimeout(timer);
    watchers.forEach(watcher => watcher.close());
    server.close();
  });
}
