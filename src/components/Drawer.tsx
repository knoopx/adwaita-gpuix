import { type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T, OverlayTitle, OverlayDescription } from "./common";
import {
  createPanelContext,
  renderPanelShell,
  makePanelTrigger,
  makePanelClose,
  makePanelHeader,
  makePanelFooter,
  PanelShowcase,
  PanelShowcaseRow,
  PanelShowcaseColumn,
  PanelSideStages,
  PaddedSection,
  type PanelSide,
  type PanelRootProps,
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
        padding: t.spacing.gap,
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
            colors: t.colors,
            panelExtra:
              side === "bottom" ? <DrawerDragHandle color={t.colors.border} /> : null,
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
        stages={[
          { side: "left", label: "side=left" },
          { side: "right", label: "side=right" },
          { side: "top", label: "side=top" },
          { side: "bottom", label: "side=bottom (drag handle)" },
        ]}
        renderPanel={(side) => (
          <Drawer open={true} onOpenChange={noop} side={side} contained>
            <DrawerBody title={`${side} drawer`} />
          </Drawer>
        )}
      />
    </PanelShowcase>
  );
}
