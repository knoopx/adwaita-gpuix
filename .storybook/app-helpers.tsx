import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, hexToRgba, useAdwaita } from "../src/theme/adwaita";
import { T } from "../src/components/text";
import { Icon, type IconName } from "../src/components/icons";
import { Button } from "../src/components/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLeadCell,
  TableNodeCell,
  TableRow,
} from "../src/components/Table";
import { Chart, type ChartData, chartPalette } from "../src/components/Chart";
import { BoxedRow } from "../src/components/BoxedList";
import { ToggleGroup } from "../src/components/ToggleGroup";
import { HeaderBar } from "../src/components/chrome/HeaderBar";
import { LocationEntry } from "../src/components/chrome/LocationEntry";
import {
  SidebarHeader,
  SidebarMenuItem,
} from "../src/components/chrome/Sidebar";
import { type ViewSwitcherItem } from "../src/components/chrome/ViewSwitcher";
import {
  type NavGroups,
  type NavRow,
  NavSidebar,
  SETTINGS_NAV_APPEARANCE,
  SETTINGS_NAV_INPUT,
  WindowShell,
} from "./window-shell";

export {
  SETTINGS_NAV_APPEARANCE,
  SETTINGS_NAV_INPUT,
  type NavGroups,
  type NavRow,
};

export type SettingsNavGroups = NavGroups;

export const FILES_WINDOW = { width: 1090, height: 762 };

export const FILES_NAV: { id: string; label: string; icon: IconName }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "recent", label: "Recent", icon: "schedule" },
  { id: "starred", label: "Starred", icon: "star" },
  { id: "network", label: "Network", icon: "globe" },
  { id: "trash", label: "Trash", icon: "delete" },
];

export const FILES_PLACES: { id: string; label: string; icon: IconName }[] = [
  { id: "documents", label: "Documents", icon: "article" },
  { id: "music", label: "Music", icon: "musicNote" },
  { id: "pictures", label: "Pictures", icon: "image" },
  { id: "videos", label: "Videos", icon: "videocam" },
  { id: "downloads", label: "Downloads", icon: "download" },
];

export const FILES_ROWS: {
  name: string;
  items: string;
  modified: string;
}[] = [
  { name: "Desktop", items: "0 items", modified: "Yesterday 11:28 PM" },
  { name: "Documents", items: "0 items", modified: "Yesterday 11:28 PM" },
  { name: "Downloads", items: "0 items", modified: "Yesterday 11:28 PM" },
  { name: "Music", items: "0 items", modified: "Yesterday 11:28 PM" },
  { name: "Pictures", items: "44 items", modified: "Yesterday 11:56 PM" },
  { name: "Public", items: "0 items", modified: "Yesterday 11:28 PM" },
  { name: "Templates", items: "0 items", modified: "Yesterday 11:28 PM" },
  { name: "Videos", items: "0 items", modified: "Yesterday 11:28 PM" },
];

export const FILES_VIEWS: ViewSwitcherItem[] = [
  { id: "grid", icon: "gridView" },
  { id: "list", icon: "list" },
];

export const WEATHER_VIEWS: ViewSwitcherItem[] = [
  { id: "hourly", icon: "schedule", label: "Hourly" },
  { id: "daily", icon: "calendarMonth", label: "Daily" },
];

export const MONITOR_VIEWS: ViewSwitcherItem[] = [
  { id: "processes", icon: "formatListNumbered", label: "Processes" },
  { id: "resources", icon: "speed", label: "Resources" },
  { id: "filesystems", icon: "hardDrive", label: "File Systems" },
];

export function filesMetrics(t: AdwaitaTheme) {
  return {
    columnGrow: { name: 6.2, size: 0.88, modified: 1.56, action: 1 },
    entryCap: t.control.locationEntryMaxWidth,
    tile: {
      width: t.control.fileTileWidth,
      icon: t.control.fileTileIconSize,
      gap: t.control.fileTileGap,
      paddingX: t.control.gridPaddingX,
      paddingY: t.control.gridPaddingY,
    },
  };
}

