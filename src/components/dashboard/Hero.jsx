import Button from "../Button"
import PolaroidBoard from "../PolaroidBoard"

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow">— Un espacio sin algoritmos, con amigos —</p>
          <h1 className="hero__title">
            Donde tus <span className="hero__title-highlight">recuerdos</span>
            <br />
            vuelven a la vida
          </h1>
          <p className="hero__desc">
            Donde las fotos borrosas con un Sony Ericsson en el baño o los SMS enviados desde una
            BlackBerry vuelven a cobrar vida. Conecta con tus amigos sin pensar en tener seguidores.
            <br />
            La nostalgia de una generación, con la tecnología de otra.
          </p>
          <div className="hero__actions">
            <Button variant="primary">Crear mi cuenta</Button>
            <Button variant="ghost">Ya tengo cuenta</Button>
          </div>
          <p className="hero__note">✎ sin anuncios raros, sin algoritmos que deciden por ti.</p>
        </div>

        <PolaroidBoard />
      </div>
    </section>
  )
}

export default Hero
