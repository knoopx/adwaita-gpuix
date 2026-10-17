import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Row, Column } from "./Box";
import { Card, CardTitle, CardDescription, Frame } from "./Card";
import { Icon, type IconName } from "./icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./Accordion";

const LAYOUT: Partial<StyleDesc> = { maxWidth: 512 };

function Section({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <Column gap={16} align="center" style={{ width: "100%" }}>
      <Labeled caption={caption}>{children}</Labeled>
    </Column>
  );
}

function ItemBody({
  item,
  dimContent,
}: {
  item: { trigger: string; content: string };
  dimContent?: boolean;
}) {
  const t = useAdwaita();
  return (
    <>
      <AccordionTrigger>
        <T size="body" weight={700}>
          {item.trigger}
        </T>
      </AccordionTrigger>
      <AccordionContent>
        <T size="body" color={dimContent ? t.colors.dim_fg : undefined}>
          {item.content}
        </T>
      </AccordionContent>
    </>
  );
}

type AccordionItemSpec = { value: string; trigger: string; content: string };

const SHIPPING_ITEMS: AccordionItemSpec[] = [
  {
    value: "shipping",
    trigger: "What are your shipping options?",
    content:
      "We offer standard (5–7 days), express (2–3 days), and overnight shipping. Free shipping on international orders.",
  },
  {
    value: "returns",
    trigger: "What is your return policy?",
    content:
      "You can return any item within 30 days of purchase for a full refund.",
  },
  {
    value: "support",
    trigger: "How can I contact customer support?",
    content:
      "Reach us by email, live chat, or phone — we respond within 24 hours.",
  },
];

const SHIPPING_ITEMS_CLOSED: AccordionItemSpec[] = [
  {
    value: "shipping",
    trigger: "What are your shipping options?",
    content:
      "We offer standard (5–7 days), express (2–3 days), and overnight shipping.",
  },
  {
    value: "returns",
    trigger: "What is your return policy?",
    content:
      "You can return any item within 30 days of purchase for a full refund.",
  },
  {
    value: "support",
    trigger: "How can I contact customer support?",
    content:
      "Reach us by email, live chat, or phone — we respond within 24 hours.",
  },
];

const SETTINGS_ITEMS: AccordionItemSpec[] = [
  {
    value: "notifications",
    trigger: "Notification Settings",
    content:
      "Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.",
  },
  {
    value: "privacy",
    trigger: "Privacy & Security",
    content: "Control your data, sessions, and two-factor authentication.",
  },
  {
    value: "billing",
    trigger: "Billing & Subscription",
    content: "Manage your payment method and download invoices.",
  },
];

function renderAccordionItems(items: AccordionItemSpec[]) {
  return items.map((item) => (
    <AccordionItem key={item.value} value={item.value}>
      <ItemBody item={item} />
    </AccordionItem>
  ));
}

function PlainAccordion({
  caption,
  type = "single",
  value = "",
  items,
}: {
  caption: string;
  type?: "single" | "multiple";
  value?: string | string[];
  items: AccordionItemSpec[];
}) {
  return (
    <Section caption={caption}>
      <Accordion
        type={type}
        value={value}
        onValueChange={() => {}}
        style={LAYOUT}
      >
        {renderAccordionItems(items)}
      </Accordion>
    </Section>
  );
}

