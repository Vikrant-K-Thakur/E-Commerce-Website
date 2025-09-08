"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { Play, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"

export function HeroBanner() {
  const [isMuted, setIsMuted] = useState(true)

  return (
    <div className="px-4 py-4 sm:py-6 lg:px-0">
      <Card className="relative overflow-hidden bg-black border-0 h-[300px] sm:h-[400px] lg:h-[500px]">
        {/* Video Background */}
        <video autoPlay loop muted={isMuted} playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/shirt-collection-video.mp4" type="video/mp4" />
          {/* Fallback image */}
          <img
            src="/luxury-shirt-collection-showcase.jpg"
            alt="NXTFIT Shirt Collection"
            className="w-full h-full object-cover"
          />
        </video>

        {/* Video Controls */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="p-6 sm:p-8 lg:p-12 space-y-4 sm:space-y-6 max-w-2xl">
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white text-balance">
                Premium Shirt Collection
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-white/90 text-pretty max-w-lg">
                Discover our exclusive range of luxury shirts crafted with the finest materials for the modern
                gentleman.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <AuthGuard>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Shop Collection
                </Button>
              </AuthGuard>
              <Button
                variant="outline"
                size="lg"
                className="bg-black/50 border-white/50 text-white hover:bg-black/70 hover:border-white/70 backdrop-blur-sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Story
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
