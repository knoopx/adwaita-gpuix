import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'

export interface BoxProps {
  children?: ReactNode
  gap?: number
  padding?: number
  margin?: number
  justify?:
    | 'start'
    | 'center'
    | 'end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  align?: 'start' | 'center' | 'end' | 'stretch'
  grow?: number
  style?: Partial<StyleDesc>
}

function flexStyle(props: BoxProps, direction: 'row' | 'column'): Partial<StyleDesc> {
  const { gap = 8, padding = 0, margin = 0, justify, align, grow, style } = props
  return {
    display: 'flex',
    flexDirection: direction,
    gap,
    padding,
    margin,
    justifyContent: justify,
    alignItems: align ?? 'stretch',
    flexGrow: grow,
    ...style,
  }
}

export function Row(props: BoxProps) {
  return <div style={flexStyle(props, 'row')}>{props.children}</div>
}

export function Column(props: BoxProps) {
  return <div style={flexStyle(props, 'column')}>{props.children}</div>
}

