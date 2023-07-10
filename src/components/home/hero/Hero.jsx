import React from "react";
import { Link } from "react-router-dom";
import Heading from "../../common/heading/Heading";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Hero.css";

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
              <Link to="/register">
                <button className="primary-btn" type="submit">
                  REGISTER NOW <i className="fa fa-long-arrow-alt-right"></i>
                </button>
              </Link>
              <Link to="/courses">
                <button type="submit">
                  VIEW COURSE <i className="fa fa-long-arrow-alt-right"></i>
                </button>
              </Link>
            </div>
          </div>
        </div>
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
              <Link to="/register">
                <button className="primary-btn" type="submit">
                  REGISTER NOW <i className="fa fa-long-arrow-alt-right"></i>
                </button>
              </Link>
              <Link to="/courses">
                <button type="submit">
                  VIEW COURSE <i className="fa fa-long-arrow-alt-right"></i>
                </button>
              </Link>
            </div>
          </div>
        </div>
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
              <Link to="/register">
                <button className="primary-btn" type="submit">
                  REGISTER NOW <i className="fa fa-long-arrow-alt-right"></i>
                </button>
              </Link>
              <Link to="/courses">
                <button type="submit">
                  VIEW COURSE <i className="fa fa-long-arrow-alt-right"></i>
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
