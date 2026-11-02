import { type ReactNode } from "react";
import { defineMeta } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { hexToRgba } from "../theme/tokens";
import { T } from "./text";
import { Icon } from "./icons";
import { Button } from "./Button";
import { Slider } from "./Slider";
import { Switch } from "./Switch";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import { ProgressBar } from "./ProgressBar";
import { PreferencesGroup, PreferencesPage } from "./PreferencesPage";
import {
  ActionRow,
  BoxedList,
  BoxedRow,
  ComboRow,
  EntryRow,
  ExpanderRow,
  SwitchRow,
} from "./BoxedList";
import {
  ContentHeader,
  PaneBody,
  SETTINGS_NAV_INPUT as SETTINGS_NAV_MOUSE,
  SETTINGS_NAV_SOUND,
  SettingsWindow,
  WindowShell,
} from "../../.storybook/window-shell";
import { TALLY_COUNTERS, TALLY_INKS } from "../../.storybook/story-helpers";
import { MousePrimaryButtonRow } from "../../.storybook/app-helpers";

export default defineMeta({
  title: "Adwaita/BoxedList",
  component: BoxedList,
  parameters: { width: 900, height: 560 },
});

const noop = () => {};

function RowControl({ children, gap }: { children: ReactNode; gap: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap,
      }}
    >
      {children}
    </div>
  );
}

function SliderWithCaptions({
  value,
  leading,
  trailing,
}: {
  value: number;
  leading: string;
  trailing: string;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.xs,
        width: t.control.rowSliderWidth,
      }}
    >
      <Slider
        value={value}
        min={0}
        max={100}
        width={t.control.rowSliderWidth}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <T size="caption" color={t.color.text.dim}>
          {leading}
        </T>
        <T size="caption" color={t.color.text.dim}>
          {trailing}
        </T>
      </div>
    </div>
  );
}

function PlainSlider({
  value,
  disabled,
}: {
  value: number;
  disabled?: boolean;
}) {
  const t = useAdwaita();
  return (
    <Slider
      value={value}
      min={0}
      max={100}
      width={t.control.rowSliderWidth}
      disabled={disabled}
    />
  );
}

function FiguresWithChevron({ figures }: { figures: string[] }) {
  const t = useAdwaita();
  return (
    <RowControl gap={t.space.md}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        {figures.map((figure) => (
          <T key={figure} size="body" color={t.color.text.dim}>
            {figure}
          </T>
        ))}
      </div>
      <Icon name="chevronRight" size={18} color={t.color.text.dim} />
    </RowControl>
  );
}

export function mouseAndTouchpad() {
  const t = useAdwaita();
  return (
    <SettingsWindow
      size={{ width: 945, height: 323 }}
      nav={SETTINGS_NAV_MOUSE}
      selected="mouse"
      header={
        <ContentHeader
          trailingIcons={["close"]}
          view={[
            { id: "mouse", icon: "radioButtonChecked", label: "Mouse" },
            { id: "touchpad", icon: "monitor", label: "Touchpad" },
          ]}
          viewValue="mouse"
        />
      }
    >
      <PreferencesPage>
        <PreferencesGroup title="General">
          <MousePrimaryButtonRow />
        </PreferencesGroup>
        <PreferencesGroup title="Mouse">
          <BoxedRow
            title="Pointer Speed"
            trailing={
              <SliderWithCaptions value={55} leading="Slow" trailing="Fast" />
            }
          />
          <BoxedRow
            title="Mouse Acceleration"
            subtitle="Recommended for most users and applications"
            trailing={
              <RowControl gap={t.space.md}>
                <Icon name="info" size={18} color={t.color.text.dim} />
                <Switch checked onChange={noop} />
              </RowControl>
            }
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: t.space.sm,
              paddingLeft: t.control.groupRowInset,
              paddingRight: t.control.groupRowInset,
              paddingTop: t.space.md,
              paddingBottom: t.space.md,
            }}
          >
            <T size="body" color={t.color.text.primary}>
              Scroll Direction
            </T>
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
          </div>
        </PreferencesGroup>
      </PreferencesPage>
    </SettingsWindow>
  );
}
mouseAndTouchpad.parameters = { width: 945, height: 323 };

