import { Link, useLocation } from 'react-router-dom'
import navLinks from '../data/navLinks'

function Nav() {
  const location = useLocation()

  return (
    <nav className="navbar__links">
      {navLinks.map((link) =>
        link.href === '/' ? (
          <Link
            key={link.href}
            to="/"
            className={`navlink${location.pathname === '/' ? ' navlink--active' : ''}`}
          >
            {link.label}
          </Link>
        ) : (
          <a
            key={link.href}
            href={link.href}
            className={`navlink${link.active ? ' navlink--active' : ''}`}
          >
            {link.label}
          </a>
        )
      )}
    </nav>
  )
}

export default Nav
