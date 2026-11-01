// Small offline WordPress fixture for dependency compatibility verification.
// Run from nuxt/: node scripts/check-static-generate-fixture.mjs
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { existsSync } from 'node:fs'

assert.ok(!existsSync('.env'), 'Use an independent checkout without .env')
const temporary = await mkdtemp(join(tmpdir(), 'starter-generate-'))
const requests = []
const post = { id: 1, slug: 'fixture-post', date: '2026-11-01T00:00:00', modified: '2026-11-01T00:00:00',
  link: 'https://fixture.invalid/fixture-post', title: { rendered: 'Fixture article' },
  excerpt: { rendered: '<p>Fixture summary</p>' }, content: { rendered: '<p>Fixture article body</p>' } }
const server = createServer((request, response) => {
  const url = new URL(request.url, 'http://fixture.invalid')
  requests.push(url.pathname)
  if (url.pathname !== '/wp-json/wp/v2/posts') {
    response.writeHead(500).end('Unexpected fixture endpoint'); return
  }
  response.writeHead(200, { 'content-type': 'application/json', 'x-wp-total': '1', 'x-wp-totalpages': '1' })
  response.end(JSON.stringify(!url.searchParams.has('slug') || url.searchParams.get('slug') === post.slug ? [post] : []))
})
try {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  const guard = join(temporary, 'network-guard.cjs')
  await writeFile(guard, `const original=globalThis.fetch; globalThis.fetch=(request,options)=>{
    const raw=typeof request==='string'||request instanceof URL?String(request):request.url;
    const url=new URL(raw);
    if(url.origin!==${JSON.stringify(origin)})throw new Error('Refused non-fixture fetch: '+url.origin);
    return original(request,options);
  };`)
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) =>
    /^(PATH|HOME|TMPDIR|CI|npm_config_)/.test(key)))
  Object.assign(env, { NUXT_TELEMETRY_DISABLED: '1', NUXT_WP_API_BASE: origin + '/wp-json',
    NUXT_PUBLIC_WP_API_BASE: origin + '/wp-json', NUXT_PUBLIC_SITE_URL: 'https://starter.example.invalid',
    NODE_OPTIONS: `--require=${guard}` })
  const child = spawn('npm', ['run', 'generate'], { env, stdio: 'inherit' })
  const timer = setTimeout(() => child.kill('SIGTERM'), 120000)
  try {
    const code = await new Promise((resolve, reject) => {
      child.once('error', reject); child.once('exit', resolve)
    })
    assert.equal(code, 0, 'fixture generate must succeed')
  } finally { clearTimeout(timer) }
  for (const route of ['index.html', 'posts/index.html', 'posts/fixture-post/index.html', 'guide/index.html', 'guide/en/index.html']) {
    assert.ok((await readFile(join('.output/public', route), 'utf8')).includes('<html'), route)
  }
  assert.ok((await readFile('.output/public/posts/fixture-post/index.html', 'utf8')).includes('Fixture article body'))
  assert.ok((await readFile('.output/public/posts/index.html', 'utf8')).includes('Fixture article'))
  assert.ok(requests.length > 0)
  console.log(`PASS fixture generate: 5 HTML routes, article/list content, ${requests.length} loopback WP requests`)
} finally {
  await new Promise(resolve => server.close(resolve))
  await rm(temporary, { recursive: true, force: true })
}
