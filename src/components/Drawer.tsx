import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { OverlayDescription, OverlayTitle } from "./overlay";
import {
  PANEL_SIDES,
  PaddedSection,
  type PanelRootProps,
  PanelShowcase,
  PanelShowcaseColumn,
  PanelShowcaseRow,
  type PanelSide,
  PanelSideStages,
  createPanelContext,
  makePanelClose,
  makePanelFooter,
  makePanelHeader,
  makePanelTrigger,
  renderPanelShell,
} from "./PanelBase";
import { Button } from "./Button";

export type DrawerSide = PanelSide;

export interface DrawerProps extends PanelRootProps {}

export interface DrawerContentProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface DrawerHeaderProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface DrawerTitleProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface DrawerCloseProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface DrawerTriggerProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface DrawerDescriptionProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface DrawerFooterProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

const noop = () => {};

const { PanelCtx: DrawerCtx, usePanel: useDrawer } =
  createPanelContext("Drawer");

function DrawerDragHandle({ color }: { color: string }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: t.space.sm,
      }}
    >
      <div
        style={{
          width: 36,
          height: 4,
          borderRadius: 2,
          backgroundColor: color,
        }}
      />
    </div>
  );
}

export function Drawer({
  open,
  onOpenChange,
  side = "right",
  contained = false,
  children,
  style,
}: DrawerProps) {
  const t = useAdwaita();
  const ctxValue = { open, onOpenChange, contained, side };

  return (
    <DrawerCtx.Provider value={ctxValue}>
      {open
        ? renderPanelShell({
            onOpenChange,
            contained,
            side,
            children,
            style,
            panelExtra:
              side === "bottom" ? (
                <DrawerDragHandle color={t.color.border.default} />
              ) : null,
          })
        : null}
    </DrawerCtx.Provider>
  );
}

export const DrawerTrigger = makePanelTrigger(useDrawer);

export function DrawerContent({ children, style }: DrawerContentProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const DrawerHeader = makePanelHeader(useDrawer);

export function DrawerTitle(props: DrawerTitleProps) {
  return <OverlayTitle {...props} />;
}

export function DrawerDescription(props: DrawerDescriptionProps) {
  return <OverlayDescription {...props} />;
}

export const DrawerFooter = makePanelFooter(useDrawer);

export const DrawerClose = makePanelClose(useDrawer);

function DrawerBody({ title }: { title: string }) {
  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerClose />
      </DrawerHeader>
      <PaddedSection>
        <T>Drawer content goes here.</T>
      </PaddedSection>
      <DrawerFooter>
        <Button label="Close" onClick={noop} />
      </DrawerFooter>
    </DrawerContent>
  );
}

const DRAWER_SIDES: { side: PanelSide; label: string }[] = PANEL_SIDES.map(
  (stage) =>
    stage.side === "bottom"
      ? { ...stage, label: "side=bottom (drag handle)" }
      : stage,
);

export function DrawerShowcase(): ReactNode {
  return (
    <PanelShowcase>
      <PanelShowcaseRow>
        <PanelShowcaseColumn caption="Closed (open=false renders nothing)">
          <Drawer open={false} onOpenChange={noop} side="right">
            <DrawerTrigger>
              <Button label="Open drawer" onClick={noop} />
            </DrawerTrigger>
          </Drawer>
        </PanelShowcaseColumn>
      </PanelShowcaseRow>
      <PanelSideStages
        stages={DRAWER_SIDES}
        renderPanel={(side) => (
          <Drawer open={true} onOpenChange={noop} side={side} contained>
            <DrawerBody title={`${side} drawer`} />
          </Drawer>
        )}
      />
    </PanelShowcase>
  );
}
