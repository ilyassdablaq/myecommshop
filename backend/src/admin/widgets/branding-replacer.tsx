import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"

const BrandingReplacer = () => {
  useEffect(() => {
    // Replace all Medusa branding with DAB ZONE
    const replaceText = () => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      )

      const textNodes: Node[] = []
      let node
      while ((node = walker.nextNode())) {
        textNodes.push(node)
      }

      textNodes.forEach((textNode) => {
        const text = textNode.textContent || ''
        let newText = text
        if (text.includes('Welcome to Medusa')) {
          newText = newText.replace(/Welcome to Medusa/g, 'Welcome to DAB ZONE')
        }
        if (text.includes('Medusa Store')) {
          newText = newText.replace(/Medusa Store/g, 'DAB ZONE')
        }
        if (text.includes('Medusa store')) {
          newText = newText.replace(/Medusa store/g, 'DAB ZONE')
        }
        if (newText !== text && textNode.textContent) {
          textNode.textContent = newText
        }
      })
    }

    // Run immediately
    replaceText()
    
    // Run after a short delay for dynamic content
    const timeout = setTimeout(replaceText, 100)
    
    // Observe for DOM changes
    const observer = new MutationObserver(() => {
      replaceText()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [])

  return null
}

export const config = defineWidgetConfig({
  zone: "login.before",
})

export default BrandingReplacer
