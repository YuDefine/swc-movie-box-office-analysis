interface SpringOptions {
  stiffness?: number
  damping?: number
  mass?: number
  precision?: number
}

export function useSpring(initial: number = 0, options: SpringOptions = {}) {
  const {
    stiffness = 170,
    damping = 26,
    mass = 1,
    precision = 0.01,
  } = options

  const value = ref(initial)
  const target = ref(initial)
  const isAnimating = ref(false)

  let pos = initial
  let velocity = 0
  let rafId: number | null = null

  const prefersReducedMotion = import.meta.server
    ? ref(false)
    : ref(window.matchMedia("(prefers-reduced-motion: reduce)").matches)

  const SUBSTEP = 1 / 120
  const MAX_SUBSTEPS = 10

  function simulate() {
    const goalValue = target.value

    if (prefersReducedMotion.value) {
      pos = goalValue
      velocity = 0
      value.value = goalValue
      isAnimating.value = false
      rafId = null
      return
    }

    let steps = MAX_SUBSTEPS
    while (steps-- > 0) {
      const displacement = pos - goalValue
      const springForce = -stiffness * displacement
      const dampingForce = -damping * velocity
      const acceleration = (springForce + dampingForce) / mass

      velocity += acceleration * SUBSTEP
      pos += velocity * SUBSTEP

      if (Math.abs(velocity) < precision && Math.abs(pos - goalValue) < precision) {
        pos = goalValue
        velocity = 0
        break
      }
    }

    value.value = pos

    if (pos === goalValue && velocity === 0) {
      isAnimating.value = false
      rafId = null
    } else {
      rafId = requestAnimationFrame(simulate)
    }
  }

  function startAnimation() {
    if (rafId !== null) return
    isAnimating.value = true
    rafId = requestAnimationFrame(simulate)
  }

  function set(v: number) {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    pos = v
    velocity = 0
    target.value = v
    value.value = v
    isAnimating.value = false
  }

  if (import.meta.client) {
    watch(target, () => {
      if (prefersReducedMotion.value) {
        set(target.value)
      } else {
        startAnimation()
      }
    })

    onUnmounted(() => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    })
  }

  return {
    value: readonly(value),
    target,
    set,
    isAnimating: readonly(isAnimating),
  }
}
