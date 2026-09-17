/**
 * Testar granskningen och sammanslagningen i lib/backup.ts.
 *
 * Node kan köra TypeScript direkt men kräver filändelse i importsökvägar,
 * medan projektet använder utelämnade ändelser. Därför kopieras modulerna till
 * en temporär mapp med ändelserna ifyllda innan de läses in.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const projectRoot = new URL('..', import.meta.url).pathname
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'inskjutning-backup-test-'))

for (const name of ['ballistics.ts', 'storage.ts', 'backup.ts']) {
  const source = fs.readFileSync(path.join(projectRoot, 'lib', name), 'utf8')
  fs.writeFileSync(
    path.join(tempDir, name),
    source.replace(/from '\.\/([a-z-]+)'/g, "from './$1.ts'")
  )
}

const {
  createBackup,
  parseBackup,
  mergeBackup,
  backupFilename,
  BACKUP_FORMAT,
} = await import(path.join(tempDir, 'backup.ts'))

let failures = 0
function check(name, condition, detail) {
  console.log(`${condition ? '  ok  ' : ' FEL  '} ${name}${condition || detail === undefined ? '' : ` — ${detail}`}`)
  if (!condition) failures++
}

/* --- Testdata ------------------------------------------------------------ */

const profile = (id, name) => ({
  id,
  name,
  notes: 'Zeiss V4',
  clickUnitId: '1/4-moa',
  customCmAt100m: null,
  defaultDistance: 100,
  desiredX: 0,
  desiredY: 3,
  createdAt: '2026-01-01T10:00:00.000Z',
})

const entry = (id, createdAt) => ({
  id,
  profileId: 'p1',
  profileName: 'Sauer 100',
  createdAt,
  distance: 100,
  clickUnitLabel: '1/4 MOA',
  shots: [{ x: 1.5, y: -2 }],
  mpiX: 1.5,
  mpiY: -2,
  horizontalClicks: -2,
  verticalClicks: 3,
  groupSizeCm: 3.6,
  groupSizeMoa: 1.2,
})

const wrap = (profiles, log) => JSON.stringify({
  format: BACKUP_FORMAT,
  version: 1,
  exportedAt: '2026-09-08T10:00:00.000Z',
  profiles,
  log,
})

/* --- Runda tur och retur ------------------------------------------------- */

const original = { profiles: [profile('p1', 'Sauer 100 .308')], log: [entry('l1', '2026-05-01T08:00:00.000Z')] }
const roundTrip = parseBackup(JSON.stringify(createBackup(original.profiles, original.log)))

check('export följt av import ger tillbaka samma data', roundTrip.ok &&
  JSON.stringify(roundTrip.backup.profiles) === JSON.stringify(original.profiles) &&
  JSON.stringify(roundTrip.backup.log) === JSON.stringify(original.log))

check('filnamnet innehåller datumet',
  backupFilename(new Date('2026-09-08T12:00:00Z')) === 'inskjutning-sakerhetskopia-2026-09-08.json',
  backupFilename(new Date('2026-09-08T12:00:00Z')))

/* --- Filer som ska avvisas ----------------------------------------------- */

check('trasig JSON avvisas', parseBackup('{ inte json').ok === false)
check('tom text avvisas', parseBackup('').ok === false)
check('lista i stället för objekt avvisas', parseBackup('[]').ok === false)
check('null avvisas', parseBackup('null').ok === false)
check('främmande fil avvisas', parseBackup('{"format":"nagot-annat","profiles":[]}').ok === false)
check('nyare filversion avvisas',
  parseBackup(JSON.stringify({ format: BACKUP_FORMAT, version: 99, profiles: [profile('p1', 'X')], log: [] })).ok === false)
check('tom säkerhetskopia avvisas', parseBackup(wrap([], [])).ok === false)

/* --- Granskning av enskilda poster --------------------------------------- */

const messy = parseBackup(wrap(
  [
    profile('p1', 'Giltig'),
    { id: 'p2' },                                   // namn saknas
    { name: 'Utan id' },                            // id saknas
    'inte ett objekt',
    null,
    { ...profile('p3', 'Skräpvärden'), defaultDistance: 'hundra', desiredX: Infinity, desiredY: NaN },
    { ...profile('p4', 'Okänt klickvärde'), clickUnitId: 'påhittat' },
  ],
  [
    entry('l1', '2026-05-01T08:00:00.000Z'),
    { ...entry('l2', 'inte ett datum') },           // ogiltigt datum
    { ...entry('l3', '2026-05-02T08:00:00.000Z'), distance: -5 }, // orimligt avstånd
    { ...entry('l4', '2026-05-03T08:00:00.000Z'), shots: 'inte en lista' },
    { ...entry('l5', '2026-05-04T08:00:00.000Z'), shots: [{ x: 1, y: 2 }, { x: 'a', y: 2 }, null] },
  ]
))

