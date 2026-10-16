import { createContext, useContext, useState, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { FloatingPanel, MenuLabel, MenuRow, MenuSeparator, MenuShortcut, T, inputShellStyle } from './common'
import { Icon } from './icons'
import { Dialog, DialogContent } from './Dialog'

/* ── Types ────────────────────────────────────────────────────────────── */

export interface CommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * Default true — after a CommandItem.onSelect the root calls
   * onOpenChange(false), closing the palette.
   */
  closeOnSelect?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface CommandInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  style?: Partial<StyleDesc>
}

export interface CommandListProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface CommandEmptyProps {
  style?: Partial<StyleDesc>
}

export interface CommandGroupProps {
  label?: string
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface CommandItemProps {
  label: string
  onSelect?: () => void
  selected?: boolean
  /** Space-separated search terms (any-term match) — a cheap cmdk stand-in. */
  searchTerms?: string
  /** A trailing keyboard-shortcut hint (caption, dim). */
  shortcut?: string
  style?: Partial<StyleDesc>
}

export interface CommandShortcutProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface CommandSeparatorProps {
  style?: Partial<StyleDesc>
}

export interface CommandDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  contained?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/* ── Context ──────────────────────────────────────────────────────────── */

interface CommandContext {
  query: string
  setQuery: (q: string) => void
  onOpenChange?: (open: boolean) => void
  closeOnSelect: boolean
}

const CommandCtx = createContext<CommandContext | null>(null)

function useCommand(): CommandContext {
  const ctx = useContext(CommandCtx)
  if (!ctx) throw new Error('Command components must be used within <Command>')
  return ctx
}

/* ── Components ───────────────────────────────────────────────────────── */

export function Command({ open, onOpenChange, closeOnSelect, children, style }: CommandProps) {
  const [query, setQuery] = useState('')

  if (open === false) return null

  return (
    <CommandCtx.Provider value={{ query, setQuery, onOpenChange, closeOnSelect: closeOnSelect ?? true }}>
      <FloatingPanel minWidth={320} padding={12} style={style}>
        {children}
      </FloatingPanel>
    </CommandCtx.Provider>
  )
}

export function CommandInput({ value, onChange, placeholder, style }: CommandInputProps) {
  const { setQuery } = useCommand()
  const t = useAdwaita()
  const { colors } = t

  return (
    <div style={inputShellStyle(t, style)}>
      <Icon name="search" size={14} color={colors.dim_fg} />
      <input
        value={value ?? ''}
        placeholder={placeholder ?? 'Type a command…'}
        onChange={(event) => {
          const v = event.value ?? ''
          setQuery(v)
          onChange?.(v)
        }}
        style={{
          flexGrow: 1,
          fontSize: 14,
          color: colors.fg,
        }}
      />
    </div>
  )
}

export function CommandList({ children, style }: CommandListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      <virtual-list estimatedItemHeight={36} style={{ maxHeight: 240, width: '100%' }}>
        {children}
      </virtual-list>
    </div>
  )
}

export function CommandEmpty({ style }: CommandEmptyProps) {
  const t = useAdwaita()
  return (
    <div style={{ padding: 12, ...style }}>
      <T size="body" color={t.colors.dim_fg} align="center">
        No results found.
      </T>
    </div>
  )
}

export function CommandGroup({ label, children, style }: CommandGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, ...style }}>
      {label ? <MenuLabel style={{ padding: 4, paddingBottom: 2 }}>{label}</MenuLabel> : null}
      {children}
    </div>
  )
}

export function CommandItem({ label, onSelect, selected, searchTerms, shortcut, style }: CommandItemProps) {
  const { query, onOpenChange, closeOnSelect } = useCommand()
  const t = useAdwaita()
  const { colors } = t

  // Filter by query (label + optional search terms, any-term match)
  const q = query.trim().toLowerCase()
  if (q) {
    const haystack = (searchTerms ?? label).toLowerCase()
    const hit =
      label.toLowerCase().includes(q) ||
      q.split(/\s+/).some((term) => term.length > 0 && haystack.includes(term))
    if (!hit) return null
  }

  return (
    <div style={{ minHeight: 36, display: 'flex', alignItems: 'center', ...style }}>
      <MenuRow
        label={label}
        onClick={() => {
          onSelect?.()
          if (closeOnSelect) onOpenChange?.(false)
        }}
        trailing={
          shortcut ? (
            <MenuShortcut>{shortcut}</MenuShortcut>
          ) : selected ? (
            <Icon name="success" size={12} color={colors.accent} />
          ) : null
        }
        style={{
          justifyContent: 'space-between',
          backgroundColor: selected ? colors.accentTint : 'transparent',
        }}
      />
    </div>
  )
}

/** A trailing keyboard-shortcut hint (caption, dim) for a command row. */
export function CommandShortcut({ children, style }: CommandShortcutProps) {
  return <MenuShortcut style={style}>{children}</MenuShortcut>
}

/** A 1px separator between command groups. */
export function CommandSeparator({ style }: CommandSeparatorProps) {
  return <MenuSeparator style={style} />
}

/**
 * Dialog (contained mode) + Command composition — the GPUix-idiomatic
 * command palette: a dialog card hosting the command input + list.
 */
export function CommandDialog({ open, onOpenChange, contained, children, style }: CommandDialogProps) {
  return (
    <Dialog open={open ?? false} onOpenChange={onOpenChange ?? (() => {})} contained={contained ?? true}>
      <DialogContent showCloseButton={false} style={style}>
        <Command open={open} onOpenChange={onOpenChange} closeOnSelect>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row, FloatingStage } from './common'

/** A captioned shot item: a small dim caption above the item. */
function CommandShotItem({ label, children }: { label: string; children: ReactNode }) {
  const t = useAdwaita()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <T size="caption" color={t.colors.dim_fg}>{label}</T>
      {children}
    </div>
  )
}

export const CommandShot: ComponentShot = {
  name: 'Command',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="Open palette · item states" col>
        <CommandShotItem label="groups + items (shortcut / selected / search terms) + separator">
          <Command>
            <CommandInput placeholder="Type a command…" />
            <CommandList>
              <CommandGroup label="General">
                <CommandItem label="New file" shortcut="Ctrl+N" onSelect={() => {}} />
                <CommandItem label="Open file" shortcut="Ctrl+O" selected onSelect={() => {}} />
                <CommandItem label="Search files" searchTerms="find locate" onSelect={() => {}} />
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup label="Actions">
                <CommandItem label="Delete" onSelect={() => {}} />
                <CommandItem label="Rename" onSelect={() => {}} />
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandShotItem>
        <CommandShotItem label="empty state">
          <Command>
            <CommandInput placeholder="Type a command…" />
            <CommandList>
              <CommandEmpty />
            </CommandList>
          </Command>
        </CommandShotItem>
      </Row>
      <Row label="Command dialog (contained, in a stage)" col>
        <FloatingStage width={480} height={220}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CommandDialog open={true} onOpenChange={() => {}} contained>
              <CommandInput placeholder="Type a command…" />
              <CommandList>
                <CommandGroup label="General">
                  <CommandItem label="New file" shortcut="Ctrl+N" onSelect={() => {}} />
                  <CommandItem label="Open file" shortcut="Ctrl+O" selected onSelect={() => {}} />
                </CommandGroup>
              </CommandList>
            </CommandDialog>
          </div>
        </FloatingStage>
      </Row>
    </div>
  ),
}
