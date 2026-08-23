import {
  ARROW_EDGE_OFFSET,
  ARROW_HALF_WIDTH,
  ARROW_LENGTH,
  ARROW_OVERLAP,
  BORDER_RADIUS,
  DEFAULT_WIDTH,
  Rect,
  Size,
  TooltipPosition,
  applyOffset,
  arrowBorderStyle,
  choosePosition,
  clampToViewport,
  computeArrowOffset,
  computeBoxOrigin,
  layoutTooltip,
  resolveWidth
} from '../positioning'

const viewport: Size = { width: 400, height: 800 }
const trigger: Rect = { x: 150, y: 400, width: 100, height: 40 }
const content: Size = { width: 200, height: 100 }
const margin = 8

describe('resolveWidth', () => {
  it('defaults to DEFAULT_WIDTH when width is undefined', () => {
    expect(resolveWidth(viewport.width)).toBe(DEFAULT_WIDTH)
  })

  it('passes a numeric width through unchanged', () => {
    expect(resolveWidth(viewport.width, 320)).toBe(320)
  })

  it('resolves a percentage width against the viewport', () => {
    expect(resolveWidth(viewport.width, '50%')).toBe(200)
  })

  it('does not clamp an oversized percentage (that is layoutTooltip job)', () => {
    expect(resolveWidth(viewport.width, '150%')).toBe(600)
  })
})

describe('choosePosition', () => {
  const sides: TooltipPosition[] = [TooltipPosition.TOP, TooltipPosition.BOTTOM, TooltipPosition.LEFT, TooltipPosition.RIGHT]

  it.each(sides)('preferred=%s always short-circuits', preferred => {
    expect(choosePosition({ trigger, content, viewport, preferred })).toBe(preferred)
  })

  it('picks TOP when trigger is near the bottom (insufficient space below)', () => {
    const nearBottom: Rect = { x: 150, y: 700, width: 100, height: 40 }
    expect(choosePosition({ trigger: nearBottom, content, viewport })).toBe(TooltipPosition.TOP)
  })

  it('picks BOTTOM when trigger is at the top (insufficient space above)', () => {
    const atTop: Rect = { x: 150, y: 5, width: 100, height: 40 }
    expect(choosePosition({ trigger: atTop, content, viewport })).toBe(TooltipPosition.BOTTOM)
  })

  it('picks RIGHT when vertically cramped but there is room to the right', () => {
    const cramped: Rect = { x: 10, y: 5, width: 100, height: 780 }
    expect(choosePosition({ trigger: cramped, content, viewport })).toBe(TooltipPosition.RIGHT)
  })

  it('picks LEFT when only the left side fits', () => {
    const onlyLeft: Rect = { x: 390, y: 5, width: 10, height: 780 }
    expect(choosePosition({ trigger: onlyLeft, content, viewport })).toBe(TooltipPosition.LEFT)
  })

  it('picks the side with the max surplus when none fully fit', () => {
    const tinyViewport: Size = { width: 60, height: 60 }
    const centeredTrigger: Rect = { x: 20, y: 20, width: 20, height: 20 }
    const bigContent: Size = { width: 200, height: 200 }

    // space.top = 20, space.bottom = 20, space.left = 20, space.right = 20 (tie ->
    // priority order TOP wins).
    expect(choosePosition({ trigger: centeredTrigger, content: bigContent, viewport: tinyViewport })).toBe(
      TooltipPosition.TOP
    )
  })
})

