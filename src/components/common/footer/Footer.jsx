import React from "react";
import "./footer.css";
import ScrollToTop from "react-scroll-to-top";

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
      <ScrollToTop
        smooth
        height="16px"
        width="14px"
        className="scroll-to-top scroll-to-top--home1"
        viewBox="0 0 448 512"
        svgPath="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3V320c0 17.7 14.3 32 32 32s32-14.3 32-32V109.3l73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 53 43 96 96 96H352c53 0 96-43 96-96V352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V352z"
      />
      <div className="legal">
        <p>© Copyright Chittagong University of Engineering & Technology</p>
      </div>
    </>
  );
};

export default Footer;