export function soundPage() {
  const t = useAdwaita();
  return (
    <SettingsWindow
      size={{ width: 945, height: 330 }}
      nav={SETTINGS_NAV_SOUND}
      selected="sound"
      header={<ContentHeader title="Sound" trailingIcons={["close"]} />}
    >
      <PreferencesPage>
        <PreferencesGroup title="Output">
          <ComboRow
            title="Output Device"
            icon="volumeUp"
            value="Speakers - Family 17h/19h HD Audio"
            options={[
              "Speakers - Family 17h/19h HD Audio",
              "Headphones",
              "HDMI",
            ]}
            onChange={noop}
            trailing={<Button label="Test…" onClick={noop} />}
          />
          <BoxedRow
            title="Output Volume"
            prefix={<Icon name="volumeUp" size={18} color={t.color.text.dim} />}
            trailing={<PlainSlider value={65} />}
          />
          <BoxedRow title="Balance" trailing={<PlainSlider value={50} />} />
        </PreferencesGroup>
        <PreferencesGroup title="Input">
          <ComboRow
            title="Input Device"
            icon="graphicEq"
            value="Internal Microphone - Family 17h/19h HD Audio"
            options={[
              "Internal Microphone - Family 17h/19h HD Audio",
              "Headset",
            ]}
            onChange={noop}
          />
          <BoxedRow
            title="Input Volume"
            trailing={<PlainSlider value={72} />}
          />
        </PreferencesGroup>
        <PreferencesGroup title="Sounds">
          <ActionRow
            title="Volume Levels"
            suffix="chevronRight"
            onClick={noop}
          />
        </PreferencesGroup>
      </PreferencesPage>
    </SettingsWindow>
  );
}
soundPage.parameters = { width: 945, height: 330 };

export function devicesAndLocations() {
  const t = useAdwaita();
  return (
    <WindowShell size={{ width: 980, height: 315 }}>
      <PaneBody>
        <ContentHeader
          title="Devices & Locations"
          trailingIcons={["menu", "close"]}
        />
        <PreferencesPage>
          <PreferencesGroup title="This Computer">
            <BoxedRow
              title="Home Folder"
              subtitle="/var/home/chris"
              titleWeight={700}
              height={t.control.deviceRowHeight}
              prefix={
                <Icon
                  name="home"
                  size={t.control.dataIconSize}
                  color={t.color.accent.base}
                />
              }
              trailing={
                <Icon name="chevronRight" size={18} color={t.color.text.dim} />
              }
              onClick={noop}
            />
            <BoxedRow
              title="localhost"
              subtitle="/"
              titleWeight={700}
              height={t.control.deviceRowHeight}
              prefix={
                <Icon
                  name="hardDrive"
                  size={t.control.dataIconSize}
                  color={t.color.text.dim}
                />
              }
              trailing={
                <FiguresWithChevron
                  figures={["11.2 GB Available", "20.5 GB Total"]}
                />
              }
              onClick={noop}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: t.control.groupRowInset,
                paddingRight: t.control.groupRowInset,
                paddingBottom: t.space.md,
              }}
            >
              <ProgressBar value={45} height={t.control.deviceBarHeight} />
            </div>
          </PreferencesGroup>
        </PreferencesPage>
      </PaneBody>
    </WindowShell>
  );
}
devicesAndLocations.parameters = { width: 980, height: 315 };

export function volumes() {
  const t = useAdwaita();

  const rows: {
    name: string;
    mount: string;
    mounted: boolean;
    color: string;

    expandable: boolean;
  }[] = [
    {
      name: "100.7 MB FAT",
      mount: "/boot",
      mounted: true,
      color: t.color.accent.base,
      expandable: true,
    },
    {
      name: "Arch",
      mount: "/",
      mounted: false,
      color: t.color.functional.success,
      expandable: true,
    },
    {
      name: "Home",
      mount: "/home",
      mounted: false,
      color: t.color.functional.warning,
      expandable: true,
    },
    {
      name: "990 Pro",
      mount: "/mnt/990pro",
      mounted: true,
      color: t.color.functional.destructive,

      expandable: false,
    },
  ];
  return (
    <WindowShell size={{ width: 1126, height: 400 }}>
      <PaneBody>
        <ContentHeader
          title="2.0 TB Disk"
          trailingIcons={["info", "moreVert", "close"]}
        />
        <PreferencesPage>
          <PreferencesGroup title="Volumes">
            {rows.map((row) => (
              <BoxedRow
                key={row.name}
                title={row.name}
                subtitle={row.mount}
                prefix={
                  <div
                    style={{
                      width: t.control.compactIconSize,
                      height: t.control.compactIconSize,
                      borderRadius: t.radius.full,
                      backgroundColor: row.color,
                      pointerEvents: "none",
                    }}
                  />
                }
                trailing={
                  <RowControl gap={t.space.md}>
                    <Switch checked={row.mounted} onChange={noop} />
                    <Icon name="moreVert" size={18} color={t.color.text.dim} />
                    {row.expandable ? (
                      <Icon
                        name="expandMore"
                        size={18}
                        color={t.color.text.dim}
                      />
                    ) : null}
                  </RowControl>
                }
              />
            ))}
          </PreferencesGroup>
        </PreferencesPage>
      </PaneBody>
    </WindowShell>
  );
}
volumes.parameters = { width: 1126, height: 400 };

export function counterRows() {
  const t = useAdwaita();

  return (
    <WindowShell size={{ width: 420, height: 520 }}>
      <PaneBody>
        <ContentHeader
          title="Tally"
          trailingIcons={["search", "menu", "close"]}
          left={
            <>
              <Button variant="icon" size="icon" icon="add" onClick={noop} />
              <Button
                variant="icon"
                size="icon"
                icon="schedule"
                onClick={noop}
              />
            </>
          }
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minHeight: 0,
            padding: t.space.md,
          }}
        >
          <BoxedList>
            {TALLY_COUNTERS.map((counter, i) => {
              const ink = TALLY_INKS[i % TALLY_INKS.length] ?? t.color.text.dim;
              return (
                <BoxedRow
                  key={counter.name}
                  title={counter.name}
                  subtitle={String(counter.count)}
                  titleWeight={600}
                  titleColor={hexToRgba(ink, 0.9)}
                  subtitleColor={ink}
                  subtitleSize="body"
                  subtitleWeight={700}
                  height={t.control.counterRowHeight}
                  background={ink ? hexToRgba(ink, 0.1) : "transparent"}
                  prefix={<Icon name="dragIndicator" size={16} color={ink} />}
                  trailing={
                    <RowControl gap={t.space.sm}>
                      <Button
                        variant="default"
                        size="sm"
                        shape="circle"
                        icon="remove"
                        style={{
                          backgroundColor: hexToRgba(ink, 0.28),
                          width: t.control.stepperSize,
                          height: t.control.stepperSize,
                        }}
                        onClick={noop}
                      />
                      <Button
                        variant="default"
                        size="sm"
                        shape="circle"
                        icon="add"
                        style={{
                          backgroundColor: hexToRgba(ink, 0.28),
                          width: t.control.stepperSize,
                          height: t.control.stepperSize,
                        }}
                        onClick={noop}
                      />
                      <Icon name="expandMore" size={16} color={ink} />
                    </RowControl>
                  }
                  onClick={noop}
                />
              );
            })}
          </BoxedList>
        </div>
      </PaneBody>
    </WindowShell>
  );
}
counterRows.parameters = { width: 420, height: 470 };

export function entryRows() {
  return (
    <WindowShell size={{ width: 900, height: 260 }}>
      <PaneBody>
        <ContentHeader title="Mastodon" trailingIcons={["moreVert", "close"]} />
        <PreferencesPage>
          <BoxedList>
            <EntryRow title="Title" value="Mastodon" onChange={noop} />
            <EntryRow title="Username" value="johnd" onChange={noop} />
          </BoxedList>
        </PreferencesPage>
      </PaneBody>
    </WindowShell>
  );
}
entryRows.parameters = { width: 900, height: 260 };

