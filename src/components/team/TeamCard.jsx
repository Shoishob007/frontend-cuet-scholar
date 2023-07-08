import React from "react";
import { team } from "../../dummydata";
import { Link } from "react-router-dom";

const TeamCard = () => {
  return (
    <>
      {team.map((val, i) => (
        <Link to={`/team/${val.name}`} key={i} className="black-link">
          <div className="items_shadow1">
            <div className="img">
              <img src={val.cover} alt="" />
              <div className="overlay">
                <i className="fab fa-github icon small"></i>
                <i className="fas fa-envelope icon small"></i>
              </div>
            </div>
            <div className="detail">
              <h2>{val.name}</h2>
              <p>{val.work}</p>
              <p>
                {" "}
                <span
                  role="img"
                  aria-label="phone-icon"
                  style={{ color: "black" }}
                >
                  &#9742;
                </span>{" "}
                {val.number}
              </p>
              <p>
                <span
                  role="img"
                  aria-label="email-icon"
                  style={{ color: "black" }}
                >
                  ✉️
                </span>{" "}
                {val.email}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default TeamCard;
