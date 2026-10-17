import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T, Labeled } from "./common";
import { Column } from "./Box";
import { Button } from "./Button";
import { Entry } from "./Entry";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerShowcase,
  type DrawerSide,
} from "./Drawer";
import {
  PanelStage,
  PanelBody,
  PanelList,
  noop,
} from "./.storybook/story-helpers";

function DrawerPanel({
  side,
  title,
  height,
  children,
}: {
  side: DrawerSide;
  title: string;
  height?: number;
  children?: ReactNode;
}) {
  return (
    <PanelStage height={height}>
      <Drawer open onOpenChange={noop} side={side} contained>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
          {children ?? (
            <PanelBody>
              <T>Panel content.</T>
            </PanelBody>
          )}
          <DrawerFooter>
            <Button label="Close" onClick={noop} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </PanelStage>
  );
}

export default defineMeta({
  title: "Adwaita/Drawer",
  component: DrawerShowcase,
  parameters: { width: 528, height: 820, frame: false },
});

export const showcase = defineStory({
  render: () => <DrawerShowcase />,
});

export const sides = defineStory({
  parameters: { width: 528, height: 1020 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="side=left">
        <DrawerPanel side="left" title="Left drawer" />
      </Labeled>
      <Labeled caption="side=right">
        <DrawerPanel side="right" title="Right drawer" />
      </Labeled>
      <Labeled caption="side=top">
        <DrawerPanel side="top" title="Top drawer" height={200} />
      </Labeled>
      <Labeled caption="side=bottom (drag handle)">
        <DrawerPanel side="bottom" title="Bottom drawer" height={200} />
      </Labeled>
    </Column>
  ),
});

export const withFooter = defineStory({
  parameters: { width: 528, height: 340 },
  render: () => (
    <Labeled caption="inspector — title, description, content, action row footer">
      <PanelStage height={260}>
        <Drawer open onOpenChange={noop} side="right" contained>
          <DrawerContent>
            <DrawerHeader>
              <Column gap={4} style={{ minWidth: 0 }}>
                <DrawerTitle>Inspector</DrawerTitle>
                <DrawerDescription>
                  Details for the selected item.
                </DrawerDescription>
              </Column>
              <DrawerClose />
            </DrawerHeader>
            <PanelBody>
              <T>Item properties go here.</T>
            </PanelBody>
            <DrawerFooter>
              <Button label="Cancel" onClick={noop} />
              <Button variant="suggested" label="Apply" onClick={noop} />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </PanelStage>
    </Labeled>
  ),
});

export function form() {
  const t = useAdwaita();
  return (
    <Labeled caption="form drawer — inputs inside the panel">
      <PanelStage height={280}>
        <Drawer open onOpenChange={noop} side="right" contained>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>New item</DrawerTitle>
              <DrawerClose />
            </DrawerHeader>
            <PanelBody>
              <T size="caption" color={t.colors.dim_fg}>
                Name
              </T>
              <Entry placeholder="Item name" />
              <T size="caption" color={t.colors.dim_fg}>
                Email
              </T>
              <Entry placeholder="name@example.com" type="email" />
            </PanelBody>
            <DrawerFooter>
              <Button label="Cancel" onClick={noop} />
              <Button variant="suggested" label="Create" onClick={noop} />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </PanelStage>
    </Labeled>
  );
}
form.parameters = { width: 528, height: 360 };

export function list() {
  return (
    <Labeled caption="list drawer — many rows in a virtual-list">
      <PanelStage height={320}>
        <Drawer open onOpenChange={noop} side="right" contained>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Items</DrawerTitle>
              <DrawerClose />
            </DrawerHeader>
            <PanelList />
            <DrawerFooter>
              <Button label="Close" onClick={noop} />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </PanelStage>
    </Labeled>
  );
}
list.parameters = { width: 528, height: 400 };

export const bottomSheet = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Labeled caption="bottom drawer — grab handle above the panel content">
      <DrawerPanel side="bottom" title="Bottom drawer" height={200} />
    </Labeled>
  ),
});
