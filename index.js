const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://www.iglesiareformada.com/LloydJones_SDM_1.html");

  const links = await page.$$eval("#element5 a", (items) => {
    const data = [];
    items.forEach((item) => {
      data.push(item.href);
    });
    return data;
  });

  const data = [];

  const contentElement = await page.$("#element3");
  const content = await contentElement.innerText();
  const cleanContent = content.split("\n");
  const setOfContent = new Set(cleanContent);

  const [chapterName, _, title, ...paragraphs] = setOfContent;
  data.push({ chapterName, title, paragraphs });
  await page.close();

  for (const link of links) {
    const page = await browser.newPage();
    await page.goto(link);
    // console.log(link);
    const contentElement = await page.$(
      link.includes("SDM_2.")
        ? "#element8"
        : link.includes("37")
        ? "#element5"
        : "#element3"
    );
    const content = await contentElement.innerText();
    const cleanContent = content.split("\n");
    const setOfContent = new Set(cleanContent);

    const [chapterName, _, title, ...paragraphs] = setOfContent;
    data.push({ chapterName, title, paragraphs });
    await page.close();
  }

  // TODO: Save data to a JSON file

  await browser.close();
})();

