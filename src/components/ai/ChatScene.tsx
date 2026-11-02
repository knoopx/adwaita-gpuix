import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
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
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minWidth: 0,
        backgroundColor: t.color.surface.view,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: t.space.sm,
          minHeight: t.control.rowHeight,
          padding: t.space.md,
          backgroundColor: t.color.surface.headerbar,
          flexShrink: 0,
        }}
      >
        <T
          size="title4"
          weight={600}
          color={t.color.text.primary}
          style={{
            flexGrow: 1,
            minWidth: 0,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </T>
        <PillIconButton icon="add" label="New thread" onClick={onNewThread} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: t.space.sm,
          flexGrow: 1,
          minHeight: 0,
          padding: t.space.lg,
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
          padding: t.space.lg,
          flexShrink: 0,
        }}
      >
        {input ?? <PromptInput />}
      </div>
    </div>
  );
}
