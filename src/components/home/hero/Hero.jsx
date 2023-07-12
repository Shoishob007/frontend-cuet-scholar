import React from "react";
import { Link } from "react-router-dom";
import Heading from "../../common/heading/Heading";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Hero.css";
import Header from "../../common/header/Header";
import Head from "../../common/header/Head";

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: false,
  };

  return (
    <>

      <section className="hero">
        <Slider {...settings}>
          <div className="containerhero">
            <div className="row">
              <Heading
                title="Best Online Education Expertise"
                subtitle1="CHANGING EDUCATION"
                subtitle2="CREATING LEGACY"
              />
              <p>
                CUET is historically rich by the count of excellence and
                environment. Here we are to propose you a more fruitful and easier
                way to achieve the standard excellence.
              </p>
              <div className="button">
                <Link to="/signup">
                  <button className="primary-btn clickable" type="submit">
                    REGISTER NOW <i className="fa fa-long-arrow-alt-right"></i>
                  </button>
                </Link>
                <Link to="/documents">
                  <button type="submit">
                    VIEW INSIGHT <i className="fa fa-long-arrow-alt-right"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="containerhero">
            <div className="row">
              <Heading
                title="Discover Research Excellence"
                subtitle1="UNLEASH YOUR CURIOSITY"
                subtitle2="ADVANCE YOUR KNOWLEDGE"
              />
              <p>
                At CUET, we foster a culture of research excellence.
                Join us to discover groundbreaking research papers and advance your knowledge in your field of interest.
              </p>
              <div className="button">
                <Link to="/register">
                  <button className="primary-btn" type="submit">
                    REGISTER NOW <i className="fa fa-long-arrow-alt-right"></i>
                  </button>
                </Link>
                <Link to="/courses">
                  <button type="submit">
                    VIEW RESEARCH PAPERS <i className="fa fa-long-arrow-alt-right"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="containerhero">
            <div className="row">
              <Heading
                title="Explore Innovative Research"
                subtitle1="DRIVE CHANGE"
                subtitle2="SHAPE THE FUTURE"
              />
              <p>
                At CUET, we encourage you to explore innovative research and contribute to shaping the future.
                Join us to delve into cutting-edge research papers and drive positive change in your field.
              </p>
              <div className="button">
                <Link to="/register">
                  <button className="primary-btn" type="submit">
                    REGISTER NOW <i className="fa fa-long-arrow-alt-right"></i>
                  </button>
                </Link>
                <Link to="/courses">
                  <button type="submit">
                    VIEW RESEARCH PAPERS <i className="fa fa-long-arrow-alt-right"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </Slider>
      </section>
      <div className="margin"></div>
    </>
  );
};

export default Hero;
