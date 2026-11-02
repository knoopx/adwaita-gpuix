import { Button } from "../../components/Button";
import { RowChevron } from "./RowChevron";

export interface DisclosureTrailingProps {
  onCopy?: () => void;
  open: boolean;
}

export function DisclosureTrailing({ onCopy, open }: DisclosureTrailingProps) {
  return (
    <>
      {onCopy ? (
        <Button
          variant="secondary"
          size="sm"
          icon="contentCopy"
          label="Copy"
          onClick={onCopy}
          style={{ flexShrink: 0 }}
        />
      ) : null}
      <RowChevron open={open} />
    </>
  );
}