describe('computeBoxOrigin', () => {
  const box: Size = content

  it('TOP + center + tooltip matches the exact reference numbers', () => {
    expect(computeBoxOrigin({ side: TooltipPosition.TOP, trigger, box, viewport, centerBy: 'tooltip', arrowAlignment: 'center' })).toEqual({
      x: 100,
      y: 290
    })
  })

  it('LEFT + center + tooltip vertically centers using measured height (NOT the old -45)', () => {
    expect(computeBoxOrigin({ side: TooltipPosition.LEFT, trigger, box, viewport, centerBy: 'tooltip', arrowAlignment: 'center' })).toEqual({
      x: -60,
      y: 370
    })
  })

  it('TOP + screen centers horizontally on the viewport, ignoring arrowAlignment', () => {
    const start = computeBoxOrigin({ side: TooltipPosition.TOP, trigger, box, viewport, centerBy: 'screen', arrowAlignment: 'start' })
    const end = computeBoxOrigin({ side: TooltipPosition.TOP, trigger, box, viewport, centerBy: 'screen', arrowAlignment: 'end' })
    expect(start).toEqual({ x: 100, y: 290 })
    expect(end).toEqual({ x: 100, y: 290 })
  })

  it('LEFT + screen centers vertically on the viewport', () => {
    expect(computeBoxOrigin({ side: TooltipPosition.LEFT, trigger, box, viewport, centerBy: 'screen', arrowAlignment: 'center' })).toEqual({
      x: -60,
      y: 350
    })
  })

  // Exact-value matrix: 4 sides x 2 centerBy x 3 arrowAlignment = 24 cases.
  // Expected numbers are worked out BY HAND from design.md's main-axis and
  // cross-axis tables (never by re-running the production formula):
  //
  //   triggerCenterX = trigger.x + trigger.width / 2  = 150 + 50 = 200
  //   triggerCenterY = trigger.y + trigger.height / 2 = 400 + 20 = 420
  //
  //   Main axis (same for every centerBy/arrowAlignment on a given side):
  //     TOP    y = trigger.y - box.height - ARROW_LENGTH     = 400 - 100 - 10 = 290
  //     BOTTOM y = trigger.y + trigger.height + ARROW_LENGTH = 400 + 40 + 10  = 450
  //     LEFT   x = trigger.x - box.width - ARROW_LENGTH      = 150 - 200 - 10 = -60
  //     RIGHT  x = trigger.x + trigger.width + ARROW_LENGTH  = 150 + 100 + 10 = 260
  //
  //   Cross axis for TOP/BOTTOM (x):
  //     screen         x = (viewport.width - box.width) / 2            = (400-200)/2   = 100 (ignores arrowAlignment)
  //     tooltip+center x = triggerCenterX - box.width / 2               = 200 - 100     = 100
  //     tooltip+start  x = triggerCenterX - ARROW_EDGE_OFFSET            = 200 - 20      = 180
  //     tooltip+end    x = triggerCenterX - box.width + ARROW_EDGE_OFFSET = 200-200+20   = 20
  //
  //   Cross axis for LEFT/RIGHT (y):
  //     screen         y = (viewport.height - box.height) / 2          = (800-100)/2   = 350
  //     tooltip+center y = triggerCenterY - box.height / 2               = 420 - 50      = 370
  //     tooltip+start  y = triggerCenterY - ARROW_EDGE_OFFSET            = 420 - 20      = 400
  //     tooltip+end    y = triggerCenterY - box.height + ARROW_EDGE_OFFSET = 420-100+20  = 340
  const exactOriginCases: Array<[TooltipPosition, 'screen' | 'tooltip', 'center' | 'start' | 'end', { x: number; y: number }]> = [
    [TooltipPosition.TOP, 'screen', 'center', { x: 100, y: 290 }],
    [TooltipPosition.TOP, 'screen', 'start', { x: 100, y: 290 }],
    [TooltipPosition.TOP, 'screen', 'end', { x: 100, y: 290 }],
    [TooltipPosition.TOP, 'tooltip', 'center', { x: 100, y: 290 }],
    [TooltipPosition.TOP, 'tooltip', 'start', { x: 180, y: 290 }],
    [TooltipPosition.TOP, 'tooltip', 'end', { x: 20, y: 290 }],

    [TooltipPosition.BOTTOM, 'screen', 'center', { x: 100, y: 450 }],
    [TooltipPosition.BOTTOM, 'screen', 'start', { x: 100, y: 450 }],
    [TooltipPosition.BOTTOM, 'screen', 'end', { x: 100, y: 450 }],
    [TooltipPosition.BOTTOM, 'tooltip', 'center', { x: 100, y: 450 }],
    [TooltipPosition.BOTTOM, 'tooltip', 'start', { x: 180, y: 450 }],
    [TooltipPosition.BOTTOM, 'tooltip', 'end', { x: 20, y: 450 }],

    [TooltipPosition.LEFT, 'screen', 'center', { x: -60, y: 350 }],
    [TooltipPosition.LEFT, 'screen', 'start', { x: -60, y: 350 }],
    [TooltipPosition.LEFT, 'screen', 'end', { x: -60, y: 350 }],
    [TooltipPosition.LEFT, 'tooltip', 'center', { x: -60, y: 370 }],
    [TooltipPosition.LEFT, 'tooltip', 'start', { x: -60, y: 400 }],
    [TooltipPosition.LEFT, 'tooltip', 'end', { x: -60, y: 340 }],

    [TooltipPosition.RIGHT, 'screen', 'center', { x: 260, y: 350 }],
    [TooltipPosition.RIGHT, 'screen', 'start', { x: 260, y: 350 }],
    [TooltipPosition.RIGHT, 'screen', 'end', { x: 260, y: 350 }],
    [TooltipPosition.RIGHT, 'tooltip', 'center', { x: 260, y: 370 }],
    [TooltipPosition.RIGHT, 'tooltip', 'start', { x: 260, y: 400 }],
    [TooltipPosition.RIGHT, 'tooltip', 'end', { x: 260, y: 340 }]
  ]

  it.each(exactOriginCases)('side=%s centerBy=%s arrowAlignment=%s -> exact origin', (side, centerBy, arrowAlignment, expected) => {
    expect(computeBoxOrigin({ side, trigger, box, viewport, centerBy, arrowAlignment })).toEqual(expected)
  })

  it('start/end use ARROW_EDGE_OFFSET for the cross-axis anchor on TOP', () => {
    const triggerCenterX = trigger.x + trigger.width / 2
    const start = computeBoxOrigin({ side: TooltipPosition.TOP, trigger, box, viewport, centerBy: 'tooltip', arrowAlignment: 'start' })
    const end = computeBoxOrigin({ side: TooltipPosition.TOP, trigger, box, viewport, centerBy: 'tooltip', arrowAlignment: 'end' })
    expect(start.x).toBe(triggerCenterX - ARROW_EDGE_OFFSET)
    expect(end.x).toBe(triggerCenterX - box.width + ARROW_EDGE_OFFSET)
  })
})

