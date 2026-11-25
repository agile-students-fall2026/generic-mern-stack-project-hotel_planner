import "./Card.css";

function Card(props) {
  return (
    <article className="card">
      <div className="image-and-edit">
        <div className="card-image">
          {props.imageSrc && <img src={props.imageSrc} alt={props.name || ""} />}
        </div>
        <button className="Saved-EditBtn" onClick={props.Edit}>
          Edit
        </button>
      </div>

      <div className="card-info">
        <h3 className="card-name">{props.name}</h3>
        <div className="card-meta">
          {props.location && <span>{props.location}</span>}
          {props.date && <span>{props.date}</span>}
        </div>
        <p className="card-description">{props.description}</p>
      </div>
    </article>
  );
}

export default Card;