export function FilesSidebar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <NavSidebar
      title="Files"
      groups={[FILES_NAV, FILES_PLACES]}
      selected={selected}
      onSelect={onSelect}
    />
  );
}

export function FilesHeaderBar({
  viewIcon,
  style,
}: {
  viewIcon: IconName;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const noop = () => {};

  return (
    <HeaderBar
      style={style}
      centerMode="location"
      centerStyle={{ maxWidth: filesMetrics(t).entryCap }}
      left={
        <>
          <Button
            variant="icon"
            size="icon"
            icon="chevronLeft"
            onClick={noop}
          />
          <Button
            variant="icon"
            size="icon"
            icon="chevronRight"
            onClick={noop}
          />
        </>
      }
      center={
        <LocationEntry icon="home" label="Home" trailingIcon="moreVert" />
      }
      right={
        <>
          <Button variant="icon" size="icon" icon={viewIcon} onClick={noop} />
          <Button variant="icon" size="icon" icon="expandMore" onClick={noop} />
          <Button variant="icon" size="icon" icon="close" onClick={noop} />
        </>
      }
    />
  );
}

export function FilesNameHeaderCell({ grow }: { grow: number }) {
  const t = useAdwaita();
  return (
    <TableNodeCell grow={grow}>
      <T size="list" color={t.color.text.dim}>
        Name
      </T>
      <Icon
        name="expandLess"
        size={t.control.caretIconSize}
        color={t.color.text.dim}
      />
    </TableNodeCell>
  );
}

export const FILES_NARROW_GROW = { name: 4, size: 1.2 };

export function FilesNarrowHeader({ style }: { style?: Partial<StyleDesc> }) {
  const noop = () => {};
  return (
    <HeaderBar
      style={style}
      left={<Button variant="icon" size="icon" icon="menu" onClick={noop} />}
      centerMode="location"
      center={
        <LocationEntry icon="home" label="Home" trailingIcon="moreVert" />
      }
      right={
        <Button variant="secondary" size="icon" icon="close" onClick={noop} />
      }
    />
  );
}

export function FilesNameTable({
  grow = FILES_NARROW_GROW,
}: {
  grow?: { name: number; size: number };
}) {
  const noop = () => {};
  return (
    <Table>
      <TableHeader>
        <FilesNameHeaderCell grow={grow.name} />
        <TableHead align="right" grow={grow.size}>
          Size
        </TableHead>
      </TableHeader>
      <TableBody>
        {FILES_ROWS.map((file) => (
          <TableRow key={file.name} onSelect={noop}>
            <TableLeadCell icon="folder" grow={grow.name}>
              {file.name}
            </TableLeadCell>
            <TableCell align="right" muted grow={grow.size}>
              {file.items}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function FilesNarrowWindow({
  size,
}: {
  size: { width: number; height: number };
}) {
  const t = useAdwaita();
  return (
    <WindowFrame size={size} style={{ position: "relative" }}>
      <FilesNarrowHeader />
      <PaneColumn bg={t.color.surface.view} grow={1}>
        <FilesNameTable />
      </PaneColumn>
      <NavSidebar
        title="Files"
        groups={[FILES_NAV]}
        selected="home"
        mobile
        contained
        open
      />
    </WindowFrame>
  );
}

export function FilesColumnHeader() {
  const t = useAdwaita();
  const grow = filesMetrics(t).columnGrow;

  return (
    <TableHeader>
      <FilesNameHeaderCell grow={grow.name} />
      <TableHead align="right" grow={grow.size}>
        Size
      </TableHead>
      <TableHead align="right" grow={grow.modified}>
        Modified
      </TableHead>
      <TableNodeCell grow={grow.action} align="right">
        <div style={{ width: t.control.rowActionIconSize }} />
      </TableNodeCell>
    </TableHeader>
  );
}

export function Stack({ children }: { children: ReactNode }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.lg,
      }}
    >
      {children}
    </div>
  );
}

export const WINDOWS = {
  wide: { width: 1000, height: 660 },
  mid: { width: 900, height: 560 },
  narrow: { width: 420, height: 620 },
};

export function WindowFrame(props: {
  size: { width: number; height: number };
  style?: Partial<StyleDesc>;
  children: ReactNode;
}) {
  const t = useAdwaita();
  return <WindowShell {...props} radius={t.radius.sm} />;
}

export function HeaderActions({
  icons = ["menu"],
  trailing,
  close = true,
  onClick = () => {},
}: {
  icons?: IconName[];
  trailing?: ReactNode;
  close?: boolean;
  onClick?: () => void;
}) {
  return (
    <>
      {icons.map((icon) => (
        <Button
          key={icon}
          variant="icon"
          size="icon"
          icon={icon}
          onClick={onClick}
        />
      ))}
      {trailing}
      {close ? (
        <Button
          variant="secondary"
          size="icon"
          icon="close"
          onClick={onClick}
        />
      ) : null}
    </>
  );
}

export function DestructiveAction({
  label,
  trailingIcon,
  onClick,
}: {
  label: string;
  trailingIcon?: IconName;
  onClick: () => void;
}) {
  const t = useAdwaita();

  return (
    <Button
      variant="secondary"
      onClick={onClick}
      style={{ backgroundColor: t.color.functional.destructiveTint }}
    >
      <T size="body" weight={600} color={t.color.functional.destructive}>
        {label}
      </T>
      {trailingIcon ? (
        <Icon
          name={trailingIcon}
          size={t.control.navIconSize}
          color={t.color.functional.destructive}
        />
      ) : null}
    </Button>
  );
}

export function Transport() {
  const t = useAdwaita();
  const noop = () => {};

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingLeft: t.space.md,
        paddingRight: t.space.md,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: t.space.xs,
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <Icon
          name="speed"
          size={t.control.navIconSize}
          color={t.color.text.primary}
        />
        <T size="body" weight={600}>
          × 1.0
        </T>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: t.space.lg,
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <Button variant="icon" size="icon" icon="rotateLeft" onClick={noop} />
        <Button variant="secondary" size="lg" icon="pause" onClick={noop} />
        <Button variant="icon" size="icon" icon="rotateRight" onClick={noop} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <Button variant="icon" size="icon" icon="volumeUp" onClick={noop} />
      </div>
    </div>
  );
}

export function PaneColumn({
  children,
  grow = 1,
  bg,
  style,
}: {
  children: ReactNode;
  grow?: number;
  bg?: string;
  style?: Partial<StyleDesc>;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: grow,
        flexShrink: 1,
        flexBasis: 0,
        minWidth: 0,
        minHeight: 0,
        backgroundColor: bg,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function PaneRow({
  sidebar,
  header,
  children,
  view = true,
  style,
}: {
  sidebar?: ReactNode;
  header?: ReactNode;
  children?: ReactNode;
  view?: boolean;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        minHeight: 0,
        minWidth: 0,
        ...(view ? { backgroundColor: t.color.surface.view } : {}),
        ...style,
      }}
    >
      {sidebar}
      <PaneColumn bg={view ? t.color.surface.view : undefined}>
        {header}
        {children}
      </PaneColumn>
    </div>
  );
}

export function SectionHeading({
  children,
  trailing,
}: {
  children: ReactNode;
  trailing?: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.sm,
      }}
    >
      <T size="title4" weight={700}>
        {children}
      </T>
      <div style={{ flexGrow: 1, flexShrink: 1, minWidth: 0 }} />
      {trailing}
    </div>
  );
}

