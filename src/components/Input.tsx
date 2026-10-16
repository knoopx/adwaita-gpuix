import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { AdwaitaInputBase } from './common'

export type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'url'

export interface InputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: InputType
  disabled?: boolean
  invalid?: boolean
  style?: Partial<StyleDesc>
}

export function Input({ value, onChange, placeholder, type = 'text', disabled, invalid, style }: InputProps) {
  const t = useAdwaita()
  const { radii } = t

  return (
    <AdwaitaInputBase
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      invalid={invalid}
      mask={type === 'password'}
      style={{ padding: 8, borderRadius: radii.row, ...style }}
    />
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const InputShot: ComponentShot = {
  name: 'Input',
  el: (
    <Shot>
      <Row label="States" col>
        <ShotItem label="placeholder"><Input placeholder="Type here…" /></ShotItem>
        <ShotItem label="with value"><Input value="Hello world" /></ShotItem>
        <ShotItem label="invalid"><Input value="invalid value" invalid /></ShotItem>
        <ShotItem label="disabled"><Input value="Read only" disabled /></ShotItem>
      </Row>
      <Row label="Types (password masks; the rest render plain text)" col>
        <ShotItem label="text"><Input type="text" placeholder="Plain text" /></ShotItem>
        <ShotItem label="password"><Input type="password" value="hunter2" /></ShotItem>
        <ShotItem label="password (empty)"><Input type="password" placeholder="Password" /></ShotItem>
        <ShotItem label="email"><Input type="email" placeholder="you@example.com" /></ShotItem>
        <ShotItem label="number"><Input type="number" placeholder="42" /></ShotItem>
        <ShotItem label="search"><Input type="search" placeholder="Search…" /></ShotItem>
        <ShotItem label="url"><Input type="url" placeholder="https://…" /></ShotItem>
      </Row>
    </Shot>
  ),
}
