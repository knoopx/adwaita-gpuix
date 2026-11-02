import { defineMeta } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { Icon } from "./icons";
import { Switch } from "./Switch";
import { Entry } from "./Entry";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./Collapsible";
import { ListBox, ListBoxItem } from "./ListBox";
import {
  ContentHeader,
  type NavGroups,
  PaneBody,
  SidebarPane,
  WindowBody,
  WindowShell,
} from "../../.storybook/window-shell";

export default defineMeta({
  title: "Adwaita/Collapsible",
  component: Collapsible,
  parameters: { width: 700, height: 520 },
});

const noop = () => {};

function TreeRow({
  label,
  icon,
  indent = 0,
  selected = false,
}: {
  label: string;
  icon?: Parameters<typeof Icon>[0]["name"];
  indent?: number;
  selected?: boolean;
}) {
  const t = useAdwaita();
  return (
    <div
      onClick={noop}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.sm,
        minHeight: t.control.rowHeight,
        paddingLeft: t.space.sm + indent * t.space.lg,
        paddingRight: t.space.sm,
        borderRadius: t.radius.sm,
        backgroundColor: selected ? t.color.selection.accent : "transparent",
        cursor: "pointer",
      }}
    >
      {icon ? (
        <Icon name={icon} size={16} color={t.color.text.primary} />
      ) : null}
      <T size="body" color={t.color.text.primary}>
        {label}
      </T>
    </div>
  );
}

function Disclosure({
  summary,
  children,
  open,
  indent = 0,
  caption = false,
}: {
  summary: string;
  children?: React.ReactNode;
  open: boolean;
  indent?: number;
  caption?: boolean;
}) {
  const t = useAdwaita();
  return (
    <Collapsible open={open} onOpenChange={noop}>
      <CollapsibleTrigger
        style={{
          paddingLeft: t.space.sm + indent * t.space.lg,
          gap: t.space.xs,
        }}
      >
        <T
          size={caption ? "caption" : "body"}
          weight={600}
          color={t.color.text.primary}
        >
          {summary}
        </T>
      </CollapsibleTrigger>
      <CollapsibleContent
        style={{
          paddingLeft: t.space.sm + (indent + 1) * t.space.lg,
          gap: t.space.xs,
        }}
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

const FEED_NAV: NavGroups = [
  [
    { id: "all", label: "All Articles", icon: "globe" },
    { id: "today", label: "Today", icon: "calendarMonth" },
  ],
];

export function feedTree() {
  const t = useAdwaita();
  const tree = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.xs,
        paddingLeft: t.space.sm,
        paddingRight: t.space.sm,
      }}
    >
      <Disclosure summary="Subscriptions" open indent={0} caption>
        <Disclosure summary="Cat1" open indent={1} caption>
          <TreeRow label="Planet GNOME" icon="globe" indent={2} selected />
          <TreeRow label="This Week in GNOME" icon="globe" indent={2} />
        </Disclosure>
        <Disclosure summary="Cat2" open={false} indent={1} caption />
      </Disclosure>
      <TreeRow label="Lwn" icon="globe" />
      <TreeRow label="Xkcd" icon="globe" />
    </div>
  );
  return (
    <WindowShell size={{ width: 700, height: 520 }}>
      <WindowBody>
        <SidebarPane
          title="NewsFlash"
          groups={FEED_NAV}
          selected="all"
          content={tree}
        />
        <PaneBody>
          <ContentHeader
            title="Planet GNOME"
            trailingIcons={[
              "star",
              "user",
              "bookmark",
              "star",
              "link",
              "menu",
              "close",
            ]}
          />
        </PaneBody>
      </WindowBody>
    </WindowShell>
  );
}
feedTree.parameters = { width: 700, height: 520 };

export function keyDetails() {
  const t = useAdwaita();
  return (
    <WindowShell size={{ width: 700, height: 460 }}>
      <PaneBody>
        <ContentHeader
          title="Icon Theme"
          trailingIcons={["search", "menu", "close"]}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: t.space.xl,
            paddingRight: t.space.xl,
            paddingTop: t.space.md,
          }}
        >
          <Collapsible open onOpenChange={noop}>
            <CollapsibleTrigger>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: t.space.sm,
                  minHeight: t.control.rowHeight,
                  cursor: "pointer",
                }}
              >
                <Icon name="expandMore" size={16} color={t.color.text.dim} />
                <T size="body" weight={600} color={t.color.text.primary}>
                  icon-theme
                </T>
                <T size="caption" color={t.color.text.dim}>
                  The fallback icon theme name
                </T>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: t.space.md,
                  paddingTop: t.space.md,
                }}
              >
                <ListBox value="custom" onValueChange={noop}>
                  <ListBoxItem
                    value="title"
                    subtitle="The fallback icon theme name"
                  >
                    Title
                  </ListBoxItem>
                  <ListBoxItem value="type">Type: s</ListBoxItem>
                  <ListBoxItem value="value">Value: Adwaita</ListBoxItem>
                  <ListBoxItem
                    value="custom"
                    trailing={<Switch checked={false} onChange={noop} />}
                  >
                    Use default value
                  </ListBoxItem>
                </ListBox>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: t.space.md,
                  }}
                >
                  <T size="body" color={t.color.text.dim}>
                    Custom value
                  </T>
                  <Entry
                    value="Adwaita"
                    onChange={noop}
                    style={{ flexGrow: 1 }}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </PaneBody>
    </WindowShell>
  );
}
keyDetails.parameters = { width: 700, height: 460 };

const DISCS: { name: string; mount: string; open?: boolean }[] = [
  { name: "100.7 MB FAT", mount: "/boot" },
  { name: "Arch", mount: "/" },
  { name: "Home", mount: "/home", open: true },
  { name: "990 Pro", mount: "/mnt/990pro" },
];

export function volumeDisclosure() {
  const t = useAdwaita();
  return (
    <WindowShell size={{ width: 700, height: 480 }}>
      <PaneBody>
        <ContentHeader
          title="2.0 TB Disk"
          trailingIcons={["info", "moreVert", "close"]}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: t.space.md,
            padding: t.space.xl,
          }}
        >
          {DISCS.map((disc) => (
            <Disclosure
              key={disc.name}
              summary={disc.name}
              open={disc.open ?? false}
            >
              <TreeRow label={disc.mount} indent={1} />
            </Disclosure>
          ))}
        </div>
      </PaneBody>
    </WindowShell>
  );
}
volumeDisclosure.parameters = { width: 700, height: 480 };
