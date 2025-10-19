// Vercel serverless function: POST /api/rerank
// Re-ranks products using an LLM (OpenAI) based on user preferences.

export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'content-type': 'application/json' } })
  }

  const apiKey = process.env.OPENAI_API_KEY

  let body: any
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'content-type': 'application/json' } })
  }

  const { prefs, products } = body || {}
  if (!prefs || !Array.isArray(products)) {
    return new Response(JSON.stringify({ error: 'Missing prefs or products' }), { status: 400, headers: { 'content-type': 'application/json' } })
  }

  // Clamp input size
  const top = products.slice(0, 20).map((p: any) => ({ id: p.id, title: p.title, category: p.category, color: p.color, price: p.price }))

  const system = `You are a personal fashion stylist. Given a user profile and a list of products, return a strict JSON object with a ranked array of product IDs from best to worst match, and a brief rationale per id. Keep JSON small.`
  const user = {
    profile: {
      name: prefs.name,
      favoriteColor: prefs.favoriteColor,
      dailyWear: prefs.dailyWear,
      age: prefs.age,
      favoriteCombo: prefs.favoriteCombo,
    },
    products: top,
    output_format: {
      ranked_ids: ["<id>", "<id>"],
      reasons: { "<id>": "short reason" }
    }
  }

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(apiKey ? { 'authorization': `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: JSON.stringify(user) }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 500,
      }),
    })

    if (!apiKey) {
      // No key in local dev: passthrough order to exercise end-to-end flow
      return new Response(JSON.stringify({ ranked_ids: top.map(p => p.id), reasons: {} }), { status: 200, headers: { 'content-type': 'application/json' } })
    }

    if (!resp.ok) {
      const text = await resp.text()
      return new Response(JSON.stringify({ error: 'LLM error', detail: text }), { status: 502, headers: { 'content-type': 'application/json' } })
    }

    const data = await resp.json() as any
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      return new Response(JSON.stringify({ error: 'Empty LLM response' }), { status: 502, headers: { 'content-type': 'application/json' } })
    }

    let parsed: { ranked_ids?: string[]; reasons?: Record<string, string> }
    try {
      parsed = JSON.parse(content)
    } catch {
      // If model failed JSON formatting, do a naive fallback: keep original order
      return new Response(JSON.stringify({ ranked_ids: top.map(p => p.id), reasons: {} }), { status: 200, headers: { 'content-type': 'application/json' } })
    }

    const ranked_ids = Array.isArray(parsed.ranked_ids) && parsed.ranked_ids.length
      ? parsed.ranked_ids
      : top.map(p => p.id)

    return new Response(JSON.stringify({ ranked_ids, reasons: parsed.reasons || {} }), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(err?.message || err) }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
