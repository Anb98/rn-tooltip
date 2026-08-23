import type { RefObject } from 'react'
import type { View } from 'react-native'

import { measureElement } from '../measure'

// Direct, unmocked tests for measureElement's own logic (null-ref guard,
// finite/positive-width validation, Rect shape). No renderer needed: a fake
// node object with a `measure` method is enough to drive the callback.
type FakeMeasurableNode = {
  measure: (callback: (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void) => void
}

const refWith = (current: FakeMeasurableNode | null): RefObject<View | null> => ({ current }) as unknown as RefObject<View | null>

describe('measureElement', () => {
  it('resolves null when the ref has no current node', async () => {
    await expect(measureElement(refWith(null))).resolves.toBeNull()
  })

  it('resolves null when the measure callback reports a non-finite pageX', async () => {
    const node: FakeMeasurableNode = { measure: callback => callback(0, 0, 100, 40, NaN, 20) }
    await expect(measureElement(refWith(node))).resolves.toBeNull()
  })

  it('resolves null when the measure callback reports zero width', async () => {
    const node: FakeMeasurableNode = { measure: callback => callback(0, 0, 0, 40, 10, 20) }
    await expect(measureElement(refWith(node))).resolves.toBeNull()
  })

  it('resolves the page-coordinate Rect for a valid measurement', async () => {
    const node: FakeMeasurableNode = { measure: callback => callback(0, 0, 100, 40, 150, 400) }
    await expect(measureElement(refWith(node))).resolves.toEqual({ x: 150, y: 400, width: 100, height: 40 })
  })
})
