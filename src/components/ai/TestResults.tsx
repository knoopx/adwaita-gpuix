import { type ReactNode, useState } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon } from "../../components/icons";
import { Collapsible, useControllableOpen } from "../../components/Collapsible";
import { CollapsibleTriggerRow } from "./CollapsibleTriggerRow";
import { DisclosureBody } from "./DisclosureBody";
import { Glyph } from "./Glyph";
import { OutputBox } from "./OutputBox";
import { RowChevron } from "./RowChevron";
import { RowLabel } from "./RowLabel";
import { StatusGlyph } from "./StatusGlyph";

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
  return (
    <DisclosureBody
      open={open}
      indent
      bodyStyle={{
        borderLeftWidth: 2,
        borderColor: hasFailures
          ? t.color.functional.destructive
          : t.color.functional.success,
        backgroundColor: hasFailures
          ? t.color.functional.destructiveTint
          : t.color.functional.successTint,
      }}
    >
      {children}
    </DisclosureBody>
  );
}

function SummaryLine({ children }: { children: ReactNode }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.sm / 2,
        flexShrink: 1,
        minWidth: 0,
      }}
    >
      {children}
    </div>
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
            name="science"
            size={14}
            color={
              hasFailures
                ? t.color.functional.destructive
                : t.color.functional.success
            }
          />
        }
        title={
          <SummaryLine>
            <T
              size="body"
              color={t.color.functional.success}
              style={{ flexShrink: 1, textOverflow: "ellipsis" }}
            >
              {`${passed} passed`}
            </T>
            {hasFailures ? (
              <T size="body" color={t.color.functional.destructive}>
                {`, ${failed} failed`}
              </T>
            ) : null}
          </SummaryLine>
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
            name="article"
            size={14}
            color={
              suiteFailed ? t.color.functional.destructive : t.color.text.dim
            }
            style={{ flexShrink: 0 }}
          />
        }
        title={
          <SummaryLine>
            <T
              size="caption"
              color={t.color.text.primary}
              style={{ flexShrink: 1, textOverflow: "ellipsis" }}
            >
              {name}
            </T>
            <T size="caption" color={t.color.text.dim}>
              {`, ${tests.length} tests`}
            </T>
            {suiteFailed ? (
              <T size="caption" color={t.color.functional.destructive}>
                {`, ${failedCount} failed`}
              </T>
            ) : null}
          </SummaryLine>
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

function TestResultStatusIcon({ status }: { status: TestResultStatus }) {
  return (
    <StatusGlyph
      status={status === "passed" ? "complete" : "error"}
      icon={status === "passed" ? "checkCircle" : "close"}
    />
  );
}

function TestResultFile({ file }: { file: string }) {
  const t = useAdwaita();
  return (
    <T
      size="caption"
      color={t.color.text.dim}
      style={{
        flexShrink: 1,
        textOverflow: "ellipsis",
        fontFamily: t.type.fontFamilyMono,
        pointerEvents: "none",
      }}
    >
      {file}
    </T>
  );
}

function testResultRowStyle(
  t: AdwaitaTheme,
  expandable: boolean,
): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: t.space.sm,
    minWidth: 0,
    cursor: expandable ? "pointer" : "default",
  };
}

function TestResultOutput({
  status,
  error,
  open,
}: {
  status: TestResultStatus;
  error?: string;
  open: boolean;
}) {
  if (status !== "failed") return null;
  if (!error || !open) return null;
  return <OutputBox text={error} tone="error" />;
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
  void duration;
  const expandable = status === "failed" && error !== undefined;
  const [isOpen, setIsOpen] = useState(expandable);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 0,
        ...style,
      }}
    >
      <div
        onClick={expandable ? () => setIsOpen(!isOpen) : undefined}
        style={testResultRowStyle(t, expandable)}
      >
        <TestResultStatusIcon status={status} />
        <RowLabel size="caption" style={{ pointerEvents: "none" }}>
          {name}
        </RowLabel>
        {file ? <TestResultFile file={file} /> : null}
        {expandable ? <RowChevron open={isOpen} /> : null}
      </div>
      <TestResultOutput status={status} error={error} open={isOpen} />
    </div>
  );
}
