import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../api/products'
import './Checkout.css'

export default function Checkout({ cart, onOrderPlaced }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  })

  const total = cart.reduce((sum, p) => sum + Number(p.price) * p.quantity, 0)
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const orderData = {
        customerName: form.customerName.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        addressLine2: form.addressLine2.trim() || undefined,
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim() || 'US',
        items: cart.map((p) => ({
          productId: p.id,
          size: p.size || null,
          quantity: p.quantity,
        })),
      }
      const result = await createOrder(orderData)
      onOrderPlaced?.()
      navigate(`/checkout/confirmation?id=${result.id}`, { replace: true })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-inner">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-empty">Your cart is empty.</p>
          <button type="button" className="checkout-btn" onClick={() => navigate('/shop')}>
            Continue shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-inner">
        <h1 className="checkout-title">Checkout</h1>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="checkout-section">
            <h2 className="checkout-section-title">Shipping address</h2>
            <div className="checkout-fields">
              <label className="checkout-label">
                Full name *
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  className="checkout-input"
                  placeholder="Jane Doe"
                />
              </label>
              <label className="checkout-label">
                Email *
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="checkout-input"
                  placeholder="jane@example.com"
                />
              </label>
              <label className="checkout-label">
                Address *
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="checkout-input"
                  placeholder="123 Main St"
                />
              </label>
              <label className="checkout-label">
                Apartment, suite, etc. (optional)
                <input
                  type="text"
                  name="addressLine2"
                  value={form.addressLine2}
                  onChange={handleChange}
                  className="checkout-input"
                  placeholder="Apt 4"
                />
              </label>
              <div className="checkout-row">
                <label className="checkout-label">
                  City *
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="checkout-input"
                    placeholder="Santa Fe"
                  />
                </label>
                <label className="checkout-label">
                  State *
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="checkout-input"
                    placeholder="NM"
                  />
                </label>
                <label className="checkout-label">
                  ZIP *
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    required
                    className="checkout-input"
                    placeholder="87501"
                  />
                </label>
              </div>
              <label className="checkout-label">
                Country
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="checkout-input"
                  placeholder="US"
                />
              </label>
            </div>
          </section>

          <section className="checkout-section checkout-summary">
            <h2 className="checkout-section-title">Order summary</h2>
            <ul className="checkout-cart-list">
              {cart.map((p) => (
                <li key={`${p.id}-${p.size || 'one'}`} className="checkout-cart-item">
                  <span className="checkout-cart-name">{p.name}{p.size ? ` (${p.size})` : ''}</span>
                  <span className="checkout-cart-qty">×{p.quantity}</span>
                  <span className="checkout-cart-subtotal">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(p.price) * p.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="checkout-total">
              <span>Total</span>
              <span>{formattedTotal}</span>
            </p>
            {error && <p className="checkout-error">{error}</p>}
            <button type="submit" className="checkout-btn checkout-btn-primary" disabled={loading}>
              {loading ? 'Placing order…' : 'Place order'}
            </button>
          </section>
        </form>
      </div>
    </div>
  )
}
