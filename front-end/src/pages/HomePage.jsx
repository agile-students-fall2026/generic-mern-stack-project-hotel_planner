import { useState } from "react";
import EditSaved from "./EditSaved";
import "./Home&ResultsPage.css";
import { Link } from "react-router-dom";
import { useCurBookings } from "../shared_content/SavedCurrentBookings";
import BookingCard from "../components/BookingCard";

function HomePage() {
  const {curBookings, deleteBooking, updateBooking} = useCurBookings();
  const [currentView, setCurrentView] = useState('noEdit');
  const [activeItemEdit, setActiveItemEdit] = useState(null);

  const handleEdit = (item) => {
      setCurrentView("edit");
      setActiveItemEdit(item);
    }

    const handleGoBack = () => {
      setCurrentView("noEdit");
      setActiveItemEdit(null);
    }

    {/*modify for data base later*/}
    const handleSave = (id, newDescription) => {
      updateBooking(id, { description: newDescription });
      handleGoBack();
    };

    {/*modify for data base later*/}
    const handleDelete = (id) => {
      deleteBooking(id);
      handleGoBack();
    };

    return currentView === 'noEdit' ? (
    <main className="homepage">
      <header className="home-header">
        <img src="https://picsum.photos/340/180" className="logo"/>
      </header>

      <section className="home-search">
        <label className="home-search-label">
          search
        </label>

        <input
          id="home-search-input"
          className="home-search-input"
          type="text"
        />

        <Link to="/results" className="home-search-button">
          search
        </Link>
      </section>

      <div id='home-page-current-bookings'>
      {curBookings.length === 0 ? (
        <p>You dont have any current bookings yet!</p>
      ) : (
        <>
        <p>Current Bookings</p>
        {curBookings.map((item) => (
          <BookingCard key={item.id} name={item.name} location={item.location} status={item.status} Edit={()=>handleEdit(item)}/>
        ))}
        </>
      )}
      </div>
    </main>
  ) : (
    <EditSaved id={activeItemEdit.id} name={activeItemEdit.name} location={activeItemEdit.location} date={activeItemEdit.checkIn} description={activeItemEdit.description} goBack={handleGoBack} onSave={handleSave} onDelete={handleDelete}/>
  );
}

export default HomePage;