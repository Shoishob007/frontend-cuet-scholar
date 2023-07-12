import React from "react";
import CountUp from "react-countup";
import { awrapper } from "../../dummydata";

const Awrapper = () => {
  return (
    <section className='awrapper'>
      <div className='container grid'>
        {awrapper.map((val, index) => {
          const dataWithoutComma = val.data.replace(/,/g, ""); // Remove comma from val.data
          const formattedData = `${dataWithoutComma.charAt(0) === "+" ? "+" : ""}${dataWithoutComma}`; // Add "+" sign if present

          return (
            <div className='box flex' key={index}>
              <div className='img'>
                <img src={val.cover} alt='' />
              </div>
              <div className='text'>
                <h1>
                  {formattedData.charAt(0) === "+" ? formattedData : ""}
                  <CountUp end={parseInt(dataWithoutComma)} duration={10} />
                  +
                </h1>
                <h3>{val.title}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Awrapper;
