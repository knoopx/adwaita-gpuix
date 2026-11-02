import { type ReactNode, createContext, useContext } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";

export type MessageAlign = "start" | "end";

interface MessageContextValue {
  align: MessageAlign;
}

const MessageCtx = createContext<MessageContextValue | null>(null);

function useMessage(): MessageContextValue {
  const ctx = useContext(MessageCtx);
  if (!ctx) throw new Error("Message parts must be used within <Message>");
  return ctx;
}

export interface MessageGroupProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function MessageGroup({ children, style }: MessageGroupProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.md,
        width: "100%",
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface MessageProps {
  align?: MessageAlign;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Message({ align = "start", children, style }: MessageProps) {
  const t = useAdwaita();
  const end = align === "end";
  return (
    <MessageCtx.Provider value={{ align }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: end ? "flex-end" : "flex-start",
          gap: t.space.sm,
          width: "100%",
          minWidth: 0,
          ...style,
        }}
      >
        {children}
      </div>
    </MessageCtx.Provider>
  );
}

export interface MessageAvatarProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function MessageAvatar({ children, style }: MessageAvatarProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: t.radius.full,
        borderWidth: 0,
        backgroundColor: t.color.surface.button,
        overflow: "hidden",
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface MessageContentProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function MessageContent({ children, style }: MessageContentProps) {
  const t = useAdwaita();
  const { align } = useMessage();
  const isUser = align === "end";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        flexGrow: 1,
        minWidth: 0,
        maxWidth: isUser ? "85%" : "100%",
        ...(isUser
          ? {
              backgroundColor: t.color.accent.tint,
              borderRadius: t.radius.sm,
              padding: t.space.sm,
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface MessageHeaderProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function MessageHeader({ children, style }: MessageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        minWidth: 0,
        maxWidth: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface MessageFooterProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function MessageFooter({ children, style }: MessageFooterProps) {
  const { align } = useMessage();
  const end = align === "end";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        minWidth: 0,
        maxWidth: "100%",
        ...(end ? { justifyContent: "flex-end" } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