export function selectedRow() {
  return (
    <WindowShell size={{ width: 1210, height: 765 }}>
      <PaneBody>
        <ContentHeader
          title="Select action"
          trailingIcons={["menu", "close"]}
        />
        <PreferencesPage>
          <BoxedList>
            <ActionRow
              title="Replace Regex"
              subtitle="Replace all matches of the regular expression"
              selected
              onClick={noop}
            />
            <ActionRow
              title="Replace Substring"
              subtitle="Replace all occurences of the substring with in the text with another string"
              onClick={noop}
            />
            <ActionRow
              title="Escape URL"
              subtitle="Replace special characters with URL-safe sequences"
              onClick={noop}
            />
            <ActionRow
              title="Escape HTML"
              subtitle="Replace special characters with HTML-safe sequences"
              onClick={noop}
            />
            <ActionRow
              title="Unescape URL"
              subtitle="Replace URL sequences with characters"
              onClick={noop}
            />
            <ActionRow
              title="Escape String"
              subtitle="Replace special characters with escape sequences"
              onClick={noop}
            />
            <ActionRow
              title="Unescape HTML"
              subtitle="Replace HTML sequences with characters"
              onClick={noop}
            />
          </BoxedList>
        </PreferencesPage>
      </PaneBody>
    </WindowShell>
  );
}
selectedRow.parameters = { width: 1210, height: 765 };

export function disabledRows() {
  return (
    <WindowShell size={{ width: 900, height: 380 }}>
      <PaneBody>
        <ContentHeader
          title="Mastodon"
          trailingIcons={["edit", "delete", "close"]}
        />
        <PreferencesPage>
          <BoxedList>
            <EntryRow title="Title" value="Mastodon" onChange={noop} />
            <EntryRow title="Server" value="matrix.org" onChange={noop} />
            <EntryRow title="Username" value="johnd" onChange={noop} />
            <EntryRow title="Password" value="••••••••" onChange={noop} />
          </BoxedList>
        </PreferencesPage>
      </PaneBody>
    </WindowShell>
  );
}
disabledRows.parameters = { width: 900, height: 320 };

export function disclosureRow() {
  return (
    <WindowShell size={{ width: 900, height: 240 }}>
      <PaneBody>
        <ContentHeader
          title="2.0 TB Disk"
          trailingIcons={["info", "moreVert", "close"]}
        />
        <PreferencesPage>
          <PreferencesGroup title="Volumes">
            <ExpanderRow title="100.7 MB FAT" subtitle="/boot">
              <T>/boot</T>
            </ExpanderRow>
          </PreferencesGroup>
        </PreferencesPage>
      </PaneBody>
    </WindowShell>
  );
}
disclosureRow.parameters = { width: 900, height: 240 };

export function switchRows() {
  return (
    <WindowShell size={{ width: 900, height: 280 }}>
      <PaneBody>
        <ContentHeader
          title="Komikku"
          trailingIcons={["menu", "close"]}
          view={[
            { id: "general", icon: "settings", label: "General" },
            { id: "library", icon: "gridView", label: "Library" },
            { id: "reader", icon: "license", label: "Reader" },
            { id: "advanced", icon: "autoAwesome", label: "Advanced" },
          ]}
          viewValue="general"
        />
        <PreferencesPage>
          <PreferencesGroup title="Notifications">
            <SwitchRow
              title="Desktop Notifications"
              subtitle="Use desktop notifications for downloads and library updates"
              checked={false}
              onChange={noop}
            />
          </PreferencesGroup>
        </PreferencesPage>
      </PaneBody>
    </WindowShell>
  );
}
switchRows.parameters = { width: 900, height: 280 };

export function emptyGroup() {
  return (
    <WindowShell size={{ width: 900, height: 240 }}>
      <PaneBody>
        <ContentHeader title="Appearance" trailingIcons={["close"]} />
        <PreferencesPage>
          <PreferencesGroup title="Style">
            <BoxedList />
          </PreferencesGroup>
        </PreferencesPage>
      </PaneBody>
    </WindowShell>
  );
}
emptyGroup.parameters = { width: 900, height: 240 };
