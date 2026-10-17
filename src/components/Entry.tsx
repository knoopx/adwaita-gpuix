import type { StyleDesc } from '@gpuix/react'
import { AdwaitaInputBase } from './common'

export type EntryType = 'text' | 'password' | 'email' | 'number' | 'search' | 'url'

export interface EntryProps {
  value?: string
  placeholder?: string
  type?: EntryType
  disabled?: boolean
  invalid?: boolean
  onChange?: (value: string) => void
  onSubmit?: () => void
  autoFocus?: boolean
  style?: Partial<StyleDesc>
  testId?: string
}

export function Entry({ value, placeholder, type = 'text', disabled, invalid, onChange, onSubmit, autoFocus, style, testId }: EntryProps) {



  void type
  return (
    <AdwaitaInputBase
      testId={testId}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      invalid={invalid}
      autoFocus={autoFocus}
      onSubmit={onSubmit}
      style={{ paddingLeft: 12, paddingRight: 12, ...style }}
    />
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { useAdwaita } from '../theme/adwaita'
import { Row, T, Shot, ShotItem } from './common'

export const EntryShot: ComponentShot = {
  name: 'Entry',
  el: (
    <Shot>
      <Row label="States" col>
        <ShotItem label="placeholder"><Entry placeholder="Type here…" /></ShotItem>
        <ShotItem label="with value"><Entry value="Hello world" /></ShotItem>
        <ShotItem label="invalid"><Entry value="invalid value" invalid /></ShotItem>
        <ShotItem label="disabled"><Entry value="Read only" disabled /></ShotItem>
      </Row>
      <Row label="Types (GPUix has no input type — all render plain text)" col>
        <ShotItem label="text"><Entry type="text" placeholder="Plain text" /></ShotItem>
        <ShotItem label="password"><Entry type="password" placeholder="••••••••" /></ShotItem>
        <ShotItem label="email"><Entry type="email" placeholder="you@example.com" /></ShotItem>
        <ShotItem label="number"><Entry type="number" placeholder="42" /></ShotItem>
        <ShotItem label="search"><Entry type="search" placeholder="Search…" /></ShotItem>
        <ShotItem label="url"><Entry type="url" placeholder="https://…" /></ShotItem>
      </Row>
    </Shot>
  ),
}
