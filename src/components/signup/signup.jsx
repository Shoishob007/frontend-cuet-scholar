import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useHistory } from "react-router-dom";
import { app } from "../../firebase";
import "./signup.css";

export const Signup = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [registerAsAdmin, setRegisterAsAdmin] = useState(true);
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

      if (registerAsAdmin) {
        if (adminKey !== "1020304050") {
          // Check if the user wants to register as an admin but the provided admin key is incorrect
          alert("Admin key is incorrect");
          return;
        }

        // Register the user as an admin
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const firestore = getFirestore(app);
        await addDoc(collection(firestore, "admins"), {
          email: user.email,
          providerId: user.providerData[0]?.providerId || "",
          created: user.metadata.creationTime,
          lastSignedIn: user.metadata.lastSignInTime,
          userId: user.uid,
        });

        console.log("Registered as admin");
        alert("Admin created successfully!");
        history.push("/dbm");
      } else {
        // Register the user as a regular user
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Registered as a regular user");
        alert("User created successfully!");

        history.push("/");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="auth-form-container">
        <h2>Create An Account</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter email"
            id="email"
            name="email"
          />
          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Set your password"
            id="password"
            name="password"
          />

          {/* Option to Register as Admin */}
          <label htmlFor="registerAsAdmin">Register as Admin?</label>
          <select
            className="admin-select"
            id="registerAsAdmin"
            value={registerAsAdmin}
            onChange={(e) => setRegisterAsAdmin(e.target.value === "true")}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>

          {/* Admin Key Input */}
          {registerAsAdmin && (
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
            className="signup-button"
            style={{
              marginTop: "20px",
              marginLeft: "40px",
              marginRight: "50px",
              padding: "10px",
            }}
          >
            Sign Up
          </button>
          <button className="link-btn">
            Have an account? <Link to="/login">Login here</Link>
          </button>
        </form>
      </div>
    </>
  );
};

export default Signup;
