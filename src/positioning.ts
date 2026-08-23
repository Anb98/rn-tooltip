import type { ViewStyle } from 'react-native'

/**
 * Pure geometry for the Tooltip component. No React Native runtime
 * dependency: only plain numbers, page-coordinate rectangles, and style
 * object literals go in and out. This keeps the module unit-testable
 * without a renderer and keeps side effects (measuring) out of it.
 */

export type Rect = { x: number; y: number; width: number; height: number }
export type Size = { width: number; height: number }
export type Point = { x: number; y: number }
export type Offset = { x?: number; y?: number }
export type CenterBy = 'screen' | 'tooltip'
export type ArrowAlignment = 'center' | 'end' | 'start'
export type UnsafeWidth = `${number}%` | number

// Const object + string-literal union (not a TS enum): keeps `TooltipPosition.TOP`
// usable as a value, type-checks `position="top"` as a plain string, and never
// emits runtime enum code.
export const TooltipPosition = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right'
} as const

export type TooltipPosition = (typeof TooltipPosition)[keyof typeof TooltipPosition]

export const DEFAULT_WIDTH = 200
export const ARROW_HALF_WIDTH = 10
export const ARROW_LENGTH = 10
export const ARROW_EDGE_OFFSET = 20
export const BORDER_RADIUS = 8
export const VIEWPORT_MARGIN = 8

const clamp = (value: number, min: number, max: number): number => Math.max(Math.min(value, max), min)

export const isVerticalSide = (side: TooltipPosition): boolean =>
  side === TooltipPosition.TOP || side === TooltipPosition.BOTTOM

export const resolveWidth = (viewportWidth: number, width?: UnsafeWidth): number => {
  if (width === undefined) return DEFAULT_WIDTH
  if (typeof width === 'number') return width
  return (viewportWidth * parseFloat(width)) / 100
}

export const choosePosition = ({
  trigger,
  content,
  viewport,
  preferred
}: {
  trigger: Rect
  content: Size
  viewport: Size
  preferred?: TooltipPosition | undefined
}): TooltipPosition => {
  if (preferred) return preferred

  const needV = content.height + ARROW_LENGTH + VIEWPORT_MARGIN
  const needH = content.width + ARROW_LENGTH + VIEWPORT_MARGIN

  const space: Record<TooltipPosition, number> = {
    [TooltipPosition.TOP]: trigger.y,
    [TooltipPosition.BOTTOM]: viewport.height - (trigger.y + trigger.height),
    [TooltipPosition.RIGHT]: viewport.width - (trigger.x + trigger.width),
    [TooltipPosition.LEFT]: trigger.x
  }
  const need: Record<TooltipPosition, number> = {
    [TooltipPosition.TOP]: needV,
    [TooltipPosition.BOTTOM]: needV,
    [TooltipPosition.RIGHT]: needH,
    [TooltipPosition.LEFT]: needH
  }

  const priority: TooltipPosition[] = [
    TooltipPosition.TOP,
    TooltipPosition.BOTTOM,
    TooltipPosition.RIGHT,
    TooltipPosition.LEFT
  ]

  const firstFit = priority.find(side => space[side] >= need[side])
  if (firstFit !== undefined) return firstFit

  let bestSide: TooltipPosition = TooltipPosition.TOP
  for (const side of priority) {
    if (space[side] - need[side] > space[bestSide] - need[bestSide]) bestSide = side
  }
  return bestSide
}

export const computeBoxOrigin = ({
  side,
  trigger,
  box,
  viewport,
  centerBy,
  arrowAlignment
}: {
  side: TooltipPosition
  trigger: Rect
  box: Size
  viewport: Size
  centerBy: CenterBy
  arrowAlignment: ArrowAlignment
}): Point => {
  const triggerCenterX = trigger.x + trigger.width / 2
  const triggerCenterY = trigger.y + trigger.height / 2

  const crossLeft: Record<ArrowAlignment, number> = {
    center: triggerCenterX - box.width / 2,
    start: triggerCenterX - ARROW_EDGE_OFFSET,
    end: triggerCenterX - box.width + ARROW_EDGE_OFFSET
  }
  const crossTop: Record<ArrowAlignment, number> = {
    center: triggerCenterY - box.height / 2,
    start: triggerCenterY - ARROW_EDGE_OFFSET,
    end: triggerCenterY - box.height + ARROW_EDGE_OFFSET
  }

  switch (side) {
    case TooltipPosition.TOP:
      return {
        y: trigger.y - box.height - ARROW_LENGTH,
        x: centerBy === 'screen' ? (viewport.width - box.width) / 2 : crossLeft[arrowAlignment]
      }
    case TooltipPosition.BOTTOM:
      return {
        y: trigger.y + trigger.height + ARROW_LENGTH,
        x: centerBy === 'screen' ? (viewport.width - box.width) / 2 : crossLeft[arrowAlignment]
      }
    case TooltipPosition.LEFT:
      return {
        x: trigger.x - box.width - ARROW_LENGTH,
        y: centerBy === 'screen' ? (viewport.height - box.height) / 2 : crossTop[arrowAlignment]
      }
    case TooltipPosition.RIGHT:
      return {
        x: trigger.x + trigger.width + ARROW_LENGTH,
        y: centerBy === 'screen' ? (viewport.height - box.height) / 2 : crossTop[arrowAlignment]
      }
  }
}

