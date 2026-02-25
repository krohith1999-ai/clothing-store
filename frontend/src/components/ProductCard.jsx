import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({ product, onAddToCart }) {
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price)

  return (
    <article className="product-card">
      <Link to={`/shop/${product.id}`} className="product-card-image-wrap">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400x500?text=No+Image'}
          alt={product.name}
          className="product-card-image"
        />
      </Link>
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <Link to={`/shop/${product.id}`}>
          <h3 className="product-card-title">{product.name}</h3>
        </Link>
        <p className="product-card-price">{price}</p>
        <button
          type="button"
          className="product-card-add"
          onClick={(e) => {
            e.preventDefault()
            onAddToCart?.(product)
          }}
        >
          Add to cart
        </button>
      </div>
    </article>
  )
}
