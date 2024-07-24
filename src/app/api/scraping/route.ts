import axios from "axios";
import cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get("https://buildfastwithai.com");
    const html = response.data;
    const $ = cheerio.load(html);

    // Example: Scrape all paragraph texts
    const paragraphs = $("p")
      .map((index, element) => $(element).text())
      .get();
    return NextResponse.json({ data: paragraphs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