describe('applyOffset', () => {
  const origin = { x: 100, y: 290 }
  const gap = 12

  const sides: TooltipPosition[] = [TooltipPosition.TOP, TooltipPosition.BOTTOM, TooltipPosition.LEFT, TooltipPosition.RIGHT]

  it.each(sides)('positive offset on %s increases the trigger-to-box distance by exactly the gap', side => {
    const axisKey = side === TooltipPosition.TOP || side === TooltipPosition.BOTTOM ? 'y' : 'x'
    const positive = applyOffset(origin, side, { [axisKey]: gap })
    const baseline = applyOffset(origin, side, {})

    const distance = (point: { x: number; y: number }): number => {
      if (side === TooltipPosition.TOP) return trigger.y - point.y
      if (side === TooltipPosition.BOTTOM) return point.y - (trigger.y + trigger.height)
      if (side === TooltipPosition.LEFT) return trigger.x - point.x
      return point.x - (trigger.x + trigger.width)
    }

    expect(distance(positive) - distance(baseline)).toBeCloseTo(gap)
  })

  it.each(sides)('negative offset on %s decreases the trigger-to-box distance by exactly the gap', side => {
    const axisKey = side === TooltipPosition.TOP || side === TooltipPosition.BOTTOM ? 'y' : 'x'
    const negative = applyOffset(origin, side, { [axisKey]: -gap })
    const baseline = applyOffset(origin, side, {})

    const distance = (point: { x: number; y: number }): number => {
      if (side === TooltipPosition.TOP) return trigger.y - point.y
      if (side === TooltipPosition.BOTTOM) return point.y - (trigger.y + trigger.height)
      if (side === TooltipPosition.LEFT) return trigger.x - point.x
      return point.x - (trigger.x + trigger.width)
    }

    expect(distance(baseline) - distance(negative)).toBeCloseTo(gap)
  })

  it('nudges the cross axis on TOP/BOTTOM via offset.x', () => {
    expect(applyOffset(origin, TooltipPosition.TOP, { x: 5 }).x).toBe(origin.x + 5)
    expect(applyOffset(origin, TooltipPosition.BOTTOM, { x: 5 }).x).toBe(origin.x + 5)
  })

  it('nudges the cross axis on LEFT/RIGHT via offset.y', () => {
    expect(applyOffset(origin, TooltipPosition.LEFT, { y: 5 }).y).toBe(origin.y + 5)
    expect(applyOffset(origin, TooltipPosition.RIGHT, { y: 5 }).y).toBe(origin.y + 5)
  })
})

