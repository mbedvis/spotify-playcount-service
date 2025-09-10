const express = require("express");
const { chromium } = require("playwright");

const app = express();
const PORT = process.env.PORT || 3000;

// Secret apsauga (WordPress turės nurodyti tą patį key)
const SECRET = process.env.SECRET || "changeme";

// GET /spotify-track-count?id=TRACKID&key=SECRET
app.get("/spotify-track-count", async (req, res) => {
  const { id, key } = req.query;

  if (!id || key !== SECRET) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`https://open.spotify.com/track/${id}`, {
      waitUntil: "domcontentloaded",
    });

    // Laukiam, kol tekstas su grojimų skaičiumi bus matomas
    await page.waitForSelector("section span", { timeout: 10000 });

    // Ieškome visų span elementų, renkam tik skaičių
    const spans = await page.$$eval("span", els =>
      els.map(el => el.textContent.trim())
    );

    let streams = null;
    for (const txt of spans) {
      if (/^\d[\d\s.,]*$/.test(txt)) {
        const num = parseInt(txt.replace(/[^\d]/g, ""), 10);
        if (num > 1000) {
          streams = num;
          break;
        }
      }
    }

    await browser.close();

    if (!streams) {
      return res.json({ ok: false, error: "Not found" });
    }

    res.json({ ok: true, streams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to fetch" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
