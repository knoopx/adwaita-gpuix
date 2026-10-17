import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Icon, type IconName } from "../icons";
import { Frame } from "../Card";
import { Row } from "../Box";

export interface ToolCardProps {
  icon: IconName;
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  style?: Partial<StyleDesc>;
  children?: ReactNode;
}

export function ToolCard({
  icon,
  title,
  description,
  badge,
  style,
  children,
}: ToolCardProps) {
  const a = useAdwaita();
  const { colors, spacing } = a;
  return (
    <Frame
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing.gap,
        padding: spacing.padding,
        ...style,
      }}
    >
      <Row gap={8} align="center">
        <Icon name={icon} size={16} color={colors.accent} />
        <T weight={600} style={{ flexGrow: 1, minWidth: 0 }}>
          {title}
        </T>
        {badge}
      </Row>
      {description ? (
        <T size="caption" color={colors.dim_fg}>
          {description}
        </T>
      ) : null}
      {children}
    </Frame>
  );
}
