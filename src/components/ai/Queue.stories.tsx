import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import type { ReactNode } from "react";
import { Column } from "../Box";
import { Queue, QueueItem } from "./Queue";
import { CollapsibleContent } from "../../components/Collapsible";

function QueueIndent({ children }: { children: ReactNode }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        paddingTop: 4,
        paddingLeft: 12,
        borderLeftWidth: 2,
        borderColor: t.colors.border,
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
}

function QueueFrame({ children }: { children: ReactNode }) {
  return (
    <Column style={{ width: "100%", minWidth: 0 }}>
      {children}
    </Column>
  );
}

type QueueItemSpec = { title: string; description?: string; completed?: boolean };

const THEME_ITEMS: QueueItemSpec[] = [
  { title: "Add a dark variant to the theme tokens", completed: true },
  { title: "Read the theme from a cookie", completed: true },
  { title: "Add a toggle to the settings page" },
  { title: "Check contrast on the charts" },
];

const WAITING_ITEMS: QueueItemSpec[] = [
  { title: "Add a dark variant to the theme tokens" },
  { title: "Read the theme from a cookie" },
  { title: "Add a toggle to the settings page" },
  { title: "Check contrast on the charts" },
];

function QueueDemo({
  title,
  count,
  open,
  items,
}: {
  title?: string;
  count?: number;
  open?: boolean;
  items: QueueItemSpec[];
}) {
  return (
    <QueueFrame>
      <Queue title={title} count={count} open={open} onOpenChange={() => {}}>
        <CollapsibleContent>
          <QueueIndent>
            {items.map((i) => (
              <QueueItem
                key={i.title}
                title={i.title}
                description={i.description}
                completed={i.completed}
              />
            ))}
          </QueueIndent>
        </CollapsibleContent>
      </Queue>
    </QueueFrame>
  );
}

export default defineMeta({
  title: "Adwaita/Queue",
  component: Queue,
  parameters: { width: 528, height: 400 },
});

export const mixed = defineStory({
  parameters: { width: 528, height: 240 },
  render: () => <QueueDemo title="4 steps" open items={THEME_ITEMS} />,
});

export const waiting = defineStory({
  parameters: { width: 528, height: 240 },
  render: () => <QueueDemo title="4 steps" open items={WAITING_ITEMS} />,
});

export const descriptions = defineStory({
  parameters: { width: 528, height: 200 },
  render: () => (
    <QueueDemo
      title="2 steps"
      open
      items={[
        {
          title: "Add a dark variant to the theme tokens",
          description: "tokens.ts — added the dark surface set",
          completed: true,
        },
        {
          title: "Add a toggle to the settings page",
          description: "Settings → Appearance, default off",
        },
      ]}
    />
  ),
});

export const closed = defineStory({
  parameters: { width: 528, height: 110 },
  render: () => (
    <QueueDemo
      count={4}
      items={[
        { title: "Add a dark variant to the theme tokens", completed: true },
        { title: "Check contrast on the charts", completed: true },
      ]}
    />
  ),
});
