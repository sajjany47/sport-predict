import { FormatErrorMessage } from "@/lib/utils";
import moment from "moment";
import { CricBuzzList } from "./CricBuzzList";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fromDate = body.fromDate
      ? moment(body.fromDate).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");
    const toDate = body.toDate
      ? moment(body.toDate).format("YYYY-MM-DD")
      : moment().add(1, "days").format("YYYY-MM-DD");

    const advanceCricketList = await CricBuzzList(toDate);

    const modifyResult = advanceCricketList.map((item: any) => ({
      ...item,
      status:
        item.startTime > moment().format("DD MMM YYYY, HH:mm")
          ? "LIVE"
          : "NOT_STARTED",
    }));

    return Response.json(
      {
        data: modifyResult,
        date: toDate,
        success: true,
        message: "Schedule fetched successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { success: false, error: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
}