export function PaneTitle({
  title,
  caption,
}: {
  title: string;
  caption?: string;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexGrow: 1,
        minWidth: 0,
      }}
    >
      <T size="title3" weight={600}>
        {title}
      </T>
      {caption ? (
        <T size="caption" color={t.color.text.dim}>
          {caption}
        </T>
      ) : null}
    </div>
  );
}

export function SettingsSidebar({
  selected,
  groups,
}: {
  selected: string;
  groups: NavGroups;
}) {
  return <NavSidebar title="Settings" groups={groups} selected={selected} />;
}

export function MousePrimaryButtonRow() {
  return (
    <BoxedRow
      title="Primary Button"
      subtitle="Order of physical buttons on mice and touchpads"
      trailing={
        <ToggleGroup
          size="lg"
          value="left"
          onChange={() => {}}
          options={[
            { id: "left", label: "Left" },
            { id: "right", label: "Right" },
          ]}
        />
      }
    />
  );
}

export const RESOURCES_NAV: {
  id: string;
  label: string;
  icon: IconName;
  series?: number[];
  color?: number;
}[] = [
  { id: "apps", label: "Apps", icon: "desktopWindows" },
  { id: "processes", label: "Processes", icon: "settings" },
  {
    id: "processor",
    label: "Processor",
    icon: "developerBoard",
    series: [8, 6, 5, 7, 12, 9, 7, 6, 8, 7, 26, 7, 6, 8],
    color: 0,
  },
  {
    id: "memory",
    label: "Memory",
    icon: "memory",
    series: [42, 43, 44, 44, 45, 46, 47, 47, 48, 48, 49, 50, 50, 51],
    color: 1,
  },
  {
    id: "gpu",
    label: "GPU",
    icon: "speed",
    series: [22, 18, 25, 14, 12, 20, 31, 16, 13, 24, 12, 18, 21, 15],
    color: 2,
  },
  {
    id: "drive",
    label: "512 GB Drive",
    icon: "hardDrive",
    series: [2, 1, 2, 1, 58, 3, 2, 1, 2, 61, 2, 1, 2, 3],
    color: 3,
  },
  {
    id: "wifi",
    label: "Wi-Fi Connection",
    icon: "wifi",
    series: [6, 5, 6, 5, 7, 5, 6, 34, 6, 5, 6, 5, 6, 5],
    color: 4,
  },
];

