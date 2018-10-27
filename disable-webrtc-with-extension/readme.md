**Original Post: https://stackoverflow.com/a/53021396/6161265**

Here are steps to prevent webrtc IP leak on puppeteer `version 1.9.0`.

## Note:

- Background Pages are available for chrome extensions. You won't probably find a background page on a headless browser.
- Chrome headless does not support extensions. We must use `headless: false`.

## Solution: WebRTC Leak Prevent

Clone the git repo to some local folder (ie: `extensions/webrtc`),

    git clone https://github.com/aghorler/WebRTC-Leak-Prevent extensions/webrtc

Use it inside your code,

    const puppeteer = require('puppeteer');

    async function helloWorld() {
      // load the extension
      const extensionPath = 'extensions/webrtc';
      const browser = await puppeteer.launch({
        // must be non-headless
        headless: false,
        args: [
          `--disable-extensions-except=${extensionPath}`,
          `--load-extension=${extensionPath}`,
        ],
      });

      const page = await browser.newPage();

      // test it with browserleaks.com
      await page.goto('https://browserleaks.com/webrtc');

      // psss: just me hiding my details
      await page.evaluate(() => $('#rtc-ipv4 a').css('-webkit-filter', 'blur(5px)'));

      // taking evidence
      await page.screenshot({ path: 'screenshots/browserleaks.png' });

      await browser.close();
    }

    helloWorld();

# Result:

Before:
[![enter image description here][1]][1]

After:
[![enter image description here][2]][2]

[1]: screenshots/browserleaks_webrtc_false.png
[2]: screenshots/browserleaks_webrtc_true.png
