// On Battrick Page
chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            var submitButton = $("input#submitbid");
            if (submitButton[0]) {
                var playerName = $("div#playerdetails > h2").text();
                var myUserName = $("span.dispname").text();
                var currentBid = 0;
                var buyerName = "";

                var form = $("div.menuitem > form").html();
                var currentBid = 0;
                var cBidID = form.indexOf("Current Bid:");
                if (cBidID !== -1) {
                    var bidStr = form.slice(cBidID + 20);
                    currentBid = +bidStr.slice(0, bidStr.indexOf("by")).trim().replace(",", "");
                    var buyerStr = bidStr.slice(bidStr.indexOf(">") + 1);
                    buyerName = buyerStr.slice(0, buyerStr.indexOf("<"));
                }
                var bid = {
                    'playerName': playerName,
                    'loggedInUserName': myUserName,
                    'bidderUserName': buyerName,
                    'currentBid': currentBid
                }
                chrome.runtime.sendMessage({ bidInfo: bid }, function(response) {
                    console.log(response);
                });
            }
        }
    }, 10);
});

function startBidding(request, sendResponse) {
    console.log("Start request:", request);
    chrome.storage.sync.get("btBidder", function(items) {
        console.log("Found saved items:", items);
        items.btBidder["started"] = true;
        chrome.storage.sync.set(items, function() { });
        sendResponse("started");
    });
}

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("got a message:", request);
        if (request.start)
            startBidding(request.start, sendResponse);
        else if (request.stop)
            stopBidding(request.stop, sendResponse);
        else sendResponse(request);
    });