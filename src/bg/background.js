// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//   "refreshInterval": "60",
//   "maxPrice": "100000"
// });

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    chrome.pageAction.show(sender.tab.id);
    if (request.player) {
      sendResponse({ player: request.player + " is a great guy" });
    }
    sendResponse({ confused: request });
  });