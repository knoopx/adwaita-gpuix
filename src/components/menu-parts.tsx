import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { FloatingPanel } from "./FloatingPanel";
import { type IconName } from "./icons";
import {
  MenuGroup,
  MenuIndicator,
  MenuItemRow,
  MenuLabel,
  MenuRadioGroupShell,
  MenuRow,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  makeMenuRadioItem,
  type MenuControlItemProps,
} from "./menu";

export interface MenuFamily {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface MenuGroupProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface MenuLabelPartProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface MenuSeparatorPartProps {
  style?: Partial<StyleDesc>;
}

export interface MenuShortcutPartProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface MenuSubPartProps {
  children?: ReactNode;
  defaultOpen?: boolean;
  style?: Partial<StyleDesc>;
}

export interface MenuSubTriggerPartProps {
  label: string;
  icon?: IconName;
  style?: Partial<StyleDesc>;
}

export interface MenuSubContentPartProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface MenuCheckboxItemPartProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  style?: Partial<StyleDesc>;
}

export interface MenuRadioGroupPartProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface MenuRadioItemPartProps {
  label: string;
  value?: string;
  selected?: boolean;
  onSelect?: () => void;
  style?: Partial<StyleDesc>;
}

export interface MenuItemPartProps extends MenuControlItemProps {}

export interface MenuContentPartProps {
  children?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  maxHeight?: number;
  style?: Partial<StyleDesc>;
}

export interface MenuPartsOptions {
  panelMinWidth?: number;

  panelXOffset?: number;

  rowStyle?: Partial<StyleDesc>;
}

export function makeMenuParts(
  useFamily: () => MenuFamily,
  options: MenuPartsOptions = {},
) {
  const { panelMinWidth = 160, panelXOffset, rowStyle } = options;

  function Item({
    label,
    icon,
    onClick,
    disabled,
    inset,
    variant,
    shortcut,
    style,
  }: MenuItemPartProps) {
    const { onOpenChange } = useFamily();
    return (
      <MenuItemRow
        label={label}
        icon={icon}
        onClick={onClick}
        onOpenChange={onOpenChange}
        disabled={disabled}
        variant={variant}
        shortcut={shortcut}
        style={{
          ...rowStyle,
          ...(inset ? { paddingLeft: 32 } : {}),
          ...style,
        }}
      />
    );
  }

  function CheckboxItem({
    label,
    checked,
    onCheckedChange,
    style,
  }: MenuCheckboxItemPartProps) {
    const { onOpenChange } = useFamily();
    return (
      <MenuRow
        label={label}
        leading={<MenuIndicator kind="checkbox" active={checked} />}
        onClick={() => {
          onCheckedChange(!checked);
          onOpenChange(false);
        }}
        style={{ ...rowStyle, ...style }}
      />
    );
  }

  function RadioGroup({
    value,
    defaultValue,
    onValueChange,
    children,
    style,
  }: MenuRadioGroupPartProps) {
    return (
      <MenuRadioGroupShell
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        children={children}
        style={style}
      />
    );
  }

  const RadioBase = makeMenuRadioItem(useFamily);

  function RadioItem(props: MenuRadioItemPartProps) {
    return <RadioBase {...props} style={{ ...rowStyle, ...props.style }} />;
  }

  function Content({
    children,
    side = "bottom",
    sideOffset = 4,
    style,
  }: MenuContentPartProps) {
    const { open } = useFamily();
    if (!open) return null;
    return (
      <FloatingPanel
        side={side}
        sideOffset={sideOffset}
        xOffset={panelXOffset}
        minWidth={panelMinWidth}
        style={style}
      >
        {children}
      </FloatingPanel>
    );
  }

  function Group({ children, style }: MenuGroupProps) {
    return <MenuGroup style={style}>{children}</MenuGroup>;
  }

  function Label({ children, style }: MenuLabelPartProps) {
    return <MenuLabel style={style}>{children}</MenuLabel>;
  }

  function Separator({ style }: MenuSeparatorPartProps) {
    return <MenuSeparator style={style} />;
  }

  function Shortcut({ children, style }: MenuShortcutPartProps) {
    return <MenuShortcut style={style}>{children}</MenuShortcut>;
  }

  function Sub({ children, defaultOpen, style }: MenuSubPartProps) {
    return (
      <MenuSub defaultOpen={defaultOpen} style={style}>
        {children}
      </MenuSub>
    );
  }

  function SubTrigger({ label, icon, style }: MenuSubTriggerPartProps) {
    return (
      <MenuSubTrigger
        label={label}
        icon={icon}
        {...(rowStyle ? { rowStyle } : {})}
        style={style}
      />
    );
  }

  function SubContent({ children, style }: MenuSubContentPartProps) {
    return <MenuSubContent style={style}>{children}</MenuSubContent>;
  }

  return {
    Item,
    CheckboxItem,
    RadioGroup,
    RadioItem,
    Content,
    Group,
    Label,
    Separator,
    Shortcut,
    Sub,
    SubTrigger,
    SubContent,
  };
}
