import { type AdwaitaTheme, useAdwaita } from "../../theme/adwaita";
import { getFileStatusIcon } from "../FileIcons";
import { Icon } from "../icons";
import { FILE_STATUS_ICONS } from "./FileStatusIcons";

const STATUS_COL_W = 14;
const STATUS_ICON_SIZE = 14;

export function fileStatusColor(status: string, t: AdwaitaTheme): string {
  if (status === "A") return t.color.functional.success;
  if (status === "D") return t.color.functional.destructive;
  return t.color.functional.warning;
}

/** Whether the source named what happened to the file. `git diff --numstat` and `jj` write
 *  no letter at all, and a glyph invented for that absence — a document in warning's
 *  orange — is a status mark on a row whose status was never stated. */
export function fileStatusNamed(status: string): boolean {
  return FILE_STATUS_ICONS[status] !== undefined;
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
      {fileStatusNamed(status) ? (
        <Icon
          name={getFileStatusIcon(status)}
          size={size}
          color={fileStatusColor(status, t)}
        />
      ) : null}
    </div>
  );
}