export const MONITOR_ROWS: {
  name: string;
  cpu: string;
  id: string;
  memory: string;
  diskRead: string;
  diskWrite: string;
  priority: string;
}[] = [
  {
    name: "gnome-shell",
    cpu: "2.56",
    id: "1537",
    memory: "127.5 MB",
    diskRead: "1.3 GB",
    diskWrite: "90.5 MB",
    priority: "Normal",
  },
  {
    name: "gnome-system-monitor",
    cpu: "1.18",
    id: "69168",
    memory: "100.8 MB",
    diskRead: "39.7 MB",
    diskWrite: "135.2 kB",
    priority: "Normal",
  },
  {
    name: "xdg-desktop-portal",
    cpu: "0.06",
    id: "2363",
    memory: "40.7 MB",
    diskRead: "14.8 MB",
    diskWrite: "3.8 kB",
    priority: "Normal",
  },
  {
    name: "gdm-wayland-session",
    cpu: "0.00",
    id: "1434",
    memory: "N/A",
    diskRead: "57.3 kB",
    diskWrite: "N/A",
    priority: "Normal",
  },
  {
    name: "gnome-session",
    cpu: "0.00",
    id: "1444",
    memory: "N/A",
    diskRead: "2.1 MB",
    diskWrite: "N/A",
    priority: "Normal",
  },
  {
    name: "gnome-shell-calendar-server",
    cpu: "0.00",
    id: "1486",
    memory: "N/A",
    diskRead: "41.0 kB",
    diskWrite: "N/A",
    priority: "Normal",
  },
  {
    name: "gjs",
    cpu: "0.00",
    id: "2021",
    memory: "2.2 MB",
    diskRead: "16.4 kB",
    diskWrite: "N/A",
    priority: "Normal",
  },
  {
    name: "gnome-software",
    cpu: "0.00",
    id: "17662",
    memory: "8.2 MB",
    diskRead: "230.7 MB",
    diskWrite: "1.6 MB",
    priority: "Normal",
  },
  {
    name: "gnome-browser-connector",
    cpu: "0.00",
    id: "55494",
    memory: "N/A",
    diskRead: "7.6 kB",
    diskWrite: "N/A",
    priority: "Normal",
  },
  {
    name: "bwrap",
    cpu: "0.00",
    id: "66293",
    memory: "131.1 kB",
    diskRead: "32.8 kB",
    diskWrite: "N/A",
    priority: "Normal",
  },
  {
    name: "gnome-keyring-daemon",
    cpu: "0.00",
    id: "1428",
    memory: "614.4 kB",
    diskRead: "4.6 MB",
    diskWrite: "831.5 kB",
    priority: "Normal",
  },
  {
    name: "github-desktop",
    cpu: "0.00",
    id: "66310",
    memory: "33.6 MB",
    diskRead: "35.4 MB",
    diskWrite: "1.4 MB",
    priority: "Normal",
  },
];

