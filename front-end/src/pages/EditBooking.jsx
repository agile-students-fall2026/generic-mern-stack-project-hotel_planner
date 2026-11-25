import "./EditSaved.css";
import { useState } from "react";

function EditBooking(props) {
  const [checkInDraft, setCheckInDraft] = useState(props.checkIn || '');
  const [checkOutDraft, setCheckOutDraft] = useState(props.checkOut || '');
  const [checkInTimeDraft, setCheckInTimeDraft] = useState(props.checkInTime || "");
  const [checkOutTimeDraft, setCheckOutTimeDraft] = useState(props.checkOutTime || "");
  const [draft, setDraft] = useState(props.description);

  return (
    <div className="edit-page-wrapper">
      <div id="edit-card-container">
        <article className="edit-card">
          <div className="edit-image-and-edit">
            <div className="edit-card-image">
            {props.imageSrc && <img src={props.imageSrc} alt={props.name || ""} />}
            </div>
            <button id="EditSaved-BackBtn" onClick={props.goBack}>
              Back
            </button>
          </div>

          <div className="edit-card-info">
            <h3 className="edit-card-name">{props.name}</h3>
            <div className="edit-card-meta">
              {props.location && <span>{props.location}</span>}
            </div>
            <div>
              <label htmlFor="edit-check-in">Check In:</label>
              <input
                className="edit-date-input"
                type="date"
                max={checkOutDraft || undefined}
                value={checkInDraft}
                onChange={(e) => setCheckInDraft(e.target.value)}
              />
              <input
                className="edit-date-input"
                type="time"
                value={checkInTimeDraft }
                onChange={(e) => setCheckInTimeDraft(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="edit-check-out">Check Out:</label>
              <input
                className="edit-date-input"
                type="date"
                min={checkInDraft || undefined}
                value={checkOutDraft}
                onChange={(e) => setCheckOutDraft(e.target.value)}
              />
              <input
                className="edit-date-input"
                type="time"
                value={checkOutTimeDraft}
                onChange={(e) => setCheckOutTimeDraft(e.target.value)}
              />
            </div>
            <label htmlFor="booking-notes">Notes</label>
            <textarea
              id="booking-notes"
              className="edit-card-textarea"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          </div>
        </article>
      </div>

      <div id="edit-card-actions-container">
        <button
          className="EditSaved-Btn"
          onClick={() => props.onDelete(props.id)}
        >
          Delete
        </button>
        <button
          className="EditSaved-Btn"
          onClick={() => {
            props.onSave(props.id, draft, checkInDraft, checkOutDraft, checkInTimeDraft, checkOutTimeDraft);
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditBooking;
