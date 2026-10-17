import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Row, Column } from "./Box";
import { Icon, type IconName } from "./icons";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./Collapsible";

function Frame({
  bordered,
  children,
  style,
}: {
  bordered?: boolean;
  children: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.spacing.gap,
        borderRadius: t.radii.card,
        padding: t.spacing.gap,
        ...(bordered
          ? { borderWidth: 1, borderColor: t.colors.border }
          : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Section({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <Column gap={t.spacing.gap} style={{ width: "100%" }}>
      <T size="caption" color={t.colors.dim_fg}>
        {caption}
      </T>
      {children}
    </Column>
  );
}

function TitleDescription({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const t = useAdwaita();
  return (
    <>
      <T size="body" weight={700}>
        {title}
      </T>
      <T size="caption" color={t.colors.dim_fg}>
        {description}
      </T>
    </>
  );
}

function IconLabel({ icon, label }: { icon: IconName; label: string }) {
  const t = useAdwaita();
  return (
    <Row gap={t.spacing.gap} align="center">
      <Icon
        name={icon}
        size={16}
        color={t.colors.dim_fg}
        style={{ pointerEvents: "none" }}
      />
      <T size="body" weight={700}>
        {label}
      </T>
    </Row>
  );
}

type CollSpec = { label: string; content: string; icon?: IconName };

function StackedCollapsibles({
  items,
  bordered,
}: {
  items: CollSpec[];
  bordered?: boolean;
}) {
  const t = useAdwaita();
  return (
    <>
      {items.map((item, i) => (
        <Collapsible
          key={item.label}
          open={i === 0}
          onOpenChange={() => {}}
          style={
            bordered
              ? {
                  borderWidth: 1,
                  borderColor: t.colors.border,
                  borderRadius: t.radii.card,
                  padding: t.spacing.gap,
                }
              : undefined
          }
        >
          <CollapsibleTrigger>
            {item.icon ? (
              <IconLabel icon={item.icon} label={item.label} />
            ) : (
              <T>{item.label}</T>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <T>{item.content}</T>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </>
  );
}

export default defineMeta({
  title: "Adwaita/Collapsible",
  component: Collapsible,
  parameters: { width: 528, height: 320 },
});

export const states = defineStory({
  render: () => (
    <Row gap={16} align="start" style={{ width: "100%" }}>
      <Labeled caption="open (chevron points up)" style={{ flexGrow: 1 }}>
        <Frame>
          <Collapsible open onOpenChange={() => {}}>
            <CollapsibleTrigger>
              <T>Open section</T>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <T>Content is visible — chevron flipped to point up.</T>
            </CollapsibleContent>
          </Collapsible>
        </Frame>
      </Labeled>
      <Labeled caption="closed (content hidden)" style={{ flexGrow: 1 }}>
        <Frame>
          <Collapsible open={false} onOpenChange={() => {}}>
            <CollapsibleTrigger>
              <T>Closed section</T>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <T>Hidden content — not rendered.</T>
            </CollapsibleContent>
          </Collapsible>
        </Frame>
      </Labeled>
    </Row>
  ),
});

export const titleDescription = defineStory({
  parameters: { height: 220 },
  render: () => (
    <Section caption="title + description header, open">
      <Frame>
        <Collapsible open onOpenChange={() => {}}>
          <CollapsibleTrigger>
            <TitleDescription
              title="Notification settings"
              description="Choose when and how you are alerted"
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <T>
              Enable email alerts for updates, push notifications for
              mentions, and a weekly digest of activity.
            </T>
          </CollapsibleContent>
        </Collapsible>
      </Frame>
    </Section>
  ),
});

const ICON_ITEMS: { icon: IconName; label: string; content: string }[] = [
  {
    icon: "bell",
    label: "Notifications",
    content:
      "Manage how you receive notifications: email, push, or both.",
  },
  {
    icon: "user",
    label: "Account",
    content:
      "Update your profile, change your password, and manage linked services.",
  },
  {
    icon: "settings",
    label: "Preferences",
    content:
      "Adjust appearance, language, and accessibility options.",
  },
];

export const withIcon = defineStory({
  parameters: { height: 280 },
  render: () => (
    <Section caption="icon + label headers, first open">
      <Frame>
        <StackedCollapsibles items={ICON_ITEMS} />
      </Frame>
    </Section>
  ),
});

const STACKED_ITEMS: { label: string; content: string }[] = [
  {
    label: "Getting started",
    content:
      "Create your account, invite your team, and configure your first project.",
  },
  {
    label: "Billing and subscriptions",
    content:
      "View invoices, update your payment method, and manage your plan.",
  },
  {
    label: "Privacy and security",
    content:
      "Review data retention, sessions, and two-factor authentication.",
  },
];

export const stacked = defineStory({
  parameters: { height: 260 },
  render: () => (
    <Section caption="independent collapsibles stacked (first open)">
      <Frame>
        <StackedCollapsibles items={STACKED_ITEMS} />
      </Frame>
    </Section>
  ),
});

export function bordered() {
  const t = useAdwaita();
  return (
    <Section caption="with border, first open">
      <Column gap={t.spacing.gap}>
        <StackedCollapsibles
          bordered
          items={[
            {
              label: "Payment methods",
              content:
                "Manage the cards and bank accounts used for your subscription.",
            },
            {
              label: "Team members",
              content: "Invite and manage the people on your team.",
            },
          ]}
        />
      </Column>
    </Section>
  );
}

export const disabled = defineStory({
  render: () => (
    <Section caption="disabled (dimmed, not interactive)">
      <Frame>
        <Collapsible disabled>
          <CollapsibleTrigger>
            <T>Premium features</T>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <T>
              This section is disabled — the trigger is dimmed and does not
              respond to input.
            </T>
          </CollapsibleContent>
        </Collapsible>
      </Frame>
    </Section>
  ),
});

export const longContent = defineStory({
  parameters: { height: 260 },
  render: () => (
    <Section caption="long trigger and content text, open">
      <Frame>
        <Collapsible open onOpenChange={() => {}}>
          <CollapsibleTrigger>
            <T>
              What happens to my data, backups, and team seats when I
              downgrade from the Enterprise plan to the Starter plan at the
              end of the billing cycle?
            </T>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <T>
              Your data stays intact. Backups older than 90 days are
              archived, and team seats above the Starter limit are
              deactivated until the next upgrade — you can re-activate them
              at any time. Invoices and audit logs remain available in the
              billing section of your account, and you will receive a
              confirmation email once the downgrade takes effect.
            </T>
          </CollapsibleContent>
        </Collapsible>
      </Frame>
    </Section>
  ),
});
