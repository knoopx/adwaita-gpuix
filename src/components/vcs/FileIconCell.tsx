import { useAdwaita } from "../../theme/adwaita";
import { getFileIcon, getFileIconColor } from "../FileIcons";
import { Icon } from "../icons";

const ICON_COL_W = 24;
const ICON_SIZE = 18;

export function FileIconCell({
  path,
  width = ICON_COL_W,
  size = ICON_SIZE,
}: {
  path: string;

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
        name={getFileIcon(path)}
        size={size}
        color={getFileIconColor(path) ?? t.color.text.dim}
      />
    </div>
  );
}
