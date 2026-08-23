# Examples

Source code for every screenshot referenced in the root [README.md](../README.md). Each file is a self-contained screen component that imports only from `react`, `react-native`, and `@anb98/rn-tooltip` — no relative imports into `src/`, no extra dependencies. This folder is excluded from the published npm package (see `files` in `package.json`); it exists for documentation and reproducibility only.

## How to use

1. Create (or reuse) a plain React Native app.
2. From this repository, run `npm pack` to build a tarball.
3. In the app, run `npm install <path-to-tarball>`.
4. Copy one example file into the app and render its default export as the app's root component (or a screen).
5. Open the tooltip and capture the screenshot per the mapping table below.

## Capture commands

**iOS Simulator**

```sh
xcrun simctl io booted screenshot <name>.png
xcrun simctl io booted recordVideo demo.mp4
```

**Android Emulator / device**

```sh
adb exec-out screencap -p > <name>.png
adb shell screenrecord /sdcard/demo.mp4
```

Convert the recorded video to `demo.gif` with any video-to-gif tool before placing it in `docs/`.

## Example ↔ screenshot ↔ README mapping

| Example file | Screenshot | README section |
|---|---|---|
| `Demo.tsx` | `docs/demo.gif` | Top hero demo |
| `Default.tsx` | `docs/default.png` | Quick path |
| `Positions.tsx` | `docs/positions.png` | Advanced examples → Explicit position |
| `ArrowAlignments.tsx` | `docs/arrow-alignments.png` | Advanced examples → Arrow alignment |
| `CustomStyle.tsx` | `docs/custom-style.png` | Props (width / backgroundColor) |
| `RichContent.tsx` | `docs/rich-content.png` | Advanced examples → Imperative ref |
| `CenterByScreen.tsx` | `docs/center-screen.png` | Advanced examples → Center by screen |
| `EdgeClamping.tsx` | `docs/edge-clamping.png` | Viewport clamping |

`positions.png` and `arrow-alignments.png` are composites: their example screen lays out multiple triggers, but the tooltip is rendered inside a `Modal` that only shows one tooltip at a time. Capture each trigger individually and combine the shots into a single composite image before saving it as the final screenshot.

The `docs/` images themselves are not part of this repository yet — they are forward references, captured and added by whoever runs through this guide.
