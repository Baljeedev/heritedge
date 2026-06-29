import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: { icon: "w-8 h-8", text: "text-lg", svg: 20 },
  md: { icon: "w-10 h-10", text: "text-xl", svg: 24 },
  lg: { icon: "w-12 h-12", text: "text-2xl", svg: 28 },
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const s = sizeMap[size]

  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl shadow-md",
          "bg-gradient-to-br from-[oklch(0.42_0.15_35)] to-[oklch(0.65_0.15_25)]",
          "ring-1 ring-white/20 group-hover:shadow-lg group-hover:scale-[1.02] transition-all duration-300",
          s.icon
        )}
      >
        <svg
          viewBox="0 0 32 32"
          width={s.svg}
          height={s.svg}
          fill="none"
          aria-hidden
          className="text-white"
        >
          <path
            d="M6 24V14L16 8L26 14V24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 24V17H21V24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="12" r="1.5" fill="currentColor" />
          <path
            d="M16 8V6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {showText && (
        <div className={cn("leading-none", s.text)}>
          <span className="font-serif font-bold tracking-tight text-sidebar-foreground">
            Herit<span className="text-[oklch(0.42_0.15_35)]">Edge</span>
          </span>
          <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium mt-0.5">
            Cultural Heritage
          </span>
        </div>
      )}
    </div>
  )
}
