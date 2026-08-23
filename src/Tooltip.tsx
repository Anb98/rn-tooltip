import { ReactNode, forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { LayoutChangeEvent, Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native'

import { measureElement } from './measure'
import {
  ArrowAlignment,
  BORDER_RADIUS,
  CenterBy,
  Offset,
  Rect,
  Size,
  TooltipPosition,
  UnsafeWidth,
  arrowBorderStyle,
  layoutTooltip,
  resolveWidth
} from './positioning'

// One discriminated-union phase replaces three independently-updated pieces
// of state (visible / measure / position), which was the root cause of the
// stale-position and first-frame-flicker bugs in the original implementation.
type Phase = { kind: 'closed' } | { kind: 'measuring'; trigger: Rect } | { kind: 'ready'; trigger: Rect; content: Size }

export type TooltipRef = {
  open: () => void
  close: () => void
}

export type TooltipProps = {
  content: ReactNode
  children: ReactNode
  width?: UnsafeWidth
  backgroundColor?: string
  position?: TooltipPosition
  arrowAlignment?: ArrowAlignment
  centerBy?: CenterBy
  offset?: Offset
  onChange?: (visible: boolean) => void
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row'
  },
  overlay: {
    flex: 1
  },
  tooltip: {
    position: 'absolute',
    elevation: 3,
    borderRadius: BORDER_RADIUS
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    backgroundColor: 'transparent'
  }
})

const CONTENT_SIZE_EPSILON = 0.5

export const Tooltip = forwardRef<TooltipRef, TooltipProps>(
  (
    {
      content,
      children,
      width,
      backgroundColor = 'rgba(0,0,0,0.75)',
      position,
      arrowAlignment = 'center',
      centerBy = 'tooltip',
      offset,
      onChange
    },
    ref
  ) => {
    const [phase, setPhase] = useState<Phase>({ kind: 'closed' })
    const triggerRef = useRef<View>(null)
    const viewport = useWindowDimensions()

    const visible = phase.kind !== 'closed'

    const openTooltip = useCallback(async () => {
      const trigger = await measureElement(triggerRef)
      if (!trigger) return

      setPhase({ kind: 'measuring', trigger })
      onChange?.(true)
    }, [onChange])

    const closeTooltip = useCallback(() => {
      setPhase({ kind: 'closed' })
      onChange?.(false)
    }, [onChange])

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          void openTooltip()
        },
        close: closeTooltip
      }),
      [openTooltip, closeTooltip]
    )

    const onPressTrigger = useCallback(() => {
      void openTooltip()
    }, [openTooltip])

    // Synchronous: measuring -> ready on first layout; from ready, only
    // re-layout when the content size actually changed (guards render loops).
    const onContentLayout = useCallback((event: LayoutChangeEvent) => {
      const { width: contentWidth, height: contentHeight } = event.nativeEvent.layout

      setPhase(current => {
        if (current.kind === 'closed') return current

        if (
          current.kind === 'ready' &&
          Math.abs(current.content.width - contentWidth) <= CONTENT_SIZE_EPSILON &&
          Math.abs(current.content.height - contentHeight) <= CONTENT_SIZE_EPSILON
        ) {
          return current
        }

        return { kind: 'ready', trigger: current.trigger, content: { width: contentWidth, height: contentHeight } }
      })
    }, [])

    const layout = useMemo(() => {
      if (phase.kind !== 'ready') return null

      return layoutTooltip({
        trigger: phase.trigger,
        content: phase.content,
        viewport,
        centerBy,
        arrowAlignment,
        width,
        preferred: position,
        offset
      })
    }, [phase, viewport, centerBy, arrowAlignment, width, position, offset])

    const resolvedWidth = resolveWidth(viewport.width, width)

    const boxStyle = layout
      ? { left: layout.box.left, top: layout.box.top, width: layout.box.width, opacity: 1 }
      : { width: resolvedWidth, height: 0, opacity: 0 }

    return (
      <View style={styles.wrapper}>
        <Pressable ref={triggerRef} onPress={onPressTrigger} testID="tooltip-trigger">
          {children}
        </Pressable>
        <Modal transparent visible={visible} onRequestClose={closeTooltip}>
          {phase.kind === 'closed' ? null : (
            <Pressable
              accessible
              accessibilityRole="button"
              accessibilityLabel="Close tooltip"
              accessibilityViewIsModal
              onPress={closeTooltip}
              style={styles.overlay}
              testID="tooltip-overlay"
            >
              <View
                style={[styles.tooltip, boxStyle, { backgroundColor }]}
                pointerEvents={layout ? 'auto' : 'none'}
                testID="tooltip-box"
              >
                {layout ? (
                  <View
                    style={[styles.arrow, { left: layout.arrow.left, top: layout.arrow.top }, arrowBorderStyle(layout.side, backgroundColor)]}
                    testID="tooltip-arrow"
                  />
                ) : null}
                <View onLayout={onContentLayout} testID="tooltip-content">{content}</View>
              </View>
            </Pressable>
          )}
        </Modal>
      </View>
    )
  }
)
