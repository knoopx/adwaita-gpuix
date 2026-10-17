import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";
import { Card } from "../Card";
import { Icon } from "../icons";
import { Row, Column } from "../Box";

export interface TodoItem {
  label: string;
  done?: boolean;
}

export interface TodoData {
  items: TodoItem[];
  verb: string | null;
}

export interface TodoCardProps {
  data: TodoData;
  style?: Partial<StyleDesc>;
}

export function TodoCard({ data, style }: TodoCardProps) {
  const t = useAdwaita();
  const { colors } = t;
  const total = data.items.length;
  const doneCount = data.items.filter((item) => item.done).length;
  const allDone = total > 0 && doneCount === total;
  return (
    <Card style={style}>
      <Row gap={8} align="center">
        <Icon
          name={allDone ? "success" : "list"}
          size={16}
          color={allDone ? colors.success : colors.accent}
        />
        <T size="body" weight={600} color={colors.fg}>
          {data.verb ? `${data.verb} list` : "To-do"}
        </T>
      </Row>
      {total > 0 ? (
        <Column gap={6}>
          {data.items.map((item, i) => (
            <Row key={i} gap={8} align="center">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: item.done ? colors.success : colors.border,
                  backgroundColor: item.done ? colors.success : "transparent",
                  flexShrink: 0,
                  pointerEvents: "none",
                }}
              >
                {item.done ? (
                  <Icon name="check" size={10} color={colors.accent_fg} />
                ) : null}
              </div>
              <T size="body" color={item.done ? colors.dim_fg : colors.fg}>
                {item.label}
              </T>
            </Row>
          ))}
        </Column>
      ) : null}
      {total > 0 ? (
        <T size="caption" color={colors.dim_fg}>
          {doneCount} of {total}
        </T>
      ) : null}
    </Card>
  );
}
