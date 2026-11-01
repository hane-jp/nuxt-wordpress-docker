// Bounded compatibility probe, not an exploit or proof that an advisory is fixed.
// Run from the package root: node scripts/check-glob-minimatch-compatibility.mjs
// Optional: append the absolute directory of an independent npm project containing
// glob@14.0.2 and minimatch@11.0.1. This never changes this project's resolution.
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { once } from 'node:events'

const require = createRequire(resolve('package.json'))
const from = name => createRequire(require.resolve(name))
const sorted = values => [...values].sort()
const glob13 = from('@vercel/nft')('glob')
const glob10 = from('archiver-utils')('glob')
const matchers = [
  ['root', require('minimatch')],
  ['archiver-utils', from('archiver-utils')('minimatch')],
  ['readdir-glob', from('readdir-glob')('minimatch')],
]
const candidate = process.argv[2] && createRequire(join(resolve(process.argv[2]), 'package.json'))
const report = { candidate: Boolean(candidate), versions: {
  nft: require('@vercel/nft/package.json').version,
  glob: from('@vercel/nft')('glob/package.json').version,
  nestedGlob: from('archiver-utils')('glob/package.json').version,
  minimatch: require('minimatch/package.json').version,
  nestedMinimatch: from('archiver-utils')('minimatch/package.json').version,
  legacyMinimatch: from('readdir-glob')('minimatch/package.json').version,
  ...(candidate && { candidateGlob: candidate('glob/package.json').version,
    candidateMinimatch: candidate('minimatch/package.json').version }),
}, collections: [], matchers: [], trace: [], archive: [] }
const fixture = await mkdtemp(join(tmpdir(), 'glob-compat-'))
try {
  const files = ['assets/a.json', 'assets/b.json', 'src/main.js', 'src/nested/part.js',
    'src/nested/omit.js', 'content/日本語.md', 'content/guide.md', '.hidden.json']
  for (const name of files) {
    await mkdir(join(fixture, name, '..'), { recursive: true })
    await writeFile(join(fixture, name), name.endsWith('.json') ? '{}' : 'fixture')
  }
  // API options used by NFT and archiver-utils, plus a bounded cancellation check.
  const globs = [['nft', glob13], ['archiver-utils', glob10]]
  if (candidate) globs.push(['candidate', candidate('glob')])
  for (const [name, glob] of globs) {
    for (const [pattern, options, expected] of [
      ['**/*.json', { dot: true, nodir: true }, ['.hidden.json', 'assets/a.json', 'assets/b.json']],
      ['src/**/*.js', { nodir: true, ignore: '**/omit.js' }, ['src/main.js', 'src/nested/part.js']],
      ['content/*.{md,json}', { nodir: true }, ['content/guide.md', 'content/日本語.md']],
    ]) {
      const opts = { ...options, cwd: fixture }
      assert.deepEqual(sorted(await glob.glob(pattern, opts)), sorted(expected), name)
      assert.deepEqual(sorted(glob.sync(pattern, opts)), sorted(expected), name)
    }
    const controller = new AbortController()
    const reason = new Error('bounded pre-abort fixture')
    controller.abort(reason)
    await assert.rejects(glob.glob('**/*', { cwd: fixture, signal: controller.signal }), error => error === reason)
    report.collections.push(name)
  }
  const corpus = [
    ['src/main.js', '**/*.js', {}, true],
    ['src/main.js', '*.js', { matchBase: true }, true],
    ['.hidden.json', '**/*.json', {}, false],
    ['.hidden.json', '**/*.json', { dot: true }, true],
    ['src/main.js', 'SRC/*.JS', { nocase: true }, true],
    ['src/nested/part.js', 'src/*.js', {}, false],
    ['content/日本語.md', 'content/*.{md,json}', {}, true],
    ['src/main.js', 'src/!(omit).js', {}, true],
  ]
  if (candidate) matchers.push(['candidate', candidate('minimatch')])
  for (const [name, module] of matchers) {
    for (const level of [0, 1, 2]) {
      for (const [path, pattern, options, expected] of corpus) {
        assert.equal(new module.Minimatch(pattern, { ...options, optimizationLevel: level }).match(path), expected, name)
      }
    }
    report.matchers.push({ name, moduleType: typeof module, classType: typeof module.Minimatch,
      hasFirstPhase: typeof module.Minimatch.prototype.firstPhasePreProcess === 'function' })
  }
  const utils = require('archiver-utils')
  assert.deepEqual(sorted(utils.file.expand({ cwd: fixture, filter: 'isFile' },
    ['src/**/*.js', '!**/omit.js'])), ['src/main.js', 'src/nested/part.js'])

  const walk = require('readdir-glob')(fixture, { pattern: '**/*.json', dot: true, nodir: true })
  const found = []
  walk.on('match', entry => found.push(entry.relative))
  await once(walk, 'end')
  assert.deepEqual(sorted(found), ['.hidden.json', 'assets/a.json', 'assets/b.json'])

  // Exercise the real NFT caller without running the fixture entry or reading env.
  await writeFile(join(fixture, 'entry.cjs'),
    "const fs=require('fs'), path=require('path'); module.exports=n=>fs.readFileSync(path.join(__dirname,'assets',n+'.json'),'utf8');")
  const trace = await require('@vercel/nft').nodeFileTrace([join(fixture, 'entry.cjs')], { base: fixture, processCwd: fixture })
  report.trace = sorted(trace.fileList)
  for (const name of ['entry.cjs', 'assets/a.json', 'assets/b.json']) assert.ok(trace.fileList.has(name), name)

  // Verify actual ZIP central-directory names, not just successful finalization.
  const archive = require('archiver')('zip', { store: true })
  const chunks = []
  archive.on('data', data => chunks.push(data))
  const ended = once(archive, 'end')
  archive.glob('src/**/*.js', { cwd: fixture, ignore: '**/omit.js' })
  await archive.finalize()
  await ended
  const zip = Buffer.concat(chunks)
  const end = zip.length - 22
  assert.equal(zip.readUInt32LE(end), 0x06054b50)
  let offset = zip.readUInt32LE(end + 16)
  const count = zip.readUInt16LE(end + 10)
  for (let i = 0; i < count; i++) {
    assert.equal(zip.readUInt32LE(offset), 0x02014b50)
    const length = zip.readUInt16LE(offset + 28)
    report.archive.push(zip.subarray(offset + 46, offset + 46 + length).toString())
    offset += 46 + length + zip.readUInt16LE(offset + 30) + zip.readUInt16LE(offset + 32)
  }
  assert.deepEqual(sorted(report.archive), ['src/main.js', 'src/nested/part.js'])
  if (require('./package.json').dependencies?.['@nuxt/content']) {
    const content = await import(pathToFileURL(join(dirname(require.resolve('@nuxt/content')),
      'runtime/internal/preview/collection.js')))
    const docs = { name: 'docs', source: [{ include: '**/*.md', exclude: ['private/**'] }] }
    for (const path of ['guide.md', '日本語.md', 'getting-started/docker.md']) {
      assert.equal(content.getCollectionByFilePath(path, { docs }).collection, docs)
    }
    for (const path of ['private/draft.md', 'image.png']) {
      assert.equal(content.getCollectionByFilePath(path, { docs }).collection, undefined)
    }
    report.content = 'PASS actual Content preview include/exclude API (5 paths); candidate is not injected'
  }
  console.log(JSON.stringify(report, null, 2))
  console.log('PASS bounded collection, matcher options, NFT tracing and ZIP membership; advisory remediation is not asserted')
} finally {
  await rm(fixture, { recursive: true, force: true })
}
