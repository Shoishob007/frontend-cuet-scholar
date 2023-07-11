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
} from "firebase/firestore";
import { db } from "../../firebase";
import SavedPapers from "../SavedPapers/SavedPapers";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUser } from "./../../UserContext";
import "./course_details.css";
import Header from "../common/header/Header";

const CourseDetails = () => {
  const { courseName } = useParams();
  const { name } = useParams();
  const [documents, setDocuments] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [deletedDocumentIds, setDeletedDocumentIds] = useState([]);
  const { user, setUser } = useUser();

  const searchFirestore = async (year, supervisor) => {
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

        const querySnapshot = await getDocs(q);
        const documentData = querySnapshot.docs.map((doc) => doc.data());
        setDocuments(documentData);
      } catch (error) {
        console.log("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [courseName, name, selectedYear, selectedSupervisor]);

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

  const handleSupervisorChange = (e) => {
    const supervisor = e.target.value;
    setSelectedSupervisor(supervisor);
    searchFirestore(selectedYear, supervisor);
  };

  const openDocumentInNewWindow = (document) => {
    window.open(document.url, "_blank");
  };

  return (
    <><Header />
    <div className="all">

      <div className="supervise">
        <h2>Thesis works in {courseName} category</h2>
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
            <label htmlFor="supervisor-select">Supervisor:</label>
            <select
              id="supervisor-select"
              value={selectedSupervisor}
              onChange={handleSupervisorChange}
            >
              <option value="">All Supervisors</option>
              <option value="Dr. Abu Hasnat Mohammad Ashfak Habib">
                Dr. Abu Hasnat Mohammad Ashfak Habib
              </option>
              <option value="Dr. Kaushik Deb">Dr. Kaushik Deb</option>
              <option value="Dr. Muhammad Ibrahim Khan">
                Dr. Muhammad Ibrahim Khan
              </option>
              <option value="Dr. Mohammed Moshiul Hoque">
                Dr. Mohammed Moshiul Hoque
              </option>
              <option value="Dr. Mohammad Shamsul Arefin">
                Dr. Mohammad Shamsul Arefin
              </option>
              <option value="Dr. Asaduzzaman">Dr. Asaduzzaman</option>
              <option value="Dr. Md. Mokammel Haque">
                Dr. Md. Mokammel Haque
              </option>
              <option value="Muhammad Kamal Hossen">
                Muhammad Kamal Hossen
              </option>
              <option value="Mohammad Obaidur Rahman">
                Mohammad Obaidur Rahman
              </option>
              <option value="Dr. Pranab Kumar Dhar">
                Dr. Pranab Kumar Dhar
              </option>
              <option value="Mir. Md. Saki Kowsar">Mir. Md. Saki Kowsar</option>
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
