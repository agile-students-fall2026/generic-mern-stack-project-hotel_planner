  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {//change to be based on diff location later??
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

const formatTime = (timeString) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":").map(Number);
  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-US", {//change to be based on diff location later??
    hour: "numeric",
    minute: "2-digit",
  });
};

function BookingCard(props) {
  return (
    <article className="card">
      <div className="image-and-edit">
        <div className="card-image">
          <img src={props.imageSrc || "https://picsum.photos/400/225"} alt="" />
        </div>
        <button className="Saved-EditBtn" onClick={props.Edit}>
          Edit
        </button>
      </div>

      <div className="card-info">
        <h3 className="card-name">{props.name}</h3>
        <div className="card-meta">
          {props.location && <span>{props.location}</span>}
        </div>
        <div>Check in: {formatDate(props.checkIn)} {formatTime(props.checkInTime)}</div>
        <div>Check out: {formatDate(props.checkOut)} {formatTime(props.checkOutTime)}</div>
        Notes
        <div>
          <p className="card-description">{props.description}</p>
        </div>
      </div>
    </article>
  );
}

export default BookingCard;
