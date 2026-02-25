import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../api/products'
import ProductCard from '../components/ProductCard'
import './Shop.css'

export default function Shop({ addToCart }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || ''
  const searchParam = searchParams.get('search') || ''

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState(categoryParam)
  const [search, setSearch] = useState(searchParam)

  useEffect(() => {
    setFilterCategory(categoryParam)
    setSearch(searchParam)
  }, [categoryParam, searchParam])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchProducts({ category: filterCategory || undefined, search: search || undefined }),
      fetchCategories(),
    ])
      .then(([prods, cats]) => {
        setProducts(prods)
        setCategories(cats)
      })
      .finally(() => setLoading(false))
  }, [filterCategory, search])

  const handleCategoryChange = (cat) => {
    setFilterCategory(cat)
    const next = new URLSearchParams(searchParams)
    if (cat) next.set('category', cat)
    else next.delete('category')
    next.delete('search')
    setSearchParams(next)
    setSearch('')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const next = new URLSearchParams(searchParams)
    if (search.trim()) next.set('search', search.trim())
    else next.delete('search')
    next.delete('category')
    setSearchParams(next)
    setFilterCategory('')
  }

  return (
    <div className="shop">
      <div className="shop-inner">
        <aside className="shop-sidebar">
          <h2 className="sidebar-title">Categories</h2>
          <nav className="sidebar-nav">
            <button
              type="button"
              className={!filterCategory ? 'active' : ''}
              onClick={() => handleCategoryChange('')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={filterCategory === cat ? 'active' : ''}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>
          <form className="sidebar-search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sidebar-search-input"
            />
            <button type="submit" className="sidebar-search-btn">
              Search
            </button>
          </form>
        </aside>
        <div className="shop-main">
          <h1 className="shop-title">Shop</h1>
          {loading ? (
            <p className="loading">Loading…</p>
          ) : products.length === 0 ? (
            <p className="empty">No products found.</p>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
