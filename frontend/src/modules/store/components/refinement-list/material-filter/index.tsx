"use client"

import { Checkbox, Label, Text } from "@medusajs/ui"

type MaterialFilterProps = {
  tags: { id: string; value: string }[]
  selectedIds: string[]
  toggle: (id: string) => void
  "data-testid"?: string
}

const MaterialFilter = ({
  tags,
  selectedIds,
  toggle,
  "data-testid": dataTestId,
}: MaterialFilterProps) => {
  return (
    <div className="flex gap-x-3 flex-col gap-y-3" data-testid={dataTestId}>
      <Text className="txt-compact-small-plus text-ui-fg-muted">
        Material
      </Text>
      <div className="flex flex-col gap-y-2">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center gap-x-2">
            <Checkbox
              id={`material-${tag.id}`}
              checked={selectedIds.includes(tag.id)}
              onCheckedChange={() => toggle(tag.id)}
            />
            <Label
              htmlFor={`material-${tag.id}`}
              className="!txt-compact-small !transform-none text-ui-fg-subtle hover:cursor-pointer capitalize"
            >
              {tag.value}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MaterialFilter
