import { Metadata } from "next"
import { listCategories } from "@lib/data/categories"
import { normalizeHandle } from "@lib/util/normalize-handle"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Kategorien | DAB ZONE",
  description: "Entdecke unsere Kategorien",
}

export default async function CategoriesPage() {
  const categories = await listCategories()

  // Filter nur Top-Level Kategorien (keine Sub-Kategorien)
  const topLevelCategories = categories?.filter(
    (c: any) => !c.parent_category
  ) || []

  return (
    <div className="py-20 px-4">
      <div className="content-container">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-ui-fg-base mb-4">
            Unsere Kategorien
          </h1>
          <p className="text-lg text-ui-fg-muted">
            Finde alles für dein Zuhause
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {topLevelCategories.map((category: any) => {
            // Normalisiere den Handle (Umlaute zu ASCII)
            const normalizedHandle = normalizeHandle(category.name)
            
            return (
              <LocalizedClientLink
                key={category.id}
                href={`/categories/${normalizedHandle}`}
                className="group"
              >
                <div className="relative h-80 overflow-hidden rounded-lg bg-gradient-to-br from-rose-100 to-orange-100 border border-ui-border-base transition-all duration-300 hover:shadow-lg hover:scale-105">
                  {/* Decorative background */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4 opacity-50">
                        {category.name === "Küche" && "🍳"}
                        {category.name === "Flur" && "🚪"}
                        {category.name === "Wohnzimmer" && "🛋️"}
                        {category.name === "Schlafzimmer" && "🛏️"}
                        {category.name === "Badezimmer" && "🚿"}
                      </div>
                      <h3 className="text-2xl font-bold text-ui-fg-base group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-orange-500 transition-all">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 w-full">
                      <button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        Jetzt entdecken →
                      </button>
                    </div>
                  </div>
                </div>
              </LocalizedClientLink>
            )
          })}
        </div>

        {topLevelCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-ui-fg-muted text-lg">
              Keine Kategorien verfügbar
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
