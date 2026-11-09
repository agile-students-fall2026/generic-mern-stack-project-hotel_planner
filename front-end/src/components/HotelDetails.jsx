
import { Link } from "react-router-dom";
import "./HotelDetails.css";

function HotelDetails({ hotel }) {
  return (
    <article className="hotel-details">
      <Link
        to={`/hotel/${hotel.id}`}
        aria-label={`View details for ${hotel.name}`}
      >
        <img
          src={hotel.image}
          alt={hotel.name}
          className="hotel-details-image"
        />
      </Link>

      <div className="hotel-details-info">
        <h3>{hotel.name}</h3>
        <p>{hotel.location}</p>
        <p>★ {hotel.rating} / 5</p>
      </div>
    </article>
  );
}

export default HotelDetails;
