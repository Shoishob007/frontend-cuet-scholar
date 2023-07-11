import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./footer.css";

const Footer = () => {
  const [click, setClick] = useState(false);
  const [keyword, setKeyword] = useState("");
  const history = useHistory();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim() !== "") {
      history.push(`/search-results?keyword=${keyword}`);
    } else {
      alert("Please enter a search keyword");
    }
  };

  return (
    <>
      <section className="newletter">
        <div className="container_flexSB">
          <div className="leftrow">
            <h1>Search Everything, Know Everything</h1>
            <span>"Everything starts from here"</span>
          </div>
          <div className="rightrow">
            <form className="rr" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search anything"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <i className="fa fa-paper-plane" type="submit"></i>
            </form>
          </div>
        </div>
      </section>
      <footer>
        <div className="container padding">
          <div className="box logo">
            <div className="widthlogo">
              <h1>CUET SCHOLAR</h1>
              <span>ONLINE EDUCATION & RESEARCH</span>
              <p>
                An approach to help students of CSE Dept. with all the published
                and undergrad thesis and project works
              </p>

              <i className="fab fa-facebook-f icon"></i>
              <i className="fab fa-twitter icon"></i>
              <i className="fab fa-instagram icon"></i>
            </div>
          </div>
          <div className="box link">
            <h3>Explore</h3>
            <div className="widthlink2">
              <ul>
                <li className="flist">About Us</li>
                <li className="flist">Courses</li>
                <li className="flist">Blog</li>
                <li className="flist">Contact us</li>
              </ul>
            </div>
          </div>
          <div className="box link">
            <h3>Quick Links</h3>
            <div className="widthlink1">
              <ul>
                <li className="flist">Contact Us</li>
                <li className="flist">Terms & Conditions</li>
                <li className="flist">Message From Head</li>
                <li className="flist">Pulications</li>
              </ul>
            </div>
          </div>
          <div className="box last">
            <h3>Authority Concern</h3>
            <ul>
              <li>
                <i className="fa fa-map"></i>
                <p className="flist">
                  Chittagong University of Engineering and Technology
                  <br />
                  Post code:4349 <br />
                  P. S. : Raozan Chittagong, Bangladesh
                </p>
              </li>
              <li>
                <i className="fa fa-phone-alt"></i>
                <p className="flist">
                  Registrar
                  <br />
                  Tel: 02-334490102 <br />
                  Fax: 02-334490103
                </p>
              </li>
              <li>
                <i className="fa fa-paper-plane"></i>
                <a
                  href="https://www.cuet.ac.bd/dept/cse"
                  className="lastlink"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://www.cuet.ac.bd/dept/cse
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="legal">
        <p>© Copyright Chittagong University of Engineering & Technology</p>
      </div>
    </>
  );
};

export default Footer;
