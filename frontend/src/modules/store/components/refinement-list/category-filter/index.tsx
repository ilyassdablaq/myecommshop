"use client"

import { Checkbox, Label, Text } from "@medusajs/ui"

type CategoryFilterProps = {
  categories: { id: string; name: string }[]
  selectedIds: string[]
  toggle: (id: string) => void
  "data-testid"?: string
}

const CategoryFilter = ({
  categories,
  selectedIds,
  toggle,
  "data-testid": dataTestId,
}: CategoryFilterProps) => {
  return (
    <div className="flex gap-x-3 flex-col gap-y-3" data-testid={dataTestId}>
      <Text className="txt-compact-small-plus text-ui-fg-muted">
        Kategorie
      </Text>
      <div className="flex flex-col gap-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-x-2">
            <Checkbox
              id={`category-${category.id}`}
              checked={selectedIds.includes(category.id)}
              onCheckedChange={() => toggle(category.id)}
            />
            <Label
              htmlFor={`category-${category.id}`}
              className="!txt-compact-small !transform-none text-ui-fg-subtle hover:cursor-pointer"
            >
              {category.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter
