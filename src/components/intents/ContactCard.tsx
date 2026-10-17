import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Icon, type IconName } from "../icons";
import { Row } from "../Box";

export interface ContactData {
  name: string;
  phone: string | null;
  email: string | null;
  initials: string;
}

export interface ContactCardProps {
  data: ContactData;
  style?: Partial<StyleDesc>;
}

function deriveInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string;
}) {
  const a = useAdwaita();
  const { colors } = a;
  return (
    <Row gap={6} align="center">
      <Icon name={icon} size={12} color={colors.dim_fg} />
      <T size="caption" color={colors.dim_fg}>
        {label}
      </T>
      <T size="caption" color={colors.fg}>
        {value}
      </T>
    </Row>
  );
}

export function ContactCard({ data, style }: ContactCardProps) {
  const a = useAdwaita();
  const { colors, radii, spacing } = a;
  const name = data.name || "Unknown";
  const initials = data.initials || deriveInitials(name);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing.gap,
        padding: spacing.padding,
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        ...style,
      }}
    >
      <Row gap={8} align="center">
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: colors.accentTint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <T size="caption" weight={700} color={colors.accent}>
            {initials || "?"}
          </T>
        </div>
        <T weight={600} color={colors.fg}>
          {name}
        </T>
      </Row>
      {data.phone ? (
        <ContactRow icon="phone" label="Phone" value={data.phone} />
      ) : null}
      {data.email ? (
        <ContactRow icon="mail" label="Email" value={data.email} />
      ) : null}
    </div>
  );
}
