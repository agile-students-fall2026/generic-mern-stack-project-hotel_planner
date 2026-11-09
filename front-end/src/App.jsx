
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import ResultsPage from "./pages/ResultsPage";
import HomePage from "./pages/HomePage";
import Saved from "./pages/Saved";
import EditSaved from "./pages/EditSaved";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Profile from "./Profile";

function Layout() {
  const location = useLocation();
  const hideBottomNav = location.pathname === "/signin" || location.pathname === "/signup";

  return (
    <div className="phone-screen">
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/editsaved" element={<EditSaved />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

      {!hideBottomNav && (
        <nav className="bottom-nav">
          <Link to="/">home</Link>
          <Link to="/">search</Link>
          <Link to="/saved">saved</Link>
          <Link to="/profile">profile</Link>
        </nav>
      )}
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
