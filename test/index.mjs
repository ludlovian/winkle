import { suite, test } from 'node:test'
import assert from 'node:assert/strict'

import Winkle from '../src/index.mjs'

let tmStart
function startClock () {
  tmStart = Date.now()
}

function hasTaken (ms, tolerance = 4) {
  return Math.abs(Date.now() - tmStart - ms) < tolerance
}

suite('Winkle', async () => {
  test('basic construction', () => {
    const w = new Winkle(20)
    assert.ok(w instanceof Winkle)

    assert.strictEqual(w.sleeping, false)
    assert.strictEqual(w.woken, false)
  })

  test('sleep right through', async () => {
    const w = new Winkle(20)

    startClock()
    const p = w.sleep()
    assert.strictEqual(w.sleeping, true)

    const bResult = await p
    assert.ok(hasTaken(20))

    assert.strictEqual(bResult, false)
    assert.strictEqual(w.woken, false)
    assert.strictEqual(w.sleeping, false)
  })

  test('sleep with wake, and non-default ms', async () => {
    const w = new Winkle()

    startClock()
    const p = w.sleep(50)
    assert.strictEqual(w.sleeping, true)

    const w2 = new Winkle()
    await w2.sleep(20)
    w.wake()

    const bResult = await p
    assert.ok(hasTaken(20))

    assert.strictEqual(bResult, true)
    assert.strictEqual(w.woken, true)
    assert.strictEqual(w.sleeping, false)
  })

  test('wake when not sleeping', async () => {
    const w = new Winkle(20)
    w.sleep()
    w.wake()
    assert.strictEqual(w.sleeping, false)
    w.wake()
    assert.strictEqual(w.sleeping, false)
  })

  test('sleep when already sleeping', async () => {
    const w = new Winkle()
    startClock()
    const p1 = w.sleep(50)
    const p2 = w.sleep(20)

    const bResult1 = await p1
    const bResult2 = await p2
    assert.ok(hasTaken(20))

    assert.strictEqual(bResult1, true)
    assert.strictEqual(bResult2, false)
  })

  test('clear sleep', async () => {
    const w = new Winkle(10)
    let woken = false
    w.sleep().then(() => (woken = true))

    await new Winkle(1).sleep()

    w.clear()

    await new Winkle(20).sleep()

    assert.strictEqual(woken, false)

    w.clear()
  })

  test('errors', async () => {
    const w = new Winkle()
    assert.throws(
      //
      () => w.sleep(),
      /No time given/
    )
  })
})
