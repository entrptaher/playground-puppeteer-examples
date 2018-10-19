var puppeteer = require("puppeteer");

async function runScraper() {
  let browser = {};
  let page = {};
  const url = "http://localhost:8080";
  const selectors = {
    header: ".display-3",
    next: ".next"
  };

  async function navigate() {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.goto(url);
  }

  async function getTargets() {
    const next = await page.evaluateHandle(
      (selectors, iframe) => {
        return iframe.querySelector(selectors.next);
      },
      selectors,
      iframe
    );

    const header = await page.evaluateHandle(
      (selectors, iframe) => {
        return iframe.querySelector(selectors.header);
      },
      selectors,
      iframe
    );
    return { iframe, next, header };
  }

  async function scrapeData({ header }) {
    return page.evaluate(target => {
      const text = target.innerText;
      target.remove();
      return text;
    }, header);
  }

  async function paginate({ next }) {
    await page.evaluate(target => {
      target.click();
    }, next);
  }

  async function loop() {
    const targets = await getTargets();
    const title = await scrapeData(targets);
    await page.waitFor(5000);
    await paginate(targets);
    return title;
  }

  await navigate();
  const page1 = await loop();
  console.log({ page1 });
  const page2 = await loop();
  const page3 = await loop();
  console.log(page1, page2, page3);
}

runScraper();