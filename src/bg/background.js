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
      chrome.tabs.getSelected(null, function (tab) {
        const tabTitle = tab.title;
        chrome.storage.sync.get(tabTitle, function (items) {
          console.log("Found saved items:", items);
          sendResponse({ player: items });
        });
      });
    }
    sendResponse(request);
  });

// chrome.storage.sync.set({ "yourBody": "myBody" }, function () {
//   //  A data saved callback omg so fancy
// });

// chrome.storage.sync.get(/* String or Array */["yourBody"], function (items) {
//   //  items = [ { "yourBody": "myBody" } ]
// });