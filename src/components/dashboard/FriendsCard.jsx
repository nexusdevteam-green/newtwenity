import friends from '../../data/friends'

function FriendsCard() {
  return (
    <div className="board-card">
      <div className="board-card__tape" />
      <h3 className="board-card__title">Tu pandilla</h3>
      <p className="board-card__sub">18 conectados ahora</p>
      <ul className="friends-grid">
        {friends.map((friend) => (
          <li key={friend.id} className="friend">
            <span
              className="friend__avatar"
              style={{ backgroundImage: `url('${friend.avatar}')` }}
            />
            <span className="friend__dot" />
          </li>
        ))}
      </ul>
      <a href="#" className="board-card__link">
        Ver los 214 →
      </a>
    </div>
  )
}

export default FriendsCard
