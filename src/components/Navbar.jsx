import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'

const plainLinks = [
  { path: '/', label: 'Home' },
  { path: '/documents', label: 'Documents' },
  { path: '/practice', label: 'Practice' },
]

const dropdowns = [
  {
    label: 'LLD Lab',
    basePath: '/lld',
    items: [
      { id: 'snake-and-ladder', label: 'Snake & Ladder' },
      { id: 'car-rental-service', label: 'Car Rental' },
    ],
  },
  {
    label: 'DB Schema',
    basePath: '/db-schema',
    items: [{ id: 'product-browser', label: 'Product Browser' }],
  },
  {
    label: 'DSA',
    basePath: '/dsa',
    items: [{ id: 'all', label: 'All Questions' }],
  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileExpanded, setMobileExpanded] = useState({})
  const location = useLocation()
  const navRef = useRef(null)

  // Close dropdowns and mobile drawer on navigation
  useEffect(() => {
    setOpenDropdown(null)
    setMobileOpen(false)
  }, [location])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    if (!openDropdown) return
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [openDropdown])

  const toggleMobileSection = (label) => {
    setMobileExpanded((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const isActive = (basePath) => location.pathname === basePath

  return (
    <nav className="navbar" ref={navRef}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">ZK</span>
          <span className="navbar__title">Prep Kit</span>
        </Link>

        {/* Desktop links + dropdowns */}
        <div className="navbar__links">
          {plainLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {dropdowns.map((dd) => (
            <div key={dd.basePath} className="navbar-dd">
              <button
                type="button"
                className={`navbar-dd__btn${isActive(dd.basePath) ? ' navbar-dd__btn--active' : ''}${openDropdown === dd.basePath ? ' navbar-dd__btn--open' : ''}`}
                aria-expanded={openDropdown === dd.basePath}
                aria-haspopup="menu"
                onClick={() =>
                  setOpenDropdown((cur) => (cur === dd.basePath ? null : dd.basePath))
                }
              >
                {dd.label}
                <span className="navbar-dd__chevron" aria-hidden="true">▾</span>
              </button>

              {openDropdown === dd.basePath && (
                <div className="navbar-dd__panel" role="menu">
                  {dd.comingSoon ? (
                    <span className="navbar-dd__soon" role="menuitem" aria-disabled="true">
                      Coming soon
                    </span>
                  ) : (
                    dd.items.map((item) => (
                      <Link
                        key={item.id}
                        to={`${dd.basePath}?q=${item.id}`}
                        className="navbar-dd__item"
                        role="menuitem"
                      >
                        {item.label}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="navbar-burger"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile full-screen sidebar */}
      <div
        className={`navbar-mobile${mobileOpen ? ' navbar-mobile--open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <div className="navbar-mobile__head">
          <span className="navbar-mobile__brand">Prep Kit</span>
          <button
            type="button"
            className="navbar-mobile__close"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="navbar-mobile__body">
          {plainLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `navbar-mobile__link ${isActive ? 'navbar-mobile__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {dropdowns.map((dd) => {
            const expanded = !!mobileExpanded[dd.label]
            return (
              <div key={dd.basePath} className="navbar-mobile__section">
                <button
                  type="button"
                  className={`navbar-mobile__link${isActive(dd.basePath) ? ' navbar-mobile__link--active' : ''}`}
                  aria-expanded={expanded}
                  onClick={() => toggleMobileSection(dd.label)}
                >
                  {dd.label}
                  <span
                    className={`navbar-mobile__chevron${expanded ? ' navbar-mobile__chevron--open' : ''}`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>

                {expanded && (
                  <div className="navbar-mobile__sub">
                    {dd.comingSoon ? (
                      <span className="navbar-mobile__soon">Coming soon</span>
                    ) : (
                      dd.items.map((item) => (
                        <Link
                          key={item.id}
                          to={`${dd.basePath}?q=${item.id}`}
                          className="navbar-mobile__item"
                        >
                          {item.label}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}