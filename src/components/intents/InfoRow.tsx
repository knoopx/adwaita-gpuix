import type { ReactNode } from "react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Icon, type IconName } from "../icons";
import { Row } from "../Box";

export interface InfoRowProps {
  icon: IconName;
  children: ReactNode;
}

export function InfoRow({ icon, children }: InfoRowProps) {
  const a = useAdwaita();
  return (
    <Row gap={8} align="center">
      <Icon name={icon} size={14} color={a.colors.dim_fg} />
      <T size="caption" color={a.colors.dim_fg}>
        {children}
      </T>
    </Row>
  );
}
