"use client"

import { Input, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

type PriceFilterProps = {
  min: string
  max: string
  setMin: (value: string) => void
  setMax: (value: string) => void
  "data-testid"?: string
}

const PriceFilter = ({
  min,
  max,
  setMin,
  setMax,
  "data-testid": dataTestId,
}: PriceFilterProps) => {
  const [minValue, setMinValue] = useState(min)
  const [maxValue, setMaxValue] = useState(max)

  useEffect(() => setMinValue(min), [min])
  useEffect(() => setMaxValue(max), [max])

  return (
    <div className="flex gap-x-3 flex-col gap-y-3" data-testid={dataTestId}>
      <Text className="txt-compact-small-plus text-ui-fg-muted">Preis</Text>
      <div className="flex items-center gap-x-2">
        <Input
          type="number"
          min={0}
          placeholder="Min"
          value={minValue}
          onChange={(e) => setMinValue(e.target.value)}
          onBlur={() => setMin(minValue)}
          className="w-24"
        />
        <span className="text-ui-fg-subtle">–</span>
        <Input
          type="number"
          min={0}
          placeholder="Max"
          value={maxValue}
          onChange={(e) => setMaxValue(e.target.value)}
          onBlur={() => setMax(maxValue)}
          className="w-24"
        />
      </div>
    </div>
  )
}

export default PriceFilter
