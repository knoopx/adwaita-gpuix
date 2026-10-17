import { defineMeta, defineStory } from "storybook";
import { T, Labeled } from "./common";
import { PreferencesPage, PreferencesGroup } from "./PreferencesPage";
import {
  ActionRow,
  ButtonRow,
  ComboRow,
  EntryRow,
  ExpanderRow,
  SpinRow,
  SwitchRow,
} from "./BoxedList";

export default defineMeta({
  title: "Adwaita/PreferencesPage",
  component: PreferencesPage,
  parameters: { width: 528, height: 560 },
});

export const allRowKinds = defineStory({
  render: () => (
    <Labeled caption="all row kinds (two groups)">
      <PreferencesPage>
        <PreferencesGroup title="General">
          <SwitchRow
            title="Enable sounds"
            checked={true}
            onChange={() => {}}
          />
          <SwitchRow
            title="Do not disturb"
            checked={false}
            onChange={() => {}}
          />
          <ActionRow
            title="Reset settings"
            subtitle="Restore the defaults"
            prefix="settings"
            suffix="chevronDown"
            onClick={() => {}}
          />
          <EntryRow title="Display name" value="Ada" />
        </PreferencesGroup>
        <PreferencesGroup title="Appearance">
          <SpinRow
            title="Zoom"
            value={100}
            min={50}
            max={200}
            step={10}
            onChange={() => {}}
          />
          <ComboRow
            title="Theme"
            value="Auto"
            options={["Auto", "Light", "Dark"]}
            onChange={() => {}}
          />
          <ButtonRow title="Sign out" label="Sign out" onClick={() => {}} />
          <ButtonRow
            title="Delete account"
            label="Delete"
            destructive
            onClick={() => {}}
          />
          <ExpanderRow title="Advanced" subtitle="Show advanced options">
            <T>Advanced options are revealed here.</T>
          </ExpanderRow>
        </PreferencesGroup>
      </PreferencesPage>
    </Labeled>
  ),
});

export const switchRows = defineStory({
  parameters: { width: 528, height: 300 },
  render: () => (
    <Labeled caption="switch rows (with subtitle and disabled)">
      <PreferencesPage>
        <PreferencesGroup title="Notifications">
          <SwitchRow
            title="Push notifications"
            checked={true}
            onChange={() => {}}
          />
          <SwitchRow
            title="Sound alerts"
            subtitle="Play a sound with each notification"
            checked={true}
            onChange={() => {}}
          />
          <SwitchRow
            title="Weekly summary"
            checked={false}
            onChange={() => {}}
          />
          <SwitchRow
            title="Do not disturb"
            subtitle="Until tomorrow morning"
            checked={true}
            disabled
            onChange={() => {}}
          />
        </PreferencesGroup>
      </PreferencesPage>
    </Labeled>
  ),
});

export const choiceRows = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Labeled caption="choice rows (combo + spin)">
      <PreferencesPage>
        <PreferencesGroup title="Appearance">
          <ComboRow
            title="Theme"
            value="Auto"
            options={["Auto", "Light", "Dark"]}
            onChange={() => {}}
          />
          <ComboRow
            title="Accent colour"
            value="Blue"
            options={["Blue", "Teal", "Green", "Yellow", "Red"]}
            onChange={() => {}}
          />
          <SpinRow
            title="Zoom"
            value={100}
            min={50}
            max={200}
            step={10}
            onChange={() => {}}
          />
        </PreferencesGroup>
      </PreferencesPage>
    </Labeled>
  ),
});

export const entryRows = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Labeled caption="entry rows (value, placeholder, action)">
      <PreferencesPage>
        <PreferencesGroup title="Profile">
          <EntryRow title="Display name" value="Ada" />
          <EntryRow title="Email" value="ada@example.com" />
          <EntryRow title="Nickname" placeholder="Shown to other users" />
          <ActionRow
            title="Account"
            subtitle="Manage your account details"
            prefix="user"
            suffix="chevronRight"
            onClick={() => {}}
          />
        </PreferencesGroup>
      </PreferencesPage>
    </Labeled>
  ),
});

const scrollableItems: { title: string; checked: boolean }[] = [
  { title: "New messages", checked: true },
  { title: "Mentions", checked: true },
  { title: "Reactions", checked: false },
  { title: "Follows", checked: false },
  { title: "Reminders", checked: true },
  { title: "Weekly summary", checked: false },
  { title: "Sound alerts", checked: false },
  { title: "Vibration", checked: true },
  { title: "Do not disturb", checked: false },
  { title: "Quiet hours", checked: false },
  { title: "Email digests", checked: true },
  { title: "Push on Wi-Fi only", checked: false },
  { title: "Battery saver", checked: true },
  { title: "Sync now", checked: false },
];

export const scrollablePage = defineStory({
  parameters: { width: 528, height: 400 },
  render: () => (
    <Labeled
      caption="long page (scrollable, virtual-list)"
      style={{ width: "100%" }}
    >
      <PreferencesPage
        scrollable
        estimatedItemHeight={40}
        style={{ width: "100%" }}
      >
        <PreferencesGroup title="Notifications">
          {scrollableItems.map((item) => (
            <SwitchRow
              key={item.title}
              title={item.title}
              checked={item.checked}
              onChange={() => {}}
            />
          ))}
        </PreferencesGroup>
      </PreferencesPage>
    </Labeled>
  ),
});
