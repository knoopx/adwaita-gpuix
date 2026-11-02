import type { ReactNode } from "react";
import { AdwaitaContext, type AdwaitaTheme } from "../theme/adwaita";

export function StoryFrame({
  theme,
  children,
}: {
  theme: AdwaitaTheme;
  children: ReactNode;
}) {
  return (
    <AdwaitaContext.Provider value={theme}>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          backgroundColor: theme.color.surface.window,
        }}
      >
        {children}
      </div>
    </AdwaitaContext.Provider>
  );
}

// The .storybook/main.tsx preview decorator every gpuix app needs: the app's
// Adwaita theme plus a padded window-colored frame around each story. A story
// keeps the theme but drops the frame with `parameters: { frame: false }`.
// Typed structurally so the design system does not depend on the storybook
// package.
export type FrameOptions = {
  // Extra provider around the story, e.g. a ToastProvider.
  wrap?: (children: ReactNode) => ReactNode;
};

function themed(
  theme: AdwaitaTheme,
  options: FrameOptions | undefined,
  children: ReactNode,
) {
  const wrapped = options?.wrap ? options.wrap(children) : children;
  return (
    <AdwaitaContext.Provider value={theme}>{wrapped}</AdwaitaContext.Provider>
  );
}

export function themeFrame(theme: AdwaitaTheme, options?: FrameOptions) {
  return (
    render: () => ReactNode,
    context?: { parameters?: { frame?: boolean } },
  ): ReactNode =>
    context?.parameters?.frame === false ? (
      themed(theme, options, render())
    ) : (
      <StoryFrame theme={theme}>{themed(theme, options, render())}</StoryFrame>
    );
}

// Theme without the padded window frame: for apps whose stories already paint
// their own window chrome.
export function themeOnly(theme: AdwaitaTheme, options?: FrameOptions) {
  return (render: () => ReactNode): ReactNode =>
    themed(theme, options, render());
}
