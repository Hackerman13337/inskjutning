'use client'

import React from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
// import { useRef, useEffect } from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Info } from "lucide-react"
import { TargetView } from "./target-view"
import { PersistentTooltip } from './persistent-tooltip'

interface CalculationResult {
  horizontalClicks: number;
  verticalClicks: number;
}

export default function CalculatorForm() {
  const [horizontalDeviation, setHorizontalDeviation] = useState("")
  const [verticalDeviation, setVerticalDeviation] = useState("")
  const [horizontalDirection, setHorizontalDirection] = useState<"left" | "right">("right")
  const [verticalDirection, setVerticalDirection] = useState<"up" | "down">("up")
  const [distance, setDistance] = useState("")
  const [adjustmentType, setAdjustmentType] = useState<"MOA" | "MIL">("MOA")
  const [result, setResult] = useState<CalculationResult | null>(null)

  const handleDeviationChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setter(value)
    }
  }

  const handleCalculate = () => {
    const Ah = parseFloat(horizontalDeviation) * (horizontalDirection === "left" ? -1 : 1)
    const Av = parseFloat(verticalDeviation) * (verticalDirection === "down" ? -1 : 1)
    const D = parseFloat(distance)
    
    const clicksPerCm = adjustmentType === "MOA" ? 1 / 0.725 : 1.0
    
    const Nh = Math.round((Ah * clicksPerCm) / (D / 100))
    const Nv = Math.round((Av * clicksPerCm) / (D / 100))
    
    setResult({ horizontalClicks: -Nh, verticalClicks: -Nv })
  }

  const DirectionButton = ({
    direction,
    active,
    onClick,
    icon: Icon
  }: {
    direction: 'left' | 'right' | 'up' | 'down';
    active: boolean;
    onClick: () => void;
    icon: React.ElementType;
  }) => (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={`p-0 w-8 h-8 ${active ? 'bg-primary text-primary-foreground' : ''}`}
      onClick={onClick}
      data-direction={direction}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )

  return (
    <TooltipProvider>
      <Card className="max-w-md mx-auto">
        <CardContent className="space-y-4 pt-6"> {/* Lagt till pt-6 för att kompensera för borttagen rubrik */}
          <div className="flex justify-center mb-4">
            <TargetView 
              horizontalDeviation={parseFloat(horizontalDeviation) * (horizontalDirection === "left" ? -1 : 1)} 
              verticalDeviation={parseFloat(verticalDeviation) * (verticalDirection === "down" ? -1 : 1)}
            />
          </div>
          
          {/* Horisontell avvikelse */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="horizontalDeviation">Horisontell avvikelse</Label>
                <span className="text-sm text-gray-500">(cm)</span>
              </div>
              <PersistentTooltip content="Ange avvikelsen i cm och välj riktning med pilarna">
                <Info className="h-4 w-4" />
                <span className="sr-only">Info om avvikelse</span>
              </PersistentTooltip>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                id="horizontalDeviation"
                type="text"
                inputMode="decimal"
                value={horizontalDeviation}
                onChange={handleDeviationChange(setHorizontalDeviation)}
                placeholder="Avvikelse"
              />
              <div className="flex space-x-2">
                <DirectionButton
                  direction="left"
                  active={horizontalDirection === "left"}
                  onClick={() => setHorizontalDirection("left")}
                  icon={ChevronLeft}
                />
                <DirectionButton
                  direction="right"
                  active={horizontalDirection === "right"}
                  onClick={() => setHorizontalDirection("right")}
                  icon={ChevronRight}
                />
              </div>
            </div>
          </div>

          {/* Vertikal avvikelse */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="verticalDeviation">Vertikal avvikelse</Label>
                <span className="text-sm text-gray-500">(cm)</span>
              </div>
              <PersistentTooltip content="Ange avvikelsen i cm och välj riktning med pilarna">
                <Info className="h-4 w-4" />
                <span className="sr-only">Info om avvikelse</span>
              </PersistentTooltip>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                id="verticalDeviation"
                type="text"
                inputMode="decimal"
                value={verticalDeviation}
                onChange={handleDeviationChange(setVerticalDeviation)}
                placeholder="Avvikelse"
              />
              <div className="flex space-x-2">
                <DirectionButton
                  direction="up"
                  active={verticalDirection === "up"}
                  onClick={() => setVerticalDirection("up")}
                  icon={ChevronUp}
                />
                <DirectionButton
                  direction="down"
                  active={verticalDirection === "down"}
                  onClick={() => setVerticalDirection("down")}
                  icon={ChevronDown}
                />
              </div>
            </div>
          </div>

          {/* Avstånd */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="distance">Avstånd till målet</Label>
                <span className="text-sm text-gray-500">(m)</span>
              </div>
              <PersistentTooltip content="Ange avståndet till målet i meter">
                <Info className="h-4 w-4" />
                <span className="sr-only">Info om avstånd</span>
              </PersistentTooltip>
            </div>
            <Input
              id="distance"
              type="text"
              inputMode="decimal"
              value={distance}
              onChange={handleDeviationChange(setDistance)}
              placeholder="Avstånd"
            />
          </div>

          {/* Justeringstyp */}
          <div>
            <Label htmlFor="adjustmentType">Välj justeringsenhet (MOA/MIL)</Label>
            <Select
              value={adjustmentType}
              onValueChange={(value: "MOA" | "MIL") => setAdjustmentType(value)}
            >
              <SelectTrigger id="adjustmentType">
                <SelectValue placeholder="Välj justeringstyp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MOA">1/4 MOA</SelectItem>
                <SelectItem value="MIL">0.1 MIL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={handleCalculate} className="w-full">Beräkna</Button>
          {result && (
            <div className="w-full p-4 bg-gray-100 rounded-md">
              <p className="font-semibold">
                Horisontella klick: {Math.abs(result.horizontalClicks)} 
                ({result.horizontalClicks > 0 ? "höger" : result.horizontalClicks < 0 ? "vänster" : "ingen justering"})
              </p>
              <p className="font-semibold">
                Vertikala klick: {Math.abs(result.verticalClicks)} 
                ({result.verticalClicks > 0 ? "upp" : result.verticalClicks < 0 ? "ner" : "ingen justering"})
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
