import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSaved } from "../shared_content/SavedContent";
import { useCurBookings } from "../shared_content/SavedCurrentBookings";
import "./HotelDetails.css";

function HotelDetails() {
  const { id } = useParams();

  const [result, setResult] = useState(null);

  const { isSaved, toggleSaved } = useSaved();
  const { isBookingSaved, toggleBookingSaved } = useCurBookings();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function loadHotel() {
      try {
        const response = await fetch(`/api/hotels/${encodeURIComponent(id)}`, {
          signal,
        });

        if (!response.ok && response.status !== 404) {
          throw new Error("Could not load hotel details.");
        }

        const hotel = response.ok ? (await response.json()).hotel : null;
        if (!signal.aborted) setResult({ id, hotel });
      } catch {
        if (!signal.aborted) {
          setResult({ id, error: "Could not load hotel details." });
        }
      }
    }

    loadHotel();
    return () => controller.abort();
  }, [id]);

  if (!result || result.id !== id) {
    return <p role="status">Loading hotel...</p>;
  }

  if (result.error) {
    return <p role="alert">{result.error}</p>;
  }

  const { hotel } = result;

  if (!hotel) {
    return (
      <main className="hotel-details-page">
        <h2>Hotel not found</h2>
        <Link to="/results">Back to Search Results</Link>
      </main>
    );
  }

  function handleSave() {
    toggleSaved({
      id: hotel.id,
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      imageSrc: hotel.imageSrc,
    });
  }

  function handleBookingSave() {
    toggleBookingSaved({
      id: hotel.id,
      name: hotel.name,
      location: hotel.location,
      description: "",
      imageSrc: hotel.imageSrc,
      checkIn: "",
      checkOut: "",
    });
  }

  const saved = isSaved(hotel.id);
  const bookingSaved = isBookingSaved(hotel.id);

  return (
    <main className="hotel-details-page">
      <header className="hotel-details-header">
        <Link to="/" className="hotel-back">
          ← Back
        </Link>
        <h1>Hotel Details</h1>
      </header>

      <img
        className="hotel-main-image"
        src={hotel.imageSrc || "https://picsum.photos/400/225"}
        alt={`${hotel.name} hotel`}
      />

      <section className="hotel-information">
        <h2>{hotel.name}</h2>
        <p className="hotel-location">📍 {hotel.location}</p>
        <p className="hotel-rating">★ {hotel.rating} / 5</p>

        <h3>About this hotel</h3>
        <p className="hotel-description">{hotel.description}</p>

        <h3>Amenities</h3>
        <ul className="hotel-amenities">
          {hotel.amenities?.map((amenity) => (
            <li key={amenity}>{amenity}</li>
          ))}
        </ul>

        <button
          className={`hotel-save-button ${saved ? "is-saved" : ""}`}
          onClick={handleSave}
          type="button"
          aria-pressed={saved}
        >
          {saved ? "✓ Saved — Click to Remove" : "♡ Save Hotel"}
        </button>

        <button
          className={`hotel-save-button ${bookingSaved ? "is-booked" : ""}`}
          onClick={handleBookingSave}
          type="button"
        >
          {bookingSaved ? "✓ Booked — Click to Remove" : "♡ Book Hotel"}
        </button>
      </section>
    </main>
  );
}

export default HotelDetails;
