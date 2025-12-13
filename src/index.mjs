//  Winkle
//
//  An object that will sleep for a time, but can be woken
//
export default class Winkle {
  woken = false
  #ms = null
  #tm = null
  #resolve = null

  constructor (ms) {
    if (ms != null) this.#ms = ms
  }

  get sleeping () {
    return !!this.#tm
  }

  sleep (ms) {
    ms = ms ?? this.#ms
    if (ms == null) throw new Error('No time given')
    if (this.sleeping) this.wake()

    const { promise, resolve } = Promise.withResolvers()
    this.#resolve = resolve
    this.woken = false
    this.#tm = setTimeout(this.#wake.bind(this, false), ms)
    return promise
  }

  wake () {
    this.#wake(true)
  }

  clear () {
    if (!this.sleeping) return
    clearTimeout(this.#tm)
    this.#tm = this.#resolve = null
  }

  #wake (woken) {
    if (!this.sleeping) return
    clearTimeout(this.#tm)
    this.woken = woken
    this.#resolve(woken)
    this.#tm = this.#resolve = null
  }
}
