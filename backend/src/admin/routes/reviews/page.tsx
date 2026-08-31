import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import {
  Badge,
  Button,
  Container,
  Heading,
  Table,
  Tabs,
  Text,
  toast,
} from "@medusajs/ui"
import { useEffect, useState } from "react"

type Review = {
  id: string
  product_id: string
  product_title: string | null
  customer_name: string
  rating: number
  title: string | null
  content: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

type StatusFilter = "pending" | "approved" | "rejected" | "all"

const statusBadgeColor: Record<Review["status"], "orange" | "green" | "red"> = {
  pending: "orange",
  approved: "green",
  rejected: "red",
}

const ReviewsPage = () => {
  const [status, setStatus] = useState<StatusFilter>("pending")
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const fetchReviews = async (currentStatus: StatusFilter) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/admin/reviews?status=${currentStatus}&limit=100`,
        { credentials: "include" }
      )
      const data = await response.json()
      setReviews(data.reviews ?? [])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews(status)
  }, [status])

  const moderate = async (id: string, nextStatus: "approved" | "rejected") => {
    setBusyId(id)
    try {
      const response = await fetch(`/admin/reviews/${id}/status`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!response.ok) {
        throw new Error("Request failed")
      }
      toast.success(
        nextStatus === "approved"
          ? "Bewertung freigegeben"
          : "Bewertung abgelehnt"
      )
      await fetchReviews(status)
    } catch {
      toast.error("Aktion fehlgeschlagen")
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (id: string) => {
    setBusyId(id)
    try {
      const response = await fetch(`/admin/reviews/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error("Request failed")
      }
      toast.success("Bewertung gelöscht")
      await fetchReviews(status)
    } catch {
      toast.error("Löschen fehlgeschlagen")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Produktbewertungen</Heading>
          <Text className="text-ui-fg-subtle">
            Kundenbewertungen prüfen, freigeben oder ablehnen.
          </Text>
        </div>
      </div>
      <Tabs
        value={status}
        onValueChange={(value) => setStatus(value as StatusFilter)}
      >
        <Tabs.List className="px-6">
          <Tabs.Trigger value="pending">Ausstehend</Tabs.Trigger>
          <Tabs.Trigger value="approved">Freigegeben</Tabs.Trigger>
          <Tabs.Trigger value="rejected">Abgelehnt</Tabs.Trigger>
          <Tabs.Trigger value="all">Alle</Tabs.Trigger>
        </Tabs.List>
      </Tabs>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Produkt</Table.HeaderCell>
            <Table.HeaderCell>Kunde</Table.HeaderCell>
            <Table.HeaderCell>Bewertung</Table.HeaderCell>
            <Table.HeaderCell>Text</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Datum</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {!isLoading && reviews.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={7}>
                <Text className="text-ui-fg-subtle py-4 text-center block">
                  Keine Bewertungen in dieser Ansicht.
                </Text>
              </Table.Cell>
            </Table.Row>
          )}
          {reviews.map((review) => (
            <Table.Row key={review.id}>
              <Table.Cell>
                {review.product_title ?? review.product_id}
              </Table.Cell>
              <Table.Cell>{review.customer_name}</Table.Cell>
              <Table.Cell>
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </Table.Cell>
              <Table.Cell className="max-w-[320px]">
                {review.title && (
                  <div className="font-medium">{review.title}</div>
                )}
                <div className="text-ui-fg-subtle line-clamp-2">
                  {review.content}
                </div>
              </Table.Cell>
              <Table.Cell>
                <Badge color={statusBadgeColor[review.status]}>
                  {review.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                {new Date(review.created_at).toLocaleDateString("de-DE")}
              </Table.Cell>
              <Table.Cell>
                <div className="flex gap-x-2">
                  {review.status !== "approved" && (
                    <Button
                      size="small"
                      variant="secondary"
                      disabled={busyId === review.id}
                      onClick={() => moderate(review.id, "approved")}
                    >
                      Freigeben
                    </Button>
                  )}
                  {review.status !== "rejected" && (
                    <Button
                      size="small"
                      variant="secondary"
                      disabled={busyId === review.id}
                      onClick={() => moderate(review.id, "rejected")}
                    >
                      Ablehnen
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="danger"
                    disabled={busyId === review.id}
                    onClick={() => remove(review.id)}
                  >
                    Löschen
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Bewertungen",
  icon: ChatBubbleLeftRight,
})

export default ReviewsPage
