import { defineMeta } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { Icon, type IconName } from "./icons";
import { Entry } from "./Entry";
import { ListBox, ListBoxItem } from "./ListBox";
import {
  ContentHeader,
  type NavGroups,
  PaneBody,
  SidebarPane,
  WindowBody,
  WindowShell,
} from "../../.storybook/window-shell";
import { TALLY_COUNTERS } from "../../.storybook/story-helpers";

export default defineMeta({
  title: "Adwaita/ListBox",
  component: ListBox,
  parameters: { width: 900, height: 520 },
});

const noop = () => {};

function RowIcon({ name, color }: { name: IconName; color?: string }) {
  const t = useAdwaita();
  return (
    <Icon
      name={name}
      size={16}
      color={color ?? t.color.text.dim}
      style={{ pointerEvents: "none" }}
    />
  );
}

function TimeCaption({ text }: { text: string }) {
  const t = useAdwaita();
  return (
    <T size="caption" color={t.color.text.dim}>
      {text}
    </T>
  );
}

const LOG_NAV: NavGroups = [
  [
    { id: "important", label: "Important" },
    { id: "all", label: "All" },
    { id: "applications", label: "Applications" },
  ],
  [
    { id: "system", label: "System" },
    { id: "security", label: "Security" },
    { id: "hardware", label: "Hardware" },
  ],
];

const LOG_LINES: { text: string; time: string }[] = [
  { text: "JS LOG: Characters Application exiting", time: "23:18" },
  {
    text: "Error retrieving the sender timestamps: Cannot assign requested address",
    time: "23:18",
  },
  {
    text: "meta_window_set_stack_position_no_sync: assertion 'window->stack_position >= 0' …",
    time: "23:18",
  },
  {
    text: "[session uid=1000 pid=98561] Successfully activated service 'org.gnome.Logs'",
    time: "23:18",
  },
  { text: "Started app-flatpak-org.gnome.Logs-274866.scope.", time: "23:18" },
  {
    text: "[session uid=1000 pid=98561] Activating service name='org.gnome.Logs' requested …",
    time: "23:18",
  },
  {
    text: "Timelines with detached actors are not supported. <unnamed>[<Gjs_ui_search_Lists…",
    time: "23:18",
  },
  { text: "unable to parse ctime: (null)", time: "23:18" },
  { text: "JS LOG: Characters Application started", time: "23:17" },
  { text: "[spotifywmm] spotify window found", time: "23:17" },
  { text: 'Failed to load module "canberra-gtk-module"', time: "23:17" },
  { text: "libpng warning: iCCP: known incorrect sRGB profile", time: "23:01" },
  { text: "Unable to get default sink", time: "22:59" },
];

export function logLines() {
  return (
    <WindowShell size={{ width: 900, height: 520 }}>
      <WindowBody>
        <SidebarPane groups={LOG_NAV} selected="applications" />
        <PaneBody>
          <ContentHeader
            title="Logs"
            caret
            trailingIcons={["search", "download", "menu", "close"]}
          />
          <ListBox
            value="line-0"
            onValueChange={noop}
            style={{ flexGrow: 1, minHeight: 0 }}
          >
            {LOG_LINES.map((line, i) => (
              <ListBoxItem
                key={line.text}
                value={`line-${i}`}
                mono
                trailing={<TimeCaption text={line.time} />}
              >
                {line.text}
              </ListBoxItem>
            ))}
          </ListBox>
        </PaneBody>
      </WindowBody>
    </WindowShell>
  );
}
logLines.parameters = { width: 900, height: 520 };

const TEXT_PIECES_ACTIONS: { title: string; subtitle: string }[] = [
  {
    title: "Replace Regex",
    subtitle: "Replace all matches of the regular expression",
  },
  {
    title: "Replace Substring",
    subtitle:
      "Replace all occurences of the substring with in the text with another string",
  },
  {
    title: "Escape URL",
    subtitle: "Replace special characters with URL-safe sequences",
  },
  {
    title: "Escape HTML",
    subtitle: "Replace special characters with HTML-safe sequences",
  },
  { title: "Unescape URL", subtitle: "Replace URL sequences with characters" },
  {
    title: "Escape String",
    subtitle: "Replace special characters with escape sequences",
  },
  {
    title: "Unescape HTML",
    subtitle: "Replace HTML sequences with characters",
  },
];

