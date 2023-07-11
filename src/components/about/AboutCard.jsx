import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Heading from "../common/heading/Heading";
import "./about.css";
import { homeAbout } from "../../dummydata";

const AboutCard = () => {
	const aboutHomeRef = useRef(null);
	const leftRowRef = useRef(null);
	const rightRowRef = useRef(null);

	useEffect(() => {
		const observerOptions = {
			root: null,
			rootMargin: "0px",
			threshold: 0.3,
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					leftRowRef.current.classList.add("animate-left");
					rightRowRef.current.classList.add("animate-right");
				} else {
					leftRowRef.current.classList.remove("animate-left");
					rightRowRef.current.classList.remove("animate-right");
				}
			});
		}, observerOptions);

		observer.observe(aboutHomeRef.current);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<section className="aboutHome" ref={aboutHomeRef}>
			<div className="container flexSB">
				<div className="left_row" ref={leftRowRef}>
					<img src="./images/aboutcard1.jpg" alt="" />
				</div>
				<div className="right_row" ref={rightRowRef}>
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
	);
};

export default AboutCard;
