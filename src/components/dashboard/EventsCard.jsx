import events from '../../data/events'

function EventsCard() {
  return (
    <div className="board-card" id="eventos">
      <div className="board-card__tape board-card__tape--yellow" />
      <h3 className="board-card__title">Próximos planes</h3>
      <ul className="event-list">
        {events.map((event) => (
          <li key={event.id} className="event">
            <span className="event__date">
              {event.day}
              <br />
              {event.date}
            </span>
            <span className="event__info">
              {event.info}
              <br />
              <small>{event.detail}</small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EventsCard
