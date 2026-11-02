import { type ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { Labeled, T } from "./text";
import { Column } from "./Box";
import { Button } from "./Button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetShowcase,
  type SheetSide,
  SheetTitle,
} from "./Sheet";
import {
  bottomPanelStory,
  PanelBody,
  PanelFormBody,
  PanelList,
  PanelStage,
  noop,
} from "../../.storybook/story-helpers";

function SheetPanel({
  side,
  title,
  description,
  height,
  children,
  footer,
}: {
  side: SheetSide;
  title: string;
  description?: string;
  height?: number;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <PanelStage height={height}>
      <Sheet open onOpenChange={noop} side={side} contained>
        <SheetContent showCloseButton={false}>
          <SheetHeader>
            {description ? (
              <Column gap={4} style={{ minWidth: 0 }}>
                <SheetTitle>{title}</SheetTitle>
                <SheetDescription>{description}</SheetDescription>
              </Column>
            ) : (
              <SheetTitle>{title}</SheetTitle>
            )}
            <SheetClose />
          </SheetHeader>
          {children ?? (
            <PanelBody>
              <T>Panel content.</T>
            </PanelBody>
          )}
          {footer ? <SheetFooter>{footer}</SheetFooter> : null}
        </SheetContent>
      </Sheet>
    </PanelStage>
  );
}

export default defineMeta({
  title: "Adwaita/Sheet",
  component: SheetShowcase,
  parameters: { width: 528, height: 1180, frame: false },
});

export const showcase = defineStory({
  render: () => <SheetShowcase />,
});

export const withFooter = defineStory({
  parameters: { width: 528, height: 340 },
  render: () => (
    <Labeled caption="inspector — title, description, content, action row footer">
      <SheetPanel
        side="right"
        title="Inspector"
        description="Details for the selected item."
        height={260}
        footer={
          <>
            <Button label="Cancel" onClick={noop} />
            <Button variant="suggested" label="Apply" onClick={noop} />
          </>
        }
      >
        <PanelBody>
          <T>Item properties go here.</T>
        </PanelBody>
      </SheetPanel>
    </Labeled>
  ),
});

export function form() {
  return (
    <Labeled caption="form sheet — inputs inside the panel">
      <SheetPanel
        side="right"
        title="New item"
        height={300}
        footer={
          <>
            <Button label="Cancel" onClick={noop} />
            <Button variant="suggested" label="Create" onClick={noop} />
          </>
        }
      >
        <PanelFormBody />
      </SheetPanel>
    </Labeled>
  );
}
form.parameters = { width: 528, height: 380 };

export function list() {
  return (
    <Labeled caption="list sheet — many rows in a virtual-list">
      <SheetPanel
        side="right"
        title="Items"
        height={320}
        footer={<Button label="Close" onClick={noop} />}
      >
        <PanelList />
      </SheetPanel>
    </Labeled>
  );
}
list.parameters = { width: 528, height: 400 };

export const bottomSheet = defineStory({
  parameters: { width: 528, height: 280 },
  render: () =>
    bottomPanelStory(SheetPanel, {
      caption: "bottom sheet — panel docked to the bottom edge with scrim",
      title: "Bottom sheet",
      body: (
        <PanelBody>
          <T>Panel content docked to the bottom.</T>
        </PanelBody>
      ),
    }),
});
