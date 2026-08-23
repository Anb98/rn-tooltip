import type { RefObject } from "react";
import type { View } from "react-native";

import type { Rect } from "./positioning";

const measureInWindowOf = (ref: RefObject<View | null>): Promise<Rect | null> =>
  new Promise((resolve) => {
    const node = ref.current;
    if (!node) {
      resolve(null);
      return;
    }

    node.measureInWindow((x, y, width, height) => {
      resolve(Number.isFinite(x) && width > 0 ? { x, y, width, height } : null);
    });
  });

export const measureElement = (
  ref: RefObject<View | null>,
): Promise<Rect | null> => measureInWindowOf(ref);

export const measureViewInWindow = (
  ref: RefObject<View | null>,
): Promise<Rect | null> => measureInWindowOf(ref);
