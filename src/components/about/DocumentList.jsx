import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import "./document.css";
import { clickCounter } from "../../utils/helper";

const DocumentList = () => {
  const history = useHistory();
  const [documents, setDocuments] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortByPopularity, setSortByPopularity] = useState(false);
  const documentsPerPage = 10;
  useEffect(() => {
    fetchDocuments();
  }, [selectedYear, selectedSupervisor, sortByPopularity]);

  const fetchDocuments = async () => {
    try {
      const booksRef = collection(db, "Thesis");
      let q = query(booksRef);

      if (selectedYear) {
        q = query(q, where("year", "==", parseInt(selectedYear)));
      }

      if (selectedSupervisor) {
        q = query(q, where("supervisor", "==", selectedSupervisor));
      }
      if (sortByPopularity) {
        q = query(q, orderBy("counter", "desc"));
      }

      const querySnapshot = await getDocs(q);
      const documentData = querySnapshot.docs.map((doc) => doc.data());
      setDocuments(documentData);
    } catch (error) {
      console.log("Error fetching documents:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword) {
      history.push(`/search-results?keyword=${searchKeyword}`);
    }
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

  const handleSortByPopularityChange = () => {
    setSortByPopularity(!sortByPopularity);
  };
  const openDocumentInNewWindow = (document) => {
    window.open(document.url, "_blank");
    clickCounter(document)


  };

  console.log(currentDocuments);


  return (
    <div className="alldocuments">
      <div className="left">
        <div className="logo-container">
          <Link to="/" className="link-style">
            <h1 className="searchlogo">CUET SCHOLAR</h1>
            <span>Everything starts from here</span>
          </Link>
        </div>
        <div className="search-options">
          <div className="search-container">
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
          </div>
          <div className="optionscontainer">
            <label htmlFor="year-select1">Batch:</label>
            <select
              id="year-select1"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="select-year"
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


            <label htmlFor="supervisor-select">Supervisor:</label>
            <select
              id="supervisor-select"
              value={selectedSupervisor}
              onChange={(e) => setSelectedSupervisor(e.target.value)}
              className="select-supervisor"
            >
              <option value="">All Supervisors</option>
              <option value="Dr. A.H.M. Ashfak Habib">
                Dr. Abu Hasnat Mohammad Ashfak Habib
              </option>
              <option value="Dr. A.H.M Ashfak Habib">
                Dr. A.H.M Ashfak Habib
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
        </div>
      </div>

      <div className="right">
        {currentDocuments.length > 0 ? (
          <ul className="document-list1">
            {currentDocuments.map((document) => (
              <li key={document.id} className="document-item">
                <a
                  href={document.url}
                  target="_blank"
                  rel="noreferrer"
                  className="title"
                  style={{ cursor: "pointer" }}
                  onClick={() => openDocumentInNewWindow(document)}
                >
                  {document.title}
                </a>
                <ul className="document-details">
                  <li className="document-detail">
                    <p className="document-author">By {document.author}</p>
                  </li>
                  <li className="document-detail">
                    <p className="document-year">Batch: {document.year}</p>
                  </li>
                  <li className="document-detail">
                    <p className="document-supervisor">
                      Supervisor: {document.supervisor}
                    </p>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-documents-message">No documents found.</p>
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
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    className={pageNumber === currentPage ? "active" : ""}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                )
              )}
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
    </div>
  );
};

export default DocumentList;