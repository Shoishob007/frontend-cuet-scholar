import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import "./document.css";

const DocumentList = () => {
  const history = useHistory();
  const [documents, setDocuments] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, [selectedYear, selectedSupervisor]);

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
            <label htmlFor="year-select1">Year:</label>
            <select
              id="year-select1"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="select-year"
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

            <label htmlFor="supervisor-select">Supervisor:</label>
            <select
              id="supervisor-select"
              value={selectedSupervisor}
              onChange={(e) => setSelectedSupervisor(e.target.value)}
              className="select-supervisor"
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
              <option value="Shuhena Salam Aonty">
                Shuhena Salam Aonty
              </option>{" "}
            </select>
          </div>
        </div>
      </div>
      <div className="right">
        {documents.length > 0 ? (
          <ul className="document-list1">
            {documents.map((document) => (
              <li key={document.id} className="document-item">
                <a
                  href={document.url}
                  target="_blank"
                  rel="noreferrer"
                  className="title"
                >
                  {document.title}
                </a>
                <ul className="document-details">
                  <li className="document-detail">
                    <p className="document-author">By {document.author}</p>
                  </li>
                  <li className="document-detail">
                    <p className="document-year">Year: {document.year}</p>
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
          <p className="right">No documents found.</p>
        )}
      </div>
    </div>
  );
};

export default DocumentList;
