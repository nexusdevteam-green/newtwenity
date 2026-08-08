import Header from '../Header'
import Hero from './Hero'
import Composer from './Composer'
import Feed from './Feed'
import Sidebar from './Sidebar'

function Dashboard() {
  return (
    <>
      <Header />
      <Hero />
      <main className="main">
        <div className="main__feed-column">
          <Composer />
          <Feed />
        </div>
        <Sidebar />
      </main>
    </>
  )
}

export default Dashboard
