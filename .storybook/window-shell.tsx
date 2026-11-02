import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../src/theme/adwaita";
import { T } from "../src/components/text";
import { Button } from "../src/components/Button";
import { type IconName } from "../src/components/icons";
import { HeaderBar } from "../src/components/chrome/HeaderBar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
} from "../src/components/chrome/Sidebar";
import {
  ViewSwitcher,
  type ViewSwitcherItem,
} from "../src/components/chrome/ViewSwitcher";

const noop = () => {};

export interface NavRow {
  id: string;
  label: string;
  icon?: IconName;
}

export type NavGroups = NavRow[][];

export function WindowShell({
  size,
  radius,
  style,
  children,
}: {
  size: { width: number; height: number };
  radius?: number;
  style?: Partial<StyleDesc>;
  children: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: size.width,
        height: size.height,
        borderRadius: radius ?? t.radius.shell,
        backgroundColor: t.color.surface.window,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function WindowBody({
  children,
  style,
}: {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        minHeight: 0,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function PaneBody({
  children,
  bg,
  style,
}: {
  children: ReactNode;
  bg?: string;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: 0,
        minWidth: 0,
        backgroundColor: bg ?? t.color.surface.window,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function NavSidebarHeader({
  title,
  leadingIcon = "search",
  trailingIcon = "menu",
  leading,
}: {
  title?: string;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  leading?: ReactNode;
}) {
  return (
    <SidebarHeader>
      {leading ?? (
        <Button variant="icon" size="icon" icon={leadingIcon} onClick={noop} />
      )}
      {title ? (
        <T size="title2" weight={600}>
          {title}
        </T>
      ) : null}
      <Button variant="icon" size="icon" icon={trailingIcon} onClick={noop} />
    </SidebarHeader>
  );
}

export function NavGroupList({
  groups,
  selected,
  onSelect,
  renderItem,
}: {
  groups: NavGroups;
  selected?: string;
  onSelect?: (id: string) => void;
  renderItem?: (row: NavRow) => ReactNode;
}) {
  return (
    <>
      {groups.map((group, gi) => (
        <SidebarGroup key={group[0]?.id ?? gi}>
          {group.map((row) =>
            renderItem ? (
              renderItem(row)
            ) : (
              <SidebarMenuItem
                key={row.id}
                icon={row.icon}
                label={row.label}
                selected={row.id === selected}
                onClick={() => (onSelect ?? noop)(row.id)}
              />
            ),
          )}
        </SidebarGroup>
      ))}
    </>
  );
}

export function NavSidebar({
  title,
  header,
  groups = [],
  selected,
  onSelect,
  renderItem,
  content,
  leadingIcon,
  trailingIcon,
  mobile,
  contained,
  open,
}: {
  title?: string;
  header?: ReactNode;
  groups?: NavGroups;
  selected?: string;
  onSelect?: (id: string) => void;
  renderItem?: (row: NavRow) => ReactNode;
  content?: ReactNode;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  mobile?: boolean;
  contained?: boolean;
  open?: boolean;
}) {
  return (
    <Sidebar mobile={mobile} contained={contained} open={open}>
      {header ?? (
        <NavSidebarHeader
          title={title}
          leadingIcon={leadingIcon}
          trailingIcon={trailingIcon}
        />
      )}
      <SidebarContent>
        {content ?? (
          <NavGroupList
            groups={groups}
            selected={selected}
            onSelect={onSelect}
            renderItem={renderItem}
          />
        )}
      </SidebarContent>
    </Sidebar>
  );
}

export function SidebarPane({
  title,
  leadingIcon = "search",
  trailingIcon = "menu",
  groups,
  selected,
  header,
  content,
}: {
  title?: string;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  groups?: NavGroups;
  selected?: string;
  header?: ReactNode;
  content?: ReactNode;
}) {
  return (
    <NavSidebar
      title={title}
      header={header}
      leadingIcon={leadingIcon}
      trailingIcon={trailingIcon}
      groups={groups}
      selected={selected}
      content={content}
    />
  );
}

export function ContentHeader({
  title,
  caret,
  view,
  viewValue,
  left,
  right,
  trailingIcons = ["menu", "close"],
}: {
  title?: string;

  caret?: boolean;
  view?: ViewSwitcherItem[];
  viewValue?: string;
  left?: ReactNode;
  right?: ReactNode;
  trailingIcons?: IconName[];
}) {
  return (
    <HeaderBar
      center={
        view ? (
          <ViewSwitcher
            items={view}
            value={viewValue ?? view[0].id}
            onChange={noop}
          />
        ) : (
          <T size="title3" weight={700}>
            {title ?? ""}
          </T>
        )
      }
      left={left}
      right={
        <>
          {right}
          {trailingIcons.map((icon) => (
            <Button
              key={icon}
              variant="icon"
              size="icon"
              icon={icon}
              onClick={noop}
            />
          ))}
        </>
      }
    />
  );
}

export function SettingsWindow({
  size,
  nav,
  selected,
  header,
  children,
}: {
  size: { width: number; height: number };
  nav: NavGroups;
  selected: string;
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <WindowShell size={size}>
      <WindowBody>
        <SidebarPane title="Settings" groups={nav} selected={selected} />
        <PaneBody>
          {header}
          {children}
        </PaneBody>
      </WindowBody>
    </WindowShell>
  );
}

const SETTINGS_CONNECTIVITY: NavRow[] = [
  { id: "network", label: "Network", icon: "networkNode" },
  { id: "bluetooth", label: "Bluetooth", icon: "bluetooth" },
];

const SETTINGS_SYSTEM: NavRow[] = [
  { id: "displays", label: "Displays", icon: "monitor" },
  { id: "sound", label: "Sound", icon: "volumeUp" },
  { id: "power", label: "Power", icon: "powerSettingsNew" },
  { id: "multitasking", label: "Multitasking", icon: "layers" },
  { id: "appearance", label: "Appearance", icon: "darkMode" },
  { id: "apps", label: "Apps", icon: "gridView" },
];

const SETTINGS_ACCOUNTS: NavRow[] = [
  { id: "notifications", label: "Notifications", icon: "notifications" },
  { id: "search", label: "Search", icon: "search" },
  { id: "accounts", label: "Online Accounts", icon: "globe" },
  { id: "sharing", label: "Sharing", icon: "share" },
];

const SETTINGS_APPS_TOP: NavRow[] = [
  { id: "apps", label: "Apps", icon: "gridView" },
  ...SETTINGS_ACCOUNTS,
];

const SETTINGS_INPUT_DEVICES: NavRow[] = [
  { id: "mouse", label: "Mouse & Touchpad", icon: "monitoring" },
  { id: "keyboard", label: "Keyboard", icon: "textFormat" },
  { id: "color", label: "Color", icon: "autoAwesome" },
  { id: "printers", label: "Printers", icon: "monitor" },
];

const SETTINGS_PRIVACY: NavRow[] = [
  { id: "accessibility", label: "Accessibility", icon: "person" },
  { id: "privacy", label: "Privacy & Security", icon: "key" },
  { id: "system", label: "System", icon: "settings" },
];

export const SETTINGS_NAV_APPEARANCE: NavGroups = [
  SETTINGS_CONNECTIVITY,
  SETTINGS_SYSTEM,
  SETTINGS_ACCOUNTS,
];

export const SETTINGS_NAV_SOUND: NavGroups = [
  [{ id: "wifi", label: "Wi-Fi", icon: "wifi" }, ...SETTINGS_CONNECTIVITY],
  SETTINGS_SYSTEM,
  SETTINGS_ACCOUNTS.slice(0, 3),
];

export const SETTINGS_NAV_INPUT: NavGroups = [
  SETTINGS_APPS_TOP,
  SETTINGS_INPUT_DEVICES,
  SETTINGS_PRIVACY,
];
