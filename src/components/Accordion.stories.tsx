import { defineMeta } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { Icon } from "./icons";
import { Switch } from "./Switch";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion";
import { BoxedList, BoxedRow, SwitchRow } from "./BoxedList";
import {
  ContentHeader,
  PaneBody,
  WindowShell,
} from "../../.storybook/window-shell";
import { MousePrimaryButtonRow } from "../../.storybook/app-helpers";

export default defineMeta({
  title: "Adwaita/Accordion",
  component: Accordion,
  parameters: { width: 760, height: 460 },
});

const noop = () => {};

function Item({
  value,
  title,
  subtitle,
  open,
  children,
}: {
  value: string;
  title: string;
  subtitle?: string;
  open: boolean;
  children?: React.ReactNode;
}) {
  const t = useAdwaita();
  return (
    <AccordionItem value={value}>
      <AccordionTrigger
        style={{
          minHeight: t.control.rowMinHeight,
          paddingTop: t.space.md,
          paddingBottom: t.space.md,
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: t.space.xs }}
        >
          <T size="body" color={t.color.text.primary}>
            {title}
          </T>
          {subtitle ? (
            <T size="caption" color={t.color.text.dim}>
              {subtitle}
            </T>
          ) : null}
        </div>
      </AccordionTrigger>
      <AccordionContent
        style={{
          paddingLeft: t.control.groupRowInset,
          paddingRight: t.control.groupRowInset,
          paddingBottom: t.space.md,
          gap: t.space.sm,
        }}
      >
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

export function scrollDirection() {
  return (
    <WindowShell size={{ width: 760, height: 400 }}>
      <PaneBody>
        <ContentHeader title="Mouse & Touchpad" trailingIcons={["close"]} />
        <BoxedList>
          <MousePrimaryButtonRow />
          <Accordion
            type="single"
            value="scroll"
            onValueChange={noop}
            style={{ paddingLeft: 0 }}
          >
            <Item value="scroll" title="Scroll Direction" open>
              <RadioGroup value="traditional" onValueChange={noop}>
                <RadioGroupItem
                  value="traditional"
                  label="Traditional"
                  description="Scrolling moves the view"
                />
                <RadioGroupItem
                  value="natural"
                  label="Natural"
                  description="Scrolling moves the content"
                  disabled
                />
              </RadioGroup>
            </Item>
          </Accordion>
        </BoxedList>
      </PaneBody>
    </WindowShell>
  );
}
scrollDirection.parameters = { width: 760, height: 400 };

export function keyDetails() {
  return (
    <WindowShell size={{ width: 760, height: 460 }}>
      <PaneBody>
        <ContentHeader
          title="Icon Theme"
          trailingIcons={["search", "menu", "close"]}
        />
        <Accordion type="single" value="icon-theme" onValueChange={noop}>
          <Item
            value="icon-theme"
            title="icon-theme"
            subtitle="The fallback icon theme name"
            open
          >
            <BoxedList>
              <BoxedRow title="Title" subtitle="The fallback icon theme name" />
              <BoxedRow title="Type" subtitle="s" />
              <BoxedRow title="Value" subtitle="Adwaita" />
              <SwitchRow
                title="Use default value"
                checked={false}
                onChange={noop}
              />
            </BoxedList>
          </Item>
        </Accordion>
      </PaneBody>
    </WindowShell>
  );
}
keyDetails.parameters = { width: 760, height: 460 };

export function feedTree() {
  const t = useAdwaita();
  return (
    <WindowShell size={{ width: 760, height: 420 }}>
      <PaneBody>
        <ContentHeader title="NewsFlash" trailingIcons={["menu", "close"]} />
        <Accordion type="single" value="subs" onValueChange={noop}>
          <Item value="subs" title="Subscriptions" open>
            {["Cat1", "Cat2", "Lwn", "Xkcd"].map((feed) => (
              <div
                key={feed}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: t.space.sm,
                  minHeight: t.control.rowHeight,
                }}
              >
                <Icon name="globe" size={16} color={t.color.text.dim} />
                <T size="body" color={t.color.text.primary}>
                  {feed}
                </T>
              </div>
            ))}
          </Item>
        </Accordion>
      </PaneBody>
    </WindowShell>
  );
}
feedTree.parameters = { width: 760, height: 420 };

export function volumesClosed() {
  return (
    <WindowShell size={{ width: 760, height: 400 }}>
      <PaneBody>
        <ContentHeader
          title="2.0 TB Disk"
          trailingIcons={["info", "moreVert", "close"]}
        />
        <Accordion type="multiple" value={[]} onValueChange={noop}>
          {[
            { name: "100.7 MB FAT", mount: "/boot" },
            { name: "Arch", mount: "/" },
            { name: "Home", mount: "/home" },
            { name: "990 Pro", mount: "/mnt/990pro" },
          ].map((vol) => (
            <Item
              key={vol.name}
              value={vol.name}
              title={vol.name}
              subtitle={vol.mount}
              open={false}
            />
          ))}
        </Accordion>
      </PaneBody>
    </WindowShell>
  );
}
volumesClosed.parameters = { width: 760, height: 400 };
