function startBidding(ev) {
    console.log("clicked on startBidding button");

    chrome.tabs.getSelected(null, function (tab) {
        console.log(tab);
                const tabTitle = tab.title;
        const startMessage = {
            url: tab.url,
            title: tab.title,
            refreshInterval: document.getElementById('refresh').value,
            maxBid: document.getElementById('max').value
        };
        chrome.storage.sync.set({ tabTitle: startMessage }, function () {
            console.log("Saved successfully");
        });
        chrome.tabs.sendMessage(tab.id, { start: startMessage }, undefined, function (response) {
            console.log(response);
        });
    });
}

console.log(document.getElementById('buttonEnable'));

document.getElementById('buttonEnable').addEventListener('click', startBidding);