// On Battrick Page

function setRefresh(items, tabTitle) {
    var timeoutHandler = setTimeout(function () {
        location.reload();
    }, +items[tabTitle].refreshInterval * 1000);
    items[tabTitle]["timeoutHandler"] = timeoutHandler;
    chrome.storage.sync.set(items, function () { });
    console.log("Refresing in %d seconds", +items[tabTitle].refreshInterval);
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
                    var buyerName = "";
                    var bidValue = $("#bidvalue").attr("value");
                    var form = $("div.menuitem > form").html();

                    var cBidID = form.indexOf("Current Bid:");
                    if (cBidID !== -1) {
                        var bidStr = form.slice(cBidID + 20);
                        var buyerStr = bidStr.slice(bidStr.indexOf(">") + 1);
                        buyerName = buyerStr.slice(0, buyerStr.indexOf("<"));
                    }

                    // Enable the plugin icon
                    chrome.runtime.sendMessage({ bidInfo: "enable" }, function (response) { });

                    // Time-based checks
                    var deadline = form.slice(form.indexOf("Deadline:") + 15, form.indexOf("Deadline:") + 36).split("&nbsp;");
                    var deadlineDay = deadline[0].split("/");
                    var deadlineDate = Date.parse(deadlineDay[1] + "/" + deadlineDay[0] + "/" + deadlineDay[2] + " " + deadline[1]);
                    var currentDate = Date.parse(new Date(new Date().toDateString() + " " + $("#time > span").html()));
                    var fiveMinutes = 5 * 60 * 1000;

                    if (items[tabTitle] && items[tabTitle]["started"]) {
                        if ((deadlineDate - currentDate) >= fiveMinutes) {
                            // Still more than 5 minutes away, set refresh to 5 min and do not bid
                            console.info("Not time to bid yet, waiting 5 more minutes");
                            setTimeout(function () {
                                location.reload();
                            }, fiveMinutes);
                        }
                        else {
                            var maxBid = +items[tabTitle]["maxBid"];
                            if (myUserName !== buyerName) { // Only bid if I'm not already the highest bidder
                                if (maxBid > bidValue)  // Still within my specified price, click that button                                
                                    submitButton.click();
                                else {
                                    console.info("Bid value (%d) is higher than max bid amount (%d), stopping all bidding here", bidValue, maxBid);
                                    items[tabTitle]["started"] = false;
                                    chrome.storage.sync.set(items, function () { });
                                    chrome.storage.sync.remove([tabTitle], function () { });
                                }
                            }
                            else
                                console.info("I'm already the highest bidder, not bidding");
                            setRefresh(items, tabTitle);
                        }
                    }
                }
                else if (items[tabTitle])
                    chrome.storage.sync.remove([tabTitle], function () { });
            });
        }
    }, 10);
});

function startBidding(request, sendResponse) {
    var tabTitle = $(document).attr('title');
    chrome.storage.sync.get(tabTitle, function (items) {
        items[tabTitle]["started"] = true;
        chrome.storage.sync.set(items, function () { });
        sendResponse("started");
        location.reload();
    });
}

function stopBidding(request, sendResponse) {
    var tabTitle = $(document).attr('title');
    chrome.storage.sync.get(tabTitle, function (items) {
        clearTimeout(+items[tabTitle]["timeoutHandler"]);
        sendResponse("stopped");
    });

    chrome.storage.sync.remove([tabTitle], function () { });
}

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.start)
            startBidding(request.start, sendResponse);
        else if (request.stop)
            stopBidding(request.stop, sendResponse);
        else sendResponse(request);
    });