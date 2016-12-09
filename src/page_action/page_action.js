var enableButton = document.getElementById('buttonEnable');
var disableButton = document.getElementById('buttonDisable');
var runningIndicator = document.getElementById('running-indicator');

enableButton.addEventListener('click', startBidding);
disableButton.addEventListener('click', stopBidding);

function startBidding(ev) {
    console.log("clicked on startBidding button");
    enableButton.disabled = true;
    disableButton.disabled = false;
    runningIndicator.style.display = 'inline';

    chrome.tabs.getSelected(null, function (tab) {
        console.log(tab);
        const tabTitle = tab.title;
        const startMessage = {
            url: tab.url,
            title: tab.title,
            refreshInterval: document.getElementById('refresh').value,
            maxBid: document.getElementById('max').value
        };
        chrome.storage.sync.set({ "btBidder": startMessage }, function () {
            console.log("Saved successfully");
        });
        chrome.tabs.sendMessage(tab.id, { start: startMessage }, undefined, function (response) {
            console.log(response);
        });
    });
}

function stopBidding(ev) {
    console.log("clicked on stopBidding button");
    enableButton.disabled = false;
    disableButton.disabled = true;
    runningIndicator.style.display = 'none';
    chrome.tabs.getSelected(null, function (tab) {
        const tabTitle = tab.title;

        chrome.storage.sync.clear(function () {
            console.log("Cleared local storage");
        });
        chrome.tabs.sendMessage(tab.id, { stop: "" }, undefined, function (response) {
            console.log(response);
        });
    });
}

chrome.storage.sync.get("btBidder", function (items) {
    console.log("Found historical data:", items);
    var started = false;
    if (items)
        if (items.btBidder)
            started = items.btBidder.started;

    console.log("Started:", started);
    if (started) {
        enableButton.disabled = true;
        disableButton.disabled = false;
        runningIndicator.style.display = 'inline';
    }
    else {
        enableButton.disabled = false;
        disableButton.disabled = true;
        runningIndicator.style.display = 'none';
    }

});