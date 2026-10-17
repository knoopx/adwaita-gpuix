import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import {
  AdwaitaProvider,
  useAdwaita,
  type AdwaitaTheme,
} from "../theme/adwaita";
import { Labeled } from "./common";
import { Row, Column } from "./Box";
import { Avatar, AvatarBadge, AvatarGroup, AvatarGroupCount } from "./Avatar";
import { ICONS } from "./icons";

function photoSrc(t: AdwaitaTheme): string {
  const inner = ICONS.user
    .replace(/^<svg[^>]*>/, "")
    .replace("</svg>", "")
    .replace(/currentColor/g, t.colors.accent);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">` +
    `<circle cx="12" cy="12" r="12" fill="${t.colors.accentTint}"/>` +
    `<g fill="none" stroke="${t.colors.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="translate(5.2 5.2) scale(0.5667)">${inner}</g>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function LabeledAvatar({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return <Labeled caption={caption}>{children}</Labeled>;
}

export default defineMeta({
  title: "Adwaita/Avatar",
  component: Avatar,
  parameters: { width: 528, height: 320 },
});

export const sizes = defineStory({
  render: () => (
    <Row gap={16} align="start">
      <LabeledAvatar caption="24">
        <Avatar name="Ada Lovelace" size={24} />
      </LabeledAvatar>
      <LabeledAvatar caption="32">
        <Avatar name="Grace Hopper" size={32} />
      </LabeledAvatar>
      <LabeledAvatar caption="48">
        <Avatar name="Alan Turing" size={48} />
      </LabeledAvatar>
      <LabeledAvatar caption="64">
        <Avatar name="Katherine J." size={64} />
      </LabeledAvatar>
    </Row>
  ),
});

export function photoBadge() {
  const t = useAdwaita();
  const photo = photoSrc(t);
  return (
    <Row gap={16} align="start">
      <Labeled caption="src (photo)">
        <Avatar name="Photo User" size={48} src={photo} />
      </Labeled>
      <Labeled caption="with badge (default)">
        <div style={{ position: "relative", width: 48, height: 48 }}>
          <Avatar name="Ada Lovelace" size={48} />
          <AvatarBadge />
        </div>
      </Labeled>
      <Labeled caption="with badge (success colour)">
        <div style={{ position: "relative", width: 48, height: 48 }}>
          <Avatar name="Grace Hopper" size={48} />
          <AvatarBadge color={t.colors.success} size={14} />
        </div>
      </Labeled>
    </Row>
  );
}

export const icon = defineStory({
  render: () => (
    <Row gap={16} align="start">
      <LabeledAvatar caption="icon (user)">
        <Avatar name="Ada Lovelace" size={48} icon="user" />
      </LabeledAvatar>
      <LabeledAvatar caption="icon (settings)">
        <Avatar name="Build bot" size={48} icon="settings" />
      </LabeledAvatar>
      <LabeledAvatar caption="empty (no name)">
        <Avatar name="" size={48} />
      </LabeledAvatar>
      <LabeledAvatar caption="empty + ring">
        <Avatar name="" size={48} ring />
      </LabeledAvatar>
    </Row>
  ),
});

export function status() {
  const t = useAdwaita();
  const dot = (color: string) => (
    <div style={{ position: "relative", width: 48, height: 48 }}>
      <Avatar name="Ada Lovelace" size={48} />
      <AvatarBadge color={color} size={14} />
    </div>
  );
  return (
    <Row gap={16} align="start">
      <Labeled caption="online">{dot(t.colors.success)}</Labeled>
      <Labeled caption="away">{dot(t.colors.warning)}</Labeled>
      <Labeled caption="busy">{dot(t.colors.destructive)}</Labeled>
      <Labeled caption="offline">{dot(t.colors.dim_fg)}</Labeled>
    </Row>
  );
}

export function ringDisabled() {
  const t = useAdwaita();
  const photo = photoSrc(t);
  return (
    <Row gap={16} align="start">
      <LabeledAvatar caption="ring">
        <Avatar name="Ada Lovelace" size={48} ring />
      </LabeledAvatar>
      <LabeledAvatar caption="ring (photo)">
        <Avatar name="Photo User" size={48} src={photo} ring />
      </LabeledAvatar>
      <LabeledAvatar caption="disabled">
        <Avatar name="Ada Lovelace" size={48} disabled />
      </LabeledAvatar>
      <LabeledAvatar caption="disabled (icon)">
        <Avatar name="" size={48} icon="user" disabled />
      </LabeledAvatar>
    </Row>
  );
}

const STACK_NAMES = ["Ada Lovelace", "Alan Turing", "Grace Hopper"];

function renderStackAvatars(size: number) {
  return STACK_NAMES.map((name) => <Avatar key={name} name={name} size={size} />);
}

export const group = defineStory({
  render: () => (
    <Column gap={16}>
      <Labeled caption="overlap stack (no count)">
        <AvatarGroup size={32} overlap={8}>
          {renderStackAvatars(32)}
        </AvatarGroup>
      </Labeled>
      <Labeled caption="overlap stack + count">
        <AvatarGroup size={32} overlap={8}>
          {renderStackAvatars(32)}
          <AvatarGroupCount count={4} size={32} />
        </AvatarGroup>
      </Labeled>
    </Column>
  ),
});

export const accentTint = defineStory({
  render: () => (
    <AdwaitaProvider accent="green">
      <Row gap={16} align="start">
        <Labeled caption="initials (green accent)">
          <Avatar name="Ada Lovelace" size={48} />
        </Labeled>
        <Labeled caption="icon (green accent)">
          <Avatar name="Build bot" size={48} icon="settings" />
        </Labeled>
        <Labeled caption="group (green accent)">
          <AvatarGroup size={32} overlap={8}>
            <Avatar name="Ada Lovelace" size={32} />
            <Avatar name="Alan Turing" size={32} />
            <AvatarGroupCount count={4} size={32} />
          </AvatarGroup>
        </Labeled>
      </Row>
    </AdwaitaProvider>
  ),
});
