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
    maxInput.readOnly = true;
    refreshInput.readOnly = true;
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
    maxInput.readOnly = false;
    refreshInput.readOnly = false;
    runningIndicator.style.display = 'none';
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendMessage(tab.id, { stop: "true" }, undefined, function (response) {
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
            maxInput.readOnly = true;
            refreshInput.readOnly = true;
            runningIndicator.style.display = 'inline';
        }
        else {
            enableButton.disabled = false;
            disableButton.disabled = true;
            maxInput.readOnly = false;
            refreshInput.readOnly = false;
            runningIndicator.style.display = 'none';
        }

    });
});