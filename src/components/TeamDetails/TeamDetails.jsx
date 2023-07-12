import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { FaSave, FaRegSave } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import {
  collection,
  query,
  doc,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import SavedPapers from "../SavedPapers/SavedPapers";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUser } from "./../../UserContext";
import "./team_details.css";
import { clickCounter } from "../../utils/helper";

const TeamDetails = () => {
  const { name } = useParams();
  const [documents, setDocuments] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [sortByPopularity, setSortByPopularity] = useState(false);

  const [deletedDocumentIds, setDeletedDocumentIds] = useState([]);
  const { user, setUser } = useUser();
  const documentsPerPage = 5;
  const searchFirestore = async (year) => {
    try {
      const booksRef = collection(db, "Thesis");
      let q = query(booksRef, where("supervisor", "==", name));

      if (year) {
        q = query(q, where("year", "==", parseInt(year)));
      }
      if (sortByPopularity) {
        q = query(q, orderBy("count", "desc"));
      }


      const querySnapshot = await getDocs(q);
      const documentData = querySnapshot.docs.map((doc) => doc.data());
      setDocuments(documentData);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveResult = async (result) => {
    try {
      if (!user) {
        alert("Please log in to save the document.");
        return;
      }

      const isDocumentSaved = savedDocuments.some(
        (doc) => doc._id === result._id
      );

      if (isDocumentSaved) {
        const documentId = savedDocuments.find(
          (doc) => doc._id === result._id
        )._id;
        await handleRemoveDocument(documentId);
      } else {
        const docRef = await addDoc(collection(db, "savedDocuments"), {
          userId: user.uid,
          ...result,
        });

        const savedDocument = {
          _id: docRef.id,
          userId: user.uid,
          ...result,
          isSavedAnimation: true,
        };
        setSavedDocuments((prevDocuments) => [...prevDocuments, savedDocument]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveDocument = async (documentId) => {
    try {
      await deleteDoc(doc(db, "savedDocuments", documentId));

      setDeletedDocumentIds((prevIds) => [...prevIds, documentId]);

      setSavedDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc._id === documentId ? { ...doc, isSavedAnimation: false } : doc
        )
      );

      console.log("Successfully removed");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const booksRef = collection(db, "Thesis");
        const q = query(booksRef, where("supervisor", "==", name));
        const querySnapshot = await getDocs(q);

        const documentData = querySnapshot.docs.map((doc) => doc.data());
        setDocuments(documentData);
      } catch (error) {
        console.log("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [name]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Logged-in User UID:", user ? user.uid : "No user logged in");
      setUser(user);
    });

    return () => unsubscribe(); // Cleaning up the listener on unmount
  }, [setUser]);

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    searchFirestore(year);
  };

  const openDocumentInNewWindow = (document) => {
    clickCounter(document.id.toString())

    window.open(document.url, "_blank");

  };
  useEffect(() => {
    const calculateTotalPages = () => {
      const totalDocs = documents.length;
      const totalPagesCount = Math.ceil(totalDocs / documentsPerPage);
      setTotalPages(totalPagesCount);
    };

    calculateTotalPages();
  }, [documents]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = documents.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );
  const [isHeadingAnimated, setIsHeadingAnimated] = useState(false);

  useEffect(() => {
    setIsHeadingAnimated(true);
  }, []);
  const [appeared, setAppeared] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    animateBookCards();
  }, [searchResults]);

  const animateBookCards = () => {
    const bookCards = document.querySelectorAll(".book-card");
    bookCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.2}s`;
    });
  };

  useEffect(() => {
    // Add the appeared class after the component is mounted
    setAppeared(true);
  }, []);
  const handleSortByPopularityChange = () => {
    setSortByPopularity(!sortByPopularity);
  };

  return (
    <div className="all">
      <div className="supervise">
        <h2
          className={`heading-animation ${isHeadingAnimated ? "heading-animated" : ""
            }`}
        >Thesis works supervised by {name}</h2>
      </div>
      <div className="team-details">
        <div className="left_col">
          <div className="option">
            <label htmlFor="year-select">Batch:</label>
            <select
              id="year_select"
              value={selectedYear}
              onChange={handleYearChange}
              className="custom-select"
            >
              <option value="">All Batch</option>
              {Array.from({ length: 20 }, (_, index) => 2015 - index).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
            <br />
            <div className="checkbox-wrapper-3">
              <label htmlFor="">Sort By Popularity</label>
              <input type="checkbox" id="cbx-3" checked={sortByPopularity}
                onChange={handleSortByPopularityChange} />
              <label for="cbx-3" className="toggle"><span></span></label>
            </div>
          </div>
          <div className="option">
            <Link to="#" className="saved-papers-link" onClick={openModal}>
              <i className="fa fa-bookmark"> Saved Papers</i>
            </Link>
          </div>
        </div>
        <div className="right_col">
          {currentDocuments.length > 0 ? (
            <ul>
              {currentDocuments.map((doc, i) => (
                <li key={i} className="book-card">
                  <h3 onClick={() => openDocumentInNewWindow(doc)}>
                    {doc.title}
                  </h3>
                  <div className="details">
                    <p>By: {doc.author}, </p>
                    <p>ID: {doc.id}, </p>
                    <p>Batch: {doc.year}</p>
                  </div>
                  <p>{doc.summary}</p>
                  <ul>
                    <li>
                      {savedDocuments.some(
                        (savedDoc) => savedDoc._id === doc._id
                      ) ? (
                        <Link
                          className={`save-button ${doc.isSavedAnimation ? "saved-animation" : ""
                            }`}
                          onClick={(e) => handleRemoveDocument(e, doc._id)}
                        >
                          <FaSave />
                        </Link>
                      ) : (
                        <Link
                          className="save-button"
                          onClick={() => handleSaveResult(doc)}
                        >
                          <FaRegSave />
                        </Link>
                      )}
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-documents-message">
              <p>No documents found.</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className={currentPage === 1 ? "disabled" : ""}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </button>
              <div className="page-numbers">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className={pageNumber === currentPage ? "active" : ""}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
              <button
                className={currentPage === totalPages ? "disabled" : ""}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
        <div className="modal1">
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Saved Papers Modal"
            style={{
              overlay: {
                inset: 0,
                position: "fixed",
                backgroundColor: "rgba(100, 100, 100, 0.65)",
              },
            }}
          >
            <SavedPapers />
            <button className="modal-close" onClick={closeModal}></button>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
