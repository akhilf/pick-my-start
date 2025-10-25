import { useEffect, useState } from 'react'
import { Questionnaire } from './modules/components/Questionnaire'
import { Results } from './modules/components/Results'
import { analyzeAndRecommend, type Preferences, type Product } from './modules/services/recommendation'

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) return saved
    // Default to dark mode instead of following OS preference
    return 'dark'
  })
  const [prefs, setPrefs] = useState<Preferences | null>(null)
  const [results, setResults] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const onSubmit = async (p: Preferences) => {
    setPrefs(p)
    setLoading(true)
    try {
      const recs = await analyzeAndRecommend(p)
      setResults(recs)
    } finally {
      setLoading(false)
    }
  }

  const onReset = () => {
    setPrefs(null)
    setResults(null)
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>PickMyFit</h1>
        <p className="subtitle">Find it. Love it. Wear it.</p>
        <p className="description" style={{ margin: '16px 0', opacity: 0.9, lineHeight: 1.5 }}>
          Your AI-powered personal stylist! Answer 5 quick questions about your style preferences 
          and discover clothes that match your personality from top fashion retailers.
        </p>
        <div className="coming-soon" style={{ margin: '12px 0', padding: '12px', background: 'var(--card)', borderRadius: '8px', fontSize: '14px' }}>
          <strong>🚀 Coming Soon:</strong> Real-time AI recommendations • Multi-retailer integration • 
          User accounts • Advanced filters • Social features • Mobile app
        </div>
        {/* Force deployment update */}
        <div style={{ marginTop: 12 }}>
          <button className="btn btn--small" onClick={toggleTheme}>
            {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          </button>
        </div>
      </header>

      {!prefs && (
        <section className="card">
          <Questionnaire onSubmit={onSubmit} />
        </section>
      )}

      {prefs && (
        <section className="card">
          <div className="results__header">
            <h2>Recommendations{prefs?.name ? ` for ${prefs.name}` : ''}</h2>
            <button className="link" onClick={onReset}>Start over</button>
          </div>
          {loading && <p>Analyzing your style and fetching picks…</p>}
          {!loading && results && <Results products={results} />}
        </section>
      )}

      <footer className="app__footer">
        <small>Mock integrations for demo. Hook to Myntra/Ajio APIs later.</small>
      </footer>
    </div>
  )
}
