import { type AdwaitaTheme, useAdwaita } from "../../theme/adwaita";
import { getFileStatusIcon } from "../FileIcons";
import { Icon } from "../icons";

const STATUS_COL_W = 14;
const STATUS_ICON_SIZE = 14;

export function fileStatusColor(status: string, t: AdwaitaTheme): string {
  if (status === "A") return t.color.functional.success;
  if (status === "D") return t.color.functional.destructive;
  return t.color.functional.warning;
}

export function FileStatusCell({
  status,
  width = STATUS_COL_W,
  size = STATUS_ICON_SIZE,
}: {
  status: string;

  width?: number;
  size?: number;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        width,
        flexShrink: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Icon
        name={getFileStatusIcon(status)}
        size={size}
        color={fileStatusColor(status, t)}
      />
    </div>
  );
}
