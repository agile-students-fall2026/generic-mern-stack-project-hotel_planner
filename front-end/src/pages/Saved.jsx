import EditSaved from "./EditSaved";
import "./Saved.css";
import { useState, useEffect } from 'react';
import Card from "../components/Card";

function Saved() {
  {/* use the useState to load up the saved array from db when we get a db */}
  const [savedItems, setSavedItems] = useState([
    {
      id: 1,
      name: "Hotel Aurora",
      location: "Paris, France",
      date: "2026-12-14",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      id: 2,
      name: "The Maple Inn",
      location: "Vermont, USA",
      date: "2027-01-05",
      description: "Saved Hotel 2",
    },
    {
      id: 3,
      name: "Casa del Sol",
      location: "Barcelona, Spain",
      date: "2027-02-20",
      description: "Saved Hotel 3",
    },
    {
      id: 4,
      name: "Harbor View Suites",
      location: "Sydney, Australia",
      date: "2027-03-11",
      description: "Saved Hotel 4",
    },
    {
      id: 5,
      name: "Lotus Garden Resort",
      location: "Kyoto, Japan",
      date: "2027-04-02",
      description: "Saved Hotel 5",
    },
  ]);

  const [filterText, setFilterText] = useState("");
  const visibleItems = savedItems.filter((item) =>
    [item.name, item.location, item.date, item.description]
      .join(" ")
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

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
    setSavedItems(
      savedItems.map((item) =>
        item.id === id ? { ...item, description: newDescription } : item
      )
    );
    handleGoBack();
  };

  {/*modify for data base later*/}
  const handleDelete = (id) => { 
    setSavedItems(savedItems.filter((item) => item.id !== id));
    handleGoBack();
  };

  if(currentView === 'noEdit'){
    return (
      <div className="page-wrapper">
        <header className='saved-header'>
          <div style={{flex:3}}>
            <img src="https://picsum.photos/340/180" style={{ width: '100%', height: '100%', objectFit: 'cover'}}/>
          </div>
          <div className="saved-header-info">
            <input
              id="saved-filter"
              className="saved-filter-input"
              type="text"
              placeholder="Name, location, date..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
         </div>
        </header>

        <h2>Saved Hotels</h2>
        
      {savedItems.length === 0 ? (
        <p>You haven't saved any hotels yet!</p>
      ) : visibleItems.length === 0 ? (
        <p>No saved hotels match "{filterText}".</p>
      ) : (
        visibleItems.map((item) => (
          <Card key={item.id} description={item.description} location={item.location} date={item.date} name={item.name} Edit={()=>handleEdit(item)}/>
        ))
      )}

        <div className="list-end-spacer"/>
      </div>
    );
  } else return <EditSaved id={activeItemEdit.id} name={activeItemEdit.name} location={activeItemEdit.location} date={activeItemEdit.date} description={activeItemEdit.description} goBack={handleGoBack} onSave={handleSave} onDelete={handleDelete}/>
}

export default Saved;