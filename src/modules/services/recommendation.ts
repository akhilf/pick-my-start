export type Preferences = {
  name: string
  favoriteColor: string
  dailyWear: 'Casual' | 'Formal' | 'Sports' | 'Traditional'
  age: number
  favoriteCombo: 'T-shirt + Jeans' | 'Shirt + Trousers' | 'Kurta + Jeans' | 'Athleisure' | 'Dress' | 'Saree'
}

export type Product = {
  id: string
  title: string
  retailer: 'Myntra' | 'Ajio' | 'Amazon Fashion'
  category: string
  color: string
  price: number
  url: string
  image: string
  score?: number
}

const MOCK_CATALOG: Product[] = [
  // Diwali Festival Collection - High Commission Category
  { id: 'amz-diwali-kurta-1', title: 'Designer Festive Kurta Set (70% OFF)', retailer: 'Amazon Fashion', category: 'Traditional', color: 'gold', price: 1499, url: 'https://amazon.in/s?k=mens+designer+kurta+set+diwali+sale&rh=p_n_deal_type%3A28066534031&tag=pickmyfit-21&linkCode=ll2&ref_=as_li_ss_tl', image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800&auto=format&fit=crop' },
  { id: 'amz-ethnic-1', title: 'Premium Ethnic Wear Set (Diwali Special)', retailer: 'Amazon Fashion', category: 'Traditional', color: 'maroon', price: 2499, url: 'https://amazon.in/s?k=premium+ethnic+wear+men+diwali&rh=p_n_deal_type%3A28066534031&tag=pickmyfit-21&linkCode=ll2&ref_=as_li_ss_tl', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop' },
  
  // Wedding Season Collection - High ASP
  { id: 'amz-wedding-suit-1', title: 'Designer Wedding Collection (Limited Stock)', retailer: 'Amazon Fashion', category: 'Formal', color: 'black', price: 3999, url: 'https://amazon.in/s?k=mens+wedding+suits+designer&rh=p_36%3A1318508031&tag=pickmyfit-21&linkCode=ll2&ref_=as_li_ss_tl', image: 'https://images.unsplash.com/photo-1520975587415-c1e9a61a3a40?q=80&w=800&auto=format&fit=crop' },
  { id: 'amz-women-lehenga-1', title: 'Bridal Collection Lehenga (Trending)', retailer: 'Amazon Fashion', category: 'Traditional', color: 'red', price: 4999, url: 'https://amazon.in/s?k=wedding+lehenga+designer+bridal&rh=p_36%3A1318509031&tag=pickmyfit-21&linkCode=ll2&ref_=as_li_ss_tl', image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=800&auto=format&fit=crop' },
  
  // Winter Collection - Seasonal High Demand
  { id: 'amz-winter-jacket-1', title: 'Premium Winter Jacket (New Launch)', retailer: 'Amazon Fashion', category: 'Casual', color: 'navy', price: 2999, url: 'https://amazon.in/s?k=premium+winter+jacket+men+branded&rh=p_n_date%3A1571559031&tag=pickmyfit-21&linkCode=ll2&ref_=as_li_ss_tl', image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?q=80&w=800&auto=format&fit=crop' },
  
  // Deal of the Day - High Converting
  { id: 'amz-casual-combo-2', title: 'Branded Fashion Set (Deal of the Day)', retailer: 'Amazon Fashion', category: 'Casual', color: 'blue', price: 1999, url: 'https://amazon.in/s?k=branded+mens+fashion+combo+set+deal&rh=p_n_deal_type%3A28066534031&tag=pickmyfit-21&linkCode=ll2&ref_=as_li_ss_tl', image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop' },
  
  // Amazon Brand - Higher Commission
  { id: 'amz-symbol-1', title: 'Amazon Brand - Symbol Premium Collection', retailer: 'Amazon Fashion', category: 'Casual', color: 'multi', price: 1799, url: 'https://amazon.in/s?k=amazon+brand+symbol+men+clothing+new&rh=p_n_date%3A1571559031&tag=pickmyfit-21&linkCode=ll2&ref_=as_li_ss_tl', image: 'https://images.unsplash.com/photo-1520975548101-7edb8b343359?q=80&w=800&auto=format&fit=crop' },
]

function scoreProduct(prefs: Preferences, p: Product): number {
  let score = 0
  const colorMatch = prefs.favoriteColor.toLowerCase()
  if (p.color.toLowerCase().includes(colorMatch)) score += 3
  if (p.category === prefs.dailyWear) score += 2
  const comboHints: Record<Preferences['favoriteCombo'], string[]> = {
    'T-shirt + Jeans': ['Tee', 'Jeans'],
    'Shirt + Trousers': ['Shirt', 'Trouser'],
    'Kurta + Jeans': ['Kurta', 'Jeans'],
    'Athleisure': ['Athleisure', 'Nike'],
    'Dress': ['Dress'],
    'Saree': ['Saree'],
  }
  const hints = comboHints[prefs.favoriteCombo]
  if (hints.some((h) => p.title.toLowerCase().includes(h.toLowerCase()))) score += 3
  if (prefs.age < 22 && p.category === 'Sports') score += 1
  if (prefs.age >= 30 && p.category === 'Formal') score += 1
  return score
}

export async function analyzeAndRecommend(prefs: Preferences): Promise<Product[]> {
  const withScore = MOCK_CATALOG.map((p) => ({ ...p, score: scoreProduct(prefs, p) }))
  const top = withScore
    .filter((p) => p.score && p.score > 0)
    .sort((a, b) => (b.score! - a.score!))
    .slice(0, 20)

  const enableAI = (import.meta as any).env?.VITE_ENABLE_AI === 'true'
  if (!enableAI) {
    return top.slice(0, 8)
  }

  try {
    const reranked = await llmRerank(prefs, top)
    return reranked.slice(0, 8)
  } catch {
    return top.slice(0, 8)
  }
}

export async function fetchFromRetailers(_query: string): Promise<Product[]> {
  return MOCK_CATALOG
}

async function llmRerank(prefs: Preferences, products: Product[]): Promise<Product[]> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  try {
    const res = await fetch('/api/rerank', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prefs, products }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error('rerank failed')
    const data = await res.json() as { ranked_ids?: string[] }
    const order = data.ranked_ids && data.ranked_ids.length ? data.ranked_ids : products.map(p => p.id)
    const map = new Map(products.map(p => [p.id, p]))
    return order.map(id => map.get(id)).filter(Boolean) as Product[]
  } finally {
    clearTimeout(timeout)
  }
}
