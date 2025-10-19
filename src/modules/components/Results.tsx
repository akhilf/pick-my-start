import React from 'react'
import type { Product } from '../services/recommendation'

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
              <a className="btn btn--small" href={p.url} target="_blank" rel="noreferrer">View</a>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
