var enableButton = document.getElementById('buttonEnable');
var disableButton = document.getElementById('buttonDisable');
var runningIndicator = document.getElementById('running-indicator');
var maxInput = document.getElementById('max');
var refreshInput = document.getElementById('refresh');

enableButton.addEventListener('click', startBidding);
disableButton.addEventListener('click', stopBidding);

function startBidding(ev) {
    enableButton.disabled = true;
    disableButton.disabled = false;
    runningIndicator.style.display = 'inline';
    window.close();

    chrome.tabs.getSelected(null, function (tab) {
        const tabTitle = tab.title;
        const startMessage = {
            url: tab.url,
            title: tab.title,
            refreshInterval: document.getElementById('refresh').value,
            maxBid: document.getElementById('max').value
        };
        chrome.storage.sync.set({ [tabTitle]: startMessage }, function () { });
        chrome.tabs.sendMessage(tab.id, { start: startMessage }, undefined, function (response) {
            console.log(response);
        });
    });
}

function stopBidding(ev) {
    window.close();
    enableButton.disabled = false;
    disableButton.disabled = true;
    runningIndicator.style.display = 'none';
    chrome.tabs.getSelected(null, function (tab) {
        const tabTitle = tab.title;
        chrome.storage.sync.remove([tabTitle], function () { });
        chrome.tabs.sendMessage(tab.id, { stop: "" }, undefined, function (response) {
            console.log(response);
        });
    });
}

chrome.tabs.getSelected(null, function (tab) {
    const tabTitle = tab.title;
    chrome.storage.sync.get(tabTitle, function (items) {
        console.log("Found historical data:", items);
        var started = false;
        if (items[tabTitle]) {
            started = items[tabTitle].started;
            maxInput.value = items[tabTitle].maxBid;
            refreshInput.value = items[tabTitle].refreshInterval;
        }

        if (started) {
            enableButton.disabled = true;
            disableButton.disabled = false;
            runningIndicator.style.display = 'inline';
            // chrome.tabs.sendMessage(tab.id, { continue: "" }, undefined, function (response) {
            //     console.log("Continue response:", response);
            // })
        }
        else {
            enableButton.disabled = false;
            disableButton.disabled = true;
            runningIndicator.style.display = 'none';
        }

    });
});