/* Function to get version of Chrome. https://stackoverflow.com/a/4900484 */
function getMajorVerison() {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? parseInt(raw[2], 10) : false;
}

/* Configure WebRTC leak prevention default setting, depending on Chrome version. */
chrome.storage.local.get(null, (items) => {
  /* Use webRTCIPHandlingPolicy in newer versions of Chrome. */
  if (getMajorVerison() > 47) {
    if (items.rtcIPHandling == undefined) {
      try {
        chrome.storage.local.set({
          rtcIPHandling: 'default_public_interface_only',
        }, () => {
          chrome.privacy.network.webRTCIPHandlingPolicy.set({
            value: 'default_public_interface_only',
          });
        });
      } catch (e) {
        console.log(`Error: ${e.message}`);
      }
    }
  }
  /* Use webRTCMultipleRoutesEnabled in older versions of Chrome. */
  else if (getMajorVerison() > 41 && getMajorVerison() < 48) {
    if (items.rtcMultipleRoutes == undefined) {
      try {
        chrome.storage.local.set({
          rtcMultipleRoutes: true,
        }, () => {
          chrome.privacy.network.webRTCMultipleRoutesEnabled.set({
            value: false,
            scope: 'regular',
          });
        });
      } catch (e) {
        console.log(`Error: ${e.message}`);
      }
    }
  }
});

/* Open options page on install. */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason == 'install') {
    chrome.runtime.openOptionsPage();
  }
});

/* Open options page on toolbar icon click. */
chrome.browserAction.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});