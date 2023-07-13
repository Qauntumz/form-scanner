chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getSpanPositions") {
      chrome.storage.sync.get("spanPositions", function (data) {
        sendResponse(data.spanPositions || []);
      });
      return true; // Indicates that the response will be sent asynchronously
    } else if (request.action === "setSpanPositions") {
      chrome.storage.sync.set({ spanPositions: request.spanPositions });
    }
  });
  