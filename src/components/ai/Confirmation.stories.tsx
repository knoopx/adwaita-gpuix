import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { FullWidth, FullWidthLabeled } from "../.storybook/story-helpers";
import {
  Confirmation,
  ConfirmationTitle,
  ConfirmationActions,
  ConfirmationAction,
} from "./Confirmation";

type ConfirmActionSpec = {
  variant: "suggested" | "secondary" | "destructive";
  icon?: "check" | "close" | "trash";
  label: string;
  onClick?: () => void;
};

function ApprovalActions({ actions }: { actions: ConfirmActionSpec[] }) {
  return (
    <ConfirmationActions>
      {actions.map((a) => (
        <ConfirmationAction
          key={a.label}
          variant={a.variant}
          icon={a.icon}
          label={a.label}
          onClick={a.onClick}
        />
      ))}
    </ConfirmationActions>
  );
}

function ConfirmationCard({
  caption,
  title,
  description,
  actions,
  destructive,
  disabled,
}: {
  caption: string;
  title: string;
  description: string;
  actions: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
}) {
  return (
    <FullWidth>
      <FullWidthLabeled caption={caption}>
        <Confirmation
          state="requested"
          destructive={destructive}
          disabled={disabled}
        >
          <ConfirmationTitle description={description}>{title}</ConfirmationTitle>
          {actions}
        </Confirmation>
      </FullWidthLabeled>
    </FullWidth>
  );
}

const REQUESTED_ACTIONS: ConfirmActionSpec[] = [
  { variant: "suggested", icon: "check", label: "Approve", onClick: () => {} },
  { variant: "secondary", icon: "close", label: "Reject", onClick: () => {} },
];

export default defineMeta({
  title: "Adwaita/Confirmation",
  component: Confirmation,
  parameters: { width: 528, height: 360 },
});

export const requested = defineStory({
  render: () => (
    <ConfirmationCard
      caption="tool approval prompt"
      title='Run "rm -rf dist/"'
      description="rm -rf dist/ and rebuild the output directory."
      actions={<ApprovalActions actions={REQUESTED_ACTIONS} />}
    />
  ),
});

export const plain = defineStory({
  render: () => (
    <ConfirmationCard
      caption="no icons (labels only)"
      title="Install dependencies"
      description="Install 14 packages into the project workspace."
      actions={
        <ApprovalActions
          actions={[
            { variant: "suggested", label: "Approve" },
            { variant: "secondary", label: "Reject" },
          ]}
        />
      }
    />
  ),
});

export const destructive = defineStory({
  render: () => (
    <ConfirmationCard
      caption="destructive card + destructive approve"
      title='Delete project "atlas"'
      description="Permanently removes the project and its build artifacts."
      actions={
        <ApprovalActions
          actions={[
            {
              variant: "destructive",
              icon: "trash",
              label: "Delete",
              onClick: () => {},
            },
            { variant: "secondary", icon: "close", label: "Cancel", onClick: () => {} },
          ]}
        />
      }
      destructive
    />
  ),
});

export const disabled = defineStory({
  render: () => (
    <ConfirmationCard
      caption="disabled (actions inert)"
      title="Publish release 1.4.0"
      description="Publish the release to the registry."
      actions={<ApprovalActions actions={REQUESTED_ACTIONS} />}
      disabled
    />
  ),
});

export const responded = defineStory({
  render: () => (
    <FullWidth>
      <FullWidthLabeled caption="approved, with reason">
        <Confirmation
          state="responded"
          approval={{ approved: true, reason: "user confirmed" }}
        >
          <ConfirmationTitle>Run "rm -rf dist/"</ConfirmationTitle>
        </Confirmation>
      </FullWidthLabeled>
      <FullWidthLabeled caption="rejected">
        <Confirmation
          state="responded"
          approval={{ approved: false, reason: "destructive command" }}
        >
          <ConfirmationTitle>Delete all user data</ConfirmationTitle>
        </Confirmation>
      </FullWidthLabeled>
    </FullWidth>
  ),
});
