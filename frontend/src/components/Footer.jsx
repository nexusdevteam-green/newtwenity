import footerLinks from '../data/footerLinks'

function Footer() {
  return (
    <footer className="footer">
      <p>Tuenties © 2026 — hecho con chinchetas, celo y demasiada nostalgia.</p>
      <nav className="footer__links">
        {footerLinks.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  )
}

export default Footer
