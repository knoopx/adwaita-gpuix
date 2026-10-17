import type { ReactNode } from "react";
import type { StyleDesc, EventPayload } from "@gpuix/react";
import { motion } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import {
  T,
  Scrim,
  CloseButton,
  dialogCardStyle,
  OverlayTitle,
  OverlayDescription,
} from "./common";
import { Button } from "./Button";

export interface DialogRootProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  contained?: boolean;
  children?: ReactNode;
}

export interface DialogTriggerProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface DialogContentProps {
  children?: ReactNode;

  showCloseButton?: boolean;
  style?: Partial<StyleDesc>;
}

export interface DialogHeaderProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface DialogTitleProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface DialogDescriptionProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface DialogFooterProps {
  children?: ReactNode;

  destructive?: boolean;
  style?: Partial<StyleDesc>;
}

export interface DialogCloseProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

interface DialogContext {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contained: boolean;
}

import { Children, createContext, useContext } from "react";
const DialogCtx = createContext<DialogContext | null>(null);

function useDialog(): DialogContext {
  const ctx = useContext(DialogCtx);
  if (!ctx) throw new Error("Dialog components must be used within <Dialog>");
  return ctx;
}

const noop = () => {};

export function Dialog({
  open,
  onOpenChange,
  contained = false,
  children,
}: DialogRootProps) {
  return (
    <DialogCtx.Provider value={{ open, onOpenChange, contained }}>
      {children}
    </DialogCtx.Provider>
  );
}

export function DialogTrigger({ children, style }: DialogTriggerProps) {
  const { onOpenChange } = useDialog();
  return (
    <div
      onClick={() => onOpenChange(true)}
      style={{ cursor: "pointer", ...style }}
    >
      {children}
    </div>
  );
}

export function DialogContent({
  children,
  showCloseButton = true,
  style,
}: DialogContentProps) {
  const { open, onOpenChange, contained } = useDialog();
  const t = useAdwaita();
  const gap = t.spacing.gap;

  if (!open) return null;

  const pos = contained ? "absolute" : "fixed";

  return (
    <div
      style={{
        position: pos,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
        ...style,
      }}
      onKeyDown={(e: EventPayload) => {
        if (e.key === "Escape") onOpenChange(false);
      }}
    >
      <Scrim position={pos} onDismiss={() => onOpenChange(false)} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        style={{ position: "relative" }}
      >
        <div
          style={{
            ...dialogCardStyle(t),
            boxShadow: {
              offsetX: 0,
              offsetY: 4,
              blurRadius: 16,
              spreadRadius: 0,
              color: "rgba(0,0,0,0.35)",
            },
          }}
        >
          {children}
          {showCloseButton ? (
            <CloseButton
              onClick={() => onOpenChange(false)}
              style={{ position: "absolute", top: gap, right: gap }}
            />
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

export function DialogHeader({ children, style }: DialogHeaderProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      {children}
    </div>
  );
}

export function DialogTitle(props: DialogTitleProps) {
  return <OverlayTitle {...props} />;
}

export function DialogDescription(props: DialogDescriptionProps) {
  return <OverlayDescription {...props} />;
}

export function DialogFooter({
  children,
  destructive = false,
  style,
}: DialogFooterProps) {
  const t = useAdwaita();
  const gap = t.spacing.gap;

  if (!destructive) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap,
          ...style,
        }}
      >
        {children}
      </div>
    );
  }

  const kids = Children.toArray(children);
  if (kids.length < 2) return <DialogFooter children={children} style={style} />;

  const [first, ...rest] = kids;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap,
        ...style,
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", gap, flexShrink: 0 }}>
        {first}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap,
        }}
      >
        {rest}
      </div>
    </div>
  );
}

export function DialogClose({ children, style }: DialogCloseProps) {
  const { onOpenChange } = useDialog();

  // icon mode: keep the compact 24x24 close-button box (e.g. the auto X).
  if (children == null) {
    return <CloseButton onClick={() => onOpenChange(false)} style={style} />;
  }

  // text mode: render a text button so a custom label matches the footer
  // buttons (content-sized width, 34px min-height) instead of overflowing
  // the fixed 24x24 icon box.
  return (
    <Button variant="text" onClick={() => onOpenChange(false)} style={style}>
      {children}
    </Button>
  );
}

function StageBox({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

export function DialogShowcase(): ReactNode {
  const t = useAdwaita();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Dialog open={false} onOpenChange={noop}>
            <DialogTrigger>
              <Button label="Open dialog" onClick={noop} />
            </DialogTrigger>
          </Dialog>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <T size="caption" color={t.colors.dim_fg}>
            adwaita idiom — destructive action on the left, cancel / suggested
            on the right (auto close button)
          </T>
          <StageBox width={480} height={190}>
            <Dialog open={true} onOpenChange={noop} contained>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog title</DialogTitle>
                  <DialogDescription>
                    A description of what this dialog is about.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter destructive>
                  <Button variant="destructive" label="Delete" onClick={noop} />
                  <Button label="Cancel" onClick={noop} />
                  <Button variant="suggested" label="Save" onClick={noop} />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </StageBox>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <T size="caption" color={t.colors.dim_fg}>
            showCloseButton=false + custom DialogClose in the footer
          </T>
          <StageBox width={480} height={190}>
            <Dialog open={true} onOpenChange={noop} contained>
              <DialogContent showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>Custom close</DialogTitle>
                  <DialogDescription>
                    The auto close button is disabled; the footer carries a
                    DialogClose.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose>
                    <T size="caption" color={t.colors.dim_fg}>
                      Close
                    </T>
                  </DialogClose>
                  <Button label="Cancel" onClick={noop} />
                  <Button variant="suggested" label="Save" onClick={noop} />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </StageBox>
        </div>
      </div>
    </div>
  );
}
