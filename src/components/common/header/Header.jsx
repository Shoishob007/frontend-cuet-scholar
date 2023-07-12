import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Head from "./Head";
import "./header.css";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useUser } from "../../../UserContext";

const Header = () => {
  const [click, setClick] = useState(false);
  const [keyword, setKeyword] = useState("");
  const history = useHistory();
  const { user, setUser } = useUser();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleaningup the listener on unmount
  }, [setUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim() !== "") {
      history.push(`/search-results?keyword=${keyword}`);
    } else {
      alert("Please enter a search keyword");
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
      history.push("/login");
      // Redirect or perform any additional logic after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  console.log("Logged-in User UID:", user ? user.uid : "No user logged in");

  return (
    <div className="header">
      <Head />
      <header>
        <nav className="flexSB">
          <ul
            className={click ? "mobile-nav" : "flexSB "}
            onClick={() => setClick(false)}
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/courses">All Courses</Link>
            </li>
            <li>
              <Link to="/team">Faculties</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            {user && user.loginAsAdmin ? (
              // If user is logged in as admin, display the "Database" link and logout option
              <>
                <li>
                  <Link to="/database">Database</Link>
                </li>
                <li>
                  <Link onClick={handleLogout} to="/login">
                    Logout
                  </Link>
                </li>
              </>
            ) : user ? (
              // If user is logged in as a regular user, display logout option
              <li>
                <Link onClick={handleLogout} to="/login">
                  Logout
                </Link>
              </li>
            ) : (
              // If user is not logged in, display login option
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
          <div className="start">
            <div className="container flexSB">
              <div className="searchbar">
                <form onSubmit={handleSearch}>
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Search"
                      className="headerSearch"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button type="submit" className="submit">
                      <i className="fa fa-search search-icon"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <button className="toggle" onClick={() => setClick(!click)}>
            {click ? (
              <i className="fa fa-times"> </i>
            ) : (
              <i className="fa fa-bars"></i>
            )}
          </button>
        </nav>
      </header>
    </div>
  );
};

export default Header;
