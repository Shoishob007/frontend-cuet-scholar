import React from "react"
import { Link } from "react-router-dom";

const Head = () => {
  return (
    <>
      <section className='head'>
        <div className='container flexSB'>
        <div className='logo'>
        <Link to="/" className="link-style">
          <h1>CUET SCHOLAR</h1>
          <span>ONLINE EDUCATION & RESEARCH</span>
        </Link>
        </div>

          <div className='social'>
            <i className='fab fa-facebook-f icon'></i>
            <i className="fab fa-github icon"></i>
            <i className="fas fa-envelope icon"></i>
            <i className='fab fa-youtube icon'></i>
          </div>
        </div>
      </section>
    </>
  )
}

export default Head;