check('trasiga poster hoppas över men resten går igenom', messy.ok)
if (messy.ok) {
  const { profiles, log, discardedProfiles, discardedLogEntries } = messy.backup
  check('profiler utan id eller namn förkastas', discardedProfiles === 4, `förkastade ${discardedProfiles}`)
  check('giltiga profiler behålls', profiles.length === 3, `behöll ${profiles.length}`)

  const junk = profiles.find((p) => p.name === 'Skräpvärden')
  check('text i sifferfält ersätts med standardvärde', junk.defaultDistance === 100, String(junk.defaultDistance))
  check('Infinity ersätts med noll', junk.desiredX === 0, String(junk.desiredX))
  check('NaN ersätts med noll', junk.desiredY === 0, String(junk.desiredY))

  const unknown = profiles.find((p) => p.name === 'Okänt klickvärde')
  check('okänt klickvärde faller tillbaka på 1/4 MOA', unknown.clickUnitId === '1/4-moa', unknown.clickUnitId)

  check('loggposter med ogiltigt datum eller avstånd förkastas', discardedLogEntries === 2, `förkastade ${discardedLogEntries}`)
  check('loggposter med trasig skottlista behålls utan skott',
    log.find((e) => e.id === 'l4').shots.length === 0)
  check('enskilda trasiga skott plockas bort ur listan',
    log.find((e) => e.id === 'l5').shots.length === 1)
}

/* --- Långa texter och stora tal ------------------------------------------ */

const long = parseBackup(wrap([{ ...profile('p1', 'A'.repeat(500)), notes: 'B'.repeat(1000) }], []))
check('för långt namn kortas till 100 tecken', long.ok && long.backup.profiles[0].name.length === 100)
check('för lång anteckning kortas till 300 tecken', long.ok && long.backup.profiles[0].notes.length === 300)

/* --- Eget klickvärde ----------------------------------------------------- */

const custom = parseBackup(wrap([{ ...profile('p1', 'Eget'), clickUnitId: 'custom', customCmAt100m: 0.8 }], []))
check('eget klickvärde behålls', custom.ok && custom.backup.profiles[0].customCmAt100m === 0.8)

const strayCustom = parseBackup(wrap([{ ...profile('p1', 'MOA'), clickUnitId: '1/4-moa', customCmAt100m: 0.8 }], []))
check('eget klickvärde nollas när enheten inte är eget',
  strayCustom.ok && strayCustom.backup.profiles[0].customCmAt100m === null)

/* --- Sammanslagning ------------------------------------------------------ */

const current = {
  profiles: [profile('p1', 'Finns redan')],
  log: [entry('l1', '2026-05-01T08:00:00.000Z')],
}
const incoming = parseBackup(wrap(
  [profile('p1', 'Omdöpt i kopian'), profile('p2', 'Ny')],
  [entry('l1', '2026-05-01T08:00:00.000Z'), entry('l2', '2026-06-01T08:00:00.000Z')]
))

check('säkerhetskopian gick att läsa', incoming.ok)
const merged = mergeBackup(current, incoming.backup, 100)

check('nya profiler läggs till', merged.addedProfiles === 1, String(merged.addedProfiles))
check('befintlig profil räknas som oförändrad', merged.keptProfiles === 1, String(merged.keptProfiles))
check('befintlig profil skrivs inte över',
  merged.profiles.find((p) => p.id === 'p1').name === 'Finns redan',
  merged.profiles.find((p) => p.id === 'p1').name)
check('nya loggposter läggs till', merged.addedLogEntries === 1, String(merged.addedLogEntries))
check('dubblett i loggen hoppas över', merged.keptLogEntries === 1, String(merged.keptLogEntries))
check('loggen sorteras med nyaste först', merged.log[0].id === 'l2', merged.log[0].id)

/* --- Taket för antal loggposter ------------------------------------------ */

const many = parseBackup(wrap(
  [],
  Array.from({ length: 30 }, (_, i) =>
    entry(`x${i}`, new Date(Date.UTC(2026, 0, i + 1)).toISOString())
  )
))
const capped = mergeBackup({ profiles: [], log: [] }, many.backup, 10)
check('taket för loggposter respekteras', capped.log.length === 10, String(capped.log.length))
check('det är de nyaste som behålls', capped.log[0].id === 'x29', capped.log[0].id)
check('antalet strukna poster rapporteras', capped.trimmedLogEntries === 20, String(capped.trimmedLogEntries))

/* --- Sammanslagning ändrar inte det inskickade --------------------------- */

const before = JSON.stringify(current)
mergeBackup(current, incoming.backup, 100)
check('sammanslagningen ändrar inte befintlig data på plats', JSON.stringify(current) === before)

fs.rmSync(tempDir, { recursive: true, force: true })

console.log(failures === 0 ? '\nAlla kontroller gick igenom.' : `\n${failures} kontroll(er) misslyckades.`)
process.exit(failures === 0 ? 0 : 1)