export function filteredList() {
  const t = useAdwaita();
  return (
    <WindowShell size={{ width: 900, height: 560 }}>
      <PaneBody>
        <ContentHeader
          title="Select action"
          trailingIcons={["menu", "close"]}
          left={<Icon name="layers" size={18} color={t.color.text.primary} />}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            paddingTop: t.space.md,
            paddingBottom: t.space.md,
          }}
        >
          <Entry
            value="replace"
            onChange={noop}
            leading={<Icon name="search" size={16} color={t.color.text.dim} />}
            trailing={<Icon name="close" size={14} color={t.color.text.dim} />}
            style={{ width: t.control.filterEntryWidth }}
          />
        </div>
        <ListBox
          value="action-0"
          onValueChange={noop}
          style={{ flexGrow: 1, minHeight: 0 }}
        >
          {TEXT_PIECES_ACTIONS.map((action, i) => (
            <ListBoxItem
              key={action.title}
              value={`action-${i}`}
              subtitle={action.subtitle}
            >
              {action.title}
            </ListBoxItem>
          ))}
        </ListBox>
      </PaneBody>
    </WindowShell>
  );
}
filteredList.parameters = { width: 900, height: 560 };

const VAULT_ENTRIES: {
  name: string;
  user?: string;
  icon: IconName;
  selected?: boolean;
}[] = [
  { name: "Mastodon", user: "johnd", icon: "person", selected: true },
  { name: "GitLab", user: "johnd", icon: "terminal" },
  { name: "Matrix", user: "johnd", icon: "chatBubble" },
  { name: "Reddit", user: "johnd94", icon: "accountCircle" },
  { name: "Discord", user: "johndoe94", icon: "chatBubble" },
  { name: "Home Wi-Fi", icon: "wifi" },
];

export function vaultEntries() {
  return (
    <WindowShell size={{ width: 900, height: 420 }}>
      <WindowBody>
        <PaneBody style={{ width: 320, flexGrow: 0 }}>
          <ListBox value="Mastodon" onValueChange={noop}>
            {VAULT_ENTRIES.map((entry) => (
              <ListBoxItem
                key={entry.name}
                value={entry.name}
                icon={entry.icon}
                subtitle={entry.user}
                trailing={
                  entry.user ? (
                    <>
                      <RowIcon name="user" />
                      <RowIcon name="search" />
                    </>
                  ) : (
                    <RowIcon name="search" />
                  )
                }
              >
                {entry.name}
              </ListBoxItem>
            ))}
          </ListBox>
        </PaneBody>
        <PaneBody>
          <ContentHeader
            title="Mastodon"
            trailingIcons={["moreVert", "close"]}
          />
        </PaneBody>
      </WindowBody>
    </WindowShell>
  );
}
vaultEntries.parameters = { width: 900, height: 420 };

const HISTORY_WORDS = [
  "define",
  "donate",
  "please",
  "broke",
  "AM",
  "I",
  "ME",
  "help",
];

export function historyRows() {
  const t = useAdwaita();
  return (
    <WindowShell size={{ width: 380, height: 480 }}>
      <PaneBody>
        <ContentHeader title="History" trailingIcons={["delete"]} />
        <ListBox
          value="define"
          onValueChange={noop}
          style={{ flexGrow: 1, minHeight: 0 }}
        >
          {HISTORY_WORDS.map((word) => (
            <ListBoxItem
              key={word}
              value={word}
              trailing={<RowIcon name="star" color={t.color.text.dim} />}
            >
              {word}
            </ListBoxItem>
          ))}
        </ListBox>
      </PaneBody>
    </WindowShell>
  );
}
historyRows.parameters = { width: 380, height: 480 };

export function counterRows() {
  const t = useAdwaita();
  return (
    <WindowShell size={{ width: 420, height: 500 }}>
      <PaneBody>
        <ContentHeader
          title="Tally"
          trailingIcons={["search", "menu", "close"]}
          left={<Icon name="add" size={18} color={t.color.text.primary} />}
        />
        <ListBox
          value="Chickadees"
          onValueChange={noop}
          style={{ flexGrow: 1, minHeight: 0 }}
        >
          {TALLY_COUNTERS.map((counter) => (
            <ListBoxItem
              key={counter.name}
              value={counter.name}
              subtitle={String(counter.count)}
              trailing={
                <>
                  <RowIcon name="minus" />
                  <RowIcon name="plus" />
                  <RowIcon name="chevronDown" />
                </>
              }
            >
              {counter.name}
            </ListBoxItem>
          ))}
        </ListBox>
      </PaneBody>
    </WindowShell>
  );
}
counterRows.parameters = { width: 420, height: 500 };
