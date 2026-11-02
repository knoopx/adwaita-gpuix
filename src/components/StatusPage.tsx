import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { type Tone, toneColor, toneTint } from "../theme/tones";
import { T } from "./text";
import { Icon, type IconName } from "./icons";

export type StatusPageTone = Tone;

export interface StatusPageProps {
  icon?: IconName;
  tone?: StatusPageTone;
  title: string;
  description?: string;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function StatusPage({
  icon = "autoAwesome",
  tone = "accent",
  title,
  description,
  children,
  style,
}: StatusPageProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: t.space.sm,
        padding: t.space.lg,
        minHeight: 160,
        ...style,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: t.radius.full,
          backgroundColor: toneTint(t, tone),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Icon name={icon} size={32} color={toneColor(t, tone)} />
      </div>
      <T size="title2" weight={700} color={t.color.text.primary}>
        {title}
      </T>
      {description ? (
        <T
          size="body"
          color={t.color.text.dim}
          align="center"
          style={{ maxWidth: 320, whiteSpace: "normal", lineHeight: 20 }}
        >
          {description}
        </T>
      ) : null}
      {children}
    </div>
  );
}
