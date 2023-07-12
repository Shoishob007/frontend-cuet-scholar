import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { FaSave, FaRegSave } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy
} from "firebase/firestore";
import { db } from "../../firebase";
import SavedPapers from "../SavedPapers/SavedPapers";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUser } from "./../../UserContext";
import "./course_details.css";
import Head from '../common/header/Head';
import { clickCounter } from "../../utils/helper";

const CourseDetails = () => {
  const { courseName } = useParams();
  const { name } = useParams();
  const [documents, setDocuments] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [sortByPopularity, setSortByPopularity] = useState(false);

  const [deletedDocumentIds, setDeletedDocumentIds] = useState([]);
  const { user, setUser } = useUser();
  const documentsPerPage = 6;
  const searchFirestore = async (year, supervisor, page) => {
    try {
      const booksRef = collection(db, "Thesis");
      let q = query(booksRef, where("category", "==", courseName));

      if (supervisor) {
        q = query(q, where("supervisor", "==", supervisor));
      }

      if (year) {
        q = query(q, where("year", "==", parseInt(year)));
      }

      const querySnapshot = await getDocs(q);
      const documentData = querySnapshot.docs.map((doc) => doc.data());
      // setDocuments(documentData);
      const totalDocuments = documentData.length;
      const totalPages = Math.ceil(totalDocuments / documentsPerPage);
      setTotalPages(totalPages);

      // Pagination
      const startIndex = (page - 1) * documentsPerPage;
      const endIndex = startIndex + documentsPerPage;
      const paginatedDocuments = documentData.slice(startIndex, endIndex);
      setDocuments(paginatedDocuments);
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
        let q = query(booksRef, where("category", "==", courseName));

        if (name) {
          // Add supervisor name check if provided
          q = query(q, where("supervisor", "==", name));
        }

        if (selectedYear) {
          q = query(q, where("year", "==", parseInt(selectedYear)));
        }

        if (selectedSupervisor) {
          q = query(q, where("supervisor", "==", selectedSupervisor));
        }
        if (sortByPopularity) {
          q = query(q, orderBy("count", "desc"));
        }


        const querySnapshot = await getDocs(q);
        const documentData = querySnapshot.docs.map((doc) => doc.data());
        // setDocuments(documentData);
        const totalDocuments = documentData.length;
        const totalPages = Math.ceil(totalDocuments / documentsPerPage);
        setTotalPages(totalPages);

        // Pagination
        const startIndex = (currentPage - 1) * documentsPerPage;
        const endIndex = startIndex + documentsPerPage;
        const paginatedDocuments = documentData.slice(startIndex, endIndex);
        setDocuments(paginatedDocuments);
      } catch (error) {
        console.log("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [courseName, name, selectedYear, selectedSupervisor, currentPage]);

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
    setCurrentPage(1);
    searchFirestore(year, selectedSupervisor, 1);
  };

  const handleSupervisorChange = (e) => {
    const supervisor = e.target.value;
    setSelectedSupervisor(supervisor);
    setCurrentPage(1);
    searchFirestore(selectedYear, supervisor, 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    searchFirestore(selectedYear, selectedSupervisor, pageNumber);
  };

  const openDocumentInNewWindow = (document) => {
    clickCounter(document.id.toString())
    window.open(document.url, "_blank");

  };
  const [isHeadingAnimated, setIsHeadingAnimated] = useState(false);

  useEffect(() => {
    setIsHeadingAnimated(true);
  }, []);
  useEffect(() => {
    animateBookCards();
  }, [searchResults]);

  const animateBookCards = () => {
    const bookCards = document.querySelectorAll(".book-card");
    bookCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.2}s`;
    });
  };
  const [appeared, setAppeared] = useState(false);

  useEffect(() => {
    // Add the appeared class after the component is mounted
    setAppeared(true);
  }, []);

  const handleSortByPopularityChange = () => {
    setSortByPopularity(!sortByPopularity);
  };


  return (
    <>
      <div className="cHead">
        <Head />
      </div>
      <div className="all">

        <div className="supervise">
          <h2
            className={`heading-animation ${isHeadingAnimated ? "heading-animated" : ""
              }`}
          >
            Thesis works in {courseName} ...
          </h2>
        </div>
        <div className="team-details">
          <div className="left_col">

            <div className="option">
              <label htmlFor="year-select">Batch:</label>
              <br />
              <select
                id="year_select"
                value={selectedYear}
                onChange={handleYearChange}
                className="custom-select"
              >
                <option value="">All Batch</option>
                {Array.from({ length: 20 }, (_, index) => 2015 - index).map(
                  (year) => (
                    <option className={appeared ? "select-transition" : ""} key={year} value={year}>
                      {year}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="option">
              <label htmlFor="supervisor-select">Supervisor:</label>
              <select
                id="supervisor-select"
                value={selectedSupervisor}
                onChange={handleSupervisorChange}
                className="custom-select"
              >
                <option value="">All Supervisors</option>
                <option value="Dr. A.H.M. Ashfak Habib">
                  Dr. Abu Hasnat Mohammad Ashfak Habib
                </option>
                <option value="Dr. Kaushik Deb">Dr. Kaushik Deb</option>
                <option value="Dr. Muhammad Ibrahim Khan">
                  Dr. Muhammad Ibrahim Khan
                </option>
                <option value="Dr. Mohammed Moshiul Hoque">
                  Dr. Mohammed Moshiul Hoque
                </option>
                <option value="Prof. Dr. Mohammad Shamsul Arefin">
                  Dr. Mohammad Shamsul Arefin
                </option>
                <option value="Dr. Asaduzzaman">Dr. Asaduzzaman</option>
                <option value="Dr. Md. Mokammel Haque">
                  Dr. Md. Mokammel Haque
                </option>
                <option value="Muhammad Kamal Hossen">
                  Muhammad Kamal Hossen
                </option>
                <option value="Obaidur Rahman">Mohammad Obaidur Rahman</option>
                <option value="Dr. Pranab Kumar Dhar">
                  Dr. Pranab Kumar Dhar
                </option>
                <option value="Mir Md. Saki Kowsar">Mir. Md. Saki Kowsar</option>
                <option value="Dr. Md. Iqbal Hasan Sarker">
                  Dr. Md. Iqbal Hasan Sarker
                </option>
                <option value="Dr. Mahfuzulhoq Chowdhury">
                  Dr. Mahfuzulhoq Chowdhury
                </option>
                <option value="Rahma Bintey Mufiz Mukta">
                  Rahma Bintey Mufiz Mukta
                </option>
                <option value="Tahmina Khanam">Tahmina Khanam</option>
                <option value="Lamia Alam">Lamia Alam</option>
                <option value="Animesh Chandra Roy">Animesh Chandra Roy</option>
                <option value="Md. Sabir Hossain">Md. Sabir Hossain</option>
                <option value="Md. Shafiul Alam Forhad">
                  Md. Shafiul Alam Forhad
                </option>
                <option value="Sharmistha Chanda Tista">
                  Sharmistha Chanda Tista
                </option>
                <option value="Md. Mynul Hasan">Md. Mynul Hasan</option>
                <option value="Annesha Das">Annesha Das</option>
                <option value="Ashim Dey">Ashim Dey</option>
                <option value="Md. Billal Hossain">Md. Billal Hossain</option>
                <option value="Md. Atiqul Islam Rizvi">
                  Md. Atiqul Islam Rizvi
                </option>
                <option value="Sabiha Anan">Sabiha Anan</option>
                <option value="Md. Rashadur Rahman">Md. Rashadur Rahman</option>
                <option value="Hasan Murad">Hasan Murad</option>
                <option value="Avishek Das">Avishek Das</option>
                <option value="Moumita Sen Sarma">Moumita Sen Sarma</option>
                <option value="Saadman Sakib">Saadman Sakib</option>
                <option value="Shuhena Salam Aonty">Shuhena Salam Aonty</option>
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
            {documents.length > 0 ? (
              <ul>
                {documents.map((doc, i) => (
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
                            className={`save-button ${doc.isSavedAnimation ? "saved-animation" : ""}`}
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
        <ScrollToTop
          smooth
          height="16px"
          width="14px"
          className="scroll-to-top scroll-to-top--home1"
          viewBox="0 0 448 512"
          svgPath="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3V320c0 17.7 14.3 32 32 32s32-14.3 32-32V109.3l73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 53 43 96 96 96H352c53 0 96-43 96-96V352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V352z"
        />
      </div></>
  );
};

export default CourseDetails;
