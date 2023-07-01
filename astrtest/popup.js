document.addEventListener("DOMContentLoaded", function () {
  const countButton = document.getElementById("countButton");

  countButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "countAsterisks" }, function (
        response
      ) {
        if (chrome.runtime.lastError) {
          // Handle the error gracefully
          console.error(chrome.runtime.lastError);
          displayCount(0);
        } else {
          displayCount(response.count);
        }
      });
    });
  });

  function displayCount(count) {
    const countElement = document.getElementById("count");
    countElement.textContent = count;
  }
});
