"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type FeaturedCollectionsProps = {
  collections: HttpTypes.StoreCollection[]
}

const FeaturedCollections = ({ collections }: FeaturedCollectionsProps) => {
  if (!collections || collections.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-rose-50">
      <div className="content-container">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-ui-fg-base mb-4">
            Unsere Kollektion
          </h2>
          <p className="text-lg text-ui-fg-muted max-w-2xl mx-auto">
            Entdecke exklusive Kollektion für dein Zuhause
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.slice(0, 6).map((collection) => (
            <LocalizedClientLink
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="group"
            >
              <div className="relative h-72 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 border border-ui-border-base transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                {/* Background shapes */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/30 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                  <h3 className="text-3xl font-bold text-ui-fg-base mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-orange-500 transition-all">
                    {collection.title}
                  </h3>
                  
                  <p className="text-sm text-ui-fg-muted mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {collection.products ? `${collection.products.length} Produkte` : "Produkte"}
                  </p>

                  {/* Hover CTA */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-block bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-2 rounded-full font-semibold">
                      Entdecken →
                    </span>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-4 h-4 bg-rose-400 rounded-full opacity-40" />
                <div className="absolute bottom-8 left-8 w-3 h-3 bg-yellow-400 rounded-full opacity-30" />
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollections
