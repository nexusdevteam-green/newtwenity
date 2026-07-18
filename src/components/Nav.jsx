import navLinks from '../data/navLinks'

function Nav() {
  return (
    <nav className="navbar__links">
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`navlink${link.active ? ' navlink--active' : ''}`}
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}

export default Nav
