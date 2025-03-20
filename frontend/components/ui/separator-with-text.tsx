import { cn } from "@/lib/utils"

interface SeparatorWithTextProps {
  text: string
  className?: string
}

export function SeparatorWithText({ text, className }: SeparatorWithTextProps) {
  return (
    <div className={cn("relative flex items-center py-2", className)}>
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="flex-shrink mx-4 text-sm text-muted-foreground">{text}</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  )
}

