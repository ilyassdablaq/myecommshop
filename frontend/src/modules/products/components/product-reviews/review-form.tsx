"use client"

import { Label, Text, Textarea } from "@medusajs/ui"
import { useActionState, useState } from "react"

import { submitProductReview } from "@lib/data/reviews"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"

type FormState = { error: string } | { success: true } | null

const ReviewForm = ({ productId }: { productId: string }) => {
  const [rating, setRating] = useState(0)
  const action = submitProductReview.bind(null, productId)

  const [state, formAction] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const error = await action(_prevState, formData)
      return error ? { error } : { success: true }
    },
    null
  )

  if (state && "success" in state) {
    return (
      <Text className="text-base-regular text-grey-70">
        Danke für deine Bewertung! Sie wird nach Prüfung veröffentlicht.
      </Text>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-y-4 max-w-md">
      <div>
        <Label className="txt-compact-small-plus text-ui-fg-subtle mb-2 block">
          Deine Bewertung
        </Label>
        <div className="flex gap-x-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`text-2xl leading-none ${
                value <= rating ? "text-brand-600" : "text-grey-30"
              }`}
              aria-label={`${value} von 5 Sternen`}
            >
              ★
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating} />
      </div>

      <Input label="Titel (optional)" name="title" maxLength={120} />

      <div>
        <Label
          htmlFor="content"
          className="txt-compact-small-plus text-ui-fg-subtle mb-2 block"
        >
          Deine Erfahrung
        </Label>
        <Textarea
          id="content"
          name="content"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          placeholder="Was gefällt dir an diesem Produkt?"
        />
      </div>

      <ErrorMessage error={state && "error" in state ? state.error : null} />
      <SubmitButton variant="secondary" className="self-start">
        Bewertung abschicken
      </SubmitButton>
    </form>
  )
}

export default ReviewForm
