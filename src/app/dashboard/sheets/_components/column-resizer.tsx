"use client"

import { useRef, useCallback, useEffect } from "react"
import { trapsEnabled } from "@/lib/traps"

interface ColumnResizerProps {
  colIndex: number
  width: number
  onResize: (colIndex: number, width: number) => void
}

export function ColumnResizer({ colIndex, width, onResize }: ColumnResizerProps) {
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)
  const draggingRef = useRef(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const delta = e.clientX - startXRef.current
    onResize(colIndex, startWidthRef.current + delta)
  }, [colIndex, onResize])

  const handleMouseUp = useCallback(() => {
    draggingRef.current = false
    document.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  // Clean up listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    draggingRef.current = true
    startXRef.current = e.clientX
    startWidthRef.current = width
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp, { once: true })
  }, [width, handleMouseMove, handleMouseUp])

  if (trapsEnabled) {
    // TRAP 27: drag-only column resize — no role, no label, no keyboard alternative
    // Agent can't resize columns at all
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50" // TRAP: no role, no aria-label
        onMouseDown={handleMouseDown}
      />
    )
  }

  // FIXED: accessible resize handle with keyboard support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 5
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      onResize(colIndex, width - step)
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      onResize(colIndex, width + step)
    }
  }

  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize column ${String.fromCharCode(65 + colIndex)}`}
      aria-valuenow={width}
      aria-valuemin={50}
      tabIndex={0}
      className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 focus:bg-primary/50 focus:outline-none"
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
    />
  )
  /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
}
