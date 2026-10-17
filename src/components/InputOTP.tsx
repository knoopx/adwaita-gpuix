import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface InputOTPProps {
  length: number
  value: string
  onChange: (value: string) => void

  onComplete?: () => void
  autoFocus?: boolean
  disabled?: boolean
  style?: Partial<StyleDesc>
}

export function InputOTP({ length, value, onChange, onComplete, autoFocus, disabled, style }: InputOTPProps) {
  const t = useAdwaita()
  const { colors } = t

  const chars = Array.from({ length: length }, (_, i) => value[i] ?? '')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <input
        value={value}
        autoFocus={autoFocus && !disabled ? true : undefined}
        readOnly={disabled}
        onChange={(event) => {
          const next = event.value ?? ''
          onChange(next)
          if (next.length === length) onComplete?.()
        }}
        style={{
          width: 1,
          opacity: 0,
          borderWidth: 0,
          flexGrow: 0,
          flexShrink: 0,
        }}
      />
      {chars.map((char, i) => (
        <InputOTPSlot
          key={i}
          index={i}
          char={char}
          filled={char.length > 0}
          active={i === value.length && !disabled}
          disabled={disabled}
        />
      ))}
    </div>
  )
}

export interface InputOTPGroupProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function InputOTPGroup({ children, style }: InputOTPGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 8, ...style }}>{children}</div>
  )
}

export interface InputOTPSlotProps {

  index: number

  char?: string

  filled?: boolean

  active?: boolean
  disabled?: boolean
  style?: Partial<StyleDesc>
}

export function InputOTPSlot({ index, char = '', filled, active, disabled, style }: InputOTPSlotProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  void index
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 44,
        borderRadius: radii.button,
        borderWidth: 1,
        borderColor: active || filled ? colors.accent : colors.border,
        backgroundColor: filled ? colors.accentTint : colors.view_bg,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <T size="title2" color={filled ? colors.fg : colors.dim_fg}>
        {char}
      </T>
    </div>
  )
}

export interface InputOTPSeparatorProps {
  style?: Partial<StyleDesc>
}

export function InputOTPSeparator({ style }: InputOTPSeparatorProps) {
  const t = useAdwaita()
  return (
    <div style={{ display: 'flex', alignItems: 'center', ...style }}>
      <T size="body" color={t.colors.dim_fg}>
        -
      </T>
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const InputOTPShot: ComponentShot = {
  name: 'InputOTP',
  el: (
    <Shot>
      <Row label="States" col>
        <ShotItem label="empty (length 4)">
          <InputOTP length={4} value="" onChange={() => {}} />
        </ShotItem>
        <ShotItem label="partially filled (accent caret slot)">
          <InputOTP length={4} value="25" onChange={() => {}} />
        </ShotItem>
        <ShotItem label="complete (onComplete fired)">
          <InputOTP length={4} value="2580" onChange={() => {}} onComplete={() => {}} />
        </ShotItem>
        <ShotItem label="disabled">
          <InputOTP length={4} value="12" onChange={() => {}} disabled />
        </ShotItem>
      </Row>
      <Row label="Slot states">
        <ShotItem label="empty"><InputOTPSlot index={0} /></ShotItem>
        <ShotItem label="filled"><InputOTPSlot index={1} char="2" filled /></ShotItem>
        <ShotItem label="active (caret)"><InputOTPSlot index={2} active /></ShotItem>
        <ShotItem label="disabled"><InputOTPSlot index={3} char="9" filled disabled /></ShotItem>
      </Row>
      <Row label="Grouped (two groups + separator)">
        <ShotItem label="grouped">
          <InputOTPGroup>
            <InputOTPSlot index={0} char="2" filled />
            <InputOTPSlot index={1} char="5" filled />
            <InputOTPSlot index={2} char="8" filled />
            <InputOTPSeparator />
            <InputOTPSlot index={3} char="0" filled />
            <InputOTPSlot index={4} active />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
