import type { ReactNode } from "react";
import { Panel } from "../../lib/panel";
import { Separator } from "../Separator";

export function ScreenLayout({
  leftTitle,
  leftFocused,
  leftGrow = 28,
  left,
  rightGrow = 72,
  mid,
  bottomTitle,
  bottom,
  trailing,
  midTitle,
  midFocused,
  midTrailing,
  bottomTrailing,
  bottomFocused,
  midHeaderless,
}: {
  leftTitle: ReactNode;
  leftFocused: boolean;
  leftGrow?: number;
  left: ReactNode;
  rightGrow?: number;

  mid?: ReactNode;
  bottomTitle: ReactNode;
  bottom: ReactNode;

  trailing?: ReactNode;

  midTitle?: ReactNode;

  midFocused?: boolean;

  midTrailing?: ReactNode;

  bottomTrailing?: ReactNode;

  bottomFocused?: boolean;

  midHeaderless?: boolean;
}) {
  const hasMid = mid != null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        flexBasis: 0,
        minHeight: 0,
        minWidth: 0,
      }}
    >
      <Panel
        title={leftTitle}
        focused={leftFocused}
        trailing={trailing}
        bordered={false}
        style={{
          flexGrow: leftGrow,
          flexBasis: 0,
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {left}
      </Panel>
      <Separator orientation="vertical" style={{ alignSelf: "stretch" }} />
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
        {hasMid && (
          <>
            <Panel
              title={midTitle}
              focused={midFocused}
              trailing={midTrailing ?? trailing}
              headerless={midHeaderless}
              bordered={false}
              style={{ flexGrow: 30, flexBasis: 0, minHeight: 0 }}
            >
              {mid}
            </Panel>
            <Separator />
          </>
        )}
        <Panel
          title={bottomTitle}
          focused={bottomFocused}
          trailing={bottomTrailing}
          bordered={false}
          style={{
            flexGrow: hasMid ? 70 : 100,
            flexBasis: 0,
            minHeight: 0,
          }}
        >
          {bottom}
        </Panel>
      </div>
    </div>
  );
}
