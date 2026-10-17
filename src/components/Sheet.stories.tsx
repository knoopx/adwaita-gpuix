import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T, Labeled } from "./common";
import { Column } from "./Box";
import { Button } from "./Button";
import { Entry } from "./Entry";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  SheetShowcase,
} from "./Sheet";
import {
  PanelStage,
  PanelBody,
  PanelList,
  noop,
} from "./.storybook/story-helpers";

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
      <PanelStage height={260}>
        <Sheet open onOpenChange={noop} side="right" contained>
          <SheetContent showCloseButton={false}>
            <SheetHeader>
              <Column gap={4} style={{ minWidth: 0 }}>
                <SheetTitle>Inspector</SheetTitle>
                <SheetDescription>
                  Details for the selected item.
                </SheetDescription>
              </Column>
              <SheetClose />
            </SheetHeader>
            <PanelBody>
              <T>Item properties go here.</T>
            </PanelBody>
            <SheetFooter>
              <Button label="Cancel" onClick={noop} />
              <Button variant="suggested" label="Apply" onClick={noop} />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </PanelStage>
    </Labeled>
  ),
});

export function form() {
  const t = useAdwaita();
  return (
    <Labeled caption="form sheet — inputs inside the panel">
      <PanelStage height={300}>
        <Sheet open onOpenChange={noop} side="right" contained>
          <SheetContent showCloseButton={false}>
            <SheetHeader>
              <SheetTitle>New item</SheetTitle>
              <SheetClose />
            </SheetHeader>
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
            <SheetFooter>
              <Button label="Cancel" onClick={noop} />
              <Button variant="suggested" label="Create" onClick={noop} />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </PanelStage>
    </Labeled>
  );
}
form.parameters = { width: 528, height: 380 };

export function list() {
  return (
    <Labeled caption="list sheet — many rows in a virtual-list">
      <PanelStage height={320}>
        <Sheet open onOpenChange={noop} side="right" contained>
          <SheetContent showCloseButton={false}>
            <SheetHeader>
              <SheetTitle>Items</SheetTitle>
              <SheetClose />
            </SheetHeader>
            <PanelList />
            <SheetFooter>
              <Button label="Close" onClick={noop} />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </PanelStage>
    </Labeled>
  );
}
list.parameters = { width: 528, height: 400 };

export const bottomSheet = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Labeled caption="bottom sheet — panel docked to the bottom edge with scrim">
      <PanelStage height={200}>
        <Sheet open onOpenChange={noop} side="bottom" contained>
          <SheetContent showCloseButton={false}>
            <SheetHeader>
              <SheetTitle>Bottom sheet</SheetTitle>
              <SheetClose />
            </SheetHeader>
            <PanelBody>
              <T>Panel content docked to the bottom.</T>
            </PanelBody>
          </SheetContent>
        </Sheet>
      </PanelStage>
    </Labeled>
  ),
});
