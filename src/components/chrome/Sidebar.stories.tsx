import { defineMeta, defineStory } from "storybook";
import { Labeled, T } from "../common";
import { Row, Column } from "../Box";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarMenuItem,
} from "./Sidebar";
import { Stage } from "../.storybook/story-helpers";

function SideContent({ collapsed }: { collapsed: boolean }) {
  return (
    <>
      <SidebarHeader>
        <T size="title3" weight={600}>
          Adwaita
        </T>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel icon={collapsed ? "list" : undefined}>
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuItem icon="home" label="Home" selected />
            <SidebarMenuItem icon="settings" label="Settings" />
            <SidebarMenuItem icon="user" label="Profile" />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel icon={collapsed ? "settings" : undefined}>
            Preferences
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuItem icon="sunMoon" label="Appearance" />
            <SidebarMenuItem icon="list" label="Shortcuts" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem icon="user" label="Ada Lovelace" />
      </SidebarFooter>
    </>
  );
}

export default defineMeta({
  title: "Adwaita/Sidebar",
  component: Sidebar,
  parameters: { width: 528, height: 700 },
});

export const expandedCollapsed = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="expanded (default, 220px)">
        <Sidebar>
          <SideContent collapsed={false} />
        </Sidebar>
      </Labeled>
      <Labeled caption="collapsed (open=false, 56px rail)">
        <Sidebar open={false}>
          <SideContent collapsed />
        </Sidebar>
      </Labeled>
    </Row>
  ),
});

export const mobileSheetOpen = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="mobile sheet · open (contained)">
        <Stage width={340} height={240} radius={12}>
          <Sidebar mobile contained open>
            <SideContent collapsed={false} />
          </Sidebar>
        </Stage>
      </Labeled>
    </Column>
  ),
});

export const mobileSheetClosed = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="mobile sheet · closed">
        <Stage width={340} height={120} radius={12}>
          <Sidebar mobile contained open={false}>
            <SideContent collapsed={false} />
          </Sidebar>
        </Stage>
      </Labeled>
    </Column>
  ),
});

export const disabledRow = defineStory({
  parameters: { width: 280, height: 400 },
  render: () => (
    <Labeled caption="disabled row (dimmed, no click)">
      <Sidebar>
        <SidebarHeader>
          <T size="title3" weight={600}>
            Adwaita
          </T>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>General</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItem icon="home" label="Home" selected />
              <SidebarMenuItem icon="settings" label="Settings" disabled />
              <SidebarMenuItem icon="user" label="Profile" />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Labeled>
  ),
});
