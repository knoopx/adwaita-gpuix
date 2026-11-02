import {
  Children,
  type ReactNode,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useMemo,
} from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { disabledStyle } from "../disabled.ts";
import { Icon, type IconName } from "../../components/icons";
import { Button } from "../../components/Button";
import { type TextTone, textToneColor } from "../../theme/tones";
import { TextStack } from "./TextStack";

export interface ConfirmationApproval {
  approved: boolean;
  reason?: string;
}

export type ConfirmationState = "requested" | "responded";

interface ConfirmationContextValue {
  approval?: ConfirmationApproval;
  state: ConfirmationState;
  disabled?: boolean;
}

const ConfirmationCtx = createContext<ConfirmationContextValue | null>(null);

function useConfirmation(): ConfirmationContextValue {
  const ctx = useContext(ConfirmationCtx);
  if (!ctx)
    throw new Error(
      "Confirmation components must be used within <Confirmation>",
    );
  return ctx;
}

type Outcome = "approved" | "rejected";

const OUTCOME: Record<
  Outcome,
  { icon: IconName; tone: TextTone; label: string }
> = {
  approved: { icon: "checkCircle", tone: "success", label: "Approved" },
  rejected: { icon: "close", tone: "destructive", label: "Rejected" },
};

function outcomeOf(approved: boolean): Outcome {
  return approved ? "approved" : "rejected";
}

function containerTint(t: AdwaitaTheme, destructive: boolean): string {
  return destructive ? t.color.functional.destructiveTint : "transparent";
}

function isApproved(
  responded: boolean,
  approval: ConfirmationApproval | undefined,
): boolean {
  return responded && approval?.approved === true;
}

function ConfirmationOutcome({
  approved,
  reason,
}: {
  approved: boolean;
  reason?: string;
}) {
  const t = useAdwaita();
  const outcome = OUTCOME[outcomeOf(approved)];
  const color = textToneColor(t, outcome.tone);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Icon
        name={outcome.icon}
        size={14}
        color={color}
        style={{ flexShrink: 0 }}
      />
      <T size="caption" color={color}>
        {outcome.label}
      </T>
      {reason ? (
        <T size="caption" color={t.color.text.dim}>
          {`— ${reason}`}
        </T>
      ) : null}
    </div>
  );
}

export interface ConfirmationProps {
  approval?: ConfirmationApproval;
  state: ConfirmationState;

  destructive?: boolean;
  disabled?: boolean;
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Confirmation({
  approval,
  state,
  destructive = false,
  disabled = false,
  children,
  style,
}: ConfirmationProps) {
  const t = useAdwaita();
  const value = useMemo(
    () => ({ approval, state, disabled }),
    [approval, state, disabled],
  );
  const responded = state === "responded" && approval !== undefined;
  const approved = isApproved(responded, approval);
  return (
    <ConfirmationCtx.Provider value={value}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: t.space.sm,
          padding: t.space.md,
          borderRadius: t.radius.sm,
          backgroundColor: containerTint(t, destructive),
          opacity: disabledStyle(disabled).opacity,
          ...style,
        }}
      >
        {children}
        {responded ? (
          <ConfirmationOutcome approved={approved} reason={approval.reason} />
        ) : null}
      </div>
    </ConfirmationCtx.Provider>
  );
}

export interface ConfirmationTitleProps {
  children: ReactNode;
  description?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ConfirmationTitle({
  children,
  description,
  style,
}: ConfirmationTitleProps) {
  return (
    <TextStack
      title={children}
      description={description}
      titleWeight={600}
      style={style}
    />
  );
}

export interface ConfirmationActionsProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ConfirmationActions({
  children,
  style,
}: ConfirmationActionsProps) {
  const { state, disabled } = useConfirmation();
  const t = useAdwaita();
  if (state !== "requested") return null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: t.space.sm,
        ...style,
      }}
    >
      {disabled
        ? Children.map(children, (child) =>
            isValidElement<{ disabled?: boolean }>(child)
              ? cloneElement(child, { disabled: true })
              : child,
          )
        : children}
    </div>
  );
}

export interface ConfirmationActionProps {
  label: string;
  icon?: IconName;
  variant?: "suggested" | "secondary" | "destructive";
  disabled?: boolean;
  onClick?: () => void;
  style?: Partial<StyleDesc>;
}

export function ConfirmationAction({
  label,
  icon,
  variant = "secondary",
  disabled,
  onClick,
  style,
}: ConfirmationActionProps) {
  return (
    <Button
      variant={variant}
      size="sm"
      label={label}
      icon={icon}
      disabled={disabled}
      onClick={onClick}
      style={style}
    />
  );
}
