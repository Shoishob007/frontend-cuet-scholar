import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  updateDoc,
  writeBatch,
  query,
  where,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { Link, useHistory } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import "./database.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../UserContext";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const DocumentForm = () => {

  const [countAdded, setCountAdded] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [thesisDocuments, setThesisDocuments] = useState([]);
  const [requestDocuments, setRequestDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedRequestedDocument, setSelectedRequestedDocument] =
    useState(null);
  const [author, setAuthor] = useState("");
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isRequestTable, setIsRequestTable] = useState(false);
  const formRef = useRef(null);
  const [replaceYear, setReplaceYear] = useState("");
  const [newYear, setNewYear] = useState("");
  const { user, setUser } = useUser();

  const history = useHistory();

  useEffect(() => {

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // if the user email is not admin collection redirect to home page


    return () => unsubscribe(); // Cleaningup the listener on unmount
  }, [setUser]);
  console.log("User:", user);


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Thesis"), (snapshot) => {
      const fetchedDocuments = snapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));
      setDocuments(fetchedDocuments);
    });

    const unsubscribeRequests = onSnapshot(
      collection(db, "Requests"),
      (snapshot) => {
        const fetchedDocuments = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        }));
        setRequestDocuments(fetchedDocuments);
      }
    );

    return () => {
      unsubscribe();
      unsubscribeRequests();
    };
  }, []);

  const fetchDocuments = async () => {
    try {
      const thesisSnapshot = await getDocs(collection(db, "Thesis"));
      const thesisDocuments = thesisSnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));
      setDocuments(thesisDocuments);

      const requestsSnapshot = await getDocs(collection(db, "Requests"));
      const requestDocuments = requestsSnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));
      setRequestDocuments(requestDocuments);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("file-input");
    const file = fileInput.files[0];

    const documentData = {
      author: author,
      id: parseInt(id),
      title: title,
      year: parseInt(year),
      supervisor: supervisor,
      summary: summary,
      category: category,
      counter: 0,
    };

    try {
      if (file) {
        // Uploading a new file
        const storageRef = ref(storage, "Data/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle upload progress if needed
          },
          (error) => {
            console.error("Error uploading document: ", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const updatedDocumentData = { ...documentData, url: downloadURL };

            if (selectedDocument) {
              // Updating existing document in the "Thesis" collection
              await setDoc(
                doc(db, "Thesis", selectedDocument._id),
                updatedDocumentData
              );
              console.log("Document updated successfully!");
              alert("Document updated successfully!");

              setSelectedDocument((prevDocuments) =>
                prevDocuments.map((doc) =>
                  doc._id === selectedDocument._id
                    ? { _id: doc._id, ...updatedDocumentData }
                    : doc
                )
              );

              resetForm();
            } else if (selectedRequestedDocument) {
              // Approving document from the "Requests" collection and adding it to the "Thesis" collection
              const newDocRef = await addDoc(
                collection(db, "Thesis"),
                documentData
              );
              const newDocument = {
                _id: newDocRef.id,
                ...documentData,
                url: downloadURL,
              };
              console.log(
                "Document approved and added to Thesis successfully!"
              );
              alert("Document approved and added to Thesis successfully!");

              setSelectedDocument((prevDocuments) => [
                ...prevDocuments,
                newDocument,
              ]);

              // Delete the approved document from the "Requests" collection
              await deleteDoc(
                doc(db, "Requests", selectedRequestedDocument._id)
              );
              console.log("Document deleted from Requests successfully!");

              setRequestDocuments((prevDocuments) =>
                prevDocuments.filter(
                  (doc) => doc._id !== selectedRequestedDocument._id
                )
              );

              resetForm();
              fetchDocuments();
            } else {
              // Adding a new document to the "Thesis" collection
              const newDocRef = await addDoc(
                collection(db, "Thesis"),
                updatedDocumentData
              );
              const newDocument = {
                _id: newDocRef.id,
                ...updatedDocumentData,
              };
              console.log("Document added successfully!");
              alert("Document added successfully!");

              setSelectedDocument((prevDocuments) => [
                ...prevDocuments,
                newDocument,
              ]);
              resetForm();
            }
            fileInput.value = "";
          }
        );
      } else {
        if (selectedDocument) {
          // Updating existing document without changing the file in the "Thesis" collection
          const updatedDocumentData = { ...documentData };

          if (selectedDocument.url) {
            updatedDocumentData.url = selectedDocument.url;
          }

          await setDoc(
            doc(db, "Thesis", selectedDocument._id),
            updatedDocumentData
          );
          console.log("Document updated successfully!");
          alert("Document updated successfully!");

          setSelectedDocument((prevDocuments) =>
            prevDocuments.map((doc) =>
              doc._id === selectedDocument._id
                ? { _id: doc._id, ...updatedDocumentData }
                : doc
            )
          );
        } else if (selectedRequestedDocument) {
          // Approving document from the "Requests" collection and adding it to the "Thesis" collection
          const newDocRef = await addDoc(
            collection(db, "Thesis"),
            documentData
          );
          const newDocument = { _id: newDocRef.id, ...documentData };
          console.log("Document approved and added to Thesis successfully!");
          alert("Document approved and added to Thesis successfully!");

          setSelectedDocument((prevDocuments) => [
            ...prevDocuments,
            newDocument,
          ]);

          // Delete the approved document from the "Requests" collection
          await deleteDoc(doc(db, "Requests", selectedRequestedDocument._id));
          console.log("Document deleted from Requests successfully!");

          setRequestDocuments((prevDocuments) =>
            prevDocuments.filter(
              (doc) => doc._id !== selectedRequestedDocument._id
            )
          );

          resetForm();
          fetchDocuments();
        } else {
          // Adding a new document to the "Thesis" collection without choosing a file
          const newDocRef = await addDoc(
            collection(db, "Thesis"),
            documentData
          );
          const newDocument = { _id: newDocRef.id, ...documentData };
          console.log("Document added successfully!");
          alert("Document added successfully!");

          setSelectedDocument((prevDocuments) => [
            ...prevDocuments,
            newDocument,
          ]);

          resetForm();
        }
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Thesis", id));
      console.log(id);
      console.log("Document deleted successfully!");
      alert("Document deleted successfully!");

      // Update the state by filtering out the deleted document
      setDocuments((prevDocuments) =>
        prevDocuments.filter((doc) => doc._id !== id)
      );

      resetForm();
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      await deleteDoc(doc(db, "Requests", id.toString()));
      console.log(id);
      console.log("Document deleted successfully!");
      alert("Document deleted successfully!");

      // Update the state by filtering out the deleted document
      setRequestDocuments((prevDocuments) =>
        prevDocuments.filter((doc) => doc._id !== id)
      );

      resetForm();
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (document) => {
    setSelectedDocument(document);
    setAuthor(document.author);
    setId(document.id);
    setTitle(document.title);
    setYear(document.year);
    setSupervisor(document.supervisor);
    setSummary(document.summary);
    setCategory(document.category);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleEditRequest = (document) => {
    setSelectedRequestedDocument(document);
    setAuthor(document.author);
    setId(document.id);
    setTitle(document.title);
    setYear(document.year);
    setSupervisor(document.supervisor);
    setSummary(document.summary);
    setCategory(document.category);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const resetForm = () => {
    setSelectedDocument(null);
    setSelectedRequestedDocument(null);
    setAuthor("");
    setId("");
    setTitle("");
    setYear("");
    setSupervisor("");
    setSummary("");
    setCategory("");
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
      history.push("/login");
      // Redirect or perform any additional logic after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleAddCountField = async () => {
    try {
      const docRef = await addDoc(collection(db, "Thesis"), { count: 0 });
      console.log("Count field added successfully with ID:", docRef.id);
      setCountAdded(true);
    } catch (error) {
      console.error("Error adding count field:", error);
    }
  };

  return (
    <div className="documents">
      <div className="document-list-users">
        <h2>Document List</h2>
        <div
          className={`table-container ${isTableExpanded ? "expanded" : "collapsed"
            }`}
        >
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>ID</th>
                <th>Supervisor</th>
                <th>Category</th>
                <th>Summary</th>
                <th>Batch</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document, index) => (
                <tr
                  key={document._id}
                  className={
                    index >= 5 && !isTableExpanded ? "collapsed-row" : ""
                  }
                >
                  <td>{document.title}</td>
                  <td>{document.author}</td>
                  <td>{document.id}</td>
                  <td>{document.supervisor}</td>
                  <td>{document.category}</td>
                  <td>{document.summary}</td>
                  <td>{document.year}</td>
                  <td>
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(document)}
                      className="edit"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(document._id)}
                      className="delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>{" "}
          </table>
        </div>

        {!isTableExpanded && documents.length > 5 && (
          <div className="expand-button">
            <button
              className="expand-collapse-button"
              onClick={() => setIsTableExpanded(true)}
            >
              See Full Database
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          </div>
        )}

        {isTableExpanded && (
          <div className="collapse-button">
            <button
              className="expand-collapse-button"
              onClick={() => setIsTableExpanded(false)}
            >
              See Less Database
              <FontAwesomeIcon icon={faChevronUp} />
            </button>
          </div>
        )}
      </div>

      <div className="document-list-request">
        <h2>Request Documents</h2>
        <div
          className={`table-container ${isTableExpanded ? "expanded" : "collapsed"
            }`}
        >
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>ID</th>
                <th>Supervisor</th>
                <th>Category</th>
                <th>Summary</th>
                <th>Batch</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requestDocuments.map((document, index) => (
                <tr
                  key={document._id}
                  className={
                    index >= 5 && !isTableExpanded ? "collapsed-row" : ""
                  }
                >
                  <td>{document.title}</td>
                  <td>{document.author}</td>
                  <td>{document.id}</td>
                  <td>{document.supervisor}</td>
                  <td>{document.category}</td>
                  <td>{document.summary}</td>
                  <td>{document.year}</td>
                  <td>
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEditRequest(document)}
                      className="edit"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(document._id)}
                      className="delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>{" "}
          </table>
        </div>
        {!isTableExpanded && requestDocuments.length > 5 && (
          <div className="expand-button">
            <button
              className="expand-collapse-button"
              onClick={() => setIsTableExpanded(true)}
            >
              See All Requests
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          </div>
        )}

        {isTableExpanded && (
          <div className="collapse-button">
            <button
              className="expand-collapse-button"
              onClick={() => setIsTableExpanded(false)}
            >
              See Less Requests
              <FontAwesomeIcon icon={faChevronUp} />
            </button>
          </div>
        )}
      </div>

      <form ref={formRef} className="fields" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            placeholder="Enter Thesis Title"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label htmlFor="author">Author:</label>
          <input
            placeholder="Enter Author Name"
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <label htmlFor="id">ID:</label>
          <input
            placeholder="Enter Student ID"
            type="number"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <label htmlFor="supervisor">Supervisor:</label>
          <input
            placeholder="Enter Supervisor Name"
            type="text"
            id="supervisor"
            value={supervisor}
            onChange={(e) => setSupervisor(e.target.value)}
            required
          />
          <label htmlFor="category">Category:</label>
          <input
            placeholder="Enter Thesis Category"
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <label htmlFor="year">Batch:</label>
          <input
            placeholder="Enter Batch"
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          <label htmlFor="summary">Summary:</label>
          <textarea
            id="summary"
            placeholder="Enter The Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          ></textarea>
          <input type="file" id="file-input" accept=".pdf" />

          <div className="habijabi">
            {selectedDocument && !selectedRequestedDocument ? (
              <>
                <button type="submit" className="upload">
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="deletereq"
                >
                  Delete
                </button>
              </>
            ) : !selectedDocument && selectedRequestedDocument ? (
              <>
                <button type="submit" className="upload">
                  Approve
                </button>
                <button
                  type="button"
                  onClick={handleDeleteRequest}
                  className="deletereq"
                >
                  Decline
                </button>
              </>
            ) : (
              <button type="submit" className="upload">
                Submit
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="add-document-button">
        <button onClick={resetForm}>Add Document</button>
        {/* <button onClick={handleAddCountField}>Add Count Field</button> */}
        <Link to='/' className="link" >Home</Link>
        <button onClick={handleLogout}>Logout</button>
        {countAdded && <p>Count field added successfully!</p>}
      </div>
    </div>
  );
};

export default DocumentForm;