'use client'

/**
 * NOTE:
 * This app is Vite/React (not Next.js) and currently does not ship with `recharts`.
 * The previous implementation depended on `recharts` types/components, which caused build/lint failures.
 *
 * This file provides a small, dependency-free API-compatible stub so imports keep working.
 * If you later decide to use charts, we can reintroduce `recharts` (or another chart lib) properly.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) throw new Error('useChart must be used within a <ChartContainer />')
  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig
  children?: React.ReactNode
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn('flex aspect-video justify-center text-xs', className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        {children}
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, item]) => item.theme || item.color,
  )

  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
                .map(([key, itemConfig]) => {
                  const color =
                    itemConfig.theme?.[
                    theme as keyof typeof itemConfig.theme
                    ] || itemConfig.color
                  return color ? `  --color-${key}: ${color};` : null
                })
                .filter(Boolean)
                .join('\n')}
}
`,
          )
          .join('\n'),
      }}
    />
  )
}

// Stubs (no-op) — provided for compatibility with shadcn-style chart imports.
const ChartTooltip = () => null
const ChartLegend = () => null

type ChartTooltipContentProps = {
  active?: boolean
  payload?: Array<{ name?: string; value?: number; color?: string }>
  className?: string
}

function ChartTooltipContent({ active, payload, className }: ChartTooltipContentProps) {
  // If you later wire in a chart lib, replace this with a real tooltip renderer.
  if (!active || !payload?.length) return null

  return (
    <div className={cn('border-border/50 bg-background rounded-lg border px-2.5 py-1.5 text-xs shadow-xl', className)}>
      {payload.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">{item.name ?? 'Value'}</span>
          <span className="text-foreground font-mono tabular-nums">
            {item.value?.toLocaleString?.() ?? ''}
          </span>
        </div>
      ))}
    </div>
  )
}

function ChartLegendContent({ className }: { className?: string }) {
  const { config } = useChart()
  void config
  return <div className={cn('flex items-center justify-center gap-4', className)} />
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle }
