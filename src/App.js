import React from "react";
import "./App.css";
import Header from "./components/common/header/Header";
import Footer from "./components/common/footer/Footer";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./components/about/About";
import CourseHome from "./components/allcourses/CourseHome";
import Team from "./components/team/Team";
import Contact from "./components/contact/Contact";
import Home from "./components/home/Home";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import SearchResults from "./components/pages/SearchResults";
import DocumentForm from "./components/database_manage/database";
import CourseDetails from "./components/CourseDetails/CourseDetails";
import TeamDetails from "./components/TeamDetails/TeamDetails";
import DocumentList from "./components/about/DocumentList";
import SavedPapers from "./components/SavedPapers/SavedPapers";
import { UserProvider } from "./UserContext"; // Import the UserProvider

const App = () => {
  return (
    <UserProvider>
      {" "}
      {/* Wrap the entire application with UserProvider */}
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/search-results" component={SearchResults} />
          <Route path="/saved-papers" component={SavedPapers} />
          <Route exact path="/dbm" component={DocumentForm} />
          <Route path="/course/:courseName" component={CourseDetails} />
          <Route path="/team/:name" component={TeamDetails} />
          <Route exact path="/documents" component={DocumentList} />

          <Route>
            <Header />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              <Route exact path="/courses" component={CourseHome} />
              <Route exact path="/team" component={Team} />
              <Route exact path="/contact" component={Contact} />
            </Switch>
            <Footer />
          </Route>
        </Switch>
      </Router>
    </UserProvider>
  );
};

export default App;
