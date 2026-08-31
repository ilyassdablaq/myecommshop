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
    <section className="py-20 px-4 bg-gradient-to-b from-grey-5 to-brand-50">
      <div className="content-container">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-4xl font-semibold text-grey-90 mb-4">
            Unsere Kollektion
          </h2>
          <p className="text-lg text-grey-60 max-w-2xl mx-auto">
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
              <div className="relative h-72 overflow-hidden rounded-2xl bg-gradient-to-br from-accent-100 via-brand-100 to-brand-200 border border-ui-border-base transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                {/* Background shapes */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/30 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                  <h3 className="font-heading text-3xl font-semibold text-grey-90 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-700 group-hover:to-brand-500 transition-all">
                    {collection.title}
                  </h3>

                  <p className="text-sm text-grey-60 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {collection.products ? `${collection.products.length} Produkte` : "Produkte"}
                  </p>

                  {/* Hover CTA */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-block bg-brand-600 text-white px-6 py-2 rounded-full font-semibold">
                      Entdecken →
                    </span>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-4 h-4 bg-brand-400 rounded-full opacity-40" />
                <div className="absolute bottom-8 left-8 w-3 h-3 bg-accent-400 rounded-full opacity-30" />
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollections
