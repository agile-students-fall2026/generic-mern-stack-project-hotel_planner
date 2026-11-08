
import { Link } from "react-router-dom";
import { mockHotels } from "../data/mockHotels";
import { mockCurrentBooking } from "../data/mockCurrentBooking";
import "./Home&ResultsPage.css";
import "./HomePageBookings.css";

function HomePage() {
  const booking = mockCurrentBooking;

  const hotel = booking
    ? mockHotels.find((item) => item.id === booking.hotelId)
    : null;

  return (
    <main className="homepage home-booking-page">

      {/* Header */}
      <header className="booking-home-header">
        <div>
          <p className="booking-eyebrow">
            YOUR TRAVEL COMPANION
          </p>
          <h1 className="booking-brand">
            Hotel Planner
          </h1>
        </div>

        <Link
          to="/signin"
          className="booking-profile-link"
          aria-label="Go to sign in"
        >
          <span aria-hidden="true">◯</span>
        </Link>
      </header>

      {/* Search Section */}
      <section className="booking-search-section">
        <h2>Where to next?</h2>

        <Link
          to="/results"
          className="booking-search-link"
        >
          <span
            className="booking-search-symbol"
            aria-hidden="true"
          >
            ⌕
          </span>

          <span>
            Explore hotels and destinations
          </span>
        </Link>
      </section>

      {/* Current Booking */}
      <section className="booking-section">
        <div className="booking-section-heading">
          <h2>Current Booking</h2>

          {hotel && (
            <span className="booking-status-badge">
              {booking.status}
            </span>
          )}
        </div>

        {hotel ? (
          <article className="booking-card">

            <img
              src={hotel.image}
              alt={hotel.name}
              className="booking-card-image"
            />

            <div className="booking-card-content">

              <h3 className="booking-hotel-name">
                {hotel.name}
              </h3>

              <p className="booking-hotel-location">
                <span aria-hidden="true">⌖</span>
                {hotel.location}
              </p>

              <div className="booking-date-grid">

                <div className="booking-date-item">
                  <span className="booking-date-label">
                    CHECK-IN
                  </span>

                  <strong>{booking.checkIn}</strong>
                </div>

                <div className="booking-date-item">
                  <span className="booking-date-label">
                    CHECK-OUT
                  </span>

                  <strong>{booking.checkOut}</strong>
                </div>

              </div>

              <Link
                to={`/hotel/${hotel.id}`}
                className="booking-view-button"
              >
                <span>View Hotel Details</span>
                <span aria-hidden="true">→</span>
              </Link>

            </div>
          </article>
        ) : (
          <div className="booking-empty-state">
            <p>You have no current bookings.</p>

            <Link to="/results">
              Explore Hotels →
            </Link>
          </div>
        )}
      </section>

    </main>
  );
}

export default HomePage;
