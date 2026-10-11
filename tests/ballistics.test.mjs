/**
 * Kontrollerar att webbverktygets beräkningar ger samma svar som appens
 * Ballistics.kt. Samma fall finns i BallisticsTest.kt — går något sönder här
 * har de två börjat glida isär, och då ska de föras ihop igen.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const projectRoot = new URL('..', import.meta.url).pathname
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'inskjutning-ballistics-'))
fs.writeFileSync(
  path.join(tempDir, 'ballistics.ts'),
  fs.readFileSync(path.join(projectRoot, 'lib', 'ballistics.ts'), 'utf8')
)

const B = await import(path.join(tempDir, 'ballistics.ts'))

let failures = 0
function check(name, ok, detail) {
  console.log(`${ok ? '  ok  ' : ' FEL  '} ${name}${ok || detail === undefined ? '' : ` — ${detail}`}`)
  if (!ok) failures++
}
const near = (a, b, tol = 1e-3) => Math.abs(a - b) <= tol

const MOA = B.CM_PER_MOA_AT_100M
const adjust = (shots, distance, cmAt100m = MOA / 4, desiredX = 0, desiredY = 0) =>
  B.calculateAdjustment({
    shots: shots.map(([x, y], i) => ({ id: String(i), x, y })),
    distanceMeters: distance,
    cmAt100m,
    desiredX,
    desiredY,
  })

/* --- klickvärden --------------------------------------------------------- */

check('1/4 MOA är 0,7272 cm på 100 m', near(MOA / 4, 0.72722, 1e-5))
check('0,1 MIL är exakt 1 cm på 100 m', B.CM_PER_MIL_AT_100M * 0.1 === 1)
check('klicket flyttar hälften så långt på halva avståndet',
  near(B.cmPerClickAtDistance(MOA / 4, 50), 0.36361, 1e-5))

/* --- riktning ------------------------------------------------------------ */

check('träff till höger ger klick åt vänster', adjust([[4, 0]], 100).horizontalClicks === -6)
check('träff högt ger klick nedåt', adjust([[0, 7]], 100).verticalClicks === -10)

const lagt = adjust([[-3, -6]], 100)
check('träff lågt till vänster ger klick upp och höger',
  lagt.horizontalClicks === 4 && lagt.verticalClicks === 8)

/* --- samma fall som i BallisticsTest.kt ---------------------------------- */

const grupp = adjust([[1.5, 2.3], [3.1, 1.1], [0.6, 3.7]], 100)
check('tre skott: medelträffpunkt', near(grupp.group.mpi.x, 1.733) && near(grupp.group.mpi.y, 2.367))
check('tre skott: klick', grupp.horizontalClicks === -2 && grupp.verticalClicks === -3,
  `${grupp.horizontalClicks}/${grupp.verticalClicks}`)
check('tre skott: extreme spread', near(grupp.group.extremeSpreadCm, 3.607))
check('tre skott: i MOA', near(grupp.group.extremeSpreadMoa, 1.24))
check('tre skott: avvikelse från mitten', near(grupp.group.offsetCm, 2.934))

const onskad = adjust([[3.5, -6.6]], 50, MOA / 4, 0, 3)
check('önskad träffpunkt på 50 m',
  onskad.horizontalClicks === -10 && onskad.verticalClicks === 26,
  `${onskad.horizontalClicks}/${onskad.verticalClicks}`)

/* --- avrundning ---------------------------------------------------------- */

check('halva klick avrundas bort från noll', B.roundHalfAwayFromZero(2.5) === 3 &&
  B.roundHalfAwayFromZero(-2.5) === -3)

const h = adjust([[0.5, 0]], 100, 1.0)
const v = adjust([[-0.5, 0]], 100, 1.0)
check('lika stor avvikelse åt höger och vänster ger lika många klick',
  h.horizontalClicks === -v.horizontalClicks, `${h.horizontalClicks} mot ${v.horizontalClicks}`)

/* --- gränsfall ----------------------------------------------------------- */

check('inga skott ger inget resultat', adjust([], 100) === null)
check('orimligt avstånd ger inget resultat', adjust([[1, 1]], 0) === null)
check('träff mitt i prick kräver ingen justering',
  adjust([[0, 0]], 100).horizontalClicks === 0 && adjust([[0, 0]], 100).verticalClicks === 0)

fs.rmSync(tempDir, { recursive: true, force: true })
console.log(failures === 0 ? '\nAlla kontroller gick igenom.' : `\n${failures} kontroll(er) misslyckades.`)
process.exit(failures === 0 ? 0 : 1)
