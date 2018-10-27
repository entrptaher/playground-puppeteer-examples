const puppeteer = require('puppeteer');

async function helloWorld({ disableRtc }) {
  // all kind of config to pass to browser
  const launchConfig = {
    args: [],
  };

  if (disableRtc) {
    // disable headless for loading extensions
    launchConfig.headless = false;

    // load webrtc related extension
    const extensionPath = 'extensions/webrtc';
    launchConfig.args.push(`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`);
  }
  const browser = await puppeteer.launch(launchConfig);
  const page = await browser.newPage();

  // test it with browserleaks.com
  await page.goto('https://browserleaks.com/webrtc');

  // psss: just me hiding my details
  await page.evaluate(() => $('#rtc-ipv4 a').css('-webkit-filter', 'blur(5px)'));

  // taking evidence
  await page.screenshot({ path: `screenshots/browserleaks_webrtc_${disableRtc}.png` });

  await browser.close();
}

helloWorld({ disableRtc: false });
helloWorld({ disableRtc: true });
