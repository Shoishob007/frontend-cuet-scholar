import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Heading from "../common/heading/Heading";
import "./about.css";
import { homeAbout } from "../../dummydata";

const AboutCard = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    const section = sectionRef.current;
    observer.observe(section);

    return () => {
      observer.unobserve(section);
    };
  }, []);

  return (
    <>
      <section className="aboutHome" ref={sectionRef}>
        <div className="container flexSB">
          <motion.div
            className="left_row"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <img src="./images/aboutcard1.jpg" alt="" />
          </motion.div>
          <motion.div
            className="right_row"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Heading
              subtitle="LEARN EVERYTHING"
              title="Benefits About Our Online Research Platform"
            />
            <div className="items">
              {homeAbout.map((val) => (
                <Link to={val.link} key={val.id} className="black-link">
                  <div className="item flexSB">
                    <div className="img">
                      <img src={val.cover} alt="" />
                    </div>
                    <div className="text">
                      <h2>{val.title}</h2>
                      <p>{val.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutCard;
