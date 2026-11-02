import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { TrailingSlot } from "../Box";
import { groupHints } from "../KeyBindings";
import { ShortcutHints } from "../KeyHint";
import { ProgressBar } from "../ProgressBar";
import { type Shortcut } from "../../lib/shortcuts";

export interface StatusBarProps {
  message?: ReactNode;

  progress?: number;

  trailing?: ReactNode;

  hints?: Shortcut[];
  style?: Partial<StyleDesc>;
}

const messageClamp: Partial<StyleDesc> = {
  flexGrow: 1,
  minWidth: 0,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

export function StatusBar({
  message,
  progress,
  trailing,
  hints,
  style,
}: StatusBarProps) {
  const t = useAdwaita();
  const groups = hints && hints.length > 0 ? groupHints(hints) : [];
  const hasLeading =
    message !== undefined || progress !== undefined || trailing !== undefined;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: t.control.statusBarHeight,
        paddingLeft: t.space.md,
        paddingRight: t.space.md,
        gap: t.space.sm,
        backgroundColor: t.color.surface.headerbar,
        minWidth: 0,
        ...style,
      }}
    >
      {hasLeading ? (
        message ? (
          typeof message === "string" ? (
            <T size="caption" color={t.color.text.dim} style={messageClamp}>
              {message}
            </T>
          ) : (
            <div style={messageClamp}>{message}</div>
          )
        ) : (
          <div style={messageClamp} />
        )
      ) : null}
      {progress !== undefined ? (
        <ProgressBar
          value={Math.min(1, Math.max(0, progress)) * 100}
          height={4}
          style={{ width: t.control.progressWidth, flexShrink: 0 }}
        />
      ) : null}
      {trailing ? <TrailingSlot>{trailing}</TrailingSlot> : null}
      {groups.length > 0 ? (
        <ShortcutHints
          groups={groups}
          style={{ overflow: "hidden", flexShrink: 0 }}
        />
      ) : null}
    </div>
  );
}
