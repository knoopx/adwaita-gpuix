import { useState } from "react";
import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import {
  T,
  selectTriggerStyle,
} from "../../components/common";
import { Icon } from "../../components/icons";
import { useControllableOpen } from "../../components/Collapsible";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../../components/DropdownMenu";

export interface ModelSelectorModel {
  id: string;
  name: string;
  provider?: string;
}

export interface ModelSelectorProps {
  models: ModelSelectorModel[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

function providerOf(model: ModelSelectorModel): string {
  return model.provider ?? "Other";
}

function useControllableValue<T>(
  value: T | undefined,
  defaultValue: T,
  onValueChange?: (value: T) => void,
): { value: T; setValue: (value: T) => void } {
  const [internal, setInternal] = useState<T>(defaultValue);
  const current = value ?? internal;
  const setValue = (next: T) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  return { value: current, setValue };
}


const panelShadow: Partial<StyleDesc> = {
  boxShadow: {
    offsetX: 0,
    offsetY: 4,
    blurRadius: 16,
    spreadRadius: 0,
    color: "rgba(0,0,0,0.35)",
  },
};

function ModelSelectTrigger({
  display,
  fallback,
  label,
  showLabel = false,
  minWidth,
  disabled,
  style,
}: {
  display?: string;
  fallback: string;
  label?: string;
  showLabel?: boolean;
  minWidth?: number;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div
      style={selectTriggerStyle(t, {
        minWidth,
        ...(showLabel ? { justifyContent: "flex-start" } : {}),
        backgroundColor: colors.button_bg,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : undefined,
        hover: disabled ? undefined : { backgroundColor: colors.button_hover },
        active: disabled ? undefined : { backgroundColor: colors.button_active },
        ...style,
      })}
    >
      {showLabel ? (
        <T size="body" color={colors.dim_fg} style={{ flexShrink: 0 }}>
          {label}
        </T>
      ) : null}
      <T
        size="body"
        color={colors.fg}
        style={{ flexShrink: 1, textOverflow: "ellipsis" }}
      >
        {display ?? fallback}
      </T>
      <Icon
        name="chevronDown"
        size={14}
        color={colors.dim_fg}
        style={{ flexShrink: 0 }}
      />
    </div>
  );
}

function ModelRadioItems({
  value,
  onValueChange,
  items,
}: {
  value: string | undefined;
  onValueChange: (value: string) => void;
  items: { id: string; label: string }[];
}) {
  const t = useAdwaita();
  return (
    <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
      {items.map((item) => (
        <DropdownMenuRadioItem
          key={item.id}
          label={item.label}
          value={item.id}
          style={
            value === item.id
              ? { backgroundColor: t.colors.accentTint }
              : undefined
          }
        />
      ))}
    </DropdownMenuRadioGroup>
  );
}

function ModelSelectShell({
  open,
  onOpenChange,
  disabled,
  trigger,
  contentStyle,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  trigger: ReactNode;
  contentStyle: Partial<StyleDesc>;
  children: ReactNode;
}) {
  return (
    <DropdownMenu open={disabled ? false : open} onOpenChange={onOpenChange}>
      {disabled ? (
        trigger
      ) : (
        <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
      )}
      <DropdownMenuContent side="bottom" style={contentStyle}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ModelSelector({
  models,
  value,
  defaultValue,
  onValueChange,
  open,
  onOpenChange,
  label = "Model",
  disabled,
  style,
}: ModelSelectorProps) {
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    false,
    onOpenChange,
  );
  const { value: currentId, setValue: handleValueChange } = useControllableValue(
    value,
    defaultValue ?? models[0]?.id,
    onValueChange,
  );
  const current = models.find((m) => m.id === currentId) ?? models[0];
  const providers: string[] = [];
  for (const model of models) {
    const provider = providerOf(model);
    if (!providers.includes(provider)) providers.push(provider);
  }
  const trigger = (
    <ModelSelectTrigger
      display={current?.name}
      fallback={label}
      minWidth={120}
      disabled={disabled}
      style={style}
    />
  );
  return (
    <ModelSelectShell
      open={isOpen}
      onOpenChange={setOpen}
      disabled={disabled}
      trigger={trigger}
      contentStyle={{ minWidth: 200, ...panelShadow }}
    >
      {providers.map((provider, i) => (
        <div
          key={provider}
          style={{ display: "flex", flexDirection: "column" }}
        >
          {i > 0 ? <DropdownMenuSeparator /> : null}
          <DropdownMenuLabel>{provider}</DropdownMenuLabel>
          <ModelRadioItems
            value={currentId}
            onValueChange={handleValueChange}
            items={models
              .filter((m) => providerOf(m) === provider)
              .map((m) => ({ id: m.id, label: m.name }))}
          />
        </div>
      ))}
    </ModelSelectShell>
  );
}

export interface ModelSelectorEffortOption {
  id: string;
  label: string;
}

export interface ModelSelectorEffortProps {
  efforts: ModelSelectorEffortOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  showLabel?: boolean;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

export function ModelSelectorEffort({
  efforts,
  value,
  defaultValue,
  onValueChange,
  open,
  onOpenChange,
  label = "Effort",
  showLabel = false,
  disabled,
  style,
}: ModelSelectorEffortProps) {
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    false,
    onOpenChange,
  );
  const { value: currentId, setValue: handleValueChange } = useControllableValue(
    value,
    defaultValue ?? efforts[0]?.id,
    onValueChange,
  );
  const current =
    efforts.find((effort) => effort.id === currentId) ?? efforts[0];
  return (
    <ModelSelectShell
      open={isOpen}
      onOpenChange={setOpen}
      disabled={disabled}
      trigger={
        <ModelSelectTrigger
          display={current?.label}
          fallback={label}
          label={label}
          showLabel={showLabel}
          minWidth={90}
          disabled={disabled}
          style={style}
        />
      }
      contentStyle={{ minWidth: 140, ...panelShadow }}
    >
      <ModelRadioItems
        value={currentId}
        onValueChange={handleValueChange}
        items={efforts}
      />
    </ModelSelectShell>
  );
}
