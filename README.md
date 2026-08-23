# @anb98/rn-tooltip

A tooltip for React Native with automatic position selection, viewport clamping, and an arrow that tracks the trigger. No native code, no runtime dependencies.

<!-- Screenshots and the demo below live in docs/, added after this change is
     pushed to GitHub. They render once that push happens. -->
<p align="center">
  <img src="https://raw.githubusercontent.com/Anb98/rn-tooltip/main/docs/demo.gif" width="280" alt="Tooltip opening near a trigger button" />
</p>

## Quick path

1. Install:

   ```sh
   npm install @anb98/rn-tooltip
   ```

   Peer dependencies: `react >=18.0.0`, `react-native >=0.72.0`.

2. Use it:

   ```tsx
   import { Tooltip } from '@anb98/rn-tooltip'
   import { Text } from 'react-native'

   function Example() {
     return (
       <Tooltip content={<Text style={{ color: 'white' }}>Helpful hint</Text>}>
         <Text>Press me</Text>
       </Tooltip>
     )
   }
   ```

3. Verify: pressing the trigger opens a modal tooltip near it; pressing outside the tooltip (or the Android back button) closes it.

<img src="https://raw.githubusercontent.com/Anb98/rn-tooltip/main/docs/default.png" width="200" alt="Zero-config tooltip with the default dark background, arrow, and radius" />

[Full runnable example](examples/Default.tsx)

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `ReactNode` | required | Tooltip body, rendered inside the modal box. |
| `children` | `ReactNode` | required | The pressable trigger content. |
| `width` | `number \| \`${number}%\`` | `200` | Fixed pixel width or a percentage of the screen width. |
| `backgroundColor` | `string` | `'rgba(0,0,0,0.75)'` | Box and arrow fill color. |
| `position` | `TooltipPosition` (`'top' \| 'bottom' \| 'left' \| 'right'`) | auto | Forces a side; when omitted the side with the most room is chosen. |
| `arrowAlignment` | `ArrowAlignment` (`'start' \| 'center' \| 'end'`) | `'center'` | Where the arrow (and box) align along the cross axis relative to the trigger. |
| `centerBy` | `'tooltip' \| 'screen'` | `'tooltip'` | Whether the box centers on the trigger or on the screen along the cross axis. |
| `offset` | `{ x?: number; y?: number }` | `undefined` | Extra gap between trigger and box. Positive always pushes the box farther away; negative pulls it closer. |
| `onChange` | `(visible: boolean) => void` | `undefined` | Called whenever the tooltip opens or closes. |

`TooltipRef` (via `ref`):

| Method | Description |
|---|---|
| `open()` | Opens the tooltip programmatically, same as pressing the trigger. |
| `close()` | Closes the tooltip programmatically, same as pressing the overlay. |

<img src="https://raw.githubusercontent.com/Anb98/rn-tooltip/main/docs/custom-style.png" width="220" alt="Tooltip with a custom brand background color and an 80% width" />

[Full runnable example](examples/CustomStyle.tsx)

## Advanced examples

**Explicit position**

```tsx
<Tooltip content={<Text>Right side</Text>} position="right">
  <Text>Trigger</Text>
</Tooltip>
```

<img src="https://raw.githubusercontent.com/Anb98/rn-tooltip/main/docs/positions.png" width="280" alt="Four tooltips, one per screen edge, each opening with room to fit" />

[Full runnable example](examples/Positions.tsx)

**Arrow alignment**

```tsx
<Tooltip content={<Text>Aligned to the trigger's leading edge</Text>} arrowAlignment="start">
  <Text>Trigger</Text>
</Tooltip>
```

<img src="https://raw.githubusercontent.com/Anb98/rn-tooltip/main/docs/arrow-alignments.png" width="280" alt="Three tooltips with start, center, and end arrow alignment" />

[Full runnable example](examples/ArrowAlignments.tsx)

**Center by screen**

```tsx
<Tooltip content={<Text>Centered on the screen, not the trigger</Text>} centerBy="screen">
  <Text>Trigger</Text>
</Tooltip>
```

<img src="https://raw.githubusercontent.com/Anb98/rn-tooltip/main/docs/center-screen.png" width="280" alt="Wide banner tooltip centered on the screen while its arrow tracks a corner trigger" />

[Full runnable example](examples/CenterByScreen.tsx)

**Offset**

```tsx
<Tooltip content={<Text>10px farther from the trigger</Text>} position="top" offset={{ y: 10 }}>
  <Text>Trigger</Text>
</Tooltip>
```

**Imperative ref**

```tsx
import { useRef } from 'react'
import { Tooltip, TooltipRef } from '@anb98/rn-tooltip'

function Example() {
  const tooltipRef = useRef<TooltipRef>(null)

  return (
    <>
      <Tooltip ref={tooltipRef} content={<Text>Hint</Text>}>
        <Text>Trigger</Text>
      </Tooltip>
      <Button title="Open" onPress={() => tooltipRef.current?.open()} />
    </>
  )
}
```

<img src="https://raw.githubusercontent.com/Anb98/rn-tooltip/main/docs/rich-content.png" width="220" alt="Coachmark tooltip with a title, body text, and a Got it button that closes it" />

[Full runnable example](examples/RichContent.tsx)

## Viewport clamping

When the trigger sits near a screen edge, the box clamps inside the viewport instead of overflowing, and the arrow shifts to keep pointing at the trigger.

<img src="https://raw.githubusercontent.com/Anb98/rn-tooltip/main/docs/edge-clamping.png" width="220" alt="Tooltip box clamped inside the viewport with the arrow shifted to keep pointing at a trigger pinned to the right edge" />

[Full runnable example](examples/EdgeClamping.tsx)

## Contributing

```sh
npm run build      # bob build -> lib/commonjs, lib/module, lib/typescript
npm test           # jest
npm run typecheck  # tsc --noEmit
```

## License

MIT © 2026 Abdiel Martinez
