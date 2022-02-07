chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    console.log("Loading page")
  }
})
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log("Blocked page")
    return {cancel: details.url.indexOf("https://www.xn--80ak6aa92e.com/") != -1};
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);