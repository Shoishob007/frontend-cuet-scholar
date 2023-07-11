import React, { useState, useRef } from "react";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import Back from "../common/back/Back";
import "./contact.css";

const Contact = () => {
  const map =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11491.358587474!2d91.9732420705141!3d22.463752349755513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad2fca34ae5549%3A0x35c88a37b3e90e97!2sChittagong%20University%20of%20Engineering%20and%20Technology%20(CUET)!5e0!3m2!1sen!2sbd!4v1685125871465!5m2!1sen!2sbd";

  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [author, setAuthor] = useState("");
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      author: author,
      id: parseInt(id),
      title: title,
      year: parseInt(year),
      supervisor: supervisor,
      summary: summary,
      category: category,
    };

    try {
      // Save the form data to the "Requests" collection in Firestore
      const docRef = await addDoc(collection(db, "Requests"), formData);

      // Upload the PDF file to Firebase Storage
      const fileInput = document.getElementById("file-input");
      const file = fileInput.files[0];
      if (file) {
        const storageRef = ref(storage, "documents/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle upload progress if needed
          },
          (error) => {
            console.error("Error uploading document:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            // Update the form data with the download URL of the uploaded document
            const updatedFormData = { ...formData, url: downloadURL };
            await setDoc(doc(db, "Requests", docRef.id), updatedFormData);
            alert("Form submitted successfully!");
          }
        );
      } else {
        alert("Form submitted without a file");
        resetForm();
      }

      // Clear the form fields after submission
      setAuthor("");
      setId("");
      setTitle("");
      setSupervisor("");
      setCategory("");
      setYear("");
      setSummary("");
      fileInput.value = "";
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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

  return (
    <>
      <Back title="Contact us" />
      <section className="contacts padding">
        <div className="container shadow flexSB">
          <div className="leftcontact row">
            <iframe src={map} title="Location Map" allowFullScreen></iframe>
          </div>
          <div className="rightcontact row">
            <h1>Send us what you want to share</h1>
            <p className="flist-contact">
              We're accepting any publication you want to post. Fill up the
              form:
            </p>

            <form onSubmit={handleSubmit}>
              <div className="flexSB-form">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Your Student ID"
                  required
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>
              <input
                className="alada"
                type="text"
                placeholder="Your Research Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="flexSB-form">
                <input
                  type="text"
                  placeholder="Your Supervisor Name"
                  required
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Category of Your Work"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Year"
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <div className="contact-upload">
                <textarea
                  placeholder="Summary of Your Report"
                  cols="30"
                  rows="10"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                ></textarea>
                <input type="file" id="file-input" accept=".pdf" />
              </div>

              <button className="primary-btn-contact" type="submit">
                Submit
              </button>
            </form>

            <div className="grid-contact">
              <div className="box">
                <h4>ADDRESS:</h4>
                <p>Post code: 4349 P. S. : Raozan Chittagong, Bangladesh</p>
              </div>
              <div className="box">
                <h4 className="boxheader">EMAIL:</h4>
                <a className="boxlink-contact" href="registrar@cuet.ac.bd">
                  registrar@cuet.ac.bd
                </a>
              </div>
              <div className="box">
                <h4>PHONE:</h4>
                <p>
                  Tel: 02-334490102 <br />
                  Fax: 02-334490103
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
