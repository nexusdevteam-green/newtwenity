function ProfileInfo({ user, isOwnProfile }) {
  const hasDetails = Boolean(user.birthday || user.studyOrWork || user.pet || user.hobbies)

  return (
    <div className="board-card profile-info">
      <div className="board-card__tape" />
      <div className="profile-info__avatar" style={{ backgroundImage: `url('${user.avatar}')` }} />
      <h2 className="profile-info__name">{user.name}</h2>

      {hasDetails ? (
        <ul className="profile-info__facts">
          {user.birthday && (
            <li>
              🎂 <span>{user.birthday}</span>
            </li>
          )}
          {user.studyOrWork && (
            <li>
              🎓 <span>{user.studyOrWork}</span>
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
        !isOwnProfile && <p className="profile-info__readonly">Este perfil es de solo lectura.</p>
      )}
    </div>
  )
}

export default ProfileInfo
