import React from "react";
import { Link } from "react-router-dom";
import Heading from "../common/heading/Heading";
import "./about.css";
import { homeAbout } from "../../dummydata";

const AboutCard = () => {
  return (
    <>
      <section className="aboutHome">
        <div className="container flexSB">
          <div className="left_row">
            <img src="./images/aboutcard1.jpg" alt="" />
          </div>
          <div className="right_row">
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
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutCard;
