import type { StyleDesc } from "@gpuix/react";
import { Button } from "../../components/Button";

export interface ReplayButtonProps {
  style?: Partial<StyleDesc>;
}

export function ReplayButton({ style }: ReplayButtonProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      label="Replay"
      onClick={() => {}}
      style={{ alignSelf: "flex-start", ...style }}
    />
  );
}
