const puppeteer = require('puppeteer');

async function runScraper() {
  let browser = {};
  let page = {};
  const url = 'http://localhost:8080';

  // open the page and wait
  async function navigate() {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.goto(url);
  }

  async function scrapeData() {
    const headerSel = 'h1';
    // wait for element
    await page.waitFor(headerSel);
    return page.evaluate((selector) => {
      const target = document.querySelector(selector);

      // get the data
      const text = target.innerText;

      // remove element so the waiting function works
      target.remove();
      return text;
    }, headerSel);
  }

  // this is a sample concept of pagination
  // it will vary from page to page because not all site have same type of pagination

  async function paginate() {
    // manually check if the next button is available or not
    const nextBtnDisabled = !!(await page.$('.next.disabled'));
    if (!nextBtnDisabled) {
      // since it's not disable, click it
      await page.evaluate(() => document.querySelector('.next').click());

      // just some random waiting function
      await page.waitFor(100);
      return true;
    }
    return { nextBtnDisabled };
  }

  /**
   * Scraping Logic
   */
  await navigate();

  // Scrape 5 pages
  for (const pageNum of [...Array(5).keys()]) {
    const title = await scrapeData();
    console.log(pageNum + 1, title);
    await paginate();
  }
}

runScraper();