function Border() {
  const t = useAdwaita();
  const items = [
    {
      value: "billing",
      trigger: "How does billing work?",
      content:
        "We offer monthly and annual subscription plans. Billing is charged at the beginning of each cycle, and you can cancel anytime. All plans include automatic backups, 24/7 support, and unlimited team members.",
    },
    {
      value: "security",
      trigger: "Is my data secure?",
      content:
        "Yes. We use end-to-end encryption, SOC 2 Type II compliance, and regular third-party security audits.",
    },
    {
      value: "integration",
      trigger: "What integrations do you support?",
      content:
        "We integrate with 500+ popular tools including Slack, Zapier, Salesforce, HubSpot, and more.",
    },
  ];
  return (
    <Accordion
      type="single"
      value="billing"
      onValueChange={() => {}}
      style={{ ...LAYOUT, gap: t.spacing.gap }}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          style={{
            borderWidth: 1,
            borderColor: t.colors.border,
            borderRadius: t.radii.row,
          }}
        >
          <ItemBody item={item} dimContent />
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function CardDemo() {
  const items = [
    {
      value: "plans",
      trigger: "What subscription plans do you offer?",
      content:
        "We offer three subscription tiers: Starter, Professional, and Enterprise. Each plan includes increasing storage limits, API access, priority support, and team collaboration features.",
    },
    {
      value: "billing",
      trigger: "How does billing work?",
      content:
        "Billing occurs automatically at the start of each billing cycle. We accept all major credit cards, PayPal, and ACH transfers.",
    },
    {
      value: "cancel",
      trigger: "How do I cancel my subscription?",
      content:
        "You can cancel your subscription anytime from your account settings. There are no cancellation fees or penalties.",
    },
  ];
  return (
    <Card style={LAYOUT}>
      <CardTitle>Subscription &amp; Billing</CardTitle>
      <CardDescription>
        Common questions about your account, plans, payments and
        cancellations.
      </CardDescription>
      <Accordion type="single" value="plans" onValueChange={() => {}}>
        {renderAccordionItems(items)}
      </Accordion>
    </Card>
  );
}

function Disabled() {
  const t = useAdwaita();
  const { colors } = t;
  const items = [
    {
      value: "history",
      trigger: "Can I access my account history?",
      content:
        "Yes, you can view your complete account history including all transactions, plan changes, and support tickets in the Account History section of your dashboard.",
      disabled: false,
    },
    {
      value: "premium",
      trigger: "Premium feature information",
      content:
        "This section contains information about premium features. Upgrade your plan to access this content.",
      disabled: true,
    },
    {
      value: "email",
      trigger: "How do I update my email address?",
      content:
        "You can update your email address in your account settings. You'll receive a verification email at your new address to confirm the change.",
      disabled: false,
    },
  ];
  return (
    <Accordion
      type="single"
      value=""
      onValueChange={() => {}}
      style={{
        ...LAYOUT,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
      }}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          style={{
            padding: 4,
          }}
        >
          <ItemBody item={item} />
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function IconLabel({
  icon,
  label,
}: {
  icon: IconName;
  label: string;
}) {
  const t = useAdwaita();
  return (
    <Row gap={8} align="center">
      <Icon name={icon} size={16} color={t.colors.dim_fg} />
      <T size="body" weight={700}>
        {label}
      </T>
    </Row>
  );
}

export default defineMeta({
  title: "Adwaita/Accordion",
  component: Accordion,
  parameters: { width: 528, height: 360 },
});

export const single = defineStory({
  render: () => (
    <PlainAccordion
      caption="shipping open, return policy + support closed"
      value="shipping"
      items={SHIPPING_ITEMS}
    />
  ),
});

export const multiple = defineStory({
  render: () => (
    <PlainAccordion
      caption="notification settings open"
      type="multiple"
      value={["notifications"]}
      items={SETTINGS_ITEMS}
    />
  ),
});

export const withBorders = defineStory({
  render: () => (
    <Section caption="billing open, security + integrations closed">
      <Border />
    </Section>
  ),
});

export const inCard = defineStory({
  render: () => (
    <Section caption="plans open, billing + cancel closed">
      <CardDemo />
    </Section>
  ),
});

export const withDisabled = defineStory({
  render: () => (
    <Section caption="all closed, premium item disabled">
      <Disabled />
    </Section>
  ),
});

export const allClosed = defineStory({
  render: () => (
    <PlainAccordion caption="all items closed" items={SHIPPING_ITEMS_CLOSED} />
  ),
});

export const multipleSeveralOpen = defineStory({
  render: () => (
    <PlainAccordion
      caption="two items open at once (multiple type)"
      type="multiple"
      value={["notifications", "privacy"]}
      items={SETTINGS_ITEMS}
    />
  ),
});

export const iconLabels = defineStory({
  render: () => {
    const items: { value: string; icon: IconName; trigger: string; content: string }[] = [
      {
        value: "notifications",
        icon: "bell",
        trigger: "Notification Settings",
        content:
          "Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.",
      },
      {
        value: "account",
        icon: "user",
        trigger: "Account",
        content:
          "Update your profile, change your password, and manage linked services.",
      },
      {
        value: "preferences",
        icon: "settings",
        trigger: "Preferences",
        content:
          "Adjust appearance, language, and accessibility options.",
      },
      {
        value: "about",
        icon: "info",
        trigger: "About",
        content:
          "Version information, credits, and license details.",
      },
    ];
    return (
      <Section caption="icon + label triggers, first item open">
        <Accordion type="single" value="notifications" onValueChange={() => {}}
          style={LAYOUT}
        >
          {items.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>
                <IconLabel icon={item.icon} label={item.trigger} />
              </AccordionTrigger>
              <AccordionContent>
                <T size="body">{item.content}</T>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    );
  },
});

export const longText = defineStory({
  render: () => (
    <Section caption="very long trigger and content text">
      <Accordion type="single" value="long" onValueChange={() => {}}
        style={LAYOUT}
      >
        <AccordionItem value="long">
          <AccordionTrigger>
            <T size="body" weight={700}>
              What happens to my data, backups, and team seats when I
              downgrade from the Enterprise plan to the Starter plan at the
              end of the billing cycle?
            </T>
          </AccordionTrigger>
          <AccordionContent>
            <T size="body">
              Your data stays intact. Backups older than 90 days are
              archived, and team seats above the Starter limit are
              deactivated until the next upgrade — you can re-activate them
              at any time. Invoices and audit logs remain available in the
              billing section of your account, and you will receive a
              confirmation email once the downgrade takes effect.
            </T>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Section>
  ),
});

export const manyItems = defineStory({
  render: () => {
    const items = [
      { value: "a", label: "Getting started" },
      { value: "b", label: "Billing and subscriptions" },
      { value: "c", label: "Team management" },
      { value: "d", label: "Notifications" },
      { value: "e", label: "Privacy and security" },
      { value: "f", label: "Integrations" },
      { value: "g", label: "Developer API" },
      { value: "h", label: "Support and contact" },
    ];
    return (
      <Section caption="eight closed items">
        <Accordion type="single" value="" onValueChange={() => {}}
          style={LAYOUT}
        >
          {items.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>
                <T size="body" weight={700}>
                  {item.label}
                </T>
              </AccordionTrigger>
              <AccordionContent>
                <T size="body">Content for {item.label}.</T>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    );
  },
});

export function empty() {
  const t = useAdwaita();
  return (
    <Section caption="no items (empty state)">
      <Frame
        style={{
          ...LAYOUT,
          display: "flex",
          flexDirection: "column",
          minHeight: 48,
          padding: t.spacing.paddingTight,
        }}
      >
        <Accordion type="single" value="" onValueChange={() => {}} />
      </Frame>
    </Section>
  );
}
