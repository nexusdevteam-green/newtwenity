function ProfileInfo({ user, isOwnProfile }) {
  const hasDetails = Boolean(
    user.birthday || user.study_or_work || user.pet || user.hobbies?.length
  )

  return (
    <div className="board-card profile-info">
      <div className="board-card__tape" />
      <div
        className="profile-info__avatar"
        style={{ backgroundImage: `url('${user.avatar_url || ""}')` }}
      />
      <h2 className="profile-info__name">{user.display_name}</h2>
      <p className="profile-info__username">@{user.username}</p>

      {user.bio && <p className="profile-info__bio">{user.bio}</p>}

      {hasDetails ? (
        <ul className="profile-info__facts">
          {user.birthday && (
            <li>
              🎂 <span>{user.birthday}</span>
            </li>
          )}
          {user.study_or_work && (
            <li>
              🎓 <span>{user.study_or_work}</span>
            </li>
          )}
          {user.pet && (
            <li>
              🐾 <span>{user.pet}</span>
            </li>
          )}
          {user.hobbies?.length > 0 && (
            <li className="profile-info__hobbies">
              ⭐
              <span className="profile-info__chips">
                {user.hobbies.map((hobby) => (
                  <span key={hobby} className="profile-info__chip">
                    {hobby}
                  </span>
                ))}
              </span>
            </li>
          )}
        </ul>
      ) : (
        !isOwnProfile && (
          <p className="profile-info__readonly">Este perfil es de solo lectura.</p>
        )
      )}
    </div>
  )
}

export default ProfileInfo
