import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
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

const STATUS_BAR_HEIGHT = 32;
const PROGRESS_WIDTH = 80;

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
  const { colors, spacing } = t;
  const groups = hints && hints.length > 0 ? groupHints(hints) : [];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.gap,
        height: STATUS_BAR_HEIGHT,
        paddingLeft: spacing.paddingTight,
        paddingRight: spacing.paddingTight,
        backgroundColor: colors.headerbar_bg,
        borderTopWidth: 1,
        borderColor: colors.border,
        minWidth: 0,
        ...style,
      }}
    >
      {message ? (
        typeof message === "string" ? (
          <T size="caption" color={colors.dim_fg} style={messageClamp}>
            {message}
          </T>
        ) : (
          <div style={messageClamp}>{message}</div>
        )
      ) : (
        <div style={messageClamp} />
      )}
      {progress !== undefined ? (
        <ProgressBar
          value={Math.min(1, Math.max(0, progress)) * 100}
          height={4}
          style={{ width: PROGRESS_WIDTH, flexShrink: 0 }}
        />
      ) : null}
      {trailing ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.gap,
            flexShrink: 0,
          }}
        >
          {trailing}
        </div>
      ) : null}
      {groups.length > 0 ? (
        <ShortcutHints
          groups={groups}
          style={{ overflow: "hidden", flexShrink: 0 }}
        />
      ) : null}
    </div>
  );
}
