# winkle
Wakeable Sleeper, just like Rip Van...

## Winkle

### new Winkle (ms)

Creates a new winkle with a default timeout of `ms`.

### .sleep ([ms]) => Promise(boolean)

Causes the winkle to sleep, for `ms` if given, else we use the default.

Returns a promise which resolves to `true` if it was woken early, or `false` if it wasn't.

If it is already sleeping, then wakes it first, before re-sleeping.

### .wake ()

Wakes the winkle. No effect if not sleeping.

### .sleeping => boolean

Is is currently sleeping.
### .woken => boolean

Was it recently woken

### .clear ()

Stops the timer - will never awake!
