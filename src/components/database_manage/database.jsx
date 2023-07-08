import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import "./database.css";

const DocumentForm = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [author, setAuthor] = useState("");
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Thesis"), (snapshot) => {
      const fetchedDocuments = snapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));
      setDocuments(fetchedDocuments);
    });

    return unsubscribe;
  }, []);

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
              // Updating existing document
              await setDoc(
                doc(db, "Thesis", selectedDocument._id),
                updatedDocumentData
              );
              console.log("Document updated successfully!");
              alert("Document updated successfully!");

              setDocuments((prevDocuments) =>
                prevDocuments.map((doc) =>
                  doc._id === selectedDocument._id
                    ? { _id: doc._id, ...updatedDocumentData }
                    : doc
                )
              );

              resetForm();
            } else {
              // Adding a new document
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

              setDocuments((prevDocuments) => [...prevDocuments, newDocument]);

              resetForm();
            }
          }
        );
      } else {
        if (selectedDocument) {
          // Updating existing document without changing the file
          await setDoc(doc(db, "Thesis", selectedDocument._id), documentData);
          console.log("Document updated successfully!");
          alert("Document updated successfully!");

          setDocuments((prevDocuments) =>
            prevDocuments.map((doc) =>
              doc._id === selectedDocument._id
                ? { _id: doc._id, ...documentData }
                : doc
            )
          );
        } else {
          // Adding a new document without choosing a file
          const newDocRef = await addDoc(
            collection(db, "Thesis"),
            documentData
          );
          const newDocument = { _id: newDocRef.id, ...documentData };
          console.log("Document added successfully!");
          alert("Document added successfully!");

          setDocuments((prevDocuments) => [...prevDocuments, newDocument]);

          resetForm();
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "Thesis", selectedDocument._id));
      console.log(selectedDocument._id);
      console.log("Document deleted successfully!");
      alert("Document deleted successfully!");

      // Update the state by filtering out the deleted document
      setDocuments((prevDocuments) =>
        prevDocuments.filter((doc) => doc._id !== selectedDocument._id)
      );

      resetForm();
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

  const resetForm = () => {
    setSelectedDocument(null);
    setAuthor("");
    setId("");
    setTitle("");
    setYear("");
    setSupervisor("");
    setSummary("");
    setCategory("");
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // const showTooltip = (event, text) => {
  //   const tooltip = document.createElement("div");
  //   tooltip.className = "tooltip";
  //   tooltip.textContent = text;

  //   const bodyRect = document.body.getBoundingClientRect();
  //   const cellRect = event.target.getBoundingClientRect();
  //   const offsetTop = cellRect.top - bodyRect.top + cellRect.height + 5;
  //   const offsetLeft = cellRect.left - bodyRect.left;

  //   tooltip.style.top = offsetTop + "px";
  //   tooltip.style.left = offsetLeft + "px";

  //   document.body.appendChild(tooltip);
  // };

  // const hideTooltip = () => {
  //   const tooltip = document.querySelector(".tooltip");
  //   if (tooltip) {
  //     tooltip.remove();
  //   }
  // };

  // useEffect(() => {
  //   const cells = document.querySelectorAll(".documents td");
  //   cells.forEach((cell) => {
  //     cell.addEventListener("mouseenter", (event) => {
  //       showTooltip(event, cell.textContent);
  //     });
  //     cell.addEventListener("mouseleave", () => {
  //       hideTooltip();
  //     });
  //   });

  //   return () => {
  //     cells.forEach((cell) => {
  //       cell.removeEventListener("mouseenter", showTooltip);
  //       cell.removeEventListener("mouseleave", hideTooltip);
  //     });
  //   };
  // }, []);

  // const handleUpload = async (e) => {
  //   e.preventDefault();

  // const fileInput = document.getElementById("file-input");
  // const file = fileInput.files[0];

  //   if (file) {
  //     const storageRef = ref(storage, "Data/" + file.name);
  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const progress = Math.round(
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //         );
  //         setUploadProgress(progress);
  //       },
  //       (error) => {
  //         console.error("Error uploading document: ", error);
  //       },
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //           console.log("Document uploaded successfully!");
  //           alert("Document uploaded successfully!");
  //           console.log(documentId);

  //           // Update the state with the download URL of the uploaded document
  //           setUrl(downloadURL);
  //         });
  //       }
  //     );
  //   }
  // };
  return (
    <div className="documents">
      <div className="document-list">
        <h2>Document List</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ID</th>
              <th>Supervisor</th>
              <th>URL</th>
              <th>Category</th>
              <th>Summary</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document._id}>
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
                  {/* <button
                    type="button"
                    onClick={() => handleDelete(document.id)}
                    className="delete"
                  >
                    Delete
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form ref={formRef} className="fields" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <label htmlFor="id">ID:</label>
          <input
            type="number"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <label htmlFor="supervisor">Supervisor:</label>
          <input
            type="text"
            id="supervisor"
            value={supervisor}
            onChange={(e) => setSupervisor(e.target.value)}
            required
          />
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          {/* <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          /> */}
          <label htmlFor="summary">Summary:</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          ></textarea>
          <input type="file" id="file-input" accept=".pdf" />
        </div>

        <button type="submit" className="upload">
          {selectedDocument ? "Update" : "Submit"}
        </button>
        {selectedDocument && (
          <button
            type="button"
            onClick={() => handleDelete(selectedDocument.id)}
            className="delete"
          >
            Delete
          </button>
        )}
        <button type="button" onClick={resetForm} className="reset1">
          Reset
        </button>
      </form>
      <div className="add-document-button">
        <button onClick={resetForm}>Add Document</button>
      </div>
    </div>
  );
};

export default DocumentForm;
