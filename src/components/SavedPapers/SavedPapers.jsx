import {
  query,
  where,
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import React, { useState, useEffect } from "react";
import { useUser } from "./../../UserContext";
import { useLocation } from "react-router-dom";
import "./SavedPapers.css";

const SavedPapers = () => {
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [deletedDocumentIds, setDeletedDocumentIds] = useState([]);
  const { user, setUser } = useUser();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userParam = params.get("user");

    if (userParam) {
      const userFromURL = JSON.parse(decodeURIComponent(userParam));
      setUser(userFromURL);
    }
  }, [location.search, setUser]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "savedDocuments"), () => {
      fetchSavedDocuments();
    });

    return () => unsubscribe(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("Logged-in User UID:", user ? user.uid : "No user logged in");

  useEffect(() => {
    fetchSavedDocuments(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedDocumentIds]);

  const fetchSavedDocuments = async () => {
    try {
      if (user) {
        const querySnapshot = await getDocs(
          query(
            collection(db, "savedDocuments"),
            where("userId", "==", user.uid)
          )
        );
        const documents = querySnapshot.docs
          .map((doc) => ({
            _id: doc.id,
            ...doc.data(),
          }))
          .filter((doc) => !deletedDocumentIds.includes(doc._id));
        setSavedDocuments(documents);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveDocument = async (documentId) => {
    try {
      await deleteDoc(doc(db, "savedDocuments", documentId));

      setDeletedDocumentIds((prevIds) => [...prevIds, documentId]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="saved-papers-container">
      <h3 className="saved-papers-title">Saved for later</h3>
      {savedDocuments.length > 0 ? (
        <ul className="saved-papers-list">
          {savedDocuments.map((document) => (
            <li
              key={document._id}
              className={`saved-paper-card ${
                document.isSavedAnimation ? "saved-animation" : ""
              }`}
            >
              {" "}
              <div className="metadata">
                <div className="result-info">
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noreferrer"
                    className="title"
                  >
                    {document.title}
                  </a>
                  <ul className="details">
                    <li className="detail">
                      <p>By: {document.author},</p>
                    </li>
                    <li className="detail">
                      <p>Year: {document.year},</p>
                    </li>
                    <li className="detail">
                      <p>Supervisor: {document.supervisor}</p>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                className="remove-button"
                onClick={() => handleRemoveDocument(document._id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No saved papers found.</p>
      )}
    </div>
  );
};

export default SavedPapers;
