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
} from "firebase/firestore";
import { db } from "../../firebase";
import SavedPapers from "../SavedPapers/SavedPapers";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUser } from "./../../UserContext";
import "./team_details.css";

const TeamDetails = () => {
  const { name } = useParams();
  const [documents, setDocuments] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [deletedDocumentIds, setDeletedDocumentIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user, setUser } = useUser();
  const documentsPerPage = 5;

  const searchFirestore = async (year) => {
    try {
      const booksRef = collection(db, "Thesis");
      let q = query(booksRef, where("supervisor", "==", name));

      if (year) {
        q = query(q, where("year", "==", parseInt(year)));
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

  console.log(name);

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

  return (
    <div className="all">
      <div className="supervise">
        <h2>Thesis works supervised by {name}</h2>
      </div>
      <div className="team-details">
        <div className="left_col">
          <div className="option">
            <label htmlFor="year-select">Year:</label>
            <select
              id="year_select"
              value={selectedYear}
              onChange={handleYearChange}
            >
              <option value="">All Years</option>
              {Array.from({ length: 23 }, (_, index) => 2022 - index).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
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
                <li key={i}>
                  <h3 onClick={() => openDocumentInNewWindow(doc)}>
                    {doc.title}
                  </h3>
                  <div className="details">
                    <p>By: {doc.author}, </p>
                    <p>ID: {doc.id}, </p>
                    <p>Year: {doc.year}</p>
                  </div>
                  <p>{doc.summary}</p>
                  <ul>
                    <li>
                      {savedDocuments.some(
                        (savedDoc) => savedDoc._id === doc._id
                      ) ? (
                        <Link
                          className={`save-button ${
                            doc.isSavedAnimation ? "saved-animation" : ""
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
