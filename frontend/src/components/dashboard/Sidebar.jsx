import FriendsCard from './FriendsCard'
import EventsCard from './EventsCard'

function Sidebar() {
  return (
    <aside className="sidebar" id="pandilla">
      <FriendsCard />
      <EventsCard />
    </aside>
  )
}

export default Sidebar