export const WEATHER_HOURLY: {
  time: string;
  icon: IconName;
  temp: number;
}[] = [
  { time: "Now", icon: "sunny", temp: 24 },
  { time: "16:00", icon: "sunny", temp: 22 },
  { time: "17:00", icon: "sunny", temp: 20 },
  { time: "18:00", icon: "sunny", temp: 18 },
  { time: "19:00", icon: "darkMode", temp: 17 },
  { time: "20:00", icon: "darkMode", temp: 17 },
  { time: "21:00", icon: "darkMode", temp: 16 },
  { time: "22:00", icon: "darkMode", temp: 16 },
  { time: "23:00", icon: "darkMode", temp: 15 },
  { time: "00:00", icon: "darkMode", temp: 14 },
];

export const EDITOR_DOCS: { id: string; label: string; closable?: boolean }[] =
  [
    { id: "readme", label: "README.md", closable: true },
    { id: "config", label: "config.fish" },
    { id: "app", label: "application.ts" },
  ];

export const README_LINES: { text: string; dim?: boolean }[] = [
  { text: "# Highscore", dim: true },
  { text: "" },
  { text: "Highscore is a retro gaming application for the GNOME desktop." },
  { text: "" },
  {
    text: "You want to install Highscore if you need a painless way to browse and play your",
  },
  {
    text: "retro games library, without bothering with advanced features such as",
  },
  { text: "speedrunning tools or video game development tools." },
  { text: "" },
  { text: "- Website:    https://wiki.gnome.org/Apps/Games", dim: true },
  { text: "- Issues:     https://gitlab.gnome.org/World/highscore", dim: true },
  {
    text: "- Download:   https://download.gnome.org/sources/gnome-games/",
    dim: true,
  },
  {
    text: "- Mailing list: https://mail.gnome.org/mailman/listinfo/games-list",
    dim: true,
  },
  { text: "" },
  { text: "## Contribution guide", dim: true },
  {
    text: "https://gitlab.gnome.org/World/highscore/blob/main/HACKING.md",
    dim: true,
  },
];

export const PODCAST_SHOWS: string[] = [
  "99% Invisible",
  "According to Need",
  "American Prestige",
  "Blowback",
  "Cocaine Intelligence Unit",
  "Anti-Capitalist Chronicles",
  "Drop Site News",
  "Ethnopenia",
  "E1",
  "The Adam Friedland Show",
  "The History of GNOME",
  "The Palestine Laboratory",
];

export function Sparkline({
  values,
  colorIndex,
}: {
  values: number[];
  colorIndex: number;
}) {
  const t = useAdwaita();
  const color = chartPalette(t)[colorIndex];
  const bandWidth =
    t.control.sidebarWidth -
    t.control.sidebarRowInsetX * 2 -
    t.control.sidebarRowPaddingX * 2;
  const data: ChartData = values.map((value) => ({ label: "", value }));
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: bandWidth,
        height: t.control.sparklineHeight,
        borderRadius: t.radius.sm,
        backgroundColor: hexToRgba(color, t.color.chart.bandTint),
      }}
    >
      <Chart
        type="line"
        fill
        data={data}
        labels={false}
        grid={false}
        markers={false}
        hideZeroLabels
        width={bandWidth - t.space.sm * 2}
        height={t.control.sparklineHeight}
        color={color}
        style={{ flexGrow: 1, minWidth: 0, pointerEvents: "none" }}
      />
    </div>
  );
}

