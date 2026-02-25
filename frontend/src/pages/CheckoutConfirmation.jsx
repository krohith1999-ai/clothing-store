import { Link, useSearchParams } from 'react-router-dom'
import './Checkout.css'

export default function CheckoutConfirmation() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('id')

  return (
    <div className="confirmation-page">
      <div className="confirmation-inner">
        <h1 className="confirmation-title">Thank you for your order</h1>
        <p className="confirmation-message">
          We’ve received your order and will process it shortly. You’ll receive a confirmation email at the address you provided.
        </p>
        {orderId && (
          <p className="confirmation-id">
            Order number: <strong>#{orderId}</strong>
          </p>
        )}
        <div className="confirmation-actions">
          <Link to="/shop">Continue shopping</Link>
          <Link to="/" className="secondary">Back to home</Link>
        </div>
      </div>
    </div>
  )
}
