import "./HomePage.css";

function HomePage() {
  return (
    <main className="phone-screen homepage">
        <header className="home-header">
            <img src="https://picsum.photos/340/180" alt="Sample" />

            <div className="home-header-actions">
            <button type="button" className="home-header-button">
            profile
          </button>

          <button type="button" className="home-header-button">
            saved
          </button>
        </div>
      </header>







      <section className="home-search">
        <label className="home-search-label" htmlFor="home-search-input">
          search
        </label>

        <input
          id="home-search-input"
          className="home-search-input"
          type="text"
          readOnly
        />

        <button type="button" className="home-search-button">
          search
        </button>
      </section>











    </main>
  );
}

export default HomePage;