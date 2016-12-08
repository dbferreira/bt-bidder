console.log("running battrick bidder");

chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading
			console.log("Hello. This message was sent from scripts/inject.js");
			// ----------------------------------------------------------

			var submitButton = $("input#submitbid");
			var playerName = submitButton[0] ? $("div#playerdetails > h2").text() : undefined;
			console.log("player is: ", playerName)
			chrome.runtime.sendMessage({ player: playerName }, function (response) {
				console.log(response);
			});

		}
	}, 10);
});

chrome.extension.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log("got a message:", request);
		//   sendResponse({ player: request.player + " is a great guy" });

	});