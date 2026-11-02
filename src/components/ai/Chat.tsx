import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon, type IconName } from "../../components/icons";
import { Spinner } from "../../components/Spinner";
import { PillIconButton } from "./PillIconButton";

export type ChatRole = "user" | "assistant";

export interface ChatProps {
  children?: ReactNode;
  height?: number;
  style?: Partial<StyleDesc>;
}

export function Chat({ children, height = 320, style }: ChatProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.sm,
        padding: t.space.lg,
        width: "100%",
        height,
        overflowY: "scroll",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface ChatHeaderProps {
  title?: string;
  style?: Partial<StyleDesc>;
}

export function ChatHeader({ title = "New Thread", style }: ChatHeaderProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        minWidth: 0,
        ...style,
      }}
    >
      <T size="body" color={t.color.text.primary} style={{ flexShrink: 1 }}>
        {title}
      </T>
      <div style={{ flexGrow: 1 }} />
      <PillIconButton icon="refresh" label="Refresh" onClick={() => {}} />
    </div>
  );
}

export interface ChatMessageProps {
  role: ChatRole;
  title?: string;
  timestamp?: string;
  streaming?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ChatMessage({
  role,
  title,
  timestamp,
  streaming = false,
  children,
  style,
}: ChatMessageProps) {
  const t = useAdwaita();
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.xs,
        width: "100%",
        minWidth: 0,
        paddingLeft: isUser ? t.space.lg : 0,
        backgroundColor: isUser ? t.color.accent.tint : undefined,
        borderRadius: isUser ? t.radius.sm : undefined,
        padding: isUser ? t.space.sm : undefined,
        ...style,
      }}
    >
      {streaming ? <Spinner size={16} label={false} /> : null}
      {typeof children === "string" ? (
        <T
          size="body"
          color={isUser ? t.color.text.primary : t.color.text.primary}
        >
          {children}
        </T>
      ) : (
        children
      )}
      {timestamp !== undefined ? (
        <T size="caption" color={t.color.text.dim}>
          {timestamp}
        </T>
      ) : null}
    </div>
  );
}

export interface ChatEmptyStateProps {
  icon?: IconName;
  title?: string;
  description?: string;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ChatEmptyState({
  icon = "chatBubble",
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  children,
  style,
}: ChatEmptyStateProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 32,
        minHeight: 160,
        width: "100%",
        textAlign: "center",
        ...style,
      }}
    >
      {children ?? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: t.radius.sm,
              backgroundColor: t.color.surface.button,
              flexShrink: 0,
            }}
          >
            <Icon name={icon} size={24} color={t.color.text.dim} />
          </div>
          <T size="body" weight={600}>
            {title}
          </T>
          <T
            size="caption"
            color={t.color.text.dim}
            style={{ maxWidth: 280, textAlign: "center" }}
            clamp={2}
          >
            {description}
          </T>
        </>
      )}
    </div>
  );
}
