import React, { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { app } from "../../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Link, useHistory } from "react-router-dom";
import "./login.css";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAsAdmin, setLoginAsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const history = useHistory();

  useEffect(() => {
    document.body.classList.add("login-signup-body");
    return () => {
      document.body.classList.remove("login-signup-body");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth(app); // Getting the Auth object from Firebase
      await setPersistence(auth, browserSessionPersistence); // Enable session persistence

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if the user is an admin
      const firestore = getFirestore();
      const adminRef = collection(firestore, "admins");
      const q = query(adminRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (loginAsAdmin) {
        if (!querySnapshot.empty) {
          // User is an admin
          history.push("/dbm");
          alert("Logged in as admin successfully");
        } else {
          // No such admin
          alert("No such admins");
        }
      } else {
        // User is not an admin
        history.push("/");
        alert("Logged in successfully");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="auth-form-container">
        <div className="h2-container">
          <h2>Welcome Back!</h2>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter Email"
            id="email"
            name="email"
          />
          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="********"
            id="password"
            name="password"
          />

          {/* Option to Log in as Admin */}
          <label htmlFor="loginAsAdmin">Log in as Admin?</label>
          <select
            className="admin-select"
            id="loginAsAdmin"
            value={loginAsAdmin}
            onChange={(e) => setLoginAsAdmin(e.target.value === "true")}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>

          {/* Admin Key Input */}
          {loginAsAdmin && (
            <div className="adminkey">
              <label htmlFor="adminKey">Admin Key:</label>
              <input
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                type="password"
                placeholder="Enter admin key"
                id="adminKey"
                name="adminKey"
              />
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            style={{
              marginTop: "20px",
              marginLeft: "40px",
              marginRight: "50px",
              padding: "10px",
            }}
          >
            Log In
          </button>
        </form>
        <div>
          <button className="link-btn">
            Don't have an account? <Link to="/signup">Register here</Link>.
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;