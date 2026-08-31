import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative overflow-hidden bg-grey-5">
      {/* Background with geometric shapes and gradient */}
      <div className="absolute inset-0">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-grey-5 via-brand-50 to-accent-50" />

        {/* Decorative circles */}
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-gradient-to-br from-brand-200/30 to-brand-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-tr from-accent-200/20 to-accent-300/20 rounded-full blur-3xl" />

        {/* Decorative squares */}
        <div className="absolute top-1/4 right-10 w-20 h-20 bg-brand-400 opacity-20 transform rotate-45" />
        <div className="absolute bottom-1/3 left-20 w-16 h-16 bg-accent-400 opacity-15 transform -rotate-12" />
        <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-brand-300 opacity-10 rounded" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-start text-left small:p-32 p-12 gap-6">
        <div className="max-w-2xl">
          <Heading
            level="h1"
            className="font-heading text-6xl leading-tight font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-brand-500 to-accent-500"
          >
            Willkommen bei
            <br />
            DAB ZONE
          </Heading>

          <p className="text-xl text-grey-60 mb-6 max-w-xl">
            Entdecke hochwertige Einrichtung für jedes Zimmer deines Zuhauses
          </p>

          <div className="flex gap-4 pt-2">
            <LocalizedClientLink href="/categories">
              <Button
                variant="primary"
                size="large"
                className="bg-brand-600 hover:bg-brand-700 font-semibold"
              >
                Kategorien entdecken
              </Button>
            </LocalizedClientLink>
            <LocalizedClientLink href="/store">
              <Button
                variant="secondary"
                size="large"
                className="border-2 border-brand-500 text-brand-700 hover:bg-brand-50 font-semibold"
              >
                Alle Produkte
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      {/* Right side accent shapes */}
      <div className="absolute right-0 top-0 h-full w-1/3 pointer-events-none">
        <div className="absolute top-1/2 right-20 transform -translate-y-1/2">
          <div className="relative w-64 h-64">
            {/* Decorative arc */}
            <div className="absolute inset-0 border-4 border-brand-400 border-r-transparent border-b-transparent rounded-tl-full opacity-40" />
            <div className="absolute inset-4 border-2 border-accent-400 border-l-transparent border-t-transparent rounded-br-full opacity-30" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