describe('clampToViewport', () => {
  const box: Size = { width: 200, height: 100 }

  it('leaves an in-bounds origin untouched (shift = {0,0})', () => {
    const origin = { x: 100, y: 290 }
    const result = clampToViewport({ origin, box, viewport, margin })
    expect(result.origin).toEqual(origin)
    expect(result.shift).toEqual({ x: 0, y: 0 })
  })

  it('clamps off the left edge', () => {
    const result = clampToViewport({ origin: { x: -50, y: 100 }, box, viewport, margin })
    expect(result.origin.x).toBe(margin)
    expect(result.shift.x).toBe(margin - -50)
  })

  it('clamps off the right edge', () => {
    const result = clampToViewport({ origin: { x: 350, y: 100 }, box, viewport, margin })
    expect(result.origin.x).toBe(viewport.width - margin - box.width)
  })

  it('clamps off the top edge', () => {
    const result = clampToViewport({ origin: { x: 100, y: -50 }, box, viewport, margin })
    expect(result.origin.y).toBe(margin)
  })

  it('clamps off the bottom edge', () => {
    const result = clampToViewport({ origin: { x: 100, y: 750 }, box, viewport, margin })
    expect(result.origin.y).toBe(viewport.height - margin - box.height)
  })

  it('clamps both corners simultaneously', () => {
    const topLeft = clampToViewport({ origin: { x: -100, y: -100 }, box, viewport, margin })
    expect(topLeft.origin).toEqual({ x: margin, y: margin })

    const bottomRight = clampToViewport({ origin: { x: 1000, y: 1000 }, box, viewport, margin })
    expect(bottomRight.origin).toEqual({
      x: viewport.width - margin - box.width,
      y: viewport.height - margin - box.height
    })
  })

  it('pins a box wider than the viewport at the margin', () => {
    const wideBox: Size = { width: 500, height: 100 }
    const result = clampToViewport({ origin: { x: 100, y: 100 }, box: wideBox, viewport, margin })
    expect(result.origin.x).toBe(margin)
  })
})

describe('computeArrowOffset', () => {
  const box: Size = { width: 200, height: 100 }

  it('unclamped center arrow sits at boxWidth/2 - ARROW_HALF_WIDTH', () => {
    const origin = computeBoxOrigin({ side: TooltipPosition.TOP, trigger, box, viewport, centerBy: 'tooltip', arrowAlignment: 'center' })
    const arrow = computeArrowOffset({ side: TooltipPosition.TOP, origin, box, trigger })
    expect(arrow.x).toBeCloseTo(box.width / 2 - ARROW_HALF_WIDTH)
    expect(arrow.y).toBe(box.height - ARROW_OVERLAP)
  })

  it('unclamped start arrow sits at ARROW_EDGE_OFFSET - ARROW_HALF_WIDTH', () => {
    const origin = computeBoxOrigin({ side: TooltipPosition.TOP, trigger, box, viewport, centerBy: 'tooltip', arrowAlignment: 'start' })
    const arrow = computeArrowOffset({ side: TooltipPosition.TOP, origin, box, trigger })
    expect(arrow.x).toBeCloseTo(ARROW_EDGE_OFFSET - ARROW_HALF_WIDTH)
  })

  it('unclamped end arrow sits at boxWidth - ARROW_EDGE_OFFSET - ARROW_HALF_WIDTH', () => {
    const origin = computeBoxOrigin({ side: TooltipPosition.TOP, trigger, box, viewport, centerBy: 'tooltip', arrowAlignment: 'end' })
    const arrow = computeArrowOffset({ side: TooltipPosition.TOP, origin, box, trigger })
    expect(arrow.x).toBeCloseTo(box.width - ARROW_EDGE_OFFSET - ARROW_HALF_WIDTH)
  })

  it('shifting the box right by S decreases arrow.left by exactly S', () => {
    const origin = computeBoxOrigin({ side: TooltipPosition.TOP, trigger, box, viewport, centerBy: 'tooltip', arrowAlignment: 'center' })
    const shifted = { x: origin.x + 15, y: origin.y }
    const arrowBefore = computeArrowOffset({ side: TooltipPosition.TOP, origin, box, trigger })
    const arrowAfter = computeArrowOffset({ side: TooltipPosition.TOP, origin: shifted, box, trigger })
    expect(arrowBefore.x - arrowAfter.x).toBeCloseTo(15)
  })

  it('pins the arrow to the low end of the band when the trigger is far outside', () => {
    const farLeftTrigger: Rect = { x: -1000, y: 400, width: 10, height: 10 }
    const origin = { x: 100, y: 290 }
    const arrow = computeArrowOffset({ side: TooltipPosition.TOP, origin, box, trigger: farLeftTrigger })
    expect(arrow.x).toBe(BORDER_RADIUS + ARROW_HALF_WIDTH - ARROW_HALF_WIDTH)
  })

  it('pins the arrow to the high end of the band when the trigger is far outside', () => {
    const farRightTrigger: Rect = { x: 5000, y: 400, width: 10, height: 10 }
    const origin = { x: 100, y: 290 }
    const arrow = computeArrowOffset({ side: TooltipPosition.TOP, origin, box, trigger: farRightTrigger })
    expect(arrow.x).toBe(box.width - BORDER_RADIUS - ARROW_HALF_WIDTH - ARROW_HALF_WIDTH)
  })

  it('centers the arrow when the box is too small for a legal band (degenerate)', () => {
    const tinyBox: Size = { width: 10, height: 10 }
    const arrow = computeArrowOffset({ side: TooltipPosition.TOP, origin: { x: 0, y: 0 }, box: tinyBox, trigger })
    expect(arrow.x).toBe(tinyBox.width / 2 - ARROW_HALF_WIDTH)
  })

  it('uses the vertical axis for LEFT/RIGHT, with the main-axis sunk by ARROW_OVERLAP', () => {
    const origin = computeBoxOrigin({ side: TooltipPosition.LEFT, trigger, box, viewport, centerBy: 'tooltip', arrowAlignment: 'center' })
    const left = computeArrowOffset({ side: TooltipPosition.LEFT, origin, box, trigger })
    expect(left.x).toBe(box.width - ARROW_OVERLAP)
    expect(left.y).toBeCloseTo(box.height / 2 - ARROW_HALF_WIDTH)

    const right = computeArrowOffset({ side: TooltipPosition.RIGHT, origin, box, trigger })
    expect(right.x).toBe(-ARROW_LENGTH + ARROW_OVERLAP)
  })

  it('sinks the arrow base under the box by ARROW_OVERLAP on TOP and BOTTOM', () => {
    const arrowTop = computeArrowOffset({ side: TooltipPosition.TOP, origin: { x: 100, y: 290 }, box, trigger })
    const arrowBottom = computeArrowOffset({ side: TooltipPosition.BOTTOM, origin: { x: 100, y: 450 }, box, trigger })
    expect(arrowTop.y).toBe(box.height - ARROW_OVERLAP)
    expect(arrowBottom.y).toBe(-ARROW_LENGTH + ARROW_OVERLAP)
  })
})

