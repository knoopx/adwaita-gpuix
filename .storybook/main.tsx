import type { ReactNode } from "react";
import type { DecoratorFunction } from "storybook";
import { AdwaitaProvider } from "../src/theme/adwaita";


const FRAME_STYLE = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

function StoryFrame({
  framed,
  children,
}: {
  framed: boolean;
  children: ReactNode;
}): ReactNode {
  if (!framed) return children;
  return <div style={FRAME_STYLE}>{children}</div>;
}

export const decorators: DecoratorFunction[] = [
  (Story, context) => (
    <AdwaitaProvider scheme="light">
      <StoryFrame framed={context.parameters?.frame !== false}>
        {Story()}
      </StoryFrame>
    </AdwaitaProvider>
  ),
];
