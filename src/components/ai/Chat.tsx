import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon, type IconName } from "../../components/icons";
import { Spinner } from "../../components/Spinner";
import { PillIconButton } from "./PillIconButton";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
  MessageFooter,
} from "./Message";

export type ChatRole = "user" | "assistant";

export interface ChatProps {
  children?: ReactNode;
  height?: number;
  style?: Partial<StyleDesc>;
}

export function Chat({ children, height = 320, style }: ChatProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing.gap,
        padding: spacing.padding,
        width: "100%",
        height,
        overflowY: "scroll",
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
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
  const { colors } = t;
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
      <T size="body" color={colors.fg} style={{ flexShrink: 1 }}>
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
  const { colors } = t;
  const isUser = role === "user";
  const glyph: IconName = isUser ? "user" : "sparkles";
  return (
    <Message align={isUser ? "end" : "start"} style={style}>
      <MessageAvatar>
        <Icon
          name={glyph}
          size={16}
          color={isUser ? colors.fg : colors.dim_fg}
        />
      </MessageAvatar>
      <MessageContent
        style={isUser ? { backgroundColor: colors.accentTint } : undefined}
      >
        <MessageHeader
          style={isUser ? { justifyContent: "flex-end" } : undefined}
        >
          <T size="caption" weight={600}>
            {title ?? (isUser ? "You" : "Assistant")}
          </T>
          {streaming ? <Spinner size={16} label={false} /> : null}
        </MessageHeader>
        {typeof children === "string" ? <T size="body">{children}</T> : children}
        {timestamp !== undefined ? (
          <MessageFooter>
            <T size="caption" color={colors.dim_fg}>
              {timestamp}
            </T>
          </MessageFooter>
        ) : null}
      </MessageContent>
    </Message>
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
  icon = "messageSquare",
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  children,
  style,
}: ChatEmptyStateProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
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
              borderRadius: radii.button,
              backgroundColor: colors.button_bg,
              flexShrink: 0,
            }}
          >
            <Icon name={icon} size={24} color={colors.dim_fg} />
          </div>
          <T size="body" weight={600}>
            {title}
          </T>
          <T
            size="caption"
            color={colors.dim_fg}
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

