import { type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon } from "../../components/icons";
import { Badge } from "../../components/Badge";
import { Frame } from "../../components/Card";
import { Spinner } from "../../components/Spinner";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  useControllableOpen,
} from "../../components/Collapsible";

export type SubagentToolStatus = "pending" | "running" | "complete" | "error";

export type SubagentStatus = "running" | "complete" | "error";

export interface SubagentToolData {
  name: string;
  description?: string;
  status?: SubagentToolStatus;
}

export interface SubagentProps {
  name: string;
  model?: string;
  instructions?: string;
  tools?: SubagentToolData[];
  output?: string;
  status?: SubagentStatus;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: Partial<StyleDesc>;
}

function SubagentStatusIndicator({ status }: { status: SubagentStatus }) {
  const t = useAdwaita();
  const { colors } = t;
  if (status === "running")
    return <Spinner size={16} label={false} style={{ flexShrink: 0 }} />;
  if (status === "complete")
    return (
      <Icon
        name="success"
        size={14}
        color={colors.success}
        style={{ flexShrink: 0 }}
      />
    );
  return (
    <Icon
      name="alert"
      size={14}
      color={colors.destructive}
      style={{ flexShrink: 0 }}
    />
  );
}

export function Subagent({
  name,
  model,
  instructions,
  tools,
  output,
  status,
  open,
  defaultOpen,
  onOpenChange,
  style,
}: SubagentProps) {
  const t = useAdwaita();
  const { colors } = t;
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    defaultOpen ?? false,
    onOpenChange,
  );
  return (
    <Frame
      style={{
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <Collapsible open={isOpen} onOpenChange={setOpen}>
        <SubagentHeader name={name} model={model} status={status} />
        <SubagentContent open={isOpen}>
          {instructions ? (
            <T size="caption" color={colors.dim_fg}>
              {instructions}
            </T>
          ) : null}
          {tools && tools.length > 0 ? (
            <SubagentSection title="Tools">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: t.spacing.gap,
                }}
              >
                {tools.map((tool) => (
                  <SubagentTool
                    key={tool.name}
                    name={tool.name}
                    description={tool.description}
                    status={tool.status}
                  />
                ))}
              </div>
            </SubagentSection>
          ) : null}
          {output ? (
            <SubagentSection title="Output">
              <SubagentOutputBlock
                text={output}
                tone={status === "error" ? "destructive" : "dim"}
              />
            </SubagentSection>
          ) : null}
        </SubagentContent>
      </Collapsible>
    </Frame>
  );
}

export interface SubagentHeaderProps {
  name: string;
  model?: string;
  status?: SubagentStatus;
  style?: Partial<StyleDesc>;
}

export function SubagentHeader({ name, model, status, style }: SubagentHeaderProps) {
  const t = useAdwaita();
  const { colors, typography } = t;
  return (
    <CollapsibleTrigger style={style}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: t.spacing.gap,
          minWidth: 0,
        }}
      >
        <Icon name="userRound" size={14} color={colors.accent} />
        <T
          size="body"
          color={colors.fg}
          style={{ flexShrink: 1, textOverflow: "ellipsis" }}
        >
          {`Ran the ${name} agent`}
        </T>
        {status ? <SubagentStatusIndicator status={status} /> : null}
        {model ? (
          <Badge
            variant="secondary"
            style={{
              flexShrink: 0,
              fontFamily: typography.fontFamilyMono,
            }}
          >
            {model}
          </Badge>
        ) : null}
      </div>
    </CollapsibleTrigger>
  );
}

export interface SubagentContentProps {
  open?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function SubagentContent({ open, children, style }: SubagentContentProps) {
  const t = useAdwaita();
  const { spacing } = t;
  return (
    <CollapsibleContent open={open} style={style}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.paddingTight,
          paddingTop: 4,
          paddingLeft: spacing.padding,
        }}
      >
        {children}
      </div>
    </CollapsibleContent>
  );
}

function SubagentSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <T size="caption" weight={600} color={colors.dim_fg}>
        {title}
      </T>
      {children}
    </div>
  );
}

export interface SubagentToolProps {
  name: string;
  description?: string;
  status?: SubagentToolStatus;
  style?: Partial<StyleDesc>;
}

export function SubagentTool({
  name,
  description,
  status = "complete",
  style,
}: SubagentToolProps) {
  const t = useAdwaita();
  const { colors, typography } = t;
  const dotColor =
    status === "complete"
      ? colors.success
      : status === "error"
        ? colors.destructive
        : status === "running"
          ? colors.accent
          : colors.dim_fg;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: t.spacing.gap,
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: dotColor,
            flexShrink: 0,
          }}
        />
        <T
          size="caption"
          weight={500}
          color={colors.fg}
          style={{
            fontFamily: typography.fontFamilyMono,
            flexShrink: 0,
          }}
        >
          {name}
        </T>
      </div>
      {description ? (
        <T
          size="caption"
          color={colors.dim_fg}
          style={{
            paddingLeft: 16,
            flexShrink: 1,
          }}
        >
          {description}
        </T>
      ) : null}
    </div>
  );
}

function SubagentOutputBlock({
  text,
  tone = "dim",
}: {
  text: string;
  tone?: "dim" | "destructive";
}) {
  const t = useAdwaita();
  const { colors, radii, typography, spacing } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: spacing.gap,
        borderRadius: radii.button,
        backgroundColor: colors.button_bg,
      }}
    >
      {text.split("\n").map((line, i) => (
        <T
          key={i}
          size="caption"
          color={tone === "destructive" ? colors.destructive : colors.dim_fg}
          style={{
            fontFamily: typography.fontFamilyMono,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            flexShrink: 1,
          }}
        >
          {line}
        </T>
      ))}
    </div>
  );
}
