import { Link } from 'react-router-dom'
import './Cart.css'

export default function Cart({ cart, updateCartQuantity, removeFromCart }) {
  const total = cart.reduce((sum, p) => sum + Number(p.price) * p.quantity, 0)
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-inner">
          <h1 className="cart-title">Your cart</h1>
          <p className="cart-empty">Your cart is empty.</p>
          <Link to="/shop" className="cart-shop-link">Continue shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-inner">
        <h1 className="cart-title">Your cart</h1>
        <ul className="cart-list">
          {cart.map((p) => {
            const sizeKey = p.size || 'One size'
            const subtotal = Number(p.price) * p.quantity
            const priceStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.price)
            const subtotalStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal)
            return (
              <li key={`${p.id}-${sizeKey}`} className="cart-item">
                <Link to={`/shop/${p.id}`} className="cart-item-image-wrap">
                  <img
                    src={p.imageUrl || 'https://via.placeholder.com/120x150?text=No+Image'}
                    alt={p.name}
                    className="cart-item-image"
                  />
                </Link>
                <div className="cart-item-details">
                  <Link to={`/shop/${p.id}`} className="cart-item-name">{p.name}</Link>
                  <p className="cart-item-meta">{p.category}{p.size ? ` · ${p.size}` : ''}</p>
                  <p className="cart-item-price">{priceStr} each</p>
                </div>
                <div className="cart-item-qty">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(p.id, p.size, -1)}
                    className="qty-btn"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="qty-value">{p.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(p.id, p.size, 1)}
                    className="qty-btn"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <p className="cart-item-subtotal">{subtotalStr}</p>
                <button
                  type="button"
                  onClick={() => removeFromCart(p.id, p.size)}
                  className="cart-item-remove"
                  aria-label="Remove from cart"
                >
                  Remove
                </button>
              </li>
            )
          })}
        </ul>
        <div className="cart-footer">
          <p className="cart-total">
            <span>Total</span>
            <span>{formattedTotal}</span>
          </p>
          <Link to="/checkout" className="cart-checkout-btn">Proceed to checkout</Link>
          <Link to="/shop" className="cart-shop-link">Continue shopping</Link>
        </div>
      </div>
    </div>
  )
}
