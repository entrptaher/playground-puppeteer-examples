/* Function to get version of Chrome. https://stackoverflow.com/a/4900484 */
function getMajorVerison() {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? parseInt(raw[2], 10) : false;
}

/* Function to determine if extension is allowed to run in Incognito mode. */
function incognitoAllowedCheck() {
  chrome.extension.isAllowedIncognitoAccess((state) => {
    const incognitoAllowed = document.getElementById('incognitoAllowed');
    const incognitoDisallowed = document.getElementById('incognitoDisallowed');

    if (state) {
      incognitoDisallowed.style.display = 'none';
    } else {
      incognitoAllowed.style.display = 'none';
    }
  });
}

/* Function to display setting page content, depending on Chrome version. */
function displayContent() {
  const divContent = document.getElementById('content');
  const divNew = document.getElementById('new');
  const divLegacy = document.getElementById('legacy');
  const pLegacyProxy = document.getElementById('legacyProxy');
  const divFail = document.getElementById('fail');
  const divIncognito = document.getElementById('incognito');
  const divApply = document.getElementById('applyButton');

  if (getMajorVerison() > 47) {
    divLegacy.style.display = 'none';
    divFail.style.display = 'none';
    incognitoAllowedCheck();
  } else if (getMajorVerison() > 41 && getMajorVerison() < 47) {
    divNew.style.display = 'none';
    divFail.style.display = 'none';
    pLegacyProxy.style.display = 'none';
    incognitoAllowedCheck();
  } else if (getMajorVerison() == 47) {
    divNew.style.display = 'none';
    divFail.style.display = 'none';
    incognitoAllowedCheck();
  } else {
    divContent.style.display = 'none';
    divIncognito.style.display = 'none';
    divApply.style.display = 'none';
  }
}

/* Function to save and set options. */
function saveOptions() {
  if (getMajorVerison() > 47) {
    const policy = document.getElementById('policy').value;
    chrome.storage.local.set({
      rtcIPHandling: policy,
    }, () => {
      try {
        chrome.storage.local.get('rtcIPHandling', (items) => {
          chrome.privacy.network.webRTCIPHandlingPolicy.set({
            value: items.rtcIPHandling,
          });
        });
      } catch (e) {
        console.log(`Error: ${e.message}`);
      }
    });
  } else if (getMajorVerison() > 41 && getMajorVerison() < 47) {
    var rtcMultipleRoutes = document.getElementById('multipleroutes').checked;
    chrome.storage.local.set({
      rtcMultipleRoutes,
    }, () => {
      try {
        chrome.storage.local.get('rtcMultipleRoutes', (items) => {
          chrome.privacy.network.webRTCMultipleRoutesEnabled.set({
            value: !items.rtcMultipleRoutes,
            scope: 'regular',
          });
        });
      } catch (e) {
        console.log(`Error: ${e.message}`);
      }
    });
  } else if (getMajorVerison() == 47) {
    const nonProxiedUDP = document.getElementById('proxy').checked;
    var rtcMultipleRoutes = document.getElementById('multipleroutes').checked;
    chrome.storage.local.set({
      nonProxiedUDP,
      rtcMultipleRoutes,
    }, () => {
      try {
        chrome.storage.local.get(null, (items) => {
          chrome.privacy.network.webRTCMultipleRoutesEnabled.set({
            value: !items.rtcMultipleRoutes,
            scope: 'regular',
          });
          chrome.privacy.network.webRTCNonProxiedUdpEnabled.set({
            value: !items.nonProxiedUDP,
            scope: 'regular',
          });
        });
      } catch (e) {
        console.log(`Error: ${e.message}`);
      }
    });
  }
}

/* Function to restore options. */
function restoreOptions() {
  if (getMajorVerison() > 47) {
    chrome.storage.local.get({
      rtcIPHandling: 'default_public_interface_only',
    }, (items) => {
      document.getElementById('policy').value = items.rtcIPHandling;
    });
  } else if (getMajorVerison() > 41 && getMajorVerison() < 47) {
    chrome.storage.local.get({
      rtcMultipleRoutes: true,
    }, (items) => {
      document.getElementById('multipleroutes').checked = items.rtcMultipleRoutes;
    });
  } else if (getMajorVerison() == 47) {
    chrome.storage.local.get({
      nonProxiedUDP: false,
      rtcMultipleRoutes: true,
    }, (items) => {
      document.getElementById('proxy').checked = items.nonProxiedUDP;
      document.getElementById('multipleroutes').checked = items.rtcMultipleRoutes;
    });
  }
}

/* Event listeners. */
document.addEventListener('DOMContentLoaded', displayContent);
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('policy').addEventListener('change', saveOptions);
document.getElementById('proxy').addEventListener('change', saveOptions);
document.getElementById('multipleroutes').addEventListener('change', saveOptions);
