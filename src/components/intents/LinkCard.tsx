import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Icon } from "../icons";
import { Card } from "../Card";
import { Row, Column } from "../Box";

export interface LinkData {
  url: string | null;
  domain: string | null;
  monogram: string;
  note: string;
}

export interface LinkCardProps {
  data: LinkData;
  style?: Partial<StyleDesc>;
}

function deriveDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] || null;
  }
}

export function LinkCard({ data, style }: LinkCardProps) {
  const t = useAdwaita();
  const { colors, radii, typography, spacing } = t;
  const domain = data.domain ?? (data.url ? deriveDomain(data.url) : null);
  const monogram = data.monogram || (domain?.[0]?.toUpperCase() ?? "");
  return (
    <Card style={style}>
      <Row gap={spacing.gap} align="center">
        <Icon name="link" size={16} color={colors.dim_fg} />
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: radii.row,
            backgroundColor: colors.button_bg,
            borderWidth: 1,
            borderColor: colors.border,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <T size="caption" weight={700}>
            {monogram || "?"}
          </T>
        </div>
        <Column gap={2} style={{ flexGrow: 1, minWidth: 0 }}>
          <T weight={600}>{data.note || domain || "Link"}</T>
          {domain ? (
            <T size="caption" color={colors.dim_fg}>
              {domain}
            </T>
          ) : null}
        </Column>
      </Row>
      {data.url ? (
        <T
          size="caption"
          color={colors.dim_fg}
          clamp={1}
          style={{ fontFamily: typography.fontFamilyMono }}
        >
          {data.url}
        </T>
      ) : null}
    </Card>
  );
}
