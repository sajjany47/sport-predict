import moment from "moment";

export const getNewAnalysis = async (data: any) => {
  const matchOver = (format: any) => {
    return format === "T20"
      ? 20
      : format === "ODI"
      ? 50
      : format === "T10"
      ? 10
      : format === "TEST"
      ? 90
      : 16.4;
  };
  const playerScoreCalculate = (player: any) => {
    const CalculateFantasy = (fantasy: any[]) => {
      const filterLast2YearsData = fantasy.filter((item: any) =>
        moment(item.date, "DD/MM/YY").isAfter(moment().subtract(2, "years"))
      );

      const totalRunsPoint = filterLast2YearsData.reduce(
        (acc, curr) => acc + Number(curr.bat),
        0
      );
      const totalBowlPoint = filterLast2YearsData.reduce(
        (acc, curr) => acc + Number(curr.bowl),
        0
      );
      const avgRunsPoint = Number(
        ((totalRunsPoint / filterLast2YearsData.length) * 0.9 || 0).toFixed(2)
      );
      const avgBowlPoint = Number(
        ((totalBowlPoint / filterLast2YearsData.length) * 0.9 || 0).toFixed(2)
      );
      return { avgRunsPoint, avgBowlPoint };
    };
    const fantasyStats = CalculateFantasy(player.fantasyPoints || []);
    return { ...fantasyStats };
  };

  const team1 = data.squadList[0];
  const team2 = data.squadList[2];

  const team1Players = playerScoreCalculate(team1.benchPlayer[1]);
  console.log(team1Players);
};
