import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Column } from "../Box";
import { Chat, ChatHeader, ChatMessage, ChatEmptyState } from "./Chat";
import { PromptInput } from "./PromptInput";
import { Reasoning, ReasoningHeader, ReasoningContent } from "./Reasoning";

function ChatDescription({
  text,
  style,
}: {
  text: string;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <T size="caption" color={t.colors.dim_fg} style={style}>
      {text}
    </T>
  );
}

export default defineMeta({
  title: "Adwaita/Chat",
  component: Chat,
  parameters: { width: 528, height: 560 },
});

export const reference = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Chat height={520}>
        <ChatHeader title="New Thread" />
        <ChatDescription text="Ask the agent to change your code." />
        <ChatEmptyState
          icon="circleDashed"
          title="What should we build?"
          description="The agent can read your code, run commands and make changes. Press send to start."
          style={{ flexGrow: 1 }}
        />
        <PromptInput value="Add a dark mode toggle to the settings page." />
      </Chat>
    </Column>
  ),
});

function ChatDemo({
  children,
  prompt,
}: {
  children?: ReactNode;
  prompt?: ReactNode;
}) {
  return (
    <Column gap={16} align="center">
      <Chat height={520}>
        <ChatHeader title="Settings page" />
        <ChatMessage role="user" timestamp="10:42">
          Add a dark mode toggle to the settings page.
        </ChatMessage>
        {children}
        {prompt}
      </Chat>
    </Column>
  );
}

export const conversation = defineStory({
  render: () => (
    <ChatDemo prompt={<PromptInput placeholder="Message the agent…" />}>
      <ChatMessage role="assistant" timestamp="10:42">
        <Reasoning duration={4}>
          <ReasoningHeader />
          <ReasoningContent>
            {"The theme is driven by an AdwaitaProvider scheme; the toggle needs to switch it between light and dark."}
          </ReasoningContent>
        </Reasoning>
        <T size="body">
          I found the theme tokens in src/theme. I'll add a scheme toggle
          that switches the provider between light and dark, and persist
          the choice.
        </T>
      </ChatMessage>
      <ChatMessage role="user" timestamp="10:43">
        Can you show me the diff before applying it?
      </ChatMessage>
      <ChatMessage role="assistant" timestamp="10:43">
        Yes — here is the change: the toggle writes the scheme to the
        provider and the tokens re-resolve. Applying it now.
      </ChatMessage>
    </ChatDemo>
  ),
});

export const streaming = defineStory({
  render: () => (
    <ChatDemo
      prompt={
        <PromptInput value="Add a dark mode toggle to the settings page." disabled />
      }
    >
      <ChatMessage role="assistant" streaming>
        <Reasoning isStreaming defaultOpen>
          <ReasoningHeader />
          <ReasoningContent>
            {"Reading the settings page component…"}
            {"Locating the AdwaitaProvider usage…"}
          </ReasoningContent>
        </Reasoning>
        <T size="body">
          I'll start by finding where the theme provider is wired up…
        </T>
      </ChatMessage>
    </ChatDemo>
  ),
});
