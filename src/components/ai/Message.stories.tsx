import { type ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { Labeled, T } from "../text";
import { Column, Row } from "../Box";
import { Icon, type IconName } from "../../components/icons";
import { Spinner } from "../../components/Spinner";
import { type CitationSource, InlineCitation } from "./InlineCitation";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "./Message";

function Glyph({ name }: { name: IconName }) {
  const t = useAdwaita();
  return <Icon name={name} size={16} color={t.color.text.dim} />;
}

const CITATION_SOURCES: CitationSource[] = [
  {
    title: "Vulkan Descriptor Sets Guide",
    url: "https://vulkan.lunarg.com/doc/latest/best_practices.html",
  },
  {
    title: "GPU Memory Bandwidth",
    url: "https://arxiv.org/abs/2401.00000",
  },
];

function AssistantMessage({
  body,
  children,
  trailing,
  time = "10:42",
  header = true,
  footer = true,
}: {
  body?: string;
  children?: ReactNode;
  trailing?: ReactNode;
  time?: string;
  header?: boolean;
  footer?: boolean;
}) {
  const t = useAdwaita();
  return (
    <Message align="start">
      <MessageAvatar>
        <Glyph name="autoAwesome" />
      </MessageAvatar>
      <MessageContent>
        {header ? (
          <MessageHeader>
            <T size="caption" weight={600}>
              Assistant
            </T>
            {trailing ?? (
              <T size="caption" color={t.color.text.dim}>
                {time}
              </T>
            )}
          </MessageHeader>
        ) : null}
        {children ?? <T size="body">{body}</T>}
        {footer ? (
          <MessageFooter>
            <T size="caption" color={t.color.text.dim}>
              Copy
            </T>
            <T size="caption" color={t.color.text.dim}>
              Regenerate
            </T>
          </MessageFooter>
        ) : null}
      </MessageContent>
    </Message>
  );
}

function UserMessage({
  body,
  header = false,
  avatar = true,
  time = "10:43",
  footer,
}: {
  body: string;
  header?: boolean;
  avatar?: boolean;
  time?: string;
  footer: string;
}) {
  const t = useAdwaita();
  return (
    <Message align="end">
      {avatar ? (
        <MessageAvatar>
          <Glyph name="person" />
        </MessageAvatar>
      ) : null}
      <MessageContent>
        {header ? (
          <MessageHeader style={{ justifyContent: "flex-end" }}>
            <T size="caption" weight={600}>
              You
            </T>
            <T size="caption" color={t.color.text.dim}>
              {time}
            </T>
          </MessageHeader>
        ) : null}
        <T size="body" color={t.color.text.onAccent}>
          {body}
        </T>
        <MessageFooter>
          <T size="caption" color={t.color.text.dim}>
            {footer}
          </T>
        </MessageFooter>
      </MessageContent>
    </Message>
  );
}

export default defineMeta({
  title: "Adwaita/Message",
  component: Message,
  parameters: { width: 528, height: 360 },
});

export function conversation() {
  return (
    <Labeled caption="MessageGroup with start + end messages">
      <MessageGroup>
        <AssistantMessage body="I would use a double-buffered ring buffer for the vertex stream so the GPU never waits on the CPU." />
        <UserMessage
          body="Make the buffer strategy explicit in the plan."
          footer="10:43"
        />
      </MessageGroup>
    </Labeled>
  );
}

export function assistant() {
  return (
    <Labeled caption="Assistant message — bare text on view_bg">
      <AssistantMessage body="I would use a double-buffered ring buffer for the vertex stream so the GPU never waits on the CPU." />
    </Labeled>
  );
}
assistant.parameters = { width: 528, height: 220 };

export function user() {
  return (
    <Labeled caption="User message — accentTint bubble, accent_fg text">
      <UserMessage
        header
        body="Make the buffer strategy explicit in the plan, with the flip cadence and the fallback when the fence stalls."
        footer="Copy"
      />
    </Labeled>
  );
}
user.parameters = { width: 528, height: 220 };

export const streaming = defineStory({
  parameters: { width: 528, height: 220 },
  render: () => (
    <Labeled caption="Streaming assistant message — spinner in header">
      <AssistantMessage
        footer={false}
        trailing={<Spinner size={16} label={false} />}
      >
        <T size="body">
          I'll start by finding where the ring buffer is allocated…
        </T>
      </AssistantMessage>
    </Labeled>
  ),
});

export function citations() {
  const t = useAdwaita();
  return (
    <Labeled caption="Assistant message with inline citations">
      <AssistantMessage
        footer={false}
        trailing={
          <T size="caption" color={t.color.text.dim}>
            10:44
          </T>
        }
      >
        <Row gap={4} align="start" style={{ minWidth: 0 }}>
          <T size="body">Descriptor-set batching cuts per-draw CPU cost</T>
          <InlineCitation sources={CITATION_SOURCES} index={1} />
          <T size="body">, and texture fetches dominate mobile GPU bandwidth</T>
          <InlineCitation sources={CITATION_SOURCES} index={2} />
          <T size="body">.</T>
        </Row>
      </AssistantMessage>
    </Labeled>
  );
}
citations.parameters = { width: 528, height: 220 };

export function virtualList() {
  const t = useAdwaita();
  return (
    <Column gap={16} align="center">
      <Labeled caption="Message rows inside a virtual-list (app context)">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: 300,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <virtual-list
            estimatedItemHeight={48}
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              minHeight: 0,
              width: "100%",
            }}
          >
            <div>
              <AssistantMessage body="I would use a double-buffered ring buffer for the vertex stream so the GPU never waits on the CPU. The producer writes into the back buffer while the consumer drains the front one, and a fence flips them every frame so neither side ever blocks on a sync point." />
            </div>
            <div>
              <UserMessage
                avatar={false}
                body="Make the buffer strategy explicit in the plan, with the flip cadence and the fallback when the fence stalls."
                footer="10:43"
              />
            </div>
            <div>
              <AssistantMessage
                header={false}
                body="Done — the plan now names the ring-buffer cadence, the fence stall threshold, and the single-buffer fallback path for the first frame of every session."
              />
            </div>
          </virtual-list>
        </div>
      </Labeled>
    </Column>
  );
}
