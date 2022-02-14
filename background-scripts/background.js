// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   if (changeInfo.status == 'complete' && tab.active) {
//     console.log("Loading page")
//   }
// })


chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    let blocked=true;
    if(is_punycode(details.url)) {
      chrome.storage.sync.set({url: details.url});
      window.open("popup.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no");
    } else {
      blocked=false;
    }
    return { cancel: blocked };
  },
  { urls: ["<all_urls>"]  },
  ["blocking"]
);


function is_punycode(url) {
  let url_without_protocol = url.split("://");
  url = url_without_protocol[url_without_protocol.length-1];
  return url.split('.').filter(section => {
    return section.startsWith('xn--')
  }).length != 0;
}