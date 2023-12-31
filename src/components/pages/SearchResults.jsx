import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import Modal from "react-modal";
import { FaSave, FaRegSave } from "react-icons/fa";
import {
	collection,
	getDocs,
	addDoc,
	query,
	where,
	deleteDoc,
	doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import SavedPapers from "../SavedPapers/SavedPapers";
import { useUser } from "./../../UserContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./SearchPage.css";

const SearchResults = () => {
	const location = useLocation();
	const history = useHistory();
	const { user, setUser } = useUser();

  const searchParams = new URLSearchParams(location.search);
  const initialKeyword = searchParams.get("keyword");
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [deletedDocumentIds, setDeletedDocumentIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

	const searchFirestore = async (searchKey, year, supervisor) => {
		try {
			const booksRef = collection(db, "Thesis");
			let q = query(booksRef);

			if (year) {
				q = query(q, where("year", "==", parseInt(year)));
			}

			if (supervisor) {
				q = query(q, where("supervisor", "==", supervisor));
			}

      const querySnapshot = await getDocs(q);
      let books = [];
      querySnapshot.forEach((doc) => {
        const { title, summary, category, supervisor } = doc.data();
        if (
          (title && title.toLowerCase().includes(searchKey.toLowerCase())) ||
          (summary &&
            summary.toLowerCase().includes(searchKey.toLowerCase())) ||
          (supervisor &&
            supervisor.toLowerCase().includes(searchKey.toLowerCase())) ||
          (category && category.toLowerCase() === searchKey.toLowerCase())
        ) {
          const regex = new RegExp(searchKey, "gi");

          const highlightedSummary = summary?.replace(
            regex,
            (match) => `<strong>${match}</strong>`
          );

          books.push({ ...doc.data(), highlightedSummary });
        }
      });
      setSearchResults(books);
    } catch (error) {
      console.error(error);
    }
  };

  const saveSearchStateToSessionStorage = () => {
    sessionStorage.setItem("searchKeyword", searchKeyword);
    sessionStorage.setItem("selectedYear", selectedYear);
    sessionStorage.setItem("selectedSupervisor", selectedSupervisor);
  };

  const retrieveSearchStateFromSessionStorage = () => {
    const storedSearchKeyword = sessionStorage.getItem("searchKeyword");
    const storedSelectedYear = sessionStorage.getItem("selectedYear");
    const storedSelectedSupervisor =
      sessionStorage.getItem("selectedSupervisor");

    setSearchKeyword(storedSearchKeyword || "");
    setSelectedYear(storedSelectedYear || "");
    setSelectedSupervisor(storedSelectedSupervisor || "");
  };

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchKeyword) {
			sessionStorage.setItem("searchKeyword", searchKeyword);
			history.push(`/search-results?keyword=${searchKeyword}`);
			searchFirestore(searchKeyword, selectedYear, selectedSupervisor);
		}
	};

	const handleYearChange = (e) => {
		const year = e.target.value;
		setSelectedYear(year);
		searchFirestore(searchKeyword, year, selectedSupervisor);
	};

	const handleSupervisorChange = (e) => {
		const supervisor = e.target.value;
		setSelectedSupervisor(supervisor);
		searchFirestore(searchKeyword, selectedYear, supervisor);
	};

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	useEffect(() => {
		if (initialKeyword) {
			searchFirestore(initialKeyword, selectedYear, selectedSupervisor);
		}
	}, [initialKeyword, selectedYear, selectedSupervisor]);

  useEffect(() => {
    saveSearchStateToSessionStorage();
  }, [searchKeyword, selectedYear, selectedSupervisor]);

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
		});

    return () => unsubscribe(); // Cleaningup the listener on unmount
  }, [setUser]);

	const fetchSavedDocuments = useCallback(async () => {
		try {
			if (user) {
				const savedDocsQuery = query(
					collection(db, "savedDocuments"),
					where("userId", "==", user.uid)
				);
				const querySnapshot = await getDocs(savedDocsQuery);

				const savedDocuments = [];
				querySnapshot.forEach((doc) => {
					savedDocuments.push({ _id: doc.id, ...doc.data() });
				});

				setSavedDocuments(savedDocuments);
			}
		} catch (error) {
			console.error(error);
		}
	}, [user]);

	useEffect(() => {
		fetchSavedDocuments();
	}, [fetchSavedDocuments]);

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

	const handleRemoveDocument = async (event, documentId) => {
		event.preventDefault();
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

  console.log("Logged-in User UID:", user ? user.uid : "No user logged in");

  return (
    <div className="searchpage-container">
      <div className="logo-container">
        <Link to="/" className="link-style">
          <h1 className="searchlogo">CUET SCHOLAR</h1>
          <span>Everything starts from here</span>
        </Link>
      </div>
      <div className="content-container">
        <div className="options-container">
          <form onSubmit={handleSearch} className="searchpage_searchbar">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search..."
            />

            <button type="submit" className="search-button">
              <i className="fa fa-search"></i>
            </button>
          </form>
          {/* Year filter */}
          <div className="option">
            <label htmlFor="year-select">Year:</label>
            <select
              id="year-select"
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
        <div className="search-results-container">
          {searchResults.length > 0 ? (
            <ul className="books">
              {searchResults.map((result, index) => (
                <li key={index} className="book-card">
                  <div className="metadata">
                    <div className="result-info">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noreferrer"
                        className="title"
                      >
                        {result.title}
                      </a>
                      <ul className="details">
                        <li className="detail">
                          <p>By: {result.author}, </p>
                        </li>
                        <li className="detail">
                          <p>Year: {result.year},</p>
                        </li>
                        <li className="detail">
                          <p>Supervisor: {result.supervisor}</p>
                        </li>
                      </ul>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: result.highlightedSummary,
                        }}
                        className="truncate-text"
                      />
                      <ul>
                        <li>
                          {savedDocuments.some(
                            (doc) => doc.id === result.id
                          ) ? (
                            <Link
                              className={`save-button ${
                                result.isSavedAnimation ? "saved-animation" : ""
                              }`}
                              onClick={(e) =>
                                handleRemoveDocument(e, result._id)
                              }
                            >
                              <FaSave />
                            </Link>
                          ) : (
                            <Link
                              className="save-button"
                              onClick={() => handleSaveResult(result)}
                            >
                              <FaRegSave />
                            </Link>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="no-documents-message">
              <p>No search results found.</p>
            </ul>
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

export default SearchResults;
