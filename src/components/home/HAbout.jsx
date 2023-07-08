import React from "react";
import OnlineCourses from "../allcourses/OnlineCourses";
import Heading from "../common/heading/Heading";
import "../allcourses/courses.css";
import Awrapper from "../about/Awrapper";

const HAbout = () => {
  return (
    <>
      <Awrapper />
      <OnlineCourses />
    </>
  );
};

export default HAbout;
