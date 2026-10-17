import { defineMeta, defineStory } from "storybook";
import { Labeled } from "./common";
import { Row, Column } from "./Box";
import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
  InputOTPSeparator,
} from "./InputOTP";

export default defineMeta({
  title: "Adwaita/InputOTP",
  component: InputOTP,
  parameters: { width: 528, height: 360 },
});

export const states = defineStory({
  parameters: { width: 528, height: 360 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="empty (length 4)">
        <InputOTP length={4} value="" onChange={() => {}} />
      </Labeled>
      <Labeled caption="partially filled (caret slot)">
        <InputOTP length={4} value="25" onChange={() => {}} />
      </Labeled>
      <Labeled caption="complete (onComplete fired)">
        <InputOTP
          length={4}
          value="2580"
          onChange={() => {}}
          onComplete={() => {}}
        />
      </Labeled>
      <Labeled caption="disabled">
        <InputOTP length={4} value="12" onChange={() => {}} disabled />
      </Labeled>
    </Column>
  ),
});

export const focused = defineStory({
  parameters: { width: 528, height: 140 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="focused (autoFocus, accent ring on caret slot)">
        <InputOTP length={4} value="25" onChange={() => {}} autoFocus />
      </Labeled>
    </Column>
  ),
});

export const lengths = defineStory({
  parameters: { width: 528, height: 240 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="length 4">
        <InputOTP length={4} value="25" onChange={() => {}} />
      </Labeled>
      <Labeled caption="length 6">
        <InputOTP length={6} value="2580" onChange={() => {}} />
      </Labeled>
      <Labeled caption="length 8">
        <InputOTP length={8} value="25801234" onChange={() => {}} />
      </Labeled>
    </Column>
  ),
});

export const slotStates = defineStory({
  parameters: { width: 528, height: 140 },
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="empty">
        <InputOTPSlot index={0} />
      </Labeled>
      <Labeled caption="filled">
        <InputOTPSlot index={1} char="2" filled />
      </Labeled>
      <Labeled caption="active (caret)">
        <InputOTPSlot index={2} active />
      </Labeled>
      <Labeled caption="disabled">
        <InputOTPSlot index={3} char="9" filled disabled />
      </Labeled>
    </Row>
  ),
});

export const grouped = defineStory({
  parameters: { width: 528, height: 140 },
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="grouped (two groups + separator)">
        <InputOTPGroup>
          <InputOTPSlot index={0} char="2" filled />
          <InputOTPSlot index={1} char="5" filled />
          <InputOTPSlot index={2} char="8" filled />
          <InputOTPSeparator />
          <InputOTPSlot index={3} char="0" filled />
          <InputOTPSlot index={4} active />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </Labeled>
    </Row>
  ),
});
