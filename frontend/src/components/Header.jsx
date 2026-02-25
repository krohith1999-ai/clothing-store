import { Link } from 'react-router-dom'
import './Header.css'

export default function Header({ categories, cartCount, theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          Thread & Form
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          {categories.length > 0 && (
            <div className="nav-dropdown">
              <span className="nav-dropdown-trigger">Categories</span>
              <div className="nav-dropdown-menu">
                {categories.map((cat) => (
                  <Link key={cat} to={`/shop?category=${encodeURIComponent(cat)}`}>
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <span className="theme-icon" aria-hidden>☀️</span>
            ) : (
              <span className="theme-icon" aria-hidden>🌙</span>
            )}
          </button>
          <Link to="/cart" className="cart-link">
            Cart
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}
