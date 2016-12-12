chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.bidInfo) {
            chrome.pageAction.show(sender.tab.id);
            sendResponse(request);
        }
    }
);
