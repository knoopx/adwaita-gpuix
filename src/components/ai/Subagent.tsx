import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon } from "../../components/icons";
import { Badge } from "../../components/Badge";
import {
  Collapsible,
  CollapsibleTrigger,
  useControllableOpen,
} from "../../components/Collapsible";
import { DisclosureBody } from "./DisclosureBody";
import { DisclosureRow } from "./DisclosureRow";
import { DisclosureSection } from "./DisclosureSection";
import { OutputBox } from "./OutputBox";
import { StatusGlyph } from "./StatusGlyph";

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
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    defaultOpen ?? false,
    onOpenChange,
  );
  return (
    <div
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
            <T size="caption" color={t.color.text.dim}>
              {instructions}
            </T>
          ) : null}
          {tools && tools.length > 0 ? (
            <DisclosureSection title="Tools">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: t.space.sm,
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
            </DisclosureSection>
          ) : null}
          {output ? (
            <DisclosureSection title="Output">
              <OutputBox
                text={output}
                filled
                padding={t.space.sm}
                color={
                  status === "error"
                    ? t.color.functional.destructive
                    : t.color.text.dim
                }
              />
            </DisclosureSection>
          ) : null}
        </SubagentContent>
      </Collapsible>
    </div>
  );
}

export interface SubagentHeaderProps {
  name: string;
  model?: string;
  status?: SubagentStatus;
  style?: Partial<StyleDesc>;
}

export function SubagentHeader({
  name,
  model,
  status,
  style,
}: SubagentHeaderProps) {
  const t = useAdwaita();
  return (
    <CollapsibleTrigger style={style}>
      <DisclosureRow
        icon={
          <Icon name="accountCircle" size={14} color={t.color.accent.base} />
        }
        label={`Ran the ${name} agent`}
        trailing={
          <>
            {status ? <StatusGlyph status={status} /> : null}
            {model ? (
              <Badge
                variant="secondary"
                style={{
                  flexShrink: 0,
                  fontFamily: t.type.fontFamilyMono,
                }}
              >
                {model}
              </Badge>
            ) : null}
          </>
        }
      />
    </CollapsibleTrigger>
  );
}

export interface SubagentContentProps {
  open?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function SubagentContent({
  open,
  children,
  style,
}: SubagentContentProps) {
  const t = useAdwaita();
  return (
    <DisclosureBody
      open={open}
      gap={t.space.md}
      inset={{ paddingTop: 4, paddingLeft: t.space.lg }}
      style={style}
    >
      {children}
    </DisclosureBody>
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
  const dotColor =
    status === "complete"
      ? t.color.functional.success
      : status === "error"
        ? t.color.functional.destructive
        : status === "running"
          ? t.color.accent.base
          : t.color.text.dim;
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
          gap: t.space.sm,
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
          color={t.color.text.primary}
          style={{
            fontFamily: t.type.fontFamilyMono,
            flexShrink: 0,
          }}
        >
          {name}
        </T>
      </div>
      {description ? (
        <T
          size="caption"
          color={t.color.text.dim}
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
