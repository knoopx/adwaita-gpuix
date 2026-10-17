import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { AdwaitaProvider, useAdwaita, type AdwaitaTheme } from "../theme/adwaita";
import { Labeled, T } from "./common";
import { Column } from "./Box";
import { Icon, type IconName } from "./icons";
import {
  Carousel,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "./Carousel";

function CardCarousel({
  visible,
  itemWidth,
  offset,
  cards = 5,
}: {
  visible: number;
  itemWidth?: number;
  offset?: number;
  cards?: number;
}) {
  return (
    <Carousel visible={visible} defaultOffset={offset}>
      {Array.from({ length: cards }, (_, i) => (
        <CarouselItem key={i} width={itemWidth}>
          <T>{`Card ${i + 1}`}</T>
        </CarouselItem>
      ))}
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default defineMeta({
  title: "Adwaita/Carousel",
  component: Carousel,
  parameters: { width: 760, height: 240 },
});

type TintKey = "accent" | "success" | "warning" | "destructive";

function tintFor(t: AdwaitaTheme, key: TintKey) {
  const c = t.colors;
  switch (key) {
    case "accent":
      return { bg: c.accentTint, fg: c.accent };
    case "success":
      return { bg: c.successTint, fg: c.success };
    case "warning":
      return { bg: c.warningTint, fg: c.warning };
    case "destructive":
      return { bg: c.destructiveTint, fg: c.destructive };
  }
}

const SLIDES: { icon: IconName; label: string; caption: string; tint: TintKey }[] =
  [
    { icon: "home", label: "Overview", caption: "Workspace summary", tint: "accent" },
    { icon: "layers", label: "Layers", caption: "Stacked modules", tint: "success" },
    { icon: "clock", label: "Timeline", caption: "Recent activity", tint: "warning" },
    { icon: "settings", label: "Settings", caption: "Preferences", tint: "destructive" },
    { icon: "user", label: "Profile", caption: "Account details", tint: "accent" },
    { icon: "inbox", label: "Inbox", caption: "Unread messages", tint: "success" },
  ];

function Slide({
  icon,
  label,
  caption,
  tint,
}: {
  icon: IconName;
  label: string;
  caption: string;
  tint: TintKey;
}) {
  const t = useAdwaita();
  const c = t.colors;
  const tone = tintFor(t, tint);
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 88,
          borderRadius: t.radii.button,
          backgroundColor: tone.bg,
        }}
      >
        <Icon name={icon} size={28} color={tone.fg} />
      </div>
      <T size="title4" weight={600} color={c.fg}>
        {label}
      </T>
      <T size="caption" color={c.dim_fg}>
        {caption}
      </T>
    </>
  );
}

function Frame({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <Column gap={12} align="center">
      <Labeled caption={caption}>{children}</Labeled>
    </Column>
  );
}

export const defaultWindow = defineStory({
  render: () => (
    <Frame caption="start — prev disabled, next enabled">
      <CardCarousel visible={3} />
    </Frame>
  ),
});

export const customWindow = defineStory({
  parameters: { width: 440, height: 200 },
  render: () => (
    <Frame caption="narrower window (visible=2, item width 160)">
      <CardCarousel visible={2} itemWidth={160} />
    </Frame>
  ),
});

export const withDots = defineStory({
  render: () => (
    <Frame caption="pagination dots — one per page, click to jump">
      <Carousel visible={3}>
        {SLIDES.slice(0, 6).map((s, i) => (
          <CarouselItem key={i}>
            <Slide {...s} />
          </CarouselItem>
        ))}
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </Frame>
  ),
});

export const tintedSlides = defineStory({
  render: () => (
    <Frame caption="token-driven slides (tinted boxes + icons), dark accent">
      <AdwaitaProvider scheme="light" accent="green">
        <Carousel visible={3}>
          {SLIDES.map((s, i) => (
            <CarouselItem key={i}>
              <Slide {...s} />
            </CarouselItem>
          ))}
          <CarouselPrevious />
          <CarouselNext />
          <CarouselDots />
        </Carousel>
      </AdwaitaProvider>
    </Frame>
  ),
});

export const singleSlide = defineStory({
  parameters: { width: 440, height: 240 },
  render: () => (
    <Frame caption="single slide — both arrows disabled, one dot">
      <Carousel visible={1}>
        <CarouselItem width={280}>
          <Slide {...SLIDES[0]} />
        </CarouselItem>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </Frame>
  ),
});

export const manySlides = defineStory({
  render: () => (
    <Frame caption="many slides (8) — dots per page">
      <Carousel visible={3}>
        {Array.from({ length: 8 }, (_, i) => (
          <CarouselItem key={i}>
            <T>Slide {i + 1}</T>
          </CarouselItem>
        ))}
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </Frame>
  ),
});

export const atEnd = defineStory({
  render: () => (
    <Frame caption="end — next disabled, prev enabled">
      <CardCarousel visible={3} offset={2} />
    </Frame>
  ),
});

export const empty = defineStory({
  parameters: { width: 440, height: 140 },
  render: () => (
    <Frame caption="empty — no items, arrows disabled, dots hidden">
      <Carousel visible={3}>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </Frame>
  ),
});
