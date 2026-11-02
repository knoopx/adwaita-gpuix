import { defineMeta, defineStory } from "storybook";
import { CONTROL } from "../../theme/adwaita";
import { T } from "../text";
import { Button } from "../Button";
import { Table } from "../Table";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
} from "./Sidebar";
import { HeaderBar } from "./HeaderBar";
import { LocationEntry } from "./LocationEntry";
import {
  FILES_NAV,
  FilesNarrowWindow,
  FilesSidebar,
  ResourcesSidebar,
  SETTINGS_NAV_APPEARANCE,
  SettingsSidebar,
  WINDOWS,
} from "../../../.storybook/app-helpers";

const meta = defineMeta({
  title: "Adwaita/Sidebar",
  component: Sidebar,
  parameters: { width: 217, height: 620 },
});

export default meta;

const noop = () => {};

function FilesNavItems({ disabledId }: { disabledId?: string }) {
  return (
    <>
      {FILES_NAV.map((row) => (
        <SidebarMenuItem
          key={row.id}
          icon={row.icon}
          label={row.label}
          selected={row.id === "home"}
          disabled={row.id === disabledId}
          onClick={noop}
        />
      ))}
    </>
  );
}

export const filesNav = defineStory({
  parameters: { width: 217, height: 470 },
  render: () => <FilesSidebar selected="home" onSelect={noop} />,
});

export const settingsRows = defineStory({
  render: () => (
    <SettingsSidebar selected="appearance" groups={SETTINGS_NAV_APPEARANCE} />
  ),
});

export const resourcesCharts = defineStory({
  parameters: { width: 217, height: 720 },
  render: () => <ResourcesSidebar selected="apps" />,
});

export const railCollapsed = defineStory({
  parameters: {
    width: CONTROL.sidebarRailWidth,
    height: 420,
    source:
      "Nautilus-2.png — the GNOME Files Places rows: Home (selected), Recent, Starred, Network, Trash. Settings-1.png / Resources-1.png — the same pane in Settings and Resources. HIG §12.5 + §25.1: the pane collapses to a rail of icons, no labels, no header text.",
  },
  render: () => (
    <Sidebar open={false}>
      <SidebarContent>
        <SidebarGroup>
          <FilesNavItems />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  ),
});

export const disabledRow = defineStory({
  parameters: {
    width: 217,
    height: 470,
    source:
      "Nautilus-2.png — the same Places list expanded, with the place labelled exactly `Network`; GNOME Files draws that place insensitive when no servers are reachable.",
  },
  render: () => (
    <Sidebar>
      <SidebarHeader>
        <Button variant="icon" size="icon" icon="search" onClick={noop} />
        <T size="title2" weight={600}>
          Files
        </T>
        <Button variant="icon" size="icon" icon="menu" onClick={noop} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <FilesNavItems disabledId="network" />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  ),
});

export const mobileSheet = defineStory({
  parameters: {
    width: WINDOWS.narrow.width,
    height: WINDOWS.narrow.height,
    source:
      "Junction-3.png — the narrow window: flat menu button leading, centred title, close button trailing; Constrict-3.png — the collapsed pane opens below the header bar, over the content only. HIG §25.1.",
  },
  render: () => (
    <FilesNarrowWindow
      size={{ width: WINDOWS.narrow.width, height: WINDOWS.narrow.height }}
    />
  ),
});
