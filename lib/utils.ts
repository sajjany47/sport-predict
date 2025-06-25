import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { load } from "cheerio";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GetHtml = async (url: string) => {
  const response = await axios.get(url);
  const data = response.data;
  const $ = load(data);
  return $;
};

export const GetPSearchList = async (searchTerm: string) => {
  const url = "https://advancecricket.com/player-load";
  const formData = new FormData();

  formData.append("text", searchTerm);

  try {
    const { data } = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const $ = load(data);
    const playerList: { name: string; url: string }[] = [];

    $("a[title$='Stats']").each((_, el) => {
      const name = $(el).find("b.card-title").text().trim();
      const href = $(el).attr("href");

      if (name && href) {
        playerList.push({
          name,
          url: href.startsWith("http")
            ? href
            : `https://advancecricket.com${href}`,
        });
      }
    });
    // if (type) {
    //   console.log(playerList);
    // }
    if (playerList.length === 0) {
      throw new Error("No players found");
    }
    return playerList[0]; // Return the first player found
  } catch (error) {
    console.error(
      `Error fetching player search list for ${searchTerm}:`,
      error
    );
    return [];
  }
};

export const GetStadiumList = async (searchTerm: string) => {
  const url = "https://advancecricket.com/player-load";
  const formData = new FormData();

  formData.append("stadium", searchTerm);

  try {
    const { data } = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const $ = load(data);
    const stadiums: { name: string; url: string }[] = [];

    $(".row.row-cols-1.row-cols-lg-3 .col").each((index, element) => {
      const name = $(element).find("b.card-title").text().trim();
      const url = $(element).find("a").attr("href");

      if (name && url) {
        stadiums.push({ name, url });
      }
    });
    if (stadiums.length === 0) {
      throw new Error("No stadium found");
    }
    return stadiums[0]; // Return the first player found
  } catch (error) {
    console.error(
      `Error fetching player search list for ${searchTerm}:`,
      error
    );
    return [];
  }
};
