import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <>
      <section className="newletter">
        <div className="container flexSB">
          <div className="leftrow">
            <h1>Search Everything, Know Everything</h1>
            <span>"Everything starts from here"</span>
          </div>
          <div className="rightrow">
            <input type="text" placeholder="Search anything" />
            <i className="fa fa-paper-plane"></i>
          </div>
        </div>
      </section>
      <footer>
        <div className="container padding">
          <div className="box logo">
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
          <div className="box link">
            <h3>Explore</h3>
            <ul>
              <li>About Us</li>
              <li>Courses</li>
              <li>Blog</li>
              <li>Contact us</li>
            </ul>
          </div>
          <div className="box link">
            <h3>Quick Links</h3>
            <ul>
              <li>Contact Us</li>
              <li>Terms & Conditions</li>
              <li>Message From Head</li>
              <li>Pulications</li>
            </ul>
          </div>
          <div className="box last">
            <h3>Authority Concern</h3>
            <ul>
              <li>
                <i className="fa fa-map"></i>
                <p>
                  Chittagong University of Engineering and Technology
                  <br />
                  Post code:4349 <br />
                  P. S. : Raozan Chittagong, Bangladesh
                </p>
              </li>
              <li>
                <i className="fa fa-phone-alt"></i>
                Registrar
                <br />
                Tel: 02-334490102 <br />
                Fax: 02-334490103
              </li>
              <li>
                <i className="fa fa-paper-plane"></i>
                https://www.cuet.ac.bd/dept/cse
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
