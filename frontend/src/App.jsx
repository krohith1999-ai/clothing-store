import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import CheckoutConfirmation from './pages/CheckoutConfirmation'
import { fetchCategories } from './api/products'

const THEME_KEY = 'clothing-store-theme'

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark'
    } catch {
      return 'dark'
    }
  })
  const [categories, setCategories] = useState([])
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id && p.size === (product.size || 'One size'))
      if (existing) {
        return prev.map((p) =>
          p.id === product.id && p.size === (product.size || 'One size')
            ? { ...p, quantity: p.quantity + quantity }
            : p
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  const updateCartQuantity = (id, size, delta) => {
    setCart((prev) =>
      prev
        .map((p) => {
          if (p.id !== id || (p.size || 'One size') !== (size || 'One size')) return p
          const q = Math.max(0, p.quantity + delta)
          return { ...p, quantity: q }
        })
        .filter((p) => p.quantity > 0)
    )
  }

  const removeFromCart = (id, size) => {
    setCart((prev) =>
      prev.filter((p) => !(p.id === id && (p.size || 'One size') === (size || 'One size')))
    )
  }

  const clearCart = () => setCart([])

  const cartCount = cart.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <>
      <Header categories={categories} cartCount={cartCount} theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/shop" element={<Shop addToCart={addToCart} />} />
          <Route path="/shop/:id" element={<ProductDetail addToCart={addToCart} />} />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                updateCartQuantity={updateCartQuantity}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout cart={cart} onOrderPlaced={clearCart} />
            }
          />
          <Route path="/checkout/confirmation" element={<CheckoutConfirmation />} />
        </Routes>
      </main>
    </>
  )
}

export default App
