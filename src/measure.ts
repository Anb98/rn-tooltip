import type { RefObject } from 'react'
import type { View } from 'react-native'

import type { Rect } from './positioning'

// Sole impure geometry read; this is the Jest mock seam for Tooltip.test.tsx.
// Never rejects: a null ref or a degenerate measurement both resolve to null
// so callers can `await` it without a try/catch.
export const measureElement = (ref: RefObject<View | null>): Promise<Rect | null> =>
  new Promise(resolve => {
    const node = ref.current
    if (!node) {
      resolve(null)
      return
    }

    node.measure((_x, _y, width, height, pageX, pageY) => {
      resolve(Number.isFinite(pageX) && width > 0 ? { x: pageX, y: pageY, width, height } : null)
    })
  })
// ponytail: if measure()'s native callback never fires, the promise never
// settles and the tooltip just stays closed — same observable outcome as
// resolving null, so no timeout is added here.
