import { type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T, CloseButton, OverlayDescription } from "./common";
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
  PanelShowcaseSection,
  PanelSideStages,
  PanelShowcaseStage,
  PaddedSection,
  type PanelSide,
  type PanelRootProps,
} from "./PanelBase";
import { Button } from "./Button";

export type SheetSide = PanelSide;

export interface SheetProps extends PanelRootProps {}

export interface SheetContentProps {
  children?: ReactNode;

  showCloseButton?: boolean;
  style?: Partial<StyleDesc>;
}

export interface SheetTriggerProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface SheetDescriptionProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface SheetFooterProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface SheetHeaderProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface SheetTitleProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface SheetCloseProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

const { PanelCtx: SheetCtx, usePanel: useSheet } =
  createPanelContext("Sheet");

export function Sheet({
  open,
  onOpenChange,
  side = "right",
  contained = false,
  children,
  style,
}: SheetProps) {
  const t = useAdwaita();
  const ctxValue = { open, onOpenChange, contained, side };

  return (
    <SheetCtx.Provider value={ctxValue}>
      {open
        ? renderPanelShell({
            onOpenChange,
            contained,
            side,
            children,
            style,
            colors: t.colors,
          })
        : null}
    </SheetCtx.Provider>
  );
}

export const SheetTrigger = makePanelTrigger(useSheet);

export function SheetContent({
  children,
  style,
  showCloseButton = true,
}: SheetContentProps) {
  const t = useAdwaita();
  const { onOpenChange } = useSheet();
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        ...style,
      }}
    >
      {children}
      {showCloseButton ? (
        <CloseButton
          onClick={() => onOpenChange(false)}
          style={{
            position: "absolute",
            top: t.spacing.gap,
            right: t.spacing.gap,
          }}
        />
      ) : null}
    </div>
  );
}

export const SheetHeader = makePanelHeader(useSheet);

export function SheetTitle({ children, style }: SheetTitleProps) {
  const t = useAdwaita();
  return (
    <T size="title3" weight={700} color={t.colors.fg} style={style}>
      {children}
    </T>
  );
}

export function SheetDescription(props: SheetDescriptionProps) {
  return <OverlayDescription {...props} />;
}

export const SheetFooter = makePanelFooter(useSheet);

export const SheetClose = makePanelClose(useSheet);

const noop = () => {};

function SheetBody({ title }: { title: string }) {
  return (
    <SheetContent showCloseButton={false}>
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
        <SheetClose />
      </SheetHeader>
      <PaddedSection>
        <T>Sheet content goes here.</T>
      </PaddedSection>
      <SheetFooter>
        <Button label="Close" onClick={noop} />
      </SheetFooter>
    </SheetContent>
  );
}

export function SheetShowcase(): ReactNode {
  return (
    <PanelShowcase>
      <PanelShowcaseRow>
        <PanelShowcaseColumn caption="Closed (open=false renders nothing)">
          <Sheet open={false} onOpenChange={noop} side="left">
            <SheetTrigger>
              <Button label="Open sheet" onClick={noop} />
            </SheetTrigger>
          </Sheet>
        </PanelShowcaseColumn>
      </PanelShowcaseRow>
      <PanelSideStages
        stages={[
          { side: "left", label: "side=left" },
          { side: "right", label: "side=right" },
          { side: "top", label: "side=top" },
          { side: "bottom", label: "side=bottom" },
        ]}
        renderPanel={(side) => (
          <Sheet open={true} onOpenChange={noop} side={side} contained>
            <SheetBody title={`${side} sheet`} />
          </Sheet>
        )}
      />
      <PanelShowcaseSection caption="Content variants">
        <PanelShowcaseColumn caption="default auto close button (showCloseButton default)">
          <PanelShowcaseStage width={360} height={150}>
            <Sheet open={true} onOpenChange={noop} side="right" contained>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Auto close</SheetTitle>
                </SheetHeader>
                <PaddedSection>
                  <T>
                    The auto close button sits in the panel corner; the header
                    carries no close of its own.
                  </T>
                </PaddedSection>
              </SheetContent>
            </Sheet>
          </PanelShowcaseStage>
        </PanelShowcaseColumn>
        <PanelShowcaseColumn caption="showCloseButton=false + custom SheetClose in the header">
          <PanelShowcaseStage width={360} height={150}>
            <Sheet open={true} onOpenChange={noop} side="right" contained>
              <SheetContent showCloseButton={false}>
                <SheetHeader>
                  <SheetTitle>No auto close</SheetTitle>
                  <SheetClose />
                </SheetHeader>
                <PaddedSection>
                  <T>
                    The auto close button is disabled; the header carries a
                    SheetClose.
                  </T>
                </PaddedSection>
              </SheetContent>
            </Sheet>
          </PanelShowcaseStage>
        </PanelShowcaseColumn>
      </PanelShowcaseSection>
    </PanelShowcase>
  );
}
