import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled } from "./common";
import { Column } from "./Box";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "./InputGroup";
import { Icon, type IconName } from "./icons";

function AddonIcon({ name }: { name: IconName }) {
  const t = useAdwaita();
  return <Icon name={name} size={14} color={t.colors.dim_fg} />;
}

export default defineMeta({
  title: "Adwaita/InputGroup",
  component: InputGroup,
  parameters: { width: 528, height: 360 },
});

export const alignments = defineStory({
  parameters: { width: 528, height: 320 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="row (default) — prefix + suffix addons">
        <InputGroup>
          <InputGroupAddon>@</InputGroupAddon>
          <InputGroupInput value="username" />
          <InputGroupAddon>.com</InputGroupAddon>
        </InputGroup>
      </Labeled>
      <Labeled caption="block-start (addon via prop on top)">
        <InputGroup align="block-start">
          <InputGroupInput value="1 250.00" />
          <InputGroupAddon>€</InputGroupAddon>
        </InputGroup>
      </Labeled>
      <Labeled caption="block-end (addon via prop on bottom)">
        <InputGroup align="block-end">
          <InputGroupInput value="kg" placeholder="Weight" />
          <InputGroupAddon>unit</InputGroupAddon>
        </InputGroup>
      </Labeled>
    </Column>
  ),
});

export const addonKinds = defineStory({
  parameters: { width: 528, height: 280 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="button addon (icon)">
        <InputGroup>
          <InputGroupInput placeholder="Search…" type="search" />
          <InputGroupButton>
            <AddonIcon name="search" />
          </InputGroupButton>
        </InputGroup>
      </Labeled>
      <Labeled caption="text addon">
        <InputGroup>
          <InputGroupInput placeholder="Amount" />
          <InputGroupText>EUR</InputGroupText>
        </InputGroup>
      </Labeled>
      <Labeled caption="textarea (rows=2)">
        <InputGroup>
          <InputGroupTextarea placeholder="Message…" rows={2} />
          <InputGroupButton>
            <AddonIcon name="plus" />
          </InputGroupButton>
        </InputGroup>
      </Labeled>
    </Column>
  ),
});

export const iconAddons = defineStory({
  parameters: { width: 528, height: 200 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="prefix icon (non-interactive)">
        <InputGroup>
          <InputGroupAddon>
            <AddonIcon name="user" />
          </InputGroupAddon>
          <InputGroupInput value="username" type="email" />
        </InputGroup>
      </Labeled>
      <Labeled caption="suffix icon (password, reveal button)">
        <InputGroup>
          <InputGroupInput value="hunter2" type="password" />
          <InputGroupButton>
            <AddonIcon name="eye" />
          </InputGroupButton>
        </InputGroup>
      </Labeled>
    </Column>
  ),
});

export const disabled = defineStory({
  parameters: { width: 528, height: 200 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="group disabled">
        <InputGroup disabled>
          <InputGroupAddon>@</InputGroupAddon>
          <InputGroupInput value="username" />
          <InputGroupButton>
            <AddonIcon name="search" />
          </InputGroupButton>
        </InputGroup>
      </Labeled>
      <Labeled caption="input disabled (addon intact)">
        <InputGroup>
          <InputGroupAddon>€</InputGroupAddon>
          <InputGroupInput value="1 250.00" disabled />
        </InputGroup>
      </Labeled>
    </Column>
  ),
});
