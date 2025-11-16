import { FormatErrorMessage } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
  } catch (error) {
    return Response.json(
      { success: false, error: FormatErrorMessage(error) },
      { status: 500 }
    );
  }
}
