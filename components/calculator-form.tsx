'use client'

import React, { useState } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
// import { useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Info } from "lucide-react"
import { TargetView } from "./target-view"
import { PersistentTooltip } from './persistent-tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

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
  const [adjustmentType, setAdjustmentType] = useState<"1/8 MOA" | "1/4 MOA" | "1/2 MOA" | "1 MOA" | "0.1 MIL">("1/4 MOA")
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)
  const [errors, setErrors] = useState<{
    horizontalDeviation?: string;
    verticalDeviation?: string;
    distance?: string;
  }>({})

  const handleDeviationChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setter(value)
    }
  }

  const validateInputs = () => {
    const newErrors: typeof errors = {}
    
    if (!horizontalDeviation) {
      newErrors.horizontalDeviation = "Horisontell avvikelse måste anges"
    }
    if (!verticalDeviation) {
      newErrors.verticalDeviation = "Vertikal avvikelse måste anges"
    }
    if (!distance) {
      newErrors.distance = "Avstånd måste anges"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = () => {
    if (!validateInputs()) {
      toast({
        title: "Ofullständig information",
        description: "Vänligen fyll i alla fält innan du beräknar.",
      })
      return
    }

    const Ah = parseFloat(horizontalDeviation) * (horizontalDirection === "left" ? -1 : 1)
    const Av = parseFloat(verticalDeviation) * (verticalDirection === "down" ? -1 : 1)
    const D = parseFloat(distance)
    
    let clicksPerCm
    switch (adjustmentType) {
      case "1/8 MOA":
        clicksPerCm = 1 / 0.3625
        break
      case "1/4 MOA":
        clicksPerCm = 1 / 0.725
        break
      case "1/2 MOA":
        clicksPerCm = 1 / 1.45
        break
      case "1 MOA":
        clicksPerCm = 1 / 2.9
        break
      case "0.1 MIL":
        clicksPerCm = 1.0
        break
    }
    
    const Nh = Math.round((Ah * clicksPerCm) / (D / 100))
    const Nv = Math.round((Av * clicksPerCm) / (D / 100))
    
    setResult({ horizontalClicks: -Nh, verticalClicks: -Nv })
    setIsResultModalOpen(true)
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
                className={errors.horizontalDeviation ? "border-red-500" : ""}
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
            {errors.horizontalDeviation && (
              <p className="text-red-500 text-sm mt-1">{errors.horizontalDeviation}</p>
            )}
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
                className={errors.verticalDeviation ? "border-red-500" : ""}
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
            {errors.verticalDeviation && (
              <p className="text-red-500 text-sm mt-1">{errors.verticalDeviation}</p>
            )}
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
              className={errors.distance ? "border-red-500" : ""}
            />
            {errors.distance && (
              <p className="text-red-500 text-sm mt-1">{errors.distance}</p>
            )}
          </div>

          {/* Justeringstyp */}
          <div>
            <Label htmlFor="adjustmentType">Välj justeringsenhet (MOA/MIL)</Label>
            <Select
              value={adjustmentType}
              onValueChange={(value: "1/8 MOA" | "1/4 MOA" | "1/2 MOA" | "1 MOA" | "0.1 MIL") => setAdjustmentType(value)}
            >
              <SelectTrigger id="adjustmentType">
                <SelectValue placeholder="Välj justeringstyp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1/8 MOA">1/8 MOA</SelectItem>
                <SelectItem value="1/4 MOA">1/4 MOA</SelectItem>
                <SelectItem value="1/2 MOA">1/2 MOA</SelectItem>
                <SelectItem value="1 MOA">1 MOA</SelectItem>
                <SelectItem value="0.1 MIL">0.1 MIL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCalculate} className="w-full">Beräkna</Button>
        </CardFooter>
      </Card>

      <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
        <DialogContent className="sm:max-w-[425px] w-[90vw] max-w-[90vw] p-4 sm:p-6 rounded-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">Beräkningsresultat</DialogTitle>
            <DialogDescription className="text-sm mt-2">Här är de beräknade justeringarna:</DialogDescription>
          </DialogHeader>
          {result && (
            <div className="p-5 bg-gray-100 rounded-md space-y-3">
              <p className="font-semibold">
                Horisontella klick: <span className="text-lg">
                  {Math.abs(result.horizontalClicks)}{' '}
                  ({result.horizontalClicks > 0 ? "höger" : result.horizontalClicks < 0 ? "vänster" : "ingen justering"})
                </span>
              </p>
              <p className="font-semibold">
                Vertikala klick: <span className="text-lg">
                  {Math.abs(result.verticalClicks)}{' '}
                  ({result.verticalClicks > 0 ? "upp" : result.verticalClicks < 0 ? "ner" : "ingen justering"})
                </span>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
