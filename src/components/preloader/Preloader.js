import React from "react";
import "./Preloader.css";
const Loader = () => {

  return (
    <>
      <div className="overlay"></div>
      <div className="spinner">
        <img src="/images/loader.gif" alt="loader" />
      </div>
    </>
  )
}

export default Loader;