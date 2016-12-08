// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//   "refreshInterval": "60",
//   "maxPrice": "100000"
// });



//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.player) {
      chrome.pageAction.show(sender.tab.id);
      sendResponse({ player: request.player + " is a great guy" });
    }
    sendResponse();
  });

// chrome.storage.sync.set({ "yourBody": "myBody" }, function () {
//   //  A data saved callback omg so fancy
// });

// chrome.storage.sync.get(/* String or Array */["yourBody"], function (items) {
//   //  items = [ { "yourBody": "myBody" } ]
// });