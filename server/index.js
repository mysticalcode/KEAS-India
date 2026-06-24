import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { createReadStream, promises as fs } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(__dirname, 'data');
const submissionsDir = path.join(dataDir, 'submissions');
const mediaDir = path.join(dataDir, 'media');
const publicUploadDir = path.join(rootDir, 'public', 'uploads', 'cms');
const distUploadDir = path.join(rootDir, 'dist', 'uploads', 'cms');
const contentFile = path.join(dataDir, 'siteData.json');
const sourceContentFile = path.join(rootDir, 'src', 'content', 'siteData.json');
const distContentFile = path.join(rootDir, 'dist', 'content', 'siteData.json');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

const port = Number(process.env.PORT || 4174);
const adminPassword = process.env.KEAS_CMS_PASSWORD || 'keas-admin';
const sessionSecret = process.env.KEAS_CMS_SECRET || 'keas-local-secret-change-me';
const isProduction = process.env.NODE_ENV === 'production';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  response.end(JSON.stringify(payload));
}

function parseCookies(header = '') {
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim().split('='))
      .filter(([key, value]) => key && value)
  );
}

function sign(value) {
  return createHmac('sha256', sessionSecret).update(value).digest('hex');
}

function createSessionToken() {
  const payload = `${Date.now()}.${randomBytes(18).toString('hex')}`;
  return `${payload}.${sign(payload)}`;
}

function isValidSession(request) {
  const token = parseCookies(request.headers.cookie).keas_session;
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = sign(payload);
  const provided = parts[2];
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

async function readBody(request, limit = 5_000_000) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > limit) {
      throw new Error('Request body is too large.');
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function readJson(request, limit) {
  const body = await readBody(request, limit);
  return body ? JSON.parse(body) : {};
}

async function ensureStorage() {
  await fs.mkdir(submissionsDir, { recursive: true });
  await fs.mkdir(mediaDir, { recursive: true });
  await fs.mkdir(publicUploadDir, { recursive: true });
  await fs.mkdir(distUploadDir, { recursive: true });
  try {
    await fs.access(contentFile);
  } catch {
    await fs.copyFile(sourceContentFile, contentFile);
  }
}

async function writeContent(content) {
  const formatted = `${JSON.stringify(content, null, 2)}\n`;
  await fs.writeFile(contentFile, formatted, 'utf8');
  await fs.writeFile(sourceContentFile, formatted, 'utf8');
  await fs.mkdir(path.dirname(distContentFile), { recursive: true });
  await fs.writeFile(distContentFile, formatted, 'utf8');
}

async function appendSubmission(type, payload) {
  const file = path.join(submissionsDir, `${type}.json`);
  let list = [];
  try {
    list = JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    list = [];
  }
  const record = {
    id: `${Date.now()}-${randomBytes(4).toString('hex')}`,
    type,
    createdAt: new Date().toISOString(),
    status: 'new',
    ...payload
  };
  list.unshift(record);
  await fs.writeFile(file, `${JSON.stringify(list, null, 2)}\n`, 'utf8');
  return record;
}

async function listSubmissions() {
  const names = ['contact', 'booking', 'newsletter'];
  const entries = await Promise.all(
    names.map(async (name) => {
      try {
        return JSON.parse(await fs.readFile(path.join(submissionsDir, `${name}.json`), 'utf8'));
      } catch {
        return [];
      }
    })
  );
  return entries.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function cleanFilename(name) {
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, ext).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${base || 'keas-media'}-${Date.now()}${ext}`;
}

async function saveMedia({ filename, dataUrl }) {
  const match = /^data:(image\/(?:png|jpe?g|webp|gif|svg\+xml));base64,(.+)$/i.exec(dataUrl || '');
  if (!match) {
    throw new Error('Only base64 image uploads are supported.');
  }
  const safeName = cleanFilename(filename || 'upload.jpg');
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 8_000_000) {
    throw new Error('Image must be under 8 MB.');
  }
  const targets = [
    path.join(mediaDir, safeName),
    path.join(publicUploadDir, safeName),
    path.join(distUploadDir, safeName)
  ];
  await Promise.all(targets.map((target) => fs.writeFile(target, buffer)));
  return {
    filename: safeName,
    url: `/uploads/cms/${safeName}`,
    size: buffer.length,
    createdAt: new Date().toISOString()
  };
}

async function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const baseDir = url.pathname.startsWith('/admin') || url.pathname.startsWith('/uploads') ? publicDir : distDir;
  let targetPath = path.normalize(path.join(baseDir, decodeURIComponent(url.pathname)));
  if (!targetPath.startsWith(baseDir)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }
  try {
    const stat = await fs.stat(targetPath);
    if (stat.isDirectory()) {
      targetPath = path.join(targetPath, 'index.html');
    }
    const ext = path.extname(targetPath);
    response.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });
    createReadStream(targetPath).pipe(response);
  } catch {
    const fallback = path.join(distDir, 'index.html');
    try {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
      createReadStream(fallback).pipe(response);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  }
}

function requireAdmin(request, response) {
  if (isValidSession(request)) return true;
  sendJson(response, 401, { error: 'Admin login required.' });
  return false;
}

async function handleApi(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === 'POST' && url.pathname === '/api/auth/login') {
    const body = await readJson(request, 50_000);
    if (body.password !== adminPassword) {
      sendJson(response, 401, { error: 'Invalid password.' });
      return;
    }
    const token = createSessionToken();
    response.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Set-Cookie': `keas_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800${isProduction ? '; Secure' : ''}`
    });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/logout') {
    response.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Set-Cookie': 'keas_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'
    });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/content') {
    sendJson(response, 200, JSON.parse(await fs.readFile(contentFile, 'utf8')));
    return;
  }

  if (request.method === 'PUT' && url.pathname === '/api/content') {
    if (!requireAdmin(request, response)) return;
    const body = await readJson(request, 3_000_000);
    await writeContent(body);
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/submissions') {
    if (!requireAdmin(request, response)) return;
    sendJson(response, 200, await listSubmissions());
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/contact') {
    const record = await appendSubmission('contact', await readJson(request, 100_000));
    sendJson(response, 201, { ok: true, id: record.id });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/booking') {
    const record = await appendSubmission('booking', await readJson(request, 100_000));
    sendJson(response, 201, { ok: true, id: record.id });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/newsletter') {
    const record = await appendSubmission('newsletter', await readJson(request, 50_000));
    sendJson(response, 201, { ok: true, id: record.id });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/media') {
    if (!requireAdmin(request, response)) return;
    const media = await saveMedia(await readJson(request, 11_000_000));
    sendJson(response, 201, media);
    return;
  }

  sendJson(response, 404, { error: 'API route not found.' });
}

await ensureStorage();

http
  .createServer(async (request, response) => {
    try {
      if (request.url.startsWith('/api/')) {
        await handleApi(request, response);
      } else {
        await serveStatic(request, response);
      }
    } catch (error) {
      sendJson(response, 500, { error: error.message || 'Server error.' });
    }
  })
  .listen(port, () => {
    console.log(`KEAS backend running at http://127.0.0.1:${port}`);
    console.log('Admin CMS: /admin');
    if (!process.env.KEAS_CMS_PASSWORD) {
      console.log('Default CMS password: keas-admin');
    }
  });
