import { defineMeta, defineStory } from "storybook";
import {
  useAdwaita,
  accentForeground,
  hexToRgba,
} from "../theme/adwaita";
import { T } from "./common";
import { Column } from "./Box";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./Tooltip";
import { Button } from "./Button";
import { LabeledStage, SidesShowcase } from "./.storybook/story-helpers";

function SideTooltip({
  side,
  text,
}: {
  side: "top" | "right" | "bottom" | "left";
  text: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip open side={side}>
        <TooltipTrigger>
          <Button label={side} onClick={() => {}} />
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default defineMeta({
  title: "Adwaita/Tooltip",
  component: Tooltip,
  parameters: { width: 528, height: 320 },
});

export const closed = defineStory({
  render: () => (
    <LabeledStage
      caption="open=false (controlled, hidden)"
      width={200}
      height={80}
      center
    >
      <Tooltip open={false}>
        <TooltipTrigger>
          <Button label="No tooltip" onClick={() => {}} />
        </TooltipTrigger>
        <TooltipContent>Hidden</TooltipContent>
      </Tooltip>
    </LabeledStage>
  ),
});

export const openSides = defineStory({
  render: () => (
    <SidesShowcase
      Side={SideTooltip}
      texts={["Tooltip above", "Tooltip right", "Tooltip below", "Tooltip left"]}
      rowGap={24}
      centerRow={false}
    />
  ),
});

export const contentSide = defineStory({
  render: () => (
    <LabeledStage
      caption="TooltipContent side=bottom (overrides Tooltip side)"
      width={200}
      height={120}
      center
    >
      <TooltipProvider>
        <Tooltip open side="top">
          <TooltipTrigger>
            <Button label="Content side" onClick={() => {}} />
          </TooltipTrigger>
          <TooltipContent side="bottom">Content-side override</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </LabeledStage>
  ),
});

export const uncontrolled = defineStory({
  render: () => (
    <LabeledStage caption="defaultOpen (uncontrolled)" width={200} height={120} center>
      <Tooltip defaultOpen>
        <TooltipTrigger>
          <Button label="Default open" onClick={() => {}} />
        </TooltipTrigger>
        <TooltipContent>Uncontrolled open state</TooltipContent>
      </Tooltip>
    </LabeledStage>
  ),
});

export function multiline() {
  const t = useAdwaita();
  const bubbleFg = accentForeground(t.colors.osd_bg);
  return (
    <LabeledStage
      caption="title + body (ReactNode children)"
      width={260}
      height={140}
      center
    >
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>
            <Button label="Title + body" onClick={() => {}} />
          </TooltipTrigger>
          <TooltipContent>
            <Column gap={2} align="start">
              <T size="caption" weight={600} color={bubbleFg}>
                Copy link
              </T>
              <T
                size="caption"
                color={hexToRgba(bubbleFg, 0.65)}
                style={{ whiteSpace: "normal" }}
              >
                Copies the anchor URL to the clipboard.
              </T>
            </Column>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </LabeledStage>
  );
}

export const wrapping = defineStory({
  render: () => (
    <LabeledStage caption="long text wraps (maxWidth)" width={320} height={140} center>
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>
            <Button label="Long text" onClick={() => {}} />
          </TooltipTrigger>
          <TooltipContent>
            A tooltip whose text is long enough to wrap onto several
            lines inside the bubble.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </LabeledStage>
  ),
});
