"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export type StoreReview = {
  id: string
  product_id: string
  customer_name: string
  rating: number
  title: string | null
  content: string
  status: string
  created_at: string
}

export type StoreProductReviewsResponse = {
  reviews: StoreReview[]
  count: number
  average_rating: number
  rating_counts: Record<number, number>
  limit: number
  offset: number
}

export const getProductReviews = async ({
  productId,
  limit = 10,
  offset = 0,
}: {
  productId: string
  limit?: number
  offset?: number
}): Promise<StoreProductReviewsResponse> => {
  const next = {
    ...(await getCacheOptions(`reviews-${productId}`)),
  }

  return sdk.client.fetch<StoreProductReviewsResponse>(
    `/store/products/${productId}/reviews`,
    {
      method: "GET",
      query: { limit, offset },
      next,
      cache: "force-cache",
    }
  )
}

export async function submitProductReview(
  productId: string,
  _currentState: unknown,
  formData: FormData
) {
  const rating = Number(formData.get("rating"))
  const title = (formData.get("title") as string)?.trim() || undefined
  const content = (formData.get("content") as string)?.trim()

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await sdk.client.fetch(`/store/products/${productId}/reviews`, {
      method: "POST",
      headers,
      body: { rating, title, content },
    })
  } catch (error: any) {
    return error.message as string
  }

  return null
}
