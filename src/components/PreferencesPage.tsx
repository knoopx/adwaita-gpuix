import { Children, type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, rowHoverBg, useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { Icon, type IconName } from "./icons";
import { BoxedList } from "./BoxedList";

export interface PreferencesGroupAction {
  label: string;
  icon?: IconName;
  onClick: () => void;
}

export interface PreferencesGroupProps {
  title: string;

  action?: PreferencesGroupAction;
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

function groupHeadingStyle(t: AdwaitaTheme): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: t.space.sm,
  };
}

function GroupAction({ action }: { action: PreferencesGroupAction }) {
  const t = useAdwaita();
  return (
    <div
      onClick={action.onClick}
      tabIndex={0}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.xs,
        padding: t.space.xs,
        borderRadius: t.radius.sm,
        cursor: "pointer",
        hover: { backgroundColor: rowHoverBg(t) },
      }}
    >
      {action.icon ? (
        <Icon
          name={action.icon}
          size={16}
          color={t.color.text.primary}
          style={{ pointerEvents: "none" }}
        />
      ) : null}
      <T size="body" color={t.color.text.primary}>
        {action.label}
      </T>
    </div>
  );
}

export function PreferencesGroup({
  title,
  action,
  children,
  style,
}: PreferencesGroupProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",

        gap: t.control.headingToGroupGap,
        ...style,
      }}
    >
      <div style={groupHeadingStyle(t)}>
        <T size="title3" weight={700} color={t.color.text.primary}>
          {title}
        </T>
        <div style={{ flexGrow: 1, flexShrink: 1, minWidth: 0 }} />
        {action ? <GroupAction action={action} /> : null}
      </div>
      <BoxedList>{children}</BoxedList>
    </div>
  );
}

export interface PreferencesPageProps {
  children: ReactNode;

  scrollable?: boolean;

  estimatedItemHeight?: number;

  fullBleed?: boolean;
  style?: Partial<StyleDesc>;
}

export function PreferencesPage({
  children,
  scrollable = false,
  estimatedItemHeight,
  fullBleed = false,
  style,
}: PreferencesPageProps) {
  const t = useAdwaita();
  const items = Children.toArray(children);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: 0,
        paddingLeft: fullBleed ? t.space.lg : t.control.settingsPagePaddingX,
        paddingRight: fullBleed ? t.space.lg : t.control.settingsPagePaddingX,
        paddingTop: t.control.settingsPagePaddingY,
        paddingBottom: t.control.settingsPagePaddingY,
        ...style,
      }}
    >
      {scrollable ? (
        <virtual-list
          estimatedItemHeight={estimatedItemHeight ?? t.control.rowHeight}
          style={{ flexGrow: 1, minHeight: 0 }}
        >
          {items.map((child, i) => (
            <div
              key={i}
              style={
                i < items.length - 1 ? { marginBottom: t.space.xl } : undefined
              }
            >
              {child}
            </div>
          ))}
        </virtual-list>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: t.space.xl,
            width: "100%",
            maxWidth: fullBleed ? undefined : t.control.settingsPageMaxWidth,

            alignSelf: "flex-start",
            flexGrow: 1,
            minHeight: 0,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
