import polaroids from '../data/polaroids'

function PolaroidBoard() {
  return (
    <div className="hero__board" aria-hidden="true">
      {polaroids.map((polaroid, index) => (
        <div key={polaroid.id} className={`polaroid polaroid--${index + 1}`}>
          <div className="polaroid__img" style={{ backgroundImage: `url('${polaroid.img}')` }} />
          <p className="polaroid__caption">{polaroid.caption}</p>
        </div>
      ))}
      <div className="sticky sticky--note">no olvides el examen del lunes</div>
    </div>
  )
}

export default PolaroidBoard
