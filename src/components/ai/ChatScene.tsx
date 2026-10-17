import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import { PromptInput } from "./PromptInput";
import { PillIconButton } from "./PillIconButton";

export interface ChatSceneProps {
  title?: string;
  onNewThread?: () => void;
  children?: ReactNode;
  input?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ChatScene({
  title = "New Thread",
  onNewThread,
  children,
  input,
  style,
}: ChatSceneProps) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minWidth: 0,
        backgroundColor: colors.view_bg,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.gap,
          minHeight: spacing.rowHeight,
          padding: spacing.paddingTight,
          backgroundColor: colors.headerbar_bg,
          borderBottomWidth: 1,
          borderColor: colors.border,
          flexShrink: 0,
        }}
      >
        <T
          size="title4"
          weight={600}
          color={colors.fg}
          style={{
            flexGrow: 1,
            minWidth: 0,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </T>
        <PillIconButton icon="plus" label="New thread" onClick={onNewThread} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.gap,
          flexGrow: 1,
          minHeight: 0,
          padding: spacing.padding,
          overflowY: "scroll",
          minWidth: 0,
        }}
      >
        {children}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: spacing.padding,
          borderTopWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.view_bg,
          flexShrink: 0,
        }}
      >
        {input ?? <PromptInput />}
      </div>
    </div>
  );
}
