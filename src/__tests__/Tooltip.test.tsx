import { createRef } from 'react'
import { Dimensions, Modal, Text } from 'react-native'
import { act, fireEvent, render, waitFor } from '@testing-library/react-native'

import { Tooltip, TooltipRef } from '../Tooltip'
import { TooltipPosition } from '../positioning'
import { measureElement } from '../measure'

jest.mock('../measure')

const mockedMeasureElement = measureElement as jest.MockedFunction<typeof measureElement>

const FIXED_TRIGGER = { x: 150, y: 400, width: 100, height: 40 }

// react-native's jest preset seeds these window dims (see node_modules/react-native/jest/setup.js).
const DEFAULT_WINDOW = { width: 750, height: 1334, scale: 2, fontScale: 2 }

const layoutEvent = (width: number, height: number) => ({ nativeEvent: { layout: { x: 0, y: 0, width, height } } })

// Merges a style array/object into one flat object so individual style keys
// (opacity, left, top, ...) can be asserted regardless of which entry in the
// array they came from.
const flattenStyle = (style: unknown): Record<string, unknown> =>
  Object.assign({}, ...([] as Array<Record<string, unknown>>).concat(style as never))

const findBoxTop = (style: unknown): number | undefined => flattenStyle(style).top as number | undefined

beforeEach(() => {
  mockedMeasureElement.mockResolvedValue(FIXED_TRIGGER)
})

afterEach(() => {
  jest.clearAllMocks()
  // Dimensions is a module-level singleton (not reset between tests in the
  // same file) — restore the jest-preset default so the rotation test below
  // never leaks its viewport into other tests.
  act(() => {
    Dimensions.set({ window: DEFAULT_WINDOW, screen: DEFAULT_WINDOW })
  })
})

