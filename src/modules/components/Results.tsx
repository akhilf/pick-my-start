import type { Product } from '../services/recommendation'

function ensureAffiliateTag(url: string): string {
  const affiliateTag = 'pickmyfit-21'
  try {
    const urlObj = new URL(url)
    
    // Extract the product ID if it's a product page
    const productId = urlObj.pathname.match(/\/dp\/([A-Z0-9]+)/)?.[1] ||
                     urlObj.pathname.match(/\/gp\/product\/([A-Z0-9]+)/)?.[1]

    if (productId) {
      // Build a direct Amazon Associates product link
      const associateUrl = new URL('https://amazon.in/dp/' + productId)
      
      // Add essential affiliate parameters first
      associateUrl.searchParams.set('tag', affiliateTag)
      
      // Add other important product parameters
      const paramsToKeep = ['th', 'psc', 'pd_rd_i']
      paramsToKeep.forEach(param => {
        if (urlObj.searchParams.has(param)) {
          associateUrl.searchParams.set(param, urlObj.searchParams.get(param)!)
        }
      })
      
      // Add standard affiliate parameters
      associateUrl.searchParams.set('linkCode', 'll1')
      associateUrl.searchParams.set('ref_', 'as_li_ss_tl')
      
      return associateUrl.toString()
    }
    
    // For search pages and other URLs
    if (!urlObj.searchParams.has('tag')) {
      urlObj.searchParams.set('tag', affiliateTag)
    }
    if (!urlObj.searchParams.has('linkCode')) {
      urlObj.searchParams.set('linkCode', 'll2')
    }
    if (!urlObj.searchParams.has('ref_')) {
      urlObj.searchParams.set('ref_', 'as_li_ss_tl')
    }
    
    return urlObj.toString()
  } catch {
    // If URL parsing fails, ensure we add the affiliate tag
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}tag=${affiliateTag}&linkCode=ll2&ref_=as_li_ss_tl`
  }
}

type Props = { products: Product[] }

export function Results({ products }: Props) {
  if (products.length === 0) {
    return <p>No matches. Try adjusting your preferences.</p>
  }

  return (
    <div className="grid">
      {products.map((p) => (
        <article key={p.id} className="card product">
          <img src={p.image} alt={p.title} />
          <div className="product__body">
            <h3>{p.title}</h3>
            <p className="muted">{p.retailer} • {p.category} • {p.color}</p>
            <div className="row">
              <span className="price">₹{p.price.toLocaleString('en-IN')}</span>
              <a 
                className="btn btn--small" 
                href={ensureAffiliateTag(p.url)} 
                onClick={(e) => {
                  e.preventDefault()
                  const productId = p.url.match(/\/dp\/([A-Z0-9]+)/)?.[1]
                  let finalUrl = p.url
                  
                  if (productId) {
                    // If it's a product page, use the clean Associates URL format
                    finalUrl = `https://amazon.in/dp/${productId}?tag=pickmyfit-21&linkCode=ll1&ref_=as_li_ss_tl`
                  } else {
                    // For search pages, use the original URL with affiliate tag
                    const urlObj = new URL(p.url)
                    urlObj.searchParams.set('tag', 'pickmyfit-21')
                    urlObj.searchParams.set('linkCode', 'll2')
                    urlObj.searchParams.set('ref_', 'as_li_ss_tl')
                    finalUrl = urlObj.toString()
                  }
                  
                  window.open(finalUrl, '_blank', 'noopener,noreferrer')
                }}
              >
                View
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
