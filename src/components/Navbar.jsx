import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/documents', label: 'Documents' },
  { path: '/lld', label: 'LLD Lab' },
  { path: '/dsa', label: 'DSA' },
  { path: '/jobs', label: 'Jobs' },
]

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">ZK</span>
          <span className="navbar__title">Prep Kit</span>
        </Link>
        <div className="navbar__links">
          {navItems.map((item) => (
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
        </div>
      </div>
    </nav>
  )
}