export function ResourcesSidebar({ selected }: { selected: string }) {
  const t = useAdwaita();
  const noop = () => {};
  return (
    <NavSidebar
      header={
        <SidebarHeader>
          <div style={{ width: t.control.viewSwitcherHeight }} />
          <T size="title2" weight={600}>
            Resources
          </T>
          <Button variant="icon" size="icon" icon="menu" onClick={noop} />
        </SidebarHeader>
      }
      groups={[
        RESOURCES_NAV.filter((row) => !row.series),
        RESOURCES_NAV.filter((row) => row.series),
      ]}
      selected={selected}
      renderItem={(row) => {
        const entry = RESOURCES_NAV.find((nav) => nav.id === row.id);
        if (!entry?.series) {
          return (
            <SidebarMenuItem
              key={row.id}
              icon={row.icon}
              label={row.label}
              selected={row.id === selected}
              onClick={noop}
            />
          );
        }
        return (
          <div
            key={row.id}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: t.space.xs,
            }}
          >
            <SidebarMenuItem icon={row.icon} label={row.label} onClick={noop} />
            <Sparkline values={entry.series} colorIndex={entry.color ?? 0} />
          </div>
        );
      }}
    />
  );
}

export const RESOURCES_APPS: {
  name: string;
  icon: IconName;
  memory: string;
  cpu: string;
  gpu: string;
}[] = [
  {
    name: "Files",
    icon: "desktopWindows",
    memory: "30.52 MB",
    cpu: "0.0 %",
    gpu: "0.0 %",
  },
  {
    name: "Firefox",
    icon: "globe",
    memory: "384.16 MB",
    cpu: "0.0 %",
    gpu: "0.0 %",
  },
  {
    name: "GNOME Shell",
    icon: "autoAwesome",
    memory: "1.37 GB",
    cpu: "7.1 %",
    gpu: "3.7 %",
  },
  {
    name: "GSConnect",
    icon: "call",
    memory: "18.12 MB",
    cpu: "0.0 %",
    gpu: "0.0 %",
  },
  {
    name: "Mullvad VPN",
    icon: "globe",
    memory: "75.12 MB",
    cpu: "0.0 %",
    gpu: "0.0 %",
  },
  {
    name: "Problem Reporting",
    icon: "warning",
    memory: "962.56 kB",
    cpu: "0.0 %",
    gpu: "0.0 %",
  },
  {
    name: "Resources",
    icon: "speed",
    memory: "73.15 MB",
    cpu: "1.2 %",
    gpu: "3.2 %",
  },
  {
    name: "Settings",
    icon: "settings",
    memory: "11.37 MB",
    cpu: "0.0 %",
    gpu: "0.0 %",
  },
  {
    name: "Software",
    icon: "package",
    memory: "460.11 MB",
    cpu: "0.0 %",
    gpu: "0.0 %",
  },
  {
    name: "Syncthing Web UI",
    icon: "refresh",
    memory: "62.44 MB",
    cpu: "0.0 %",
    gpu: "0.0 %",
  },
  {
    name: "System Processes",
    icon: "settings",
    memory: "366.70 MB",
    cpu: "1.8 %",
    gpu: "9.1 %",
  },
  {
    name: "Thunderbird",
    icon: "mail",
    memory: "223.10 MB",
    cpu: "0.0 %",
    gpu: "0.0 %",
  },
];

export const NOW_PLAYING = {
  episode: "UNLOCKED: The Sumud Flotilla Interview feat. Zue Jernstedt",
  show: "Chapo Trap House",
  elapsed: "09:28",
  total: "24:57",
  speed: "1.25\u00d7",
};
