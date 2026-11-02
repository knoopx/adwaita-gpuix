import { type ReactNode } from "react";
import {
  render,
  type EventPayload,
  type RenderOptions,
  type Root,
} from "@gpuix/react";
import { AdwaitaContext, type AdwaitaTheme } from "../theme/adwaita";
import { globalKeyHandler, keyHandler, type WindowKeyEvent } from "./keybus";

// The window-level GPUI key event translated to the keybus event, then handed
// to globalKeyHandler first so overlay and palette chords can swallow a key
// before the focused screen sees it; a handler returning true consumes it.
export function dispatchWindowKey(event: EventPayload): void {
  const ev: WindowKeyEvent = {
    key: event.key ?? "",
    keyChar: event.keyChar,
    isHeld: event.isHeld,
    modifiers: event.modifiers,
  };
  if (globalKeyHandler.current?.(ev)) return;
  keyHandler.current?.(ev);
}

// Everything render() takes except onKeyDown, which the keybus owns.
export interface LaunchOptions extends Omit<RenderOptions, "onKeyDown"> {
  theme: AdwaitaTheme;
  wrap?: (children: ReactNode) => ReactNode;
}

// render() plus what every adwaita app repeats: the theme provider, the
// window size defaults, the GPUIX_BACKGROUND opt-out, and keybus dispatch.
// What is left in an app main.tsx is its own config, providers and window
// identity.
export function launchApp(root: ReactNode, options: LaunchOptions): Root {
  const { theme, wrap, ...window } = options;
  return render(
    <AdwaitaContext.Provider value={theme}>
      {wrap ? wrap(root) : root}
    </AdwaitaContext.Provider>,
    {
      width: 1280,
      height: 800,
      focus: process.env.GPUIX_BACKGROUND !== "1",
      ...window,
      onKeyDown: dispatchWindowKey,
    },
  );
}
