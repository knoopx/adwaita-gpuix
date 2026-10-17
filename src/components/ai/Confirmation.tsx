import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon, type IconName } from "../../components/icons";
import { Button } from "../../components/Button";

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
  const { colors, radii, spacing } = t;
  const value = useMemo(
    () => ({ approval, state, disabled }),
    [approval, state, disabled],
  );
  const responded = state === "responded" && approval !== undefined;
  const approved = responded && approval.approved;
  const statusColor = approved ? colors.success : colors.destructive;
  return (
    <ConfirmationCtx.Provider value={value}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.gap,
          padding: spacing.paddingTight,
          borderRadius: radii.card,
          borderWidth: 1,
          borderColor: destructive ? colors.destructive : colors.border,
          backgroundColor: destructive
            ? colors.destructiveTint
            : colors.view_bg,
          opacity: disabled ? 0.5 : 1,
          ...style,
        }}
      >
        {children}
        {responded ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon
              name={approved ? "success" : "close"}
              size={14}
              color={statusColor}
              style={{ flexShrink: 0 }}
            />
            <T size="caption" color={statusColor}>
              {approved ? "Approved" : "Rejected"}
            </T>
            {approval.reason ? (
              <T size="caption" color={colors.dim_fg}>
                {`— ${approval.reason}`}
              </T>
            ) : null}
          </div>
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
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      <T size="body" weight={600} color={colors.fg}>
        {children}
      </T>
      {description ? (
        <T size="caption" color={colors.dim_fg}>
          {description}
        </T>
      ) : null}
    </div>
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
        gap: t.spacing.gap,
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
