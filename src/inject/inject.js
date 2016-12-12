// On Battrick Page

function setRefresh(items, tabTitle) {
    var timeoutHandler = setTimeout(function () {
        location.reload();
    }, +items[tabTitle].refreshInterval * 1000);
    items[tabTitle]["timeoutHandler"] = timeoutHandler;
    chrome.storage.sync.set(items, function () { });
}

chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            var tabTitle = $(document).attr('title');
            var submitButton = $("input#submitbid");
            chrome.storage.sync.get(tabTitle, function (items) {
                if (submitButton[0]) {
                    var myUserName = $("span.dispname").text();
                    var playerName = $("div#playerdetails > h2").text();
                    var currentBid = 0;
                    var buyerName = "";

                    var form = $("div.menuitem > form").html();
                    var cBidID = form.indexOf("Current Bid:");
                    if (cBidID !== -1) {
                        var bidStr = form.slice(cBidID + 20);
                        currentBid = +bidStr.slice(0, bidStr.indexOf("by")).trim().replace(",", "");
                        var buyerStr = bidStr.slice(bidStr.indexOf(">") + 1);
                        buyerName = buyerStr.slice(0, buyerStr.indexOf("<"));
                    }

                    // Enable the plugin icon
                    chrome.runtime.sendMessage({ bidInfo: "enable" }, function (response) { });

                    if (items[tabTitle]) {
                        console.log("Got some items just after page load:", items);
                        // clearTimeout(items[tabTitle]["timeoutHandler"]);
                        var maxBid = +items[tabTitle]["maxBid"];
                        console.log("maxBid", maxBid);
                        console.log("currentBid", currentBid);
                        if (myUserName !== buyerName) { // Only bid if I'm not already the highest bidder
                            console.log("i'm not the bidder");
                            if (maxBid > currentBid) { // Still within my specified price, click that button
                                submitButton.click();
                            }
                        }
                        setRefresh(items, tabTitle);
                    }

                }
                else if (items[tabTitle])
                    chrome.storage.sync.remove([tabTitle], function () { });

            });
        }
    }, 10);
});

function startBidding(request, sendResponse) {
    console.log("Start request:", request);
    var tabTitle = $(document).attr('title');
    chrome.storage.sync.get(tabTitle, function (items) {
        items[tabTitle]["started"] = true;
        setRefresh(items, tabTitle);
        sendResponse("started");
    });
}

function stopBidding(request, sendResponse) {
    console.log("Stop request:", request);
    var tabTitle = $(document).attr('title');

    // Clear timeouts
    chrome.storage.sync.get(tabTitle, function (items) {
        clearTimeout(items[tabTitle]["timeoutHandler"]);
        sendResponse("stopped");
    });
}

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("got a message:", request);
        if (request.start)
            startBidding(request.start, sendResponse);
        else if (request.stop)
            stopBidding(request.stop, sendResponse);
        else sendResponse(request);
    });