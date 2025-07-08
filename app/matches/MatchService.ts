import axios from "axios";

export const FetchMatchDetails = async (matchId: any, venue: any) => {
  const response = await axios.post(
    "/api/match-details",
    { matchId: Number(matchId), venue: venue },
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data;
};
