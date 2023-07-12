import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./courses.css";
import { online } from "../../dummydata";
import Heading from "../common/heading/Heading";
import CountUp from "react-countup";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const OnlineCourses = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategory] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {

    const fetchDocuments = async () => {
      try {
        const booksRef = collection(db, "Thesis"); // Replace 'db' with your Firestore instance
        const querySnapshot = await getDocs(booksRef);
        const documentData = querySnapshot.docs.map((doc) => doc.data());
        setDocuments(documentData);

        // Count category occurrences
        const counts = documentData.reduce((acc, doc) => {
          const category = doc.category;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        setCategory(counts);
      } catch (error) {
        console.log("Error fetching documents:", error);
      }
    };

    fetchDocuments();
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Adjust threshold as per your requirement
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  const handleObserver = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    });
  };
  console.log(categories);
  return (
    <>
      <section ref={containerRef}
        className={`online ${isVisible ? "animate" : ""}`}>
        <div className="container">
          <Heading subtitle="COURSES" title="Browse According To Your Interest" />
          <div className="content grid3">
            {Object.entries(categories).map(([category, count], i) => (
              <Link to={`/course/${category}`} key={category} className={` ${i % 2 === 0 ? "rowFadeInLeft" : "rowFadeInRight"
                }`}>
                <div className="box1">
                  <div className="img">
                    {/* Replace with appropriate image source */}
                    <img src={online.find(val => val.courseName === category)?.cover} alt="" />
                    <img src={online.find(val => val.courseName === category)?.hoverCover} alt="" className="show" />
                  </div>
                  <h1>{category}</h1>
                  <span>
                    <CountUp end={count} duration={10} /> papers
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default OnlineCourses;
