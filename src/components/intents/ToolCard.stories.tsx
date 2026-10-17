import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { Labeled, T } from "../common";
import { Column, Row } from "../Box";
import { ToolCard } from "./ToolCard";
import type { IconName } from "../icons";

export default defineMeta({
  title: "Adwaita/ToolCard",
  component: ToolCard,
  parameters: { width: 528, height: 280 },
});

export const basic = defineStory({
  parameters: { width: 528, height: 150 },
  render: () => (
    <Labeled caption="icon + title + description" style={{ width: "100%" }}>
      <ToolCard icon="fileText" title="Notes" description="Write and edit notes" />
    </Labeled>
  ),
});

export function withBadge() {
  const t = useAdwaita();
  return (
    <Labeled
      caption="icon + title + description + badge"
      style={{ width: "100%" }}
    >
      <ToolCard
        icon="settings"
        title="Settings"
        description="Configure the app"
        badge={<T size="caption" color={t.colors.dim_fg}>new</T>}
      />
    </Labeled>
  );
}
withBadge.parameters = { width: 528, height: 150 };

export const titleOnly = defineStory({
  parameters: { width: 528, height: 130 },
  render: () => (
    <Labeled caption="title only (no description)" style={{ width: "100%" }}>
      <ToolCard icon="user" title="Profile" />
    </Labeled>
  ),
});

export function withBody() {
  const t = useAdwaita();
  return (
    <Labeled
      caption="icon + title + description + body"
      style={{ width: "100%" }}
    >
      <ToolCard
        icon="terminal"
        title="Console"
        description="Run commands and inspect output"
      >
        <T size="caption" color={t.colors.dim_fg}>
          Card body content.
        </T>
      </ToolCard>
    </Labeled>
  );
}
withBody.parameters = { width: 528, height: 170 };

const TOOLS: { icon: IconName; title: string; desc: string }[] = [
  { icon: "fileText", title: "Notes", desc: "Write and edit notes" },
  { icon: "calendar", title: "Calendar", desc: "Schedule and view events" },
  { icon: "mail", title: "Mail", desc: "Read and send messages" },
  { icon: "settings", title: "Settings", desc: "Configure the app" },
];

export const grid = defineStory({
  parameters: { width: 528, height: 340 },
  render: () => (
    <Labeled caption="tool grid (2x2)" style={{ width: "100%" }}>
      <Column gap={12}>
        {[0, 2].map((start) => (
          <Row key={start} gap={12}>
            {TOOLS.slice(start, start + 2).map((tool) => (
              <ToolCard
                key={tool.title}
                icon={tool.icon}
                title={tool.title}
                description={tool.desc}
                style={{ flexGrow: 1, minWidth: 0 }}
              />
            ))}
          </Row>
        ))}
      </Column>
    </Labeled>
  ),
});
