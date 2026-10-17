import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T, Labeled } from "./common";
import { Row, Column } from "./Box";
import { Icon } from "./icons";
import { Button } from "./Button";
import { Input } from "./Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogShowcase,
} from "./Dialog";

const noop = () => {};

function ModalDemo({
  caption,
  title,
  description,
  body,
  footer,
  destructiveFooter,
  showCloseButton = true,
}: {
  caption: string;
  title: string;
  description: string;
  body?: ReactNode;
  footer: ReactNode;
  destructiveFooter?: boolean;
  showCloseButton?: boolean;
}) {
  return (
    <Labeled caption={caption}>
      <Dialog open onOpenChange={noop}>
        <DialogContent showCloseButton={showCloseButton}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {body}
          <DialogFooter destructive={destructiveFooter}>
            {footer}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Labeled>
  );
}

export default defineMeta({
  title: "Adwaita/Dialog",
  component: Dialog,
  parameters: { width: 528, height: 520, frame: false },
});

export const showcase = defineStory({
  render: () => <DialogShowcase />,
});

export const basic = defineStory({
  parameters: { height: 320 },
  render: () => (
    <ModalDemo
      caption="open modal — title + description + footer (auto close button)"
      title="Share project"
      description="Anyone with the link can view this project."
      footer={
        <>
          <Button label="Cancel" onClick={noop} />
          <Button variant="suggested" label="Copy link" onClick={noop} />
        </>
      }
    />
  ),
});

export const destructive = defineStory({
  parameters: { height: 320 },
  render: () => (
    <ModalDemo
      caption="adwaita idiom — destructive action split to the left"
      title="Delete item?"
      description="This action cannot be undone."
      destructiveFooter
      footer={
        <>
          <Button variant="destructive" label="Delete" onClick={noop} />
          <Button label="Cancel" onClick={noop} />
          <Button variant="suggested" label="Save" onClick={noop} />
        </>
      }
    />
  ),
});

export const form = defineStory({
  parameters: { height: 380 },
  render: () => (
    <ModalDemo
      caption="form dialog — inputs inside the card"
      title="New note"
      description="Give the note a title and a body."
      body={
        <Column gap={8}>
          <Input placeholder="Title" />
          <Input placeholder="Body" />
        </Column>
      }
      footer={
        <>
          <Button label="Cancel" onClick={noop} />
          <Button variant="suggested" label="Create" onClick={noop} />
        </>
      }
    />
  ),
});

export function iconHeader() {
  const t = useAdwaita();
  return (
    <Labeled caption="icon header — warning icon beside title">
      <Dialog open onOpenChange={noop}>
        <DialogContent>
          <DialogHeader>
            <Row gap={12} align="center">
              <Icon
                name="warning"
                size={24}
                color={t.colors.warning}
                style={{ pointerEvents: "none" }}
              />
              <Column gap={4}>
                <DialogTitle>Storage full</DialogTitle>
                <DialogDescription>
                  Free up space to continue syncing.
                </DialogDescription>
              </Column>
            </Row>
          </DialogHeader>
          <DialogFooter destructive>
            <Button variant="destructive" label="Delete oldest" onClick={noop} />
            <Button label="Cancel" onClick={noop} />
            <Button variant="suggested" label="Open settings" onClick={noop} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Labeled>
  );
}
iconHeader.parameters = { height: 320 };

export function customClose() {
  const t = useAdwaita();
  return (
    <ModalDemo
      caption="showCloseButton=false — DialogClose in the footer"
      title="Custom close"
      description="The auto close button is disabled; the footer carries a DialogClose."
      showCloseButton={false}
      footer={
        <>
          <DialogClose>
            <T size="caption" color={t.colors.dim_fg}>
              Close
            </T>
          </DialogClose>
          <Button label="Cancel" onClick={noop} />
          <Button variant="suggested" label="Save" onClick={noop} />
        </>
      }
    />
  );
}
customClose.parameters = { height: 320 };
