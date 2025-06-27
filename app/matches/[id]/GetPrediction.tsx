import moment from "moment";
import React from "react";

const GetPrediction = (data: any) => {
  // stadium Last 10 matches --------
  // Pitch Type---------------
  // Avg Score---------------
  // Wheather Type----------
  // Temprature-------------
  // Both Team Recent Match-----
  // H2H stats------------
  // H2H Recent Match -------
  // Batting First Win-----
  // Bowling First Win----
  // Last 20 Match Fantasy Point----
  // Last 20 Match Batting Form-----
  // Last 20 Match Bowling Form-----
  // Carrier Overall Bowling Stats--
  // Carrier Overall Batting Stats--
  // Player Against Stadium Batting Stats----
  // Player Against Stadium Bowling Stats----
  // Player Against Team Batting Stats----
  // Player Against Team Bowling Stats----
  const calculateAverageScore = () => {
    const apiAvgScore =
      Number(data.overview.groundAndWheather.avgScore) ?? null;
    const stadiumStats = data.stadiumStats.filter((date: any) => {
      return (
        moment(date.date, "DD/MM/YY").isSameOrBefore(moment(), "day") &&
        moment(date.date, "DD/MM/YY").isSameOrAfter(
          moment().subtract(2, "years"),
          "day"
        )
      );
    });
  };

  return <div>GetPrediction</div>;
};

export default GetPrediction;
