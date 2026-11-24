import { Link } from "react-router-dom";
import "./Card.css";

export default function HotelDetails({ hotel }) {
  return (
    <article className="card">
      <div className="image-and-edit">
        <Link
          className="card-image"
          to={`/hotel/${hotel.id}`}
          aria-label={`View details for ${hotel.name}`}
        >
          {hotel.imageSrc && <img src={hotel.imageSrc} alt="" />}
        </Link>
      </div>

      <div className="card-info">
        <h3 className="card-name">{hotel.name}</h3>
        <div className="card-meta">
          <span>{hotel.location}</span>
        </div>
        <p className="card-description">{hotel.description}</p>
      </div>
    </article>
  );
}
