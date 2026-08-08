import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import friendsData from "../../data/friends"

function ProfileFriends() {
  const [friends, setFriends] = useState(friendsData)
  const [openMenuId, setOpenMenuId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (openMenuId === null) return

    function handleClick(event) {
      if (!event.target.closest(`[data-friend-id="${openMenuId}"]`)) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [openMenuId])

  const handleViewProfile = (friend) => {
    setOpenMenuId(null)
    navigate(`/perfil/${friend.id}`)
  }

  const handleStartChat = (friend) => {
    setOpenMenuId(null)
    alert(`Chat con ${friend.name} — próximamente`)
  }

  const handleUnfriend = (friend) => {
    setOpenMenuId(null)
    if (window.confirm(`¿Dejar de ser amigo de ${friend.name}?`)) {
      setFriends((current) => current.filter((item) => item.id !== friend.id))
    }
  }

  return (
    <div className="board-card profile-friends">
      <div className="board-card__tape" />
      <h3 className="board-card__title">Tus amigos</h3>
      <p className="board-card__sub">{friends.length} amigos</p>

      <ul className="friends-grid friends-grid--large">
        {friends.map((friend) => (
          <li key={friend.id} className="friend friend--large" data-friend-id={friend.id}>
            <button
              type="button"
              className="friend__button"
              onClick={() => setOpenMenuId(openMenuId === friend.id ? null : friend.id)}
            >
              <span
                className="friend__avatar friend__avatar--large"
                style={{ backgroundImage: `url('${friend.avatar}')` }}
              />
              <span className="friend__dot" />
              <span className="friend__name">{friend.name}</span>
            </button>

            {openMenuId === friend.id && (
              <ul className="friend-menu">
                <li>
                  <button type="button" onClick={() => handleViewProfile(friend)}>
                    Ver perfil
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleStartChat(friend)}>
                    Iniciar chat
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleUnfriend(friend)}>
                    Dejar de ser amigo
                  </button>
                </li>
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProfileFriends
