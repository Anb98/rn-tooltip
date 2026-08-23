import * as api from '../index'
import type { ArrowAlignment, TooltipProps, TooltipRef } from '../index'

// design.md's "Curated Public Exports" names exactly five: Tooltip,
// TooltipRef, TooltipProps, TooltipPosition, ArrowAlignment. Three of those
// (TooltipRef, TooltipProps, ArrowAlignment) are `export type` — TypeScript
// erases type-only exports at compile time, so they never become properties
// on the compiled CommonJS module object. Only `Tooltip` and `TooltipPosition`
// (plain `export { ... }`, i.e. values) survive into the runtime module.
// This test locks that split so a future accidental `export type` -> `export`
// (or vice versa) on any of the five names is caught.
describe('index barrel', () => {
  it('exposes exactly the two runtime values: Tooltip and TooltipPosition', () => {
    expect(Object.keys(api).sort()).toEqual(['Tooltip', 'TooltipPosition'])
  })

  it('type-checks all five curated names as importable types/values (compile-time only, never invoked)', () => {
    const assertFiveNamesAreImportable = (
      _tooltip: typeof api.Tooltip,
      _position: typeof api.TooltipPosition,
      _ref: TooltipRef,
      _props: TooltipProps,
      _alignment: ArrowAlignment
    ): void => {}

    expect(typeof assertFiveNamesAreImportable).toBe('function')
  })
})
