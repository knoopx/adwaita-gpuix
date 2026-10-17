import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./common";
import { Column } from "./Box";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./Tabs";

export default defineMeta({
  title: "Adwaita/Tabs",
  component: Tabs,
  parameters: { width: 528, height: 320 },
});

function Sample({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        backgroundColor: t.colors.view_bg,
      }}
    >
      <T size="caption" color={t.colors.dim_fg}>
        {label}
      </T>
      {children}
    </div>
  );
}

export const horizontal = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Sample label="selected + closable + icon">
        <Tabs
          items={[
            { id: "a", label: "General", icon: "settings" },
            { id: "b", label: "Files", icon: "list", closable: true },
            { id: "c", label: "Advanced", icon: "grid" },
          ]}
          value="a"
          onSelect={() => {}}
          onClose={() => {}}
        />
      </Sample>
      <Sample label="uncontrolled (defaultValue)">
        <Tabs
          items={[
            { id: "x", label: "One" },
            { id: "y", label: "Two" },
          ]}
          defaultValue="y"
          onSelect={() => {}}
        />
      </Sample>
    </Column>
  ),
});

export const vertical = defineStory({
  render: () => (
    <Column gap={16} align="center" justify="center" style={{ height: 320 }}>
      <Sample label="right-edge pill (vertical bar)">
        <Tabs
          orientation="vertical"
          style={{ justifyContent: "center" }}
          items={[
            { id: "a", label: "General" },
            { id: "b", label: "Files" },
            { id: "c", label: "Advanced" },
          ]}
          value="b"
          onSelect={() => {}}
        />
      </Sample>
    </Column>
  ),
});

export const compound = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Sample label="controlled value + content below">
        <Tabs value="a" onSelect={() => {}}>
          <TabsList>
            <TabsTrigger value="a">Account</TabsTrigger>
            <TabsTrigger value="b">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="a">
            <T>Account panel content.</T>
          </TabsContent>
          <TabsContent value="b">
            <T>Password panel content.</T>
          </TabsContent>
        </Tabs>
      </Sample>
    </Column>
  ),
});

export const disabled = defineStory({
  parameters: { width: 528, height: 200 },
  render: () => (
    <Column gap={16} align="center">
      <Sample label="disabled tab (dim, no hover, no close)">
        <Tabs
          items={[
            { id: "a", label: "General", icon: "settings" },
            { id: "b", label: "Files", icon: "list", closable: true, disabled: true },
            { id: "c", label: "Advanced", icon: "grid" },
          ]}
          value="a"
          onSelect={() => {}}
          onClose={() => {}}
        />
      </Sample>
    </Column>
  ),
});
