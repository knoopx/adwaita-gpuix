import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'
import { BoxedList } from './BoxedList'

export interface PreferencesGroupProps {
  title: string
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function PreferencesGroup({ title, children, style }: PreferencesGroupProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        ...style,
      }}
    >
      <T size="title4" weight={600} color={colors.dim_fg}>
        {title}
      </T>
      <BoxedList>{children}</BoxedList>
    </div>
  )
}

export interface PreferencesPageProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function PreferencesPage({ children, style }: PreferencesPageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot } from './common'
import { ActionRow, ButtonRow, ComboRow, EntryRow, ExpanderRow, SpinRow, SwitchRow } from './BoxedList'

export const PreferencesPageShot: ComponentShot = {
  name: 'PreferencesPage',
  el: (
    <Shot>
      <Row label="All row kinds (two groups)" col>
        <PreferencesPage>
          <PreferencesGroup title="General">
            <SwitchRow title="Enable sounds" checked={true} onChange={() => {}} />
            <SwitchRow title="Do not disturb" checked={false} onChange={() => {}} />
            <ActionRow title="Reset settings" subtitle="Restore the defaults" prefix="settings" suffix="chevronDown" onClick={() => {}} />
            <EntryRow title="Display name" value="Ada" />
          </PreferencesGroup>
          <PreferencesGroup title="Appearance">
            <SpinRow title="Zoom" value={100} min={50} max={200} step={10} onChange={() => {}} />
            <ComboRow title="Theme" value="Auto" options={['Auto', 'Light', 'Dark']} onChange={() => {}} />
            <ButtonRow title="Sign out" label="Sign out" onClick={() => {}} />
            <ButtonRow title="Delete account" label="Delete" destructive onClick={() => {}} />
            <ExpanderRow title="Advanced" subtitle="Show advanced options">
              <T>Advanced options are revealed here.</T>
            </ExpanderRow>
          </PreferencesGroup>
        </PreferencesPage>
      </Row>
    </Shot>
  ),
}
