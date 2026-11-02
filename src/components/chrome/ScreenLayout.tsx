import { type ReactNode, useEffect, useRef, useState } from "react";
import { Panel } from "../../lib/panel";
import { Divider, DividerGroup, useDividerGroup } from "../Divider";
import { useAdwaita } from "../../theme/adwaita";

function usePaneSize(cfg: { min: number; max: number; defaultSize: number }) {
  const group = useDividerGroup();
  const cfgRef = useRef(cfg);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    if (!group) return;
    const i = group.registerPanel(cfgRef.current);
    setIndex(i);
    const g = group;
    return () => g.unregisterPanel(i);
  }, []);

  if (!group || index < 0) return undefined;
  return group.sizes[index];
}

function SidePane({
  grow,
  title,
  focused,
  trailing,
  headerRadiusStart,
  children,
}: {
  grow: number;
  title: ReactNode;
  focused: boolean;
  trailing?: ReactNode;
  headerRadiusStart?: number;
  children: ReactNode;
}) {
  const group = useDividerGroup();
  const size = usePaneSize({ min: 220, max: 720, defaultSize: 360 });
  return (
    <Panel
      title={title}
      focused={focused}
      trailing={trailing}
      headerRadiusStart={headerRadiusStart}
      bordered={false}
      style={{
        ...(size != null
          ? {
              flexBasis: size,
              width: size,
              flexGrow: 0,
              flexShrink: 0,
            }
          : { flexGrow: grow, flexBasis: 0 }),
        minWidth: 0,
        minHeight: 0,
      }}
    >
      {children}
    </Panel>
  );
}

function TopPane({
  grow,
  title,
  focused,
  trailing,
  headerless,
  headerRadiusEnd,
  children,
}: {
  grow: number;
  title?: ReactNode;
  focused?: boolean;
  trailing?: ReactNode;
  headerless?: boolean;
  headerRadiusEnd?: number;
  children: ReactNode;
}) {
  const group = useDividerGroup();
  const size = usePaneSize({ min: 120, max: 600, defaultSize: 240 });
  return (
    <Panel
      title={title}
      focused={focused}
      trailing={trailing}
      headerless={headerless}
      headerRadiusEnd={headerRadiusEnd}
      bordered={false}
      style={{
        ...(size != null
          ? {
              flexBasis: size,
              height: size,
              flexGrow: 0,
              flexShrink: 0,
            }
          : { flexGrow: grow, flexBasis: 0 }),
        minHeight: 0,
      }}
    >
      {children}
    </Panel>
  );
}

export function ScreenLayout({
  leftTitle,
  leftFocused,
  leftGrow = 28,
  left,
  rightGrow = 72,
  mid,
  bottomTitle,
  bottom,
  bottomHeaderless = false,
  trailing,
  midTitle,
  midFocused,
  midTrailing,
  bottomTrailing,
  bottomFocused,
  midHeaderless,

  cornerRadius,
}: {
  leftTitle: ReactNode;
  leftFocused: boolean;
  leftGrow?: number;
  left: ReactNode;
  rightGrow?: number;

  mid?: ReactNode;
  bottomTitle?: ReactNode;
  bottom: ReactNode;

  bottomHeaderless?: boolean;

  trailing?: ReactNode;

  midTitle?: ReactNode;

  midFocused?: boolean;

  midTrailing?: ReactNode;

  bottomTrailing?: ReactNode;

  bottomFocused?: boolean;

  midHeaderless?: boolean;

  cornerRadius?: number;
}) {
  const t = useAdwaita();
  const hasMid = mid != null;

  return (
    <DividerGroup
      orientation="horizontal"
      style={{
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        flexBasis: 0,
        minHeight: 0,
        minWidth: 0,
      }}
    >
      <SidePane
        grow={leftGrow}
        title={leftTitle}
        focused={leftFocused}
        trailing={trailing}
        headerRadiusStart={cornerRadius}
      >
        {left}
      </SidePane>
      <Divider
        orientation="vertical"
        thickness={1}
        resize={0}
        style={{
          alignSelf: "stretch",
          backgroundColor: "transparent",
          marginLeft: -2,
          marginRight: -2,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: rightGrow,
          flexBasis: 0,
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {hasMid ? (
          <DividerGroup
            orientation="vertical"
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              flexBasis: 0,
              minHeight: 0,
              minWidth: 0,
            }}
          >
            <TopPane
              grow={30}
              title={midTitle}
              focused={midFocused}
              trailing={midTrailing ?? trailing}
              headerless={midHeaderless}
              headerRadiusEnd={cornerRadius}
            >
              {mid}
            </TopPane>
            <Divider
              orientation="horizontal"
              thickness={1}
              resize={0}
              style={{
                backgroundColor: "transparent",
                marginTop: -2,
                marginBottom: -2,
              }}
            />
            <Panel
              title={bottomTitle}
              focused={bottomFocused}
              trailing={bottomTrailing}
              headerless={bottomHeaderless}
              bordered={false}
              style={{ flexGrow: 70, flexBasis: 0, minHeight: 0 }}
            >
              {bottom}
            </Panel>
          </DividerGroup>
        ) : (
          <Panel
            title={bottomTitle}
            focused={bottomFocused}
            trailing={bottomTrailing}
            headerless={bottomHeaderless}
            headerRadiusEnd={cornerRadius}
            bordered={false}
            style={{ flexGrow: 100, flexBasis: 0, minHeight: 0 }}
          >
            {bottom}
          </Panel>
        )}
      </div>
    </DividerGroup>
  );
}