describe('Tooltip', () => {
  it('is closed initially: the tooltip box is absent', () => {
    const { queryByTestId } = render(
      <Tooltip content={<Text>content</Text>}>
        <Text>trigger</Text>
      </Tooltip>
    )

    expect(queryByTestId('tooltip-box')).toBeNull()
  })

  it('opens on trigger press and fires onChange(true) exactly once', async () => {
    const onChange = jest.fn()
    const { getByTestId, queryByTestId } = render(
      <Tooltip content={<Text>content</Text>} onChange={onChange}>
        <Text>trigger</Text>
      </Tooltip>
    )

    fireEvent.press(getByTestId('tooltip-trigger'))

    await waitFor(() => expect(queryByTestId('tooltip-box')).not.toBeNull())
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('closes on overlay press and fires onChange(false)', async () => {
    const onChange = jest.fn()
    const { getByTestId, queryByTestId } = render(
      <Tooltip content={<Text>content</Text>} onChange={onChange}>
        <Text>trigger</Text>
      </Tooltip>
    )

    fireEvent.press(getByTestId('tooltip-trigger'))
    await waitFor(() => expect(queryByTestId('tooltip-overlay')).not.toBeNull())

    fireEvent.press(getByTestId('tooltip-overlay'))

    expect(queryByTestId('tooltip-box')).toBeNull()
    expect(onChange).toHaveBeenLastCalledWith(false)
  })

  it('ref.open() and ref.close() drive the same transitions as press', async () => {
    const ref = createRef<TooltipRef>()
    const { queryByTestId } = render(
      <Tooltip ref={ref} content={<Text>content</Text>}>
        <Text>trigger</Text>
      </Tooltip>
    )

    act(() => ref.current?.open())
    await waitFor(() => expect(queryByTestId('tooltip-box')).not.toBeNull())

    act(() => ref.current?.close())
    expect(queryByTestId('tooltip-box')).toBeNull()
  })

  it('gives the overlay the required accessibility attributes and wires Modal dismissal', async () => {
    const { getByTestId, UNSAFE_getByType } = render(
      <Tooltip content={<Text>content</Text>}>
        <Text>trigger</Text>
      </Tooltip>
    )

    fireEvent.press(getByTestId('tooltip-trigger'))
    await waitFor(() => expect(getByTestId('tooltip-overlay')).toBeTruthy())

    const overlay = getByTestId('tooltip-overlay')
    expect(overlay.props.accessible).toBe(true)
    expect(overlay.props.accessibilityRole).toBe('button')
    expect(overlay.props.accessibilityLabel).toBe('Close tooltip')
    expect(overlay.props.accessibilityViewIsModal).toBe(true)

    const modal = UNSAFE_getByType(Modal)
    expect(modal.props.transparent).toBe(true)
    expect(typeof modal.props.onRequestClose).toBe('function')
  })

  it('measureElement resolving null keeps the tooltip closed without calling onChange', async () => {
    mockedMeasureElement.mockResolvedValueOnce(null)
    const onChange = jest.fn()
    const { getByTestId, queryByTestId } = render(
      <Tooltip content={<Text>content</Text>} onChange={onChange}>
        <Text>trigger</Text>
      </Tooltip>
    )

    fireEvent.press(getByTestId('tooltip-trigger'))

    await waitFor(() => expect(mockedMeasureElement).toHaveBeenCalled())
    expect(queryByTestId('tooltip-box')).toBeNull()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('auto position: near the bottom of the screen the box renders above the trigger', async () => {
    const nearBottom = { x: 150, y: 700, width: 100, height: 40 }
    mockedMeasureElement.mockResolvedValue(nearBottom)
    const { getByTestId } = render(
      <Tooltip content={<Text>content</Text>}>
        <Text>trigger</Text>
      </Tooltip>
    )

    fireEvent.press(getByTestId('tooltip-trigger'))
    await waitFor(() => expect(getByTestId('tooltip-content')).toBeTruthy())
    fireEvent(getByTestId('tooltip-content'), 'layout', layoutEvent(200, 100))

    await waitFor(() => {
      const top = findBoxTop(getByTestId('tooltip-box').props.style)
      expect(top).toBeLessThan(nearBottom.y)
    })
  })

  it('auto position: near the top of the screen the box renders below the trigger', async () => {
    const nearTop = { x: 150, y: 5, width: 100, height: 40 }
    mockedMeasureElement.mockResolvedValue(nearTop)
    const { getByTestId } = render(
      <Tooltip content={<Text>content</Text>}>
        <Text>trigger</Text>
      </Tooltip>
    )

    fireEvent.press(getByTestId('tooltip-trigger'))
    await waitFor(() => expect(getByTestId('tooltip-content')).toBeTruthy())
    fireEvent(getByTestId('tooltip-content'), 'layout', layoutEvent(200, 100))

    await waitFor(() => {
      const top = findBoxTop(getByTestId('tooltip-box').props.style)
      expect(top).toBeGreaterThan(nearTop.y + nearTop.height)
    })
  })

  it('honors an explicit position prop; TooltipPosition.TOP === "top" at runtime', () => {
    expect(TooltipPosition.TOP).toBe('top')
    const { getByTestId } = render(
      <Tooltip content={<Text>content</Text>} position={TooltipPosition.RIGHT}>
        <Text>trigger</Text>
      </Tooltip>
    )
    expect(getByTestId('tooltip-trigger')).toBeTruthy()
  })

  it('re-layouts the box when content grows taller', async () => {
    const { getByTestId } = render(
      <Tooltip content={<Text>content</Text>}>
        <Text>trigger</Text>
      </Tooltip>
    )

    fireEvent.press(getByTestId('tooltip-trigger'))
    await waitFor(() => expect(getByTestId('tooltip-content')).toBeTruthy())

    fireEvent(getByTestId('tooltip-content'), 'layout', layoutEvent(200, 100))
    let topAfterFirst: number | undefined
    await waitFor(() => {
      topAfterFirst = findBoxTop(getByTestId('tooltip-box').props.style)
      expect(topAfterFirst).not.toBeUndefined()
    })

    fireEvent(getByTestId('tooltip-content'), 'layout', layoutEvent(200, 300))
    await waitFor(() => {
      const topAfterSecond = findBoxTop(getByTestId('tooltip-box').props.style)
      expect(topAfterSecond).not.toBe(topAfterFirst)
    })
  })

  it('renders invisible with no left/top while measuring, then visible with a numeric position after onLayout', async () => {
    const { getByTestId } = render(
      <Tooltip content={<Text>content</Text>}>
        <Text>trigger</Text>
      </Tooltip>
    )

    fireEvent.press(getByTestId('tooltip-trigger'))

    // The box mounts as soon as phase leaves 'closed', i.e. before the
    // content's onLayout has fired — this is the provisional 'measuring' render.
    await waitFor(() => expect(getByTestId('tooltip-box')).toBeTruthy())
    const measuringStyle = flattenStyle(getByTestId('tooltip-box').props.style)
    expect(measuringStyle.opacity).toBe(0)
    expect(measuringStyle.left).toBeUndefined()
    expect(measuringStyle.top).toBeUndefined()

    fireEvent(getByTestId('tooltip-content'), 'layout', layoutEvent(200, 100))

    await waitFor(() => {
      const readyStyle = flattenStyle(getByTestId('tooltip-box').props.style)
      expect(readyStyle.opacity).toBe(1)
      expect(typeof readyStyle.left).toBe('number')
      expect(typeof readyStyle.top).toBe('number')
    })
  })

  it('recomputes the box position when the viewport rotates', async () => {
    const { getByTestId } = render(
      <Tooltip content={<Text>content</Text>}>
        <Text>trigger</Text>
      </Tooltip>
    )

    fireEvent.press(getByTestId('tooltip-trigger'))
    await waitFor(() => expect(getByTestId('tooltip-content')).toBeTruthy())
    fireEvent(getByTestId('tooltip-content'), 'layout', layoutEvent(200, 100))

    // Default width=200, FIXED_TRIGGER center x=200 -> unclamped left=100
    // against DEFAULT_WINDOW.width=750, well inside [margin, 750-8-200].
    await waitFor(() => {
      expect(flattenStyle(getByTestId('tooltip-box').props.style).left).toBe(100)
    })

    // Rotate to a narrow viewport (width=250): max = 250-8-200 = 42 < 100,
    // so the unclamped left=100 must clamp down to 42. This exercises the
    // real useWindowDimensions -> Dimensions 'change' event wiring (bug 4
    // regression guard), not a mocked hook.
    act(() => {
      Dimensions.set({ window: { width: 250, height: 500, scale: 2, fontScale: 2 }, screen: { width: 250, height: 500, scale: 2, fontScale: 2 } })
    })

    await waitFor(() => {
      expect(flattenStyle(getByTestId('tooltip-box').props.style).left).toBe(42)
    })
  })

  it('closes and fires onChange(false) when the platform back button triggers Modal onRequestClose', async () => {
    const onChange = jest.fn()
    const { getByTestId, queryByTestId, UNSAFE_getByType } = render(
      <Tooltip content={<Text>content</Text>} onChange={onChange}>
        <Text>trigger</Text>
      </Tooltip>
    )

    fireEvent.press(getByTestId('tooltip-trigger'))
    await waitFor(() => expect(queryByTestId('tooltip-box')).not.toBeNull())

    const modal = UNSAFE_getByType(Modal)
    act(() => {
      modal.props.onRequestClose()
    })

    expect(queryByTestId('tooltip-box')).toBeNull()
    expect(onChange).toHaveBeenLastCalledWith(false)
  })
})