// Positive offset always increases the trigger-to-box distance, on every side.
export const applyOffset = (origin: Point, side: TooltipPosition, offset?: Offset): Point => {
  const dx = offset?.x ?? 0
  const dy = offset?.y ?? 0

  switch (side) {
    case TooltipPosition.TOP:
      return { x: origin.x + dx, y: origin.y - dy }
    case TooltipPosition.BOTTOM:
      return { x: origin.x + dx, y: origin.y + dy }
    case TooltipPosition.LEFT:
      return { x: origin.x - dx, y: origin.y + dy }
    case TooltipPosition.RIGHT:
      return { x: origin.x + dx, y: origin.y + dy }
  }
}

export const clampToViewport = ({
  origin,
  box,
  viewport,
  margin = VIEWPORT_MARGIN
}: {
  origin: Point
  box: Size
  viewport: Size
  margin?: number
}): { origin: Point; shift: Point } => {
  const x = clamp(origin.x, margin, viewport.width - margin - box.width)
  const y = clamp(origin.y, margin, viewport.height - margin - box.height)

  return { origin: { x, y }, shift: { x: x - origin.x, y: y - origin.y } }
}

// ponytail: no side flipping; choosePosition covers the common case — add flip if overlap is reported.
export const computeArrowOffset = ({
  side,
  origin,
  box,
  trigger,
  borderRadius = BORDER_RADIUS
}: {
  side: TooltipPosition
  origin: Point
  box: Size
  trigger: Rect
  borderRadius?: number
}): Point => {
  const vertical = isVerticalSide(side)
  const crossLength = vertical ? box.width : box.height
  const triggerCross = vertical ? trigger.x + trigger.width / 2 : trigger.y + trigger.height / 2
  const originCross = vertical ? origin.x : origin.y

  const minCentre = borderRadius + ARROW_HALF_WIDTH
  const maxCentre = crossLength - borderRadius - ARROW_HALF_WIDTH

  const arrowCentre = minCentre > maxCentre ? crossLength / 2 : clamp(triggerCross - originCross, minCentre, maxCentre)
  const crossOffset = arrowCentre - ARROW_HALF_WIDTH

  switch (side) {
    case TooltipPosition.TOP:
      return { x: crossOffset, y: box.height }
    case TooltipPosition.BOTTOM:
      return { x: crossOffset, y: -ARROW_LENGTH }
    case TooltipPosition.LEFT:
      return { x: box.width, y: crossOffset }
    case TooltipPosition.RIGHT:
      return { x: -ARROW_LENGTH, y: crossOffset }
  }
}

export const arrowBorderStyle = (side: TooltipPosition, backgroundColor: string): ViewStyle => {
  switch (side) {
    case TooltipPosition.TOP:
      return {
        borderTopWidth: ARROW_LENGTH,
        borderLeftWidth: ARROW_HALF_WIDTH,
        borderRightWidth: ARROW_HALF_WIDTH,
        borderTopColor: backgroundColor,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent'
      }
    case TooltipPosition.BOTTOM:
      return {
        borderBottomWidth: ARROW_LENGTH,
        borderLeftWidth: ARROW_HALF_WIDTH,
        borderRightWidth: ARROW_HALF_WIDTH,
        borderBottomColor: backgroundColor,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent'
      }
    case TooltipPosition.LEFT:
      return {
        borderLeftWidth: ARROW_LENGTH,
        borderTopWidth: ARROW_HALF_WIDTH,
        borderBottomWidth: ARROW_HALF_WIDTH,
        borderLeftColor: backgroundColor,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent'
      }
    case TooltipPosition.RIGHT:
      return {
        borderRightWidth: ARROW_LENGTH,
        borderTopWidth: ARROW_HALF_WIDTH,
        borderBottomWidth: ARROW_HALF_WIDTH,
        borderRightColor: backgroundColor,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent'
      }
  }
}

export type TooltipLayout = {
  side: TooltipPosition
  box: { left: number; top: number; width: number }
  arrow: { left: number; top: number }
  shift: Point
}

export type LayoutInput = {
  trigger: Rect
  content: Size
  viewport: Size
  centerBy: CenterBy
  arrowAlignment: ArrowAlignment
  width?: UnsafeWidth | undefined
  preferred?: TooltipPosition | undefined
  offset?: Offset | undefined
  borderRadius?: number
  margin?: number
}

// The single call the component makes. Pipeline: resolveWidth -> clamp width
// to the viewport -> choosePosition -> computeBoxOrigin -> applyOffset ->
// clampToViewport -> computeArrowOffset.
export const layoutTooltip = (input: LayoutInput): TooltipLayout => {
  const {
    trigger,
    content,
    viewport,
    centerBy,
    arrowAlignment,
    width,
    preferred,
    offset,
    borderRadius = BORDER_RADIUS,
    margin = VIEWPORT_MARGIN
  } = input

  const resolvedWidth = clamp(resolveWidth(viewport.width, width), 0, viewport.width - 2 * margin)
  const box: Size = { width: resolvedWidth, height: content.height }

  const side = choosePosition({ trigger, content: box, viewport, preferred })
  const idealOrigin = computeBoxOrigin({ side, trigger, box, viewport, centerBy, arrowAlignment })
  const offsetOrigin = applyOffset(idealOrigin, side, offset)
  const { origin, shift } = clampToViewport({ origin: offsetOrigin, box, viewport, margin })
  const arrow = computeArrowOffset({ side, origin, box, trigger, borderRadius })

  return {
    side,
    box: { left: origin.x, top: origin.y, width: resolvedWidth },
    arrow: { left: arrow.x, top: arrow.y },
    shift
  }
}
