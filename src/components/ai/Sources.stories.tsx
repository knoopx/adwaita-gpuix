import { defineMeta, defineStory } from "storybook";
import type { ReactNode } from "react";
import { useAdwaita } from "../../theme/adwaita";
import { Labeled } from "../common";
import { Column } from "../Box";
import { type IconName } from "../../components/icons";
import { CollapsibleContent } from "../Collapsible";
import { Sources, Source } from "./Sources";

interface StorySource {
  title: string;
  url: string;
  icon?: IconName;
}

const STORY_SOURCES: StorySource[] = [
  { title: "Getting Started Guide", url: "https://docs.example.com/start" },
  { title: "Project template", url: "https://registry.example.com/create" },
  { title: "CLI reference", url: "https://cli.example.com/reference" },
];

function SourcesPanel({
  count,
  open = true,
  sources,
}: {
  count?: number;
  open?: boolean;
  sources: StorySource[];
}) {
  return (
    <Sources count={count} open={open}>
      <CollapsibleContent>
        <Column gap={4} style={{ minWidth: 0 }}>
          {sources.map((s, i) => (
            <Source key={i} title={s.title} url={s.url} icon={s.icon} />
          ))}
        </Column>
      </CollapsibleContent>
    </Sources>
  );
}

function Panel({
  children,
  width = 380,
}: {
  children: ReactNode;
  width?: number;
}) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width,
        minWidth: 0,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
      }}
    >
      {children}
    </div>
  );
}

export default defineMeta({
  title: "Adwaita/Sources",
  component: Sources,
  parameters: { width: 528, height: 320 },
});

export const basicList = defineStory({
  parameters: { width: 404, height: 220 },
  render: () => (
    <Panel>
      <Labeled caption="Sources list — header + count, open" />
      <SourcesPanel count={3} sources={STORY_SOURCES} />
    </Panel>
  ),
});

export const singleSource = defineStory({
  parameters: { width: 404, height: 150 },
  render: () => (
    <Panel>
      <Labeled caption="Single source — one row" />
      <SourcesPanel count={1} sources={STORY_SOURCES.slice(0, 1)} />
    </Panel>
  ),
});

export const iconVariants = defineStory({
  parameters: { width: 404, height: 220 },
  render: () => {
    const withIcons: StorySource[] = [
      { ...STORY_SOURCES[0], icon: "link" },
      { ...STORY_SOURCES[1], icon: "fileText" },
      { ...STORY_SOURCES[2], icon: "search" },
    ];
    return (
      <Panel>
        <Labeled caption="Source rows with icon chip variants" />
        <SourcesPanel count={3} sources={withIcons} />
      </Panel>
    );
  },
});

export const closed = defineStory({
  parameters: { width: 404, height: 130 },
  render: () => (
    <Panel>
      <Labeled caption="Collapsed — count in header, chevron points right" />
      <SourcesPanel count={3} open={false} sources={STORY_SOURCES} />
    </Panel>
  ),
});
