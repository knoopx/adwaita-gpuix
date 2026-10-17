import { useState } from "react";
import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon } from "../../components/icons";
import {
  Collapsible,
  CollapsibleContent,
  useControllableOpen,
} from "../../components/Collapsible";
import { CollapsibleTriggerRow } from "./CollapsibleTriggerRow";
import { Glyph } from "./Glyph";
import { OutputBox } from "./OutputBox";
import { RowChevron } from "./RowChevron";

export type TestResultStatus = "passed" | "failed";

export interface TestResultData {
  name: string;
  status: TestResultStatus;

  duration?: number;
  error?: string;
  file?: string;
}

export interface TestSuiteData {
  name: string;
  tests: TestResultData[];
}

export interface TestResultsProps {
  suites: TestSuiteData[];

  duration?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: Partial<StyleDesc>;
}

function TestListBody({
  open,
  hasFailures,
  children,
}: {
  open: boolean;
  hasFailures: boolean;
  children: ReactNode;
}) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  return (
    <CollapsibleContent open={open}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.gap,
          paddingTop: 4,
          paddingLeft: spacing.paddingTight,
          borderLeftWidth: 2,
          borderColor: hasFailures ? colors.destructive : colors.success,
          minWidth: 0,
        }}
      >
        {children}
      </div>
    </CollapsibleContent>
  );
}

export function TestResults({
  suites,
  duration,
  open,
  defaultOpen,
  onOpenChange,
  style,
}: TestResultsProps) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    defaultOpen ?? true,
    onOpenChange,
  );
  void duration;

  const allTests = suites.flatMap((suite) => suite.tests);
  const total = allTests.length;
  const failed = allTests.filter((test) => test.status === "failed").length;
  const passed = total - failed;
  const hasFailures = failed > 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setOpen} style={style}>
      <CollapsibleTriggerRow
        icon={
          <Glyph
            name="flask"
            size={14}
            color={hasFailures ? colors.destructive : colors.success}
          />
        }
        title={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.gap / 2,
              flexShrink: 1,
              minWidth: 0,
            }}
          >
            <T
              size="body"
              color={colors.success}
              style={{ flexShrink: 1, textOverflow: "ellipsis" }}
            >
              {`${passed} passed`}
            </T>
            {hasFailures ? (
              <T size="body" color={colors.destructive}>
                {`, ${failed} failed`}
              </T>
            ) : null}
          </div>
        }
        open={isOpen}
        onToggle={() => setOpen(!isOpen)}
      />
      <TestListBody open={isOpen} hasFailures={hasFailures}>
        {suites.map((suite) => (
          <TestSuite key={suite.name} name={suite.name} tests={suite.tests} />
        ))}
      </TestListBody>
    </Collapsible>
  );
}

export interface TestSuiteProps {
  name: string;
  tests: TestResultData[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: Partial<StyleDesc>;
}

export function TestSuite({
  name,
  tests,
  open,
  defaultOpen,
  onOpenChange,
  style,
}: TestSuiteProps) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  const failedCount = tests.filter((test) => test.status === "failed").length;
  const suiteFailed = failedCount > 0;
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    defaultOpen ?? suiteFailed,
    onOpenChange,
  );
  return (
    <Collapsible open={isOpen} onOpenChange={setOpen} style={style}>
      <CollapsibleTriggerRow
        icon={
          <Icon
            name="fileText"
            size={14}
            color={suiteFailed ? colors.destructive : colors.dim_fg}
            style={{ flexShrink: 0 }}
          />
        }
        title={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.gap / 2,
              flexShrink: 1,
              minWidth: 0,
            }}
          >
            <T
              size="caption"
              color={colors.fg}
              style={{ flexShrink: 1, textOverflow: "ellipsis" }}
            >
              {name}
            </T>
            <T size="caption" color={colors.dim_fg}>
              {`, ${tests.length} tests`}
            </T>
            {suiteFailed ? (
              <T size="caption" color={colors.destructive}>
                {`, ${failedCount} failed`}
              </T>
            ) : null}
          </div>
        }
        open={isOpen}
        onToggle={() => setOpen(!isOpen)}
      />
      <TestListBody open={isOpen} hasFailures={suiteFailed}>
        {tests.map((test) => (
          <TestResult key={test.name} {...test} />
        ))}
      </TestListBody>
    </Collapsible>
  );
}

export interface TestResultProps {
  name: string;
  status: TestResultStatus;

  duration?: number;
  error?: string;
  file?: string;
  style?: Partial<StyleDesc>;
}

export function TestResult({
  name,
  status,
  duration,
  error,
  file,
  style,
}: TestResultProps) {
  const t = useAdwaita();
  const { colors, spacing, typography } = t;
  void duration;
  const failed = status === "failed";
  const expandable = failed && error !== undefined;
  const [isOpen, setIsOpen] = useState(expandable);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, ...style }}>
      <div
        onClick={expandable ? () => setIsOpen(!isOpen) : undefined}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.gap,
          minWidth: 0,
          cursor: expandable ? "pointer" : "default",
        }}
      >
        {failed ? (
          <Icon
            name="close"
            size={14}
            color={colors.destructive}
            style={{ flexShrink: 0 }}
          />
        ) : (
          <Icon
            name="success"
            size={14}
            color={colors.success}
            style={{ flexShrink: 0 }}
          />
        )}
        <T
          size="caption"
          color={colors.fg}
          style={{
            flexShrink: 1,
            textOverflow: "ellipsis",
            pointerEvents: "none",
          }}
        >
          {name}
        </T>
        {file ? (
          <T
            size="caption"
            color={colors.dim_fg}
            style={{
              flexShrink: 1,
              textOverflow: "ellipsis",
              fontFamily: typography.fontFamilyMono,
              pointerEvents: "none",
            }}
          >
            {file}
          </T>
        ) : null}
        {expandable ? <RowChevron open={isOpen} /> : null}
      </div>
      {failed && error && isOpen ? <OutputBox text={error} tone="error" /> : null}
    </div>
  );
}
