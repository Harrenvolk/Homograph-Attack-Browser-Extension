// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   if (changeInfo.status == 'complete' && tab.active) {
//     console.log("Loading page")
//   }
// })


chrome.webRequest.onBeforeRequest.addListener(
  async function (details) {
    let blocked = true;
    await chrome.storage.sync.get(['redirected'], function (result) {
      console.log("results", result);
      console.log('url', details.url)
      if (result.redirected === details.url) {
        blocked=false;
        chrome.storage.sync.set({ redirected: '' });
      } else if (is_punycode(details.url)) {
        chrome.storage.sync.set({ url: details.url });
        window.open("popup.html", "extension_popup", "width=350,height=450,status=no,scrollbars=no,resizable=no");
      } else {
        blocked = false;
      }
    })
    console.log(blocked);
    return { cancel: blocked };
    
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);


function is_punycode(url) {
  let url_without_protocol = url.split("://");
  url = url_without_protocol[url_without_protocol.length - 1];
  return url.split('/')[0].split('.').filter(section => {
    return section.startsWith('xn--')
  }).length != 0;
}
