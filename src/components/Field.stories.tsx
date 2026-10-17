import { defineMeta } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled } from "./common";
import { Row, Column } from "./Box";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldTitle,
  FieldSeparator,
} from "./Field";
import { Entry } from "./Entry";
import { Input } from "./Input";
import { Icon } from "./icons";

export default defineMeta({
  title: "Adwaita/Field",
  component: Field,
  parameters: { width: 528, height: 360 },
});

export function vertical() {
  return (
    <Column gap={16} align="center">
      <Labeled caption="label + control + description + error">
        <Field>
          <FieldLabel>Username</FieldLabel>
          <FieldContent>
            <Input value="ada" />
          </FieldContent>
          <FieldDescription>Your public display name.</FieldDescription>
          <FieldError>This field is required.</FieldError>
        </Field>
      </Labeled>
    </Column>
  );
}

vertical.parameters = { width: 528, height: 220 };

export function horizontal() {
  return (
    <Row gap={16} align="center">
      <Labeled caption="label left, control right">
        <Field orientation="horizontal">
          <FieldLabel>Email</FieldLabel>
          <FieldContent>
            <Input placeholder="you@example.com" />
          </FieldContent>
        </Field>
      </Labeled>
    </Row>
  );
}

horizontal.parameters = { width: 528, height: 220 };

export function fieldSetLegend() {
  return (
    <Column gap={16} align="center">
      <Labeled caption="grouped fields (title + multi-error)">
        <FieldSet>
          <FieldLegend>Profile</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldTitle>Display name</FieldTitle>
              <FieldContent>
                <Input value="Ada Lovelace" />
              </FieldContent>
              <FieldError
                errors={[
                  { message: "Must be at least 3 characters" },
                  { message: "Cannot contain spaces" },
                ]}
              />
            </Field>
            <Field>
              <FieldTitle>Bio</FieldTitle>
              <FieldContent>
                <Input placeholder="Short bio" />
              </FieldContent>
              <FieldError
                errors={[{ message: "Single error from the errors list" }]}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </Labeled>
    </Column>
  );
}

fieldSetLegend.parameters = { width: 528, height: 360 };

export function separators() {
  return (
    <Row gap={16} align="center">
      <Labeled caption="labelled">
        <FieldSeparator>or</FieldSeparator>
      </Labeled>
      <Labeled caption="unlabelled">
        <FieldSeparator />
      </Labeled>
    </Row>
  );
}

separators.parameters = { width: 528, height: 180 };

export function disabled() {
  return (
    <Column gap={16} align="center">
      <Labeled caption="disabled control">
        <Field>
          <FieldLabel>Access key</FieldLabel>
          <FieldContent>
            <Entry value="Disabled value" disabled />
          </FieldContent>
          <FieldDescription>Disabled fields stay visible but inert.</FieldDescription>
        </Field>
      </Labeled>
    </Column>
  );
}

disabled.parameters = { width: 528, height: 220 };

export function withLeadingIcon() {
  const t = useAdwaita();
  return (
    <Column gap={16} align="center">
      <Labeled caption="leading icon on the control">
        <Field>
          <FieldLabel>Account</FieldLabel>
          <FieldContent>
            <Entry
              type="email"
              placeholder="you@example.com"
              leading={
                <Icon name="user" size={16} color={t.colors.dim_fg} />
              }
            />
          </FieldContent>
          <FieldDescription>Used for sign-in.</FieldDescription>
        </Field>
      </Labeled>
    </Column>
  );
}

withLeadingIcon.parameters = { width: 528, height: 220 };
