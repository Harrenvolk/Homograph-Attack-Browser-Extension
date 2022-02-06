chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
      chrome.action.setBadgeText(details={tabId,text:"Hi"})
    }
  })