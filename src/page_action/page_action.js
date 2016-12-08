function test(ev) {
    console.log("clicked on button");

    // chrome.tabs.executeScript({
    //     file: 'alert.js'
    // });

    chrome.tabs.getSelected(null, function (tab) {
        console.log("selected tab", tab);
        chrome.tabs.sendRequest(tab.id, { clicked: "clicked on the button" }, function (response) { });
    });
}

console.log(document.getElementById('buttonEnable'));

document.getElementById('buttonEnable').addEventListener('click', test);