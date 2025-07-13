import axios from "axios";
import moment from "moment";

export const FetchMatchDetails = async (matchId: any, venue: any) => {
  try {
    const response = await axios.post(
      "/api/match-details",
      { matchId: Number(matchId), venue: venue },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const FetchMatchList = async (date: any) => {
  try {
    const response = await axios.post(
      "/api/schedule",
      {
        fromDate: moment(date).format("YYYY-MM-DD"),
        toDate: moment(date).add(1, "days").format("YYYY-MM-DD"),
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
