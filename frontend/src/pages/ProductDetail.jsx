import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProductById } from '../api/products'
import './ProductDetail.css'

export default function ProductDetail({ addToCart }) {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetchProductById(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleAdd = () => {
    if (!product) return
    for (let i = 0; i < quantity; i++) addToCart(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <div className="product-detail"><p className="loading">Loading…</p></div>
  if (!product) return <div className="product-detail"><p className="empty">Product not found.</p></div>

  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)

  return (
    <div className="product-detail">
      <div className="product-detail-inner">
        <div className="product-detail-image-wrap">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/600x750?text=No+Image'}
            alt={product.name}
            className="product-detail-image"
          />
        </div>
        <div className="product-detail-info">
          <span className="product-detail-category">{product.category}</span>
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-detail-price">{price}</p>
          {product.description && (
            <p className="product-detail-desc">{product.description}</p>
          )}
          {(product.size || product.color) && (
            <p className="product-detail-meta">
              {product.size && <span>Size: {product.size}</span>}
              {product.size && product.color && ' · '}
              {product.color && <span>Color: {product.color}</span>}
            </p>
          )}
          <div className="product-detail-actions">
            <div className="quantity-wrap">
              <label htmlFor="qty">Quantity</label>
              <input
                id="qty"
                type="number"
                min="1"
                max={product.stock || 99}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="quantity-input"
              />
            </div>
            <button
              type="button"
              className="add-btn"
              onClick={handleAdd}
              disabled={product.stock !== null && product.stock < quantity}
            >
              {added ? 'Added to cart' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