describe('arrowBorderStyle', () => {
  const bg = 'rgba(0,0,0,0.75)'

  it.each([TooltipPosition.TOP, TooltipPosition.BOTTOM, TooltipPosition.LEFT, TooltipPosition.RIGHT])(
    'sets exactly one border color to the background on %s and the rest transparent',
    side => {
      const style = arrowBorderStyle(side, bg) as Record<string, unknown>
      const colorKeys = ['borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor']
      const presentColors = colorKeys.filter(key => key in style)

      expect(presentColors).toHaveLength(3)
      const colored = presentColors.filter(key => style[key] === bg)
      const transparent = presentColors.filter(key => style[key] === 'transparent')
      expect(colored).toHaveLength(1)
      expect(transparent).toHaveLength(2)
    }
  )
})

describe('layoutTooltip integration', () => {
  const corners: Rect[] = [
    { x: 0, y: 0, width: 40, height: 20 },
    { x: 360, y: 0, width: 40, height: 20 },
    { x: 0, y: 780, width: 40, height: 20 },
    { x: 360, y: 780, width: 40, height: 20 },
    { x: 150, y: 400, width: 100, height: 40 }
  ]

  it.each(corners)('keeps the box inside the viewport margins and the arrow inside the legal band', triggerAt => {
    const layout = layoutTooltip({
      trigger: triggerAt,
      content,
      viewport,
      centerBy: 'tooltip',
      arrowAlignment: 'center'
    })

    expect(layout.box.left).toBeGreaterThanOrEqual(margin)
    expect(layout.box.left + layout.box.width).toBeLessThanOrEqual(viewport.width - margin)
    expect(layout.box.top).toBeGreaterThanOrEqual(margin)

    const isVertical = layout.side === TooltipPosition.TOP || layout.side === TooltipPosition.BOTTOM
    const crossLength = isVertical ? layout.box.width : content.height
    const arrowCross = isVertical ? layout.arrow.left : layout.arrow.top
    const minCentre = BORDER_RADIUS + ARROW_HALF_WIDTH - ARROW_HALF_WIDTH
    const maxCentre = crossLength - BORDER_RADIUS - ARROW_HALF_WIDTH - ARROW_HALF_WIDTH
    expect(arrowCross).toBeGreaterThanOrEqual(minCentre - 0.001)
    expect(arrowCross).toBeLessThanOrEqual(maxCentre + 0.001)
  })

  it('centers the arrow on the trigger when the band permits it', () => {
    const layout = layoutTooltip({
      trigger,
      content,
      viewport,
      centerBy: 'tooltip',
      arrowAlignment: 'center'
    })

    const triggerCenterX = trigger.x + trigger.width / 2
    const reconstructed = layout.box.left + layout.arrow.left + ARROW_HALF_WIDTH
    expect(Math.abs(reconstructed - triggerCenterX)).toBeLessThan(0.001)
  })

  it('clamps an oversized percentage width to viewport.width - 2*margin', () => {
    const layout = layoutTooltip({
      trigger,
      content,
      viewport,
      centerBy: 'tooltip',
      arrowAlignment: 'center',
      width: '150%'
    })
    expect(layout.box.width).toBe(viewport.width - 2 * margin)
  })
})
