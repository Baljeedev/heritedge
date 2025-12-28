"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { HERITAGE_SITES } from "@/data/heritage-sites"

interface HeritageMapProps {
  selectedSiteId: number | null
  onSiteSelect: (siteId: number) => void
}

export function HeritageMap({ selectedSiteId, onSiteSelect }: HeritageMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Draw map background and sites
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const container = containerRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = container.clientWidth
    canvas.height = container.clientHeight

    // Clear canvas with background
    ctx.fillStyle = "#f5f3f0"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid pattern
    ctx.strokeStyle = "#e5e1d8"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw sites
    HERITAGE_SITES.forEach((site) => {
      const x = site.coordinates.x * canvas.width + pan.x
      const y = site.coordinates.y * canvas.height + pan.y

      // Draw site pin
      const isSelected = selectedSiteId === site.id
      const radius = isSelected ? 20 : 16

      ctx.fillStyle = isSelected ? "#8B5A2B" : "#D2B48C"
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw border
      ctx.strokeStyle = isSelected ? "#654321" : "#A0826D"
      ctx.lineWidth = isSelected ? 3 : 2
      ctx.stroke()

      // Draw icon background
      ctx.fillStyle = "#FFFAF0"
      ctx.beginPath()
      ctx.arc(x, y, radius - 4, 0, Math.PI * 2)
      ctx.fill()

      // Draw pin icon indicator
      ctx.fillStyle = isSelected ? "#8B5A2B" : "#D2B48C"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("📍", x, y)
    })
  }, [zoom, pan, selectedSiteId])

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicked on a site
    for (const site of HERITAGE_SITES) {
      const siteX = site.coordinates.x * canvas.width + pan.x
      const siteY = site.coordinates.y * canvas.height + pan.y
      const distance = Math.sqrt((x - siteX) ** 2 + (y - siteY) ** 2)

      if (distance < 20) {
        onSiteSelect(site.id)
        return
      }
    }

    // Start dragging
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    setPan((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }))

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => {
      const newZoom = direction === "in" ? prev * 1.2 : prev / 1.2
      return Math.max(0.5, Math.min(3, newZoom))
    })
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-gradient-to-b from-background to-muted cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas ref={canvasRef} onMouseDown={handleCanvasMouseDown} className="w-full h-full block" />

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 bg-card border border-border rounded-lg shadow-lg p-2">
        <button
          onClick={() => handleZoom("in")}
          className="p-2 hover:bg-muted transition-colors rounded"
          title="Zoom in"
        >
          <span className="text-lg font-bold">+</span>
        </button>
        <div className="w-8 h-px bg-border" />
        <button
          onClick={() => handleZoom("out")}
          className="p-2 hover:bg-muted transition-colors rounded"
          title="Zoom out"
        >
          <span className="text-lg font-bold">−</span>
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs">
        <h3 className="font-serif font-bold text-foreground mb-3">Heritage Sites Map</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Drag to pan • Scroll wheel to zoom • Click on pins to view details</p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-4 h-4 rounded-full bg-accent border-2 border-primary"></div>
            <span>Selected site</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-secondary border-2 border-secondary"></div>
            <span>Available site</span>
          </div>
        </div>
      </div>
    </div>
  )
}
