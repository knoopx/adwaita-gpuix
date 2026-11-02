import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";

export function FilePathCell({
  path,
  color,
}: {
  path: string;

  color?: string;
}) {
  const t = useAdwaita();
  return (
    <T
      size="caption"
      color={color ?? t.color.text.primary}
      style={{
        flexGrow: 1,
        minWidth: 0,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
      }}
    >
      {path}
    </T>
  );
}
