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
  { id: 'm-tee-jeans-1', title: 'Roadster Tee + Slim Jeans', retailer: 'Myntra', category: 'Casual', color: 'blue', price: 1299, url: 'https://www.myntra.com', image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop' },
  { id: 'm-shirt-trouser-1', title: 'HRX Shirt & Trousers', retailer: 'Myntra', category: 'Formal', color: 'white', price: 2199, url: 'https://www.myntra.com', image: 'https://images.unsplash.com/photo-1520975587415-c1e9a61a3a40?q=80&w=800&auto=format&fit=crop' },
  { id: 'a-ath-1', title: 'Nike Athleisure Set', retailer: 'Amazon Fashion', category: 'Sports', color: 'black', price: 2999, url: 'https://www.amazon.in', image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?q=80&w=800&auto=format&fit=crop' },
  { id: 'aj-kurta-1', title: 'Indie Kurta + Jeans', retailer: 'Ajio', category: 'Traditional', color: 'green', price: 1599, url: 'https://www.ajio.com', image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800&auto=format&fit=crop' },
  { id: 'aj-dress-1', title: 'Trendy Casual Dress', retailer: 'Ajio', category: 'Casual', color: 'red', price: 1899, url: 'https://www.ajio.com', image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=800&auto=format&fit=crop' },
  { id: 'm-saree-1', title: 'Silk Saree', retailer: 'Myntra', category: 'Traditional', color: 'blue', price: 3499, url: 'https://www.myntra.com', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop' },
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
