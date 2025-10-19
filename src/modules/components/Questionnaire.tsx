import React, { useState } from 'react'
import type { Preferences } from '../services/recommendation'

const DAILY_WEAR_OPTIONS = ['Casual', 'Formal', 'Sports', 'Traditional'] as const
const COMBO_OPTIONS = [
  'T-shirt + Jeans',
  'Shirt + Trousers',
  'Kurta + Jeans',
  'Athleisure',
  'Dress',
  'Saree'
] as const

type Props = {
  onSubmit: (prefs: Preferences) => void
}

export function Questionnaire({ onSubmit }: Props) {
  const [name, setName] = useState('')
  const [favoriteColor, setFavoriteColor] = useState('black')
  const [dailyWear, setDailyWear] = useState<typeof DAILY_WEAR_OPTIONS[number]>('Casual')
  const [age, setAge] = useState<number>(25)
  const [favoriteCombo, setFavoriteCombo] = useState<typeof COMBO_OPTIONS[number]>('T-shirt + Jeans')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, favoriteColor, dailyWear, age, favoriteCombo })
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="form__row">
        <label htmlFor="name">Your name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rahul, Ananya"
          required
        />
      </div>

      <div className="form__row">
        <label htmlFor="favoriteColor">Favorite color</label>
        <input
          id="favoriteColor"
          type="text"
          value={favoriteColor}
          onChange={(e) => setFavoriteColor(e.target.value)}
          placeholder="e.g. black, blue, red"
          required
        />
      </div>

      <div className="form__row">
        <label htmlFor="dailyWear">Daily wear</label>
        <select id="dailyWear" value={dailyWear} onChange={(e) => setDailyWear(e.target.value as any)}>
          {DAILY_WEAR_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="form__row">
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          min={12}
          max={100}
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value || '0', 10))}
          required
        />
      </div>

      <div className="form__row">
        <label htmlFor="favoriteCombo">Favorite combination</label>
        <select id="favoriteCombo" value={favoriteCombo} onChange={(e) => setFavoriteCombo(e.target.value as any)}>
          {COMBO_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="form__actions">
        <button type="submit" className="btn">Get recommendations</button>
      </div>
    </form>
  )
}
