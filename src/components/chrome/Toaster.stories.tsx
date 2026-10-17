import type { StyleDesc } from "@gpuix/react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { Labeled, T } from "../common";
import { Row, Column } from "../Box";
import {
  Toaster,
  type ToasterPosition,
} from "./Toaster";
import { type ToastType } from "./Toast";
import { Stage } from "../.storybook/story-helpers";

function ToastStage({
  toasts,
  position = "bottom-left",
  width = 360,
  height = 160,
  captionPos = "top-left",
}: {
  toasts: { message: string; type?: ToastType; actionLabel?: string }[];
  position?: ToasterPosition;
  width?: number;
  height?: number;
  captionPos?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const t = useAdwaita();
  const { colors } = t;
  const captionStyle: StyleDesc = {
    position: "absolute",
    ...(captionPos === "top-right"
      ? { top: 8, right: 12 }
      : captionPos === "bottom-left"
        ? { bottom: 8, left: 12 }
        : captionPos === "bottom-right"
          ? { bottom: 8, right: 12 }
          : { top: 8, left: 12 }),
  };
  return (
    <Stage width={width} height={height}>
      <div style={captionStyle}>
        <T size="caption" color={colors.dim_fg}>
          App window
        </T>
      </div>
      <Toaster
        toasts={toasts.map((toast, i) => ({ id: `story-${i}`, ...toast }))}
        position={position}
        onDismiss={() => {}}
      />
    </Stage>
  );
}

export default defineMeta({
  title: "Adwaita/Toaster",
  component: Toaster,
  parameters: { width: 528, height: 720 },
});

export const single = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="single toast (default position)">
        <ToastStage
          width={360}
          height={120}
          toasts={[{ message: "File saved" }]}
        />
      </Labeled>
    </Column>
  ),
});

export const toastTypes = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="default / success / warning / error / loading">
        <ToastStage
          width={420}
          height={248}
          captionPos="top-right"
          toasts={[
            { message: "File saved" },
            { message: "Build succeeded", type: "success" },
            { message: "Disk almost full", type: "warning" },
            { message: "Upload failed", type: "error" },
            { message: "Uploading…", type: "loading" },
          ]}
        />
      </Labeled>
    </Column>
  ),
});

export const actionDismiss = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="action button + close icon">
        <ToastStage
          width={300}
          height={120}
          captionPos="top-right"
          toasts={[
            { message: "File deleted", actionLabel: "Undo" },
            { message: "Copied to clipboard" },
          ]}
        />
      </Labeled>
    </Column>
  ),
});

export const longError = defineStory({
  parameters: { width: 980, height: 260 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="long multi-line error (jj stderr)">
        <ToastStage
          width={956}
          height={160}
          captionPos="top-right"
          position="bottom-center"
          toasts={[
            {
              message:
                'Failed: Error: There is no jj repo in "."\nHint: It looks like this is a git repo. You can create a jj repo backed by it by running this:\njj git init',
              type: "error",
            },
          ]}
        />
      </Labeled>
    </Column>
  ),
});

export const longWrap = defineStory({
  parameters: { width: 560, height: 220 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="wraps only at the window edge (full width)">
        <ToastStage
          width={536}
          height={180}
          captionPos="top-right"
          position="bottom-center"
          toasts={[
            {
              message:
                "Failed: Error: unable to push bookmark \"main\" to remote \"origin\": the remote has advanced since the last fetch, so the push was rejected; fetch the remote first and rebase, or push with --force if this is intended",
              type: "error",
            },
          ]}
        />
      </Labeled>
    </Column>
  ),
});

export const empty = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="no toasts (region is transparent and inert)">
        <ToastStage
          width={360}
          height={120}
          toasts={[]}
        />
      </Labeled>
    </Column>
  ),
});

export const positions = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Row gap={16}>
        <Labeled caption="bottom-left (default)">
          <ToastStage
            width={250}
            height={120}
            toasts={[{ message: "Saved" }]}
          />
        </Labeled>
        <Labeled caption="bottom-right">
          <ToastStage
            width={250}
            height={120}
            position="bottom-right"
            toasts={[{ message: "Saved", type: "success" }]}
          />
        </Labeled>
      </Row>
      <Row gap={16}>
        <Labeled caption="bottom-center">
          <ToastStage
            width={250}
            height={120}
            position="bottom-center"
            captionPos="top-right"
            toasts={[{ message: "Saved", type: "success" }]}
          />
        </Labeled>
        <Labeled caption="top-center">
          <ToastStage
            width={250}
            height={120}
            position="top-center"
            captionPos="bottom-left"
            toasts={[{ message: "Saved", type: "info" }]}
          />
        </Labeled>
      </Row>
      <Row gap={16}>
        <Labeled caption="top-left">
          <ToastStage
            width={250}
            height={120}
            position="top-left"
            captionPos="bottom-right"
            toasts={[{ message: "Saved", type: "info" }]}
          />
        </Labeled>
        <Labeled caption="top-right">
          <ToastStage
            width={250}
            height={120}
            position="top-right"
            captionPos="bottom-left"
            toasts={[{ message: "Saved", type: "warning" }]}
          />
        </Labeled>
      </Row>
    </Column>
  ),
});
