chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    console.log("Loading page")
  }
})
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log("Blocked page")
    const blocked = (details.url.indexOf("https://www.xn--80ak6aa92e.com/") != -1)    
    if (blocked) {
      chrome.runtime.sendMessage(message={greeting:"Hi"})
      window.open("popup.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no");
      
    }
    return {cancel:blocked };
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);