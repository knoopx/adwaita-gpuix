import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled } from "./common";
import { Column } from "./Box";
import { Icon } from "./icons";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  MessageDialog,
} from "./AlertDialog";

export default defineMeta({
  title: "Adwaita/AlertDialog",
  component: AlertDialog,
  parameters: { width: 528, height: 400 },
});

export const flat = defineStory({
  parameters: { height: 540 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="destructive + default actions">
        <AlertDialog
          heading="Delete item?"
          body="This action cannot be undone."
          actions={[
            { label: "Delete", variant: "destructive", onClick: () => {} },
            { label: "Cancel", variant: "default", onClick: () => {} },
          ]}
        />
      </Labeled>
      <Labeled caption="suggested action, size sm">
        <AlertDialog
          size="sm"
          heading="Heads up"
          body="A plain message dialog."
          actions={[{ label: "OK", variant: "suggested", onClick: () => {} }]}
        />
      </Labeled>
    </Column>
  ),
});

export const basic = defineStory({
  parameters: { height: 280 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="basic — title + body + suggested action">
        <AlertDialog
          heading="Heads up"
          body="A plain message dialog."
          actions={[{ label: "OK", variant: "suggested", onClick: () => {} }]}
        />
      </Labeled>
    </Column>
  ),
});

export const noActions = defineStory({
  parameters: { height: 240 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="no actions — informational only">
        <AlertDialog
          heading="Synced"
          body="Your library is up to date. No action is needed."
        />
      </Labeled>
    </Column>
  ),
});

export const multiAction = defineStory({
  parameters: { height: 360 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="multiple actions — suggested + default + destructive">
        <AlertDialog
          heading="Update available"
          body="A newer version is ready to install."
          actions={[
            { label: "Update now", variant: "suggested", onClick: () => {} },
            { label: "Remind me later", variant: "default", onClick: () => {} },
            { label: "Uninstall", variant: "destructive", onClick: () => {} },
          ]}
        />
      </Labeled>
    </Column>
  ),
});

export function media() {
  const t = useAdwaita();
  return (
    <Column gap={16} align="center">
      <Labeled caption="with media (size default)">
        <AlertDialog
          media={<Icon name="warning" size={32} color={t.colors.warning} />}
          heading="Storage full"
          body="Free up space to continue syncing."
          actions={[
            {
              label: "Open settings",
              variant: "suggested",
              onClick: () => {},
            },
          ]}
        />
      </Labeled>
    </Column>
  );
}
media.parameters = { height: 340 };

export const longText = defineStory({
  parameters: { height: 320 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="long title + description (wrapping)">
        <AlertDialog
          heading="This is a long dialog title that should wrap across multiple lines"
          body="This is a long description that wraps across several lines to show how the dialog keeps extended text centred and readable."
          actions={[{ label: "Got it", variant: "suggested", onClick: () => {} }]}
        />
      </Labeled>
    </Column>
  ),
});

export const compound = defineStory({
  parameters: { height: 500 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="Header / Footer / Action / Cancel">
        <AlertDialog>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction label="Delete" variant="destructive" />
            <AlertDialogCancel label="Cancel" />
          </AlertDialogFooter>
        </AlertDialog>
      </Labeled>
      <Labeled caption="disabled actions">
        <AlertDialog heading="Confirm" body="Both actions are disabled.">
          <AlertDialogFooter>
            <AlertDialogAction label="Confirm" disabled />
            <AlertDialogCancel label="Cancel" disabled />
          </AlertDialogFooter>
        </AlertDialog>
      </Labeled>
    </Column>
  ),
});

export const messageDialog = defineStory({
  parameters: { height: 280 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="alias of AlertDialog">
        <MessageDialog
          heading="Heads up"
          body="A plain message dialog."
          actions={[{ label: "OK", variant: "suggested", onClick: () => {} }]}
        />
      </Labeled>
    </Column>
  ),
});

export const openOverlay = defineStory({
  parameters: { height: 420 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="open modal — scrim + centred card">
        <AlertDialog
          open
          onOpenChange={() => {}}
          heading="Confirm"
          body="This action cannot be undone."
          actions={[
            { label: "Confirm", variant: "suggested", onClick: () => {} },
            { label: "Cancel", variant: "default", onClick: () => {} },
          ]}
        />
      </Labeled>
    </Column>
  ),
});
