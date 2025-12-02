import { GetHtml } from "@/lib/utils";
import moment from "moment-timezone";

const extractKeyObject = (text: any, key: any) => {
  if (!text || !key) return null;

  // find the key (try with quotes)
  const keyPatterns = [`"${key}"`, `'${key}'`, key];
  let keyPos = -1;
  let foundPattern = null;
  for (const p of keyPatterns) {
    const idx = text.indexOf(p);
    if (idx !== -1) {
      keyPos = idx;
      foundPattern = p;
      break;
    }
  }
  if (keyPos === -1) return null;

  // find the first '{' after the key (skip whitespace and colon)
  let braceStart = text.indexOf("{", keyPos);
  if (braceStart === -1) return null;

  // walk forward to find matching closing brace while respecting strings and escapes
  let i = braceStart;
  let depth = 0;
  let inString = false;
  let stringChar = null; // " or '
  let prevChar = null;

  while (i < text.length) {
    const ch = text[i];

    if (!inString) {
      if (ch === '"' || ch === "'") {
        inString = true;
        stringChar = ch;
      } else if (ch === "{") {
        depth += 1;
      } else if (ch === "}") {
        depth -= 1;
        if (depth === 0) {
          // include this closing brace and stop
          const jsonText = text.slice(braceStart, i + 1);

          // attempt to clean typical issues (optional)
          let cleaned = jsonText
            // remove stray control characters
            .replace(/\u0000/g, "")
            // sometimes there are trailing commas before closing braces/arrays -> remove them
            .replace(/,\s*([}\]])/g, "$1");

          try {
            return JSON.parse(cleaned);
          } catch (e) {
            // second attempt: try loosening quotes (replace single quotes to double inside)
            try {
              const alt = cleaned.replace(
                /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
                '"$2":'
              );
              return JSON.parse(alt);
            } catch (e2) {
              // failed to parse
              console.error("parse failed for extracted scheduleData:", e, e2);
              return null;
            }
          }
        }
      }
    } else {
      // inside a string
      if (ch === stringChar && prevChar !== "\\") {
        inString = false;
        stringChar = null;
      }
    }

    prevChar = ch;
    i += 1;
  }

  // no match found
  return null;
};
export async function extractAndTransformSchedule(html: string): Promise<any> {
  const $: any = await GetHtml(html);
  let scheduleData: any = null;

  // Robust regex for finding a balanced JSON object after "scheduleData":
  const scheduleDataRegex =
    /"scheduleData":\s*({(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*})/;

  $("script").each((index: any, element: any) => {
    const scriptContent = $(element).html();

    if (scriptContent && scriptContent.includes("matchScheduleMap")) {
      try {
        // Look for the array pattern
        const arrayMatch = scriptContent.match(
          /self\.__next_f\.push\(\[1,\s*'([\s\S]*?)'\]\]/
        );

        if (arrayMatch && arrayMatch[1]) {
          let dataString = arrayMatch[1];

          // **CRITICAL FIX: Unescape the string content**
          // If the string is triple-escaped, unescape it once to get a usable JSON string.
          // This uses JSON.parse on the string literal.
          try {
            // The outer quotes ('...') are removed by the regex.
            // The content inside is often a JSON string literal which needs to be parsed
            // to resolve the heavy escaping (e.g., "\\\" becomes \"").
            dataString = JSON.parse(`"${dataString}"`);
          } catch (e) {
            console.log(
              "Could not unescape dataString via JSON.parse. Proceeding with raw string."
            );
          }

          // Find scheduleData using the robust regex
          const scheduleDataMatch = dataString.match(scheduleDataRegex);

          if (scheduleDataMatch && scheduleDataMatch[1]) {
            try {
              // scheduleDataMatch[1] is the JSON object string (e.g., "{...}")
              scheduleData = { scheduleData: JSON.parse(scheduleDataMatch[1]) };
              // Exit the loop once data is found
              return false;
            } catch (parseError) {
              console.error(
                "Failed to parse scheduleData JSON object:",
                parseError
              );
            }
          }
        }
      } catch (error) {
        console.error("Error extracting schedule data:", error);
      }
    }
  });

  // If data was found, no need to run the complex second attempt.
  if (scheduleData) {
    console.log("Schedule data found:", scheduleData ? "Yes" : "No");
  } else {
    console.log(
      "No schedule data found with primary method. Trying fallback..."
    );

    // Your existing, slightly more complex fallback method (second attempt)
    // ... (keep this block for maximum robustness if the first fix doesn't work 100% of the time)
    $("script").each((index: any, element: any) => {
      const scriptContent = $(element).html();

      if (scriptContent && scriptContent.includes("matchScheduleMap")) {
        // Try to extract the entire array and parse it
        const fullArrayMatch = scriptContent.match(
          /self\.__next_f\.push\((\[[\s\S]*?\])\)/
        );

        if (fullArrayMatch && fullArrayMatch[1]) {
          try {
            // Replace single quotes with double quotes for JSON parsing
            const arrayStr = fullArrayMatch[1]
              .replace(/'/g, '"')
              .replace(/\\"/g, '"')
              .replace(/\\\\/g, "\\");

            const dsfdsfdgfdgfrg = extractKeyObject(arrayStr, "scheduleData");

            scheduleData = dsfdsfdgfdgfrg;

            // const parsedArray = JSON.parse(arrayStr);

            // if (parsedArray.length >= 2) {
            //   const dataString = parsedArray[1];

            //   // Use the robust regex to find scheduleData
            //   const match = dataString.match(scheduleDataRegex);

            //   if (match && match[1]) {
            //     try {
            //       scheduleData = { scheduleData: JSON.parse(match[1]) };
            //       return false; // Exit once found
            //     } catch (e) {
            //       console.error("Final parse attempt failed");
            //     }
            //   }
            // }
          } catch (e) {
            console.error("Could not parse full array");
          }
        }
      }
    });
  }

  // Debug: Log if we found data
  console.log("Schedule data found:", scheduleData ? "Yes" : "No");

  if (!scheduleData || !scheduleData || !scheduleData.matchScheduleMap) {
    console.log("No valid schedule data structure found");
    return [];
  }

  //   // Rest of your transformation code...
  const matches: any[] = [];
  // ... (transformation logic is fine and omitted for brevity)
  scheduleData.matchScheduleMap.forEach((day: any) => {
    const scheduleAdWrapper = day.scheduleAdWrapper;

    if (!scheduleAdWrapper || !scheduleAdWrapper.matchScheduleList) {
      return;
    }

    scheduleAdWrapper.matchScheduleList.forEach((series: any) => {
      if (!series.matchInfo) {
        return;
      }

      series.matchInfo.forEach((match: any) => {
        const venue = match.venueInfo || {};
        const timeZone = venue.timezone || "+00:00";

        const makeTeam = (team: any): any => ({
          squadId: team.teamId,
          teamName: team.teamName,
          teamShortName: team.teamSName,
          teamFlagUrl: `https://static.cricbuzz.com/a/img/v1/25x18/i1/c${
            team.imageId
          }/${team.teamName.toLowerCase().trim().replace(/\s+/g, "-")}.jpg`,
          isWinner: null,
          color: null,
          cricketScore: null,
          squadNo: null,
        });

        const formatDate = (ms: string | number | null): string | null => {
          if (!ms) return null;
          try {
            // Use moment.utc() and then tz() to correctly handle the timestamp
            return moment
              .utc(Number(ms))
              .tz(timeZone)
              .format("DD MMM YYYY, HH:mm");
          } catch (error) {
            console.error("Date formatting error:", error);
            return null;
          }
        };

        const targetMatch: any = {
          tourId: series.seriesId ?? null,
          tourName: series.seriesName ?? null,
          matchId: match.matchId,
          matchName: null,
          matchDescription: match.matchDesc ?? null,
          originalStartTime: String(match.startDate),
          startTime: formatDate(match.startDate),
          endTime: formatDate(match.endDate),
          status: null,
          venue: {
            ground: venue.ground ?? null,
            city: venue.city ?? null,
            country: venue.country ?? null,
            timezone: venue.timezone ?? null,
          },
          tour: series.seriesCategory ?? null,
          format: series.seriesName.toLowerCase().includes("t10")
            ? "T10"
            : match.matchFormat ?? null,
          sport: "cricket",
          teams: [makeTeam(match.team1), makeTeam(match.team2)],
        };

        matches.push(targetMatch);
      });
    });
  });

  return matches;
}
