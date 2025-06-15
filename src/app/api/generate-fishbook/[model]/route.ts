import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import type { Mood } from "@/components/pages/data/types";
import { generateFishBookHtml } from "@/components/lib/generateFishBookHtml"; // ✅ Import here

const moodLoaders: Record<
  string,
  { loader: () => Promise<{ default: Mood[] }> }
> = {
  fishcarouseldynamic: {
    loader: () => import("@/components/pages/data/moods/blue"),
  },
  redfishcarousel: {
    loader: () => import("@/components/pages/data/moods/red"),
  },
  "diko-german": {
    loader: () => import("@/components/pages/data/moods/diko-german"),
  },
  "lilit-german": {
    loader: () => import("@/components/pages/data/moods/lilit-german"),
  },
  "ani-armenian": {
    loader: () => import("@/components/pages/data/moods/ani-armenian"),
  },
};

export async function GET(req: NextRequest) {
  const model = req.nextUrl.pathname.split("/").pop()?.toLowerCase();
  const entry = model ? moodLoaders[model] : undefined;

  if (!entry) {
    return NextResponse.json(
      { error: "Fish model not found" },
      { status: 404 }
    );
  }

  // 1️⃣ Load moods
  const moods = (await entry.loader()).default;

  // 2️⃣ Generate HTML using your new function
  const html = generateFishBookHtml(moods, model || "fishbook");

  // 3️⃣ Render HTML to PDF using Puppeteer
  const browser = await puppeteer.launch({
    headless: "new", // use 'new' for latest Puppeteer compatibility
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    landscape: true,
    printBackground: true,
  });

  await browser.close();

  // 4️⃣ Return PDF response
  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${model}-fishbook.pdf"`,
    },
  });
}
