import type { RefObject } from 'react'
import type { View } from 'react-native'

import { measureElement, measureViewInWindow } from '../measure'

// Direct, unmocked tests for the measure functions' own logic (null-ref
// guard, finite/positive-width validation, Rect shape). No renderer needed: a
// fake node object with a `measureInWindow` method is enough to drive the
// callback. Both exports share the same window-coordinate read.
type FakeWindowMeasurableNode = {
  measureInWindow: (callback: (x: number, y: number, width: number, height: number) => void) => void
}

const refWith = (current: FakeWindowMeasurableNode | null): RefObject<View | null> =>
  ({ current }) as unknown as RefObject<View | null>

describe.each([
  ['measureElement', measureElement],
  ['measureViewInWindow', measureViewInWindow]
])('%s', (_name, measure) => {
  it('resolves null when the ref has no current node', async () => {
    await expect(measure(refWith(null))).resolves.toBeNull()
  })

  it('resolves null when the callback reports a non-finite x', async () => {
    const node: FakeWindowMeasurableNode = { measureInWindow: callback => callback(NaN, 63, 750, 1271) }
    await expect(measure(refWith(node))).resolves.toBeNull()
  })

  it('resolves null when the callback reports zero width', async () => {
    const node: FakeWindowMeasurableNode = { measureInWindow: callback => callback(0, 63, 0, 1271) }
    await expect(measure(refWith(node))).resolves.toBeNull()
  })

  it('resolves the window-coordinate Rect for a valid measurement', async () => {
    const node: FakeWindowMeasurableNode = { measureInWindow: callback => callback(150, 400, 100, 40) }
    await expect(measure(refWith(node))).resolves.toEqual({ x: 150, y: 400, width: 100, height: 40 })
  })
})
