import Nav from "./Nav"

function Header() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a href="#" className="logo">
          <span className="logo__mark">t.</span>
          <span className="logo__text">Tuenties</span>
        </a>

        <Nav />

        <div className="navbar__search">
          <input type="text" placeholder="Busca amigos..." />
        </div>

        <div className="navbar__user">
          <span className="navbar__bell" title="Notificaciones">
            🔔<span className="badge">3</span>
          </span>
          <div
            className="navbar__avatar"
            style={{ backgroundImage: "url('https://i.pravatar.cc/80?img=12')" }}
          />
        </div>
      </div>
    </header>
  )
}

export default Header
