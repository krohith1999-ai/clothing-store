import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../api/products'
import ProductCard from '../components/ProductCard'
import './Home.css'

export default function Home({ addToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts().then(setProducts).finally(() => setLoading(false))
  }, [])

  const featured = products.slice(0, 6)

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Thread & Form</h1>
          <p className="hero-subtitle">Curated essentials for everyday style.</p>
          <Link to="/shop" className="hero-cta">
            Shop the collection
          </Link>
        </div>
      </section>

      <section className="section featured">
        <div className="section-inner">
          <h2 className="section-title">Featured</h2>
          {loading ? (
            <p className="loading">Loading…</p>
          ) : (
            <div className="product-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
              ))}
            </div>
          )}
          <div className="section-footer">
            <Link to="/shop" className="link-underline">
              View all products →
            </Link>
          </div>
        </div>
      </section>

      <section className="section map-section">
        <div className="section-inner">
          <h2 className="section-title">Visit us</h2>
          <p className="map-address">
            3230 Rufina St, Santa Fe, NM
          </p>
          <div className="map-wrap">
            <iframe
              title="Thread & Form store location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5517.22286171335!2d-106.00302638727102!3d35.65363163137301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87185a5bec12d51b%3A0xea374c14491d605e!2s3230%20Rufina%20St%2C%20Santa%20Fe%2C%20NM%2087507!5e1!3m2!1sen!2sus!4v1771829514463!5m2!1sen!2sus"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
