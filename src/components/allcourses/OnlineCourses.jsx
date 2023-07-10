import React from "react";
import { Link } from "react-router-dom";
import "./courses.css";
import { online } from "../../dummydata";
import Heading from "../common/heading/Heading";
import CountUp from "react-countup";

const OnlineCourses = () => {
  return (
    <>
      <section className="online">
        <div className="container">
          <Heading
            subtitle="COURSES"
            title="Browse According To Your Interest"
          />
          <div className="content grid3">
            {online.map((val, i) => (
              <Link to={`/course/${val.courseName}`} key={i}>
                <div className="box1">
                  <div className="img">
                    <img src={val.cover} alt="" />
                    <img src={val.hoverCover} alt="" className="show" />
                  </div>
                  <h1>{val.courseName}</h1>
                  <span><CountUp end={val.course} duration={5}/>papers</span>
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